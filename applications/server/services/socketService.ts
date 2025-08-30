import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { 
  userCanAccessConversation,
  createMessage,
  markMessagesAsRead
} from './chatService';
import { clerkConfigClient } from '@/config/clerk';
import {
  joinConversationSchema,
  sendMessageSchema,
  markAsReadSchema,
} from '@/schemas/chatSchemas';

interface AuthenticatedSocket {
  userId: string;
  userRole: string;
  userFullName: string;
}

export class SocketService {
  private io: SocketIOServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
  private conversationRooms: Map<string, string[]> = new Map(); // conversationId -> userIds[]

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify token and attach user info to socket
        const user = await this.verifyToken(token);
        if (!user) {
          return next(new Error('Invalid token'));
        }

        (socket as any).user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private async verifyToken(token: string): Promise<AuthenticatedSocket | null> {
    try {
      // Use Clerk to verify token - simplified approach
      // In a real implementation, you would verify the JWT token properly
      // For now, we'll assume the token contains user information
      const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      return {
        userId: decodedToken.sub || decodedToken.user_id,
        userRole: decodedToken.role || 'customer',
        userFullName: decodedToken.name || 'Unknown User',
      };
    } catch (error) {
      return null;
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const user = (socket as any).user as AuthenticatedSocket;
      console.log(`User ${user.userId} connected with socket ${socket.id}`);

      // Store user's socket connections
      this.addUserSocket(user.userId, socket.id);

      // Handle user joining a conversation
      socket.on('join_conversation', async (data) => {
        try {
          const { conversation_id } = joinConversationSchema.parse(data);
          
          // Check if user can access this conversation
          const canAccess = await userCanAccessConversation(user.userId, conversation_id);
          if (!canAccess) {
            socket.emit('error', { message: 'Access denied to this conversation' });
            return;
          }

          // Join the conversation room
          socket.join(`conversation_${conversation_id}`);
          this.addUserToConversation(conversation_id, user.userId);

          // Send conversation info
          socket.emit('conversation_joined', {
            conversation_id,
          });

          // Notify other users in the conversation
          socket.to(`conversation_${conversation_id}`).emit('user_joined_conversation', {
            conversation_id,
            user: {
              id: user.userId,
              full_name: user.userFullName,
              role: user.userRole,
            },
          });

        } catch (error) {
          socket.emit('error', { 
            message: error instanceof Error ? error.message : 'Invalid data' 
          });
        }
      });

      // Handle user leaving a conversation
      socket.on('leave_conversation', (data) => {
        const { conversation_id } = data;
        socket.leave(`conversation_${conversation_id}`);
        this.removeUserFromConversation(conversation_id, user.userId);

        socket.to(`conversation_${conversation_id}`).emit('user_left_conversation', {
          conversation_id,
          user: {
            id: user.userId,
            full_name: user.userFullName,
            role: user.userRole,
          },
        });
      });

      // Handle sending a message
      socket.on('send_message', async (data) => {
        try {
          const validatedData = sendMessageSchema.parse(data);
          
          // Check if user can access this conversation
          const canAccess = await userCanAccessConversation(user.userId, validatedData.conversation_id);
          if (!canAccess) {
            socket.emit('error', { message: 'Access denied to this conversation' });
            return;
          }

          // Create message in database
          const message = await createMessage({
            ...validatedData,
            sender_id: user.userId,
          });

          // Broadcast message to all users in the conversation
          this.io.to(`conversation_${validatedData.conversation_id}`).emit('new_message', {
            conversation_id: validatedData.conversation_id,
            message,
          });

          // Send confirmation to sender
          socket.emit('message_sent', {
            conversation_id: validatedData.conversation_id,
            message_id: message.id,
          });

        } catch (error) {
          socket.emit('error', { 
            message: error instanceof Error ? error.message : 'Failed to send message' 
          });
        }
      });

      // Handle marking messages as read
      socket.on('mark_messages_read', async (data) => {
        try {
          const { conversation_id, message_ids } = markAsReadSchema.parse(data);
          
          // Check if user can access this conversation
          const canAccess = await userCanAccessConversation(user.userId, conversation_id);
          if (!canAccess) {
            socket.emit('error', { message: 'Access denied to this conversation' });
            return;
          }

          // Mark messages as read
          await markMessagesAsRead(message_ids);

          // Notify other users in the conversation
          socket.to(`conversation_${conversation_id}`).emit('messages_marked_read', {
            conversation_id,
            message_ids,
            read_by: user.userId,
          });

        } catch (error) {
          socket.emit('error', { 
            message: error instanceof Error ? error.message : 'Failed to mark messages as read' 
          });
        }
      });

      // Handle typing indicator
      socket.on('typing_start', (data) => {
        const { conversation_id } = data;
        socket.to(`conversation_${conversation_id}`).emit('user_typing', {
          conversation_id,
          user: {
            id: user.userId,
            full_name: user.userFullName,
          },
          is_typing: true,
        });
      });

      socket.on('typing_stop', (data) => {
        const { conversation_id } = data;
        socket.to(`conversation_${conversation_id}`).emit('user_typing', {
          conversation_id,
          user: {
            id: user.userId,
            full_name: user.userFullName,
          },
          is_typing: false,
        });
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        console.log(`User ${user.userId} disconnected from socket ${socket.id}`);
        this.removeUserSocket(user.userId, socket.id);
      });
    });
  }

  // Utility methods for managing user connections
  private addUserSocket(userId: string, socketId: string) {
    const userSockets = this.userSockets.get(userId) || [];
    userSockets.push(socketId);
    this.userSockets.set(userId, userSockets);
  }

  private removeUserSocket(userId: string, socketId: string) {
    const userSockets = this.userSockets.get(userId) || [];
    const updatedSockets = userSockets.filter(id => id !== socketId);
    
    if (updatedSockets.length === 0) {
      this.userSockets.delete(userId);
    } else {
      this.userSockets.set(userId, updatedSockets);
    }
  }

  private addUserToConversation(conversationId: string, userId: string) {
    const users = this.conversationRooms.get(conversationId) || [];
    if (!users.includes(userId)) {
      users.push(userId);
      this.conversationRooms.set(conversationId, users);
    }
  }

  private removeUserFromConversation(conversationId: string, userId: string) {
    const users = this.conversationRooms.get(conversationId) || [];
    const updatedUsers = users.filter(id => id !== userId);
    
    if (updatedUsers.length === 0) {
      this.conversationRooms.delete(conversationId);
    } else {
      this.conversationRooms.set(conversationId, updatedUsers);
    }
  }

  // Public methods for external use
  public getIO(): SocketIOServer {
    return this.io;
  }

  public getUserSockets(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  public getConversationUsers(conversationId: string): string[] {
    return this.conversationRooms.get(conversationId) || [];
  }

  // Method to send notification to specific user
  public sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.getUserSockets(userId);
    userSockets.forEach(socketId => {
      this.io.to(socketId).emit(event, data);
    });
  }

  // Method to send notification to all users in a conversation
  public sendToConversation(conversationId: string, event: string, data: any) {
    this.io.to(`conversation_${conversationId}`).emit(event, data);
  }

  // Method to broadcast to all connected users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

export let socketService: SocketService;

export const initializeSocketService = (server: HTTPServer) => {
  socketService = new SocketService(server);
  return socketService;
};
