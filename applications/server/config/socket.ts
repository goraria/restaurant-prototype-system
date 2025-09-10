import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
// import {
//   userCanAccessConversation,
//   createMessage,
//   markMessagesAsRead
// } from '@/services/chatServices';
import { clerkConfigClient } from '@/config/clerk';
// import { verifyTokenAndGetUser } from '@/middlewares/authMiddlewares';
import {
  joinConversationSchema,
  sendMessageSchema,
  markAsReadSchema,
} from '@/schemas/chatSchemas';

interface AuthenticatedSocket {
  id: string;
  clerk_id: string | null;
  email: string;
  username: string;
  role: string;
  status: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  phone_code: string | null;
}

// Global state management
let io: SocketIOServer;
const userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
const conversationRooms: Map<string, string[]> = new Map(); // conversationId -> userIds[]

// Authentication middleware setup
// const setupMiddleware = () => {
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
//
//       if (!token) {
//         return next(new Error('Authentication token required'));
//       }
//
//       // Verify token using Clerk and get user info from database
//       const user = await verifyTokenAndGetUser(token);
//       if (!user) {
//         return next(new Error('Invalid token'));
//       }
//
//       (socket as any).user = user;
//       next();
//     } catch (error) {
//       console.error('Socket authentication error:', error);
//       next(new Error('Authentication failed'));
//     }
//   });
// };

// Token verification function - now using verifyTokenAndGetUser from middleware
// const verifyToken = async (token: string): Promise<AuthenticatedSocket | null> => {
//   try {
//     return await verifyTokenAndGetUser(token);
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return null;
//   }
// };

// Event handlers setup
// const setupEventHandlers = () => {
//   io.on('connection', (socket) => {
//     const user = (socket as any).user as AuthenticatedSocket;
//     console.log(`User ${user.id} connected with socket ${socket.id}`);
//
//     // Store user's socket connections
//     addUserSocket(user.id, socket.id);
//
//     // Handle user joining a conversation
//     socket.on('join_conversation', async (data) => {
//       try {
//         const { conversation_id } = joinConversationSchema.parse(data);
//
//         // Check if user can access this conversation
//         const canAccess = await userCanAccessConversation(user.id, conversation_id);
//         if (!canAccess) {
//           socket.emit('error', { message: 'Access denied to this conversation' });
//           return;
//         }
//
//         // Join the conversation room
//         socket.join(`conversation_${conversation_id}`);
//         addUserToConversation(conversation_id, user.id);
//
//         // Send conversation info
//         socket.emit('conversation_joined', {
//           conversation_id,
//         });
//
//         // Notify other users in the conversation
//         socket.to(`conversation_${conversation_id}`).emit('user_joined_conversation', {
//           conversation_id,
//           user: {
//             id: user.id,
//             full_name: user.full_name,
//             role: user.role,
//           },
//         });
//
//       } catch (error) {
//         socket.emit('error', {
//           message: error instanceof Error ? error.message : 'Invalid data'
//         });
//       }
//     });
//
//     // Handle user leaving a conversation
//     socket.on('leave_conversation', (data) => {
//       const { conversation_id } = data;
//       socket.leave(`conversation_${conversation_id}`);
//       removeUserFromConversation(conversation_id, user.id);
//
//       socket.to(`conversation_${conversation_id}`).emit('user_left_conversation', {
//         conversation_id,
//         user: {
//           id: user.id,
//           full_name: user.full_name,
//           role: user.role,
//         },
//       });
//     });
//
//     // Handle sending a message
//     socket.on('send_message', async (data) => {
//       try {
//         const validatedData = sendMessageSchema.parse(data);
//
//         // Check if user can access this conversation
//         const canAccess = await userCanAccessConversation(user.id, validatedData.conversation_id);
//         if (!canAccess) {
//           socket.emit('error', { message: 'Access denied to this conversation' });
//           return;
//         }
//
//         // Create message in database
//         const message = await createMessage({
//           ...validatedData,
//           sender_id: user.id,
//         });
//
//         // Broadcast message to all users in the conversation
//         io.to(`conversation_${validatedData.conversation_id}`).emit('new_message', {
//           conversation_id: validatedData.conversation_id,
//           message,
//         });
//
//         // Send confirmation to sender
//         socket.emit('message_sent', {
//           conversation_id: validatedData.conversation_id,
//           message_id: message.id,
//         });
//
//       } catch (error) {
//         socket.emit('error', {
//           message: error instanceof Error ? error.message : 'Failed to send message'
//         });
//       }
//     });
//
//     // Handle marking messages as read
//     socket.on('mark_messages_read', async (data) => {
//       try {
//         const { conversation_id, message_ids } = markAsReadSchema.parse(data);
//
//         // Check if user can access this conversation
//         const canAccess = await userCanAccessConversation(user.id, conversation_id);
//         if (!canAccess) {
//           socket.emit('error', { message: 'Access denied to this conversation' });
//           return;
//         }
//
//         // Mark messages as read
//         await markMessagesAsRead(message_ids);
//
//         // Notify other users in the conversation
//         socket.to(`conversation_${conversation_id}`).emit('messages_marked_read', {
//           conversation_id,
//           message_ids,
//           read_by: user.id,
//         });
//
//       } catch (error) {
//         socket.emit('error', {
//           message: error instanceof Error ? error.message : 'Failed to mark messages as read'
//         });
//       }
//     });
//
//     // Handle typing indicator
//     socket.on('typing_start', (data) => {
//       const { conversation_id } = data;
//       socket.to(`conversation_${conversation_id}`).emit('user_typing', {
//         conversation_id,
//         user: {
//           id: user.id,
//           full_name: user.full_name,
//         },
//         is_typing: true,
//       });
//     });
//
//     socket.on('typing_stop', (data) => {
//       const { conversation_id } = data;
//       socket.to(`conversation_${conversation_id}`).emit('user_typing', {
//         conversation_id,
//         user: {
//           id: user.id,
//           full_name: user.full_name,
//         },
//         is_typing: false,
//       });
//     });
//
//     // Handle user disconnection
//     socket.on('disconnect', () => {
//       console.log(`User ${user.id} disconnected from socket ${socket.id}`);
//       removeUserSocket(user.id, socket.id);
//     });
//   });
// };

// Utility functions for managing user connections
const addUserSocket = (userId: string, socketId: string) => {
  const userSocketsArray = userSockets.get(userId) || [];
  userSocketsArray.push(socketId);
  userSockets.set(userId, userSocketsArray);
};

const removeUserSocket = (userId: string, socketId: string) => {
  const userSocketsArray = userSockets.get(userId) || [];
  const updatedSockets = userSocketsArray.filter(id => id !== socketId);

  if (updatedSockets.length === 0) {
    userSockets.delete(userId);
  } else {
    userSockets.set(userId, updatedSockets);
  }
};

const addUserToConversation = (conversationId: string, userId: string) => {
  const users = conversationRooms.get(conversationId) || [];
  if (!users.includes(userId)) {
    users.push(userId);
    conversationRooms.set(conversationId, users);
  }
};

const removeUserFromConversation = (conversationId: string, userId: string) => {
  const users = conversationRooms.get(conversationId) || [];
  const updatedUsers = users.filter(id => id !== userId);

  if (updatedUsers.length === 0) {
    conversationRooms.delete(conversationId);
  } else {
    conversationRooms.set(conversationId, updatedUsers);
  }
};

// Public functions for external use
export const getIO = (): SocketIOServer => {
  return io;
};

export const getUserSockets = (userId: string): string[] => {
  return userSockets.get(userId) || [];
};

export const getConversationUsers = (conversationId: string): string[] => {
  return conversationRooms.get(conversationId) || [];
};

// Function to send notification to specific user
export const sendToUser = (userId: string, event: string, data: any) => {
  const userSocketsArray = getUserSockets(userId);
  userSocketsArray.forEach(socketId => {
    io.to(socketId).emit(event, data);
  });
};

// Function to send notification to all users in a conversation
export const sendToConversation = (conversationId: string, event: string, data: any) => {
  io.to(`conversation_${conversationId}`).emit(event, data);
};

// Function to broadcast to all connected users
export const broadcast = (event: string, data: any) => {
  io.emit(event, data);
};

// Main initialization function
export const initializeSocketService = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // setupMiddleware();
  // setupEventHandlers();

  return {
    getIO,
    getUserSockets,
    getConversationUsers,
    sendToUser,
    sendToConversation,
    broadcast,
  };
};

// Export the socket service instance (for backwards compatibility)
export let socketService: ReturnType<typeof initializeSocketService>;
