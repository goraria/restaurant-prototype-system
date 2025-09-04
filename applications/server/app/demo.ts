import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import session from "express-session";
import http from "http";
import fs from 'fs';
import { fileURLToPath } from "node:url";
// GraphQL imports
import { graphqlHTTP } from 'express-graphql';
import { buildSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
// Socket.IO imports
import { Server as SocketIOServer } from 'socket.io';
import {
  clerkMiddleware,
  requireAuth,
} from '@clerk/express';
import prisma from '@/config/prisma';
import { initializeSocketService } from '@/config/socket';
import * as chatService from '@/services/chatService';

/* OLD ROUTE IMPORTS */
import authRoutes from "@/routes/authRoutes";
import paymentRoutes from "@/routes/purchaseRoutes";
import productRoutes from "@/routes/productRoutes";
import voucherRoutes from '@/routes/voucherRoutes';
import categoryRoutes from '@/routes/categoryRoutes';
import taskRoutes from "@/routes/taskRoutes";
import userRoutes from "@/routes/userRoutes";
import restaurantRoutes from "@/routes/restaurantRoutes";
import orderRoutes from "@/routes/orderRoutes";
import menuRoutes from "@/routes/menuRoutes";
import uploadRoutes from "@/routes/uploadRoutes";
import chatRoutes from "@/routes/chatRoutes";
import { errorHandler } from '@/middlewares/errorMiddleware';

// ================================
// 🚀 GraphQL SCHEMA & RESOLVERS DEFINITION
// ================================

// User Type Definition
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    full_name: { type: GraphQLString },
    phone_code: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
    cover_url: { type: GraphQLString },
    bio: { type: GraphQLString },
    status: { type: GraphQLString },
    role: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  },
});

// Conversation Type Definition
const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: {
    id: { type: GraphQLString },
    restaurant_id: { type: GraphQLString },
    customer_id: { type: GraphQLString },
    staff_id: { type: GraphQLString },
    type: { type: GraphQLString },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  },
});

// Message Type Definition
const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: { type: GraphQLString },
    conversation_id: { type: GraphQLString },
    sender_id: { type: GraphQLString },
    content: { type: GraphQLString },
    message_type: { type: GraphQLString },
    media_url: { type: GraphQLString },
    is_read: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  },
});

// Root Query Type
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Hello World Query
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL Chat API! 🚀'
    },

    // Get All Users
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        try {
          return await prisma.users.findMany({
            orderBy: { created_at: 'desc' }
          });
        } catch (error) {
          console.error('GraphQL Users Query Error:', error);
          throw new Error('Không thể lấy danh sách người dùng');
        }
      }
    },

    // Get User by ID
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          return await prisma.users.findUnique({
            where: { id: args.id }
          });
        } catch (error) {
          console.error('GraphQL User Query Error:', error);
          throw new Error('Không thể lấy thông tin người dùng');
        }
      }
    },

    // Get Conversations for a user
    conversations: {
      type: new GraphQLList(ConversationType),
      args: {
        userId: { type: GraphQLString },
        type: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          const whereClause: any = {
            OR: [
              { customer_id: args.userId },
              { staff_id: args.userId }
            ]
          };
          
          if (args.type) {
            whereClause.type = args.type;
          }

          return await prisma.conversations.findMany({
            where: whereClause,
            orderBy: { updated_at: 'desc' }
          });
        } catch (error) {
          console.error('GraphQL Conversations Query Error:', error);
          throw new Error('Không thể lấy danh sách cuộc trò chuyện');
        }
      }
    },

    // Get Messages in a conversation
    messages: {
      type: new GraphQLList(MessageType),
      args: {
        conversationId: { type: GraphQLString },
        limit: { type: GraphQLString },
        offset: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        try {
          const limit = parseInt(args.limit || '50');
          const offset = parseInt(args.offset || '0');
          
          return await prisma.messages.findMany({
            where: { conversation_id: args.conversationId },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
          });
        } catch (error) {
          console.error('GraphQL Messages Query Error:', error);
          throw new Error('Không thể lấy danh sách tin nhắn');
        }
      }
    }
  }
});

// GraphQL Schema
const graphqlSchema = new GraphQLSchema({
  query: RootQuery
});

// ================================
// 🔌 SOCKET.IO REALTIME CHAT LOGIC
// ================================

let io: SocketIOServer;
let chatSocketService: any;

const initializeRealtimeChat = (server: http.Server) => {
  // Initialize Socket.IO service
  chatSocketService = initializeSocketService(server);
  io = chatSocketService.getIO();

  console.log('✅ Socket.IO Realtime Chat initialized successfully');
  
  // Additional socket event handlers can be added here
  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);
    
    // Custom chat events
    socket.on('user_online', (userId) => {
      socket.join(`user_${userId}`);
      socket.broadcast.emit('user_status_changed', {
        userId,
        status: 'online',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('user_offline', (userId) => {
      socket.leave(`user_${userId}`);
      socket.broadcast.emit('user_status_changed', {
        userId,
        status: 'offline',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });
  });

  return chatSocketService;
};

// Export realtime functions for external use
export const sendRealtimeNotification = (userId: string, data: any) => {
  if (chatSocketService) {
    chatSocketService.sendToUser(userId, 'notification', data);
  }
};

export const broadcastToConversation = (conversationId: string, event: string, data: any) => {
  if (chatSocketService) {
    chatSocketService.sendToConversation(conversationId, event, data);
  }
};

// ================================
// 🌐 EXPRESS SERVER CONFIGURATION
// ================================

/* CONFIGURATIONS */
dotenv.config();
// dotenv.config({ path: ".env.local" });

const app: Express = express();
// const PORT = process.env.PORT || 5000;
// Disable ETag for dynamic API responses to avoid 304 on auth/me
app.set('etag', false);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.EXPRESS_JWT_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.EXPRESS_ENV === 'production', // true nếu dùng HTTPS
    httpOnly: true, // Ngăn JS phía client truy cập
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    // expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Thời gian hết hạn cookie
    // domain: process.env.EXPRESS_CLIENT_URL!, // Tùy chọn: tên miền cookie
    // secure: true, // Chỉ gửi cookie qua HTTPS
    // sameSite: 'Lax' // Hoặc 'Strict'. 'None' cần secure: true
    // path: '/', // Phạm vi cookie (thường là gốc)
  }
}));
// app.use(cors());
app.use(cors({
  origin: [
    process.env.EXPRESS_CLIENT_URL!,
    process.env.EXPRESS_MOBILE_URL!,
  ],
  credentials: true,
}));

// Cấu hình Clerk middleware với ignoredRoutes để bỏ qua payment routes
app.use(clerkMiddleware({
  publishableKey: process.env.EXPRESS_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.EXPRESS_CLERK_SECRET_KEY,
}));

/* STATIC FILES */
/* UPLOAD MULTER CONFIG */
// const __filename = fileURLToPath(process.env.url!);
// // const __dirname = path.resolve();
// const __dirname = path.dirname(__filename);
// app.use("/assets", express.static(path.join(__dirname, "assets")));
const directory = path.resolve(__dirname, "..", "public");
if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
app.use("@/public", express.static(directory));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const safeBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(safeBase);
    const name = path.basename(safeBase, ext);
    cb(null, `${name}_${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ hỗ trợ file ảnh (image/*)'));
    }
    cb(null, true);
  },
});

export const fileUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// const storage = multer.diskStorage({
//   destination: (
//     req,
//     file,
//     cb
//   ): void => {
//     cb(null, "assets");
//   },
//   filename: (
//     req,
//     file,
//     cb
//   ): void => {
//     // cb(null, req.body.name);
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

const isProduction = process.env.EXPRESS_ENV === 'production';

// Kết nối Database
// connectDB();

// Middlewares Cơ bản
// app.use(cors()); // Cho phép Cross-Origin Resource Sharing
// app.use(helmet()); // Bảo mật ứng dụng bằng cách thiết lập các HTTP headers
// app.use(morgan('dev')); // Logging HTTP requests (chế độ 'dev' cho development)
// app.use(express.json()); // Parse JSON request bodies (thay thế body-parser.json)
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

/* STATIC FILES */
/* UPLOAD MULTER CONFIG */
// const __filename = fileURLToPath(process.env.url!);
// // const __dirname = path.resolve();
// const __dirname = path.dirname(__filename);
// app.use("/assets", express.static(path.join(__dirname, "assets")));
//
// const storage = multer.diskStorage({
//     destination: (
//         req,
//         file,
//         cb
//     ): void => {
//         cb(null, "assets");
//     },
//     filename: (
//         req,
//         file,
//         cb
//     ): void => {
//         // cb(null, req.body.name);
//         cb(null, file.originalname);
//     },
// });
//
// const upload = multer({ storage });

// --- Ví dụ tích hợp Clerk (nếu bạn dùng) ---
// app.get('/protected-route', ClerkExpressRequireAuth(), (req, res) => {
//   res.json(req.auth);
// });
// --------------------------------------------

/* ROUTES */
// ================================
// 📡 GRAPHQL ENDPOINT SETUP
// ================================
app.use('/graphql', cors({
  origin: [
    process.env.EXPRESS_CLIENT_URL!,
    process.env.EXPRESS_MOBILE_URL!,
  ],
  credentials: true,
}), graphqlHTTP({
  schema: graphqlSchema,
  graphiql: process.env.EXPRESS_ENV !== 'production', // Enable GraphQL Playground in development
  customFormatErrorFn: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  }
}));

// ================================
// 🛣️ REST API ROUTES (Existing)
// ================================
// Old routes (keep for backward compatibility)
app.use("/auth", authRoutes)
// app.use("/payment", requireAuth(), paymentRoutes)
app.use("/payment", paymentRoutes)
app.use("/products", requireAuth(), productRoutes)
app.use("/voucher", voucherRoutes) // Removed requireAuth() for testing
app.use("/category", categoryRoutes) // Category routes
app.use("/task", requireAuth(), taskRoutes)
app.use('/users', requireAuth(), userRoutes);
app.use('/restaurants', requireAuth(), restaurantRoutes);
app.use('/orders', requireAuth(), orderRoutes);
app.use('/menus', menuRoutes); //, requireAuth()
app.use('/upload', uploadRoutes);
app.use('/chat', requireAuth(), chatRoutes);

// Debug route to test voucher endpoints
// app.get('/debug/voucher', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Voucher debug endpoint working',
//     availableRoutes: [
//       'GET /voucher - Get all vouchers',
//       'POST /voucher - Create voucher',
//       'GET /voucher/:id - Get voucher by ID'
//     ]
//   });
// });

app.get('/', (
  req,
  res
) => {
  res.json({
    success: true,
    message: 'Waddles Restaurant API v2.0.0 🚀',
    timestamp: new Date().toISOString(),
    features: {
      'REST API': '✅ Enabled',
      'GraphQL': '✅ Enabled',
      'Socket.IO Chat': '✅ Enabled',
      'Real-time Notifications': '✅ Enabled'
    },
    endpoints: {
      'GraphQL Playground': '/graphql',
      'Socket.IO': 'ws://localhost:' + port,
      'REST API': {
        health: '/api/v1/health',
        users: '/users',
        restaurants: '/restaurants',
        orders: '/orders',
        menus: '/menus',
        chat: '/chat',
        vouchers: '/voucher',
        categories: '/category'
      }
    },
    graphqlQueries: {
      'Get All Users': `
        query GetUsers {
          users {
            id
            username
            email
            full_name
            avatar_url
            role
            status
            created_at
          }
        }
      `,
      'Get User by ID': `
        query GetUser($id: String!) {
          user(id: $id) {
            id
            username
            email
            full_name
            avatar_url
            role
            status
            created_at
          }
        }
      `,
      'Get Conversations': `
        query GetConversations($userId: String!, $type: String) {
          conversations(userId: $userId, type: $type) {
            id
            restaurant_id
            customer_id
            staff_id
            type
            title
            status
            created_at
            updated_at
          }
        }
      `,
      'Get Messages': `
        query GetMessages($conversationId: String!, $limit: String, $offset: String) {
          messages(conversationId: $conversationId, limit: $limit, offset: $offset) {
            id
            conversation_id
            sender_id
            content
            message_type
            media_url
            is_read
            created_at
          }
        }
      `
    },
    socketEvents: {
      'Client to Server': [
        'join_conversation',
        'leave_conversation', 
        'send_message',
        'mark_messages_read',
        'typing_start',
        'typing_stop',
        'user_online',
        'user_offline'
      ],
      'Server to Client': [
        'conversation_joined',
        'user_joined_conversation',
        'user_left_conversation',
        'new_message',
        'message_sent',
        'messages_marked_read',
        'user_typing',
        'user_status_changed',
        'notification'
      ]
    }
  });
});

// 404 handler (should be after all routes but before error handler)
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: 'Not Found', 
    message: `Route ${req.originalUrl} not found.` 
  });
});

// Error handling middleware (phải đặt cuối cùng)
app.use(errorHandler);

/* MONGOOSE */

// connectDB();

const httpServer = http.createServer(app);

// ================================
// 🚀 INITIALIZE REALTIME CHAT & GRAPHQL
// ================================

// Initialize Socket.IO service for realtime chat
const realtimeChatService = initializeRealtimeChat(httpServer);

// Export socket service for use in other parts of the application
export { realtimeChatService as socketService };

const port = process.env.EXPRESS_PORT || 8080;

// ================================
// 🚀 START SERVER WITH SOCKET.IO & GRAPHQL
// ================================

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start HTTP server with Socket.IO
    httpServer.listen(port, () => {
      console.log('🚀=====================================🚀');
      console.log(`🌟 Waddles Restaurant API v1.0.0`);
      console.log(`🌐 Server running at: http://localhost:${port}`);
      console.log(`📡 GraphQL endpoint: http://localhost:${port}/graphql`);
      console.log(`💬 Socket.IO Chat: ws://localhost:${port}`);
      console.log(`🔧 Environment: ${process.env.EXPRESS_ENV || 'development'}`);
      console.log(`📚 GraphQL Playground: ${process.env.EXPRESS_ENV !== 'production' ? 'Enabled' : 'Disabled'}`);
      console.log('🚀=====================================🚀');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT signal received: closing HTTP server');
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM signal received: closing HTTP server');
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
  process.exit(0);
});

// Start the server
startServer();