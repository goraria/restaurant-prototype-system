import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import session from "express-session";
import fs from 'fs';
import http, { createServer } from "http";

import prisma from '@/config/prisma';
import { errorHandler } from '@/middlewares/errorMiddlewares';
import { initializeRealtimeChat } from "@/config/realtime";
import { createGraphQLMiddleware } from "@/config/graphql";

/* ROUTE IMPORTS */
// import authRoutes from "@/routes/authRoutes";
import paymentRoutes from "@/routes/purchaseRoutes";
import productRoutes from "@/routes/productRoutes";
import voucherRoutes from '@/routes/voucherRoutes';
import categoryRoutes from '@/routes/categoryRoutes';
import inventoryRoutes from '@/routes/inventoryRoutes'
import tableRoutes from '@/routes/tableRoutes'
import taskRoutes from "@/routes/taskRoutes";
// import userRoutes from "@/routes/userRoutes";
import restaurantRoutes from "@/routes/restaurantRoutes";
// import orderRoutes from "@/routes/orderRoutes";
import menuRoutes from "@/routes/menuRoutes";
import recipeRoutes from "@/routes/recipeRoutes"
import uploadRoutes from "@/routes/uploadRoutes";
// import chatRoutes from "@/routes/chatRoutes";
// import clerkRoutes from "@/routes/clerkRoutes";
// import rlsTestRoutes from "@/routes/rlsTestRoutes";
import notificationRoutes from "@/routes/notificationRoutes";
// import graphqlRoutes from "@/routes/graphqlRoutes";

// ================================
// 🌐 EXPRESS SERVER CONFIGURATION
// ================================

/* CONFIGURATIONS */
dotenv.config();
// dotenv.config({ path: ".env.local" });

const app: Express = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
// Configure CORS
// app.use(cors());
app.use(cors({
  origin: [
    process.env.EXPRESS_CLIENT_URL!,
    process.env.EXPRESS_MOBILE_URL!,
  ],
  credentials: true,
}));

const server = http.createServer(app);
// const io = initializeRealtimeChat(server);

/* STATIC FILES */
/* UPLOAD MULTER CONFIG */

const directory = path.resolve(__dirname, "..", "public");
if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
app.use("@/public", express.static(directory));

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

/* ROUTES */
// ================================
// 📡 GRAPHQL ENDPOINT SETUP
// ================================
// ROUTES
// ================================
// app.use('/graphql', createGraphQLMiddleware());

// ================================
// 🛣️ REST API ROUTES (Updated with Clerk Auth)
// ================================
// app.use('/clerk', clerkRoutes);
// app.use(clerkAuthMiddleware)

// app.use("/auth", authRoutes); // Keep for backwards compatibility
app.use("/payment", paymentRoutes); // Payment hooks từ providers
app.use("/category", categoryRoutes); // Public category access
app.use('/menu', menuRoutes); // Public menu viewing
app.use('/recipe', recipeRoutes); // Private recipe viewing
app.use('/inventory', inventoryRoutes); // Private inventory viewing
app.use('/table', tableRoutes); // Public table viewing
app.use('/upload', uploadRoutes); // File uploads

// Protected routes (require Clerk authentication)
app.use("/product", productRoutes);
app.use("/voucher", voucherRoutes);
app.use("/task", taskRoutes);
// app.use('/users', userRoutes);
app.use('/restaurant', restaurantRoutes);
// app.use('/orders', orderRoutes);
// app.use('/chat', chatRoutes);
// app.use('/rls', rlsTestRoutes); // RLS testing routes (simple)
app.use("/notification", notificationRoutes);
// app.use("/graphql", graphqlRoutes);
app.use("/graphql", createGraphQLMiddleware);

app.get('/', (
  req,
  res
) => {
  res.json({
    success: true,
    message: 'Server đang hoạt động! 🚀',
    timestamp: new Date().toISOString(),
    routes: [
      'GET / - Root endpoint',
      'POST /clerk/webhooks - Clerk webhook handler',
      'GET /clerk/webhooks - Webhook status',
      'POST /clerk/webhooks/test - Test webhook handler',
      'GET /clerk/webhooks/test - Test webhook status',
      'GET /graphql - GraphQL endpoint',
      '... và nhiều routes khác'
    ],
    originalFeatures: {
      'REST API': '✅ Enabled',
      'GraphQL': '✅ Enabled',
      'Socket.IO Chat': '✅ Enabled',
      'Real-time Notifications': '✅ Enabled',
      'Supabase Realtime': '✅ Enabled',
      'Database Live Updates': '✅ Enabled'
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
        'user_offline',
        'join_restaurant',
        'leave_restaurant',
        'track_order',
        'stop_tracking_order',
        'subscribe_menu',
        'unsubscribe_menu'
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
        'notification',
        'user_updated',
        'restaurant_updated',
        'order_updated',
        'new_order',
        'order_status_updated',
        'kitchen_new_order',
        'menu_updated',
        'menu_item_updated',
        'inventory_updated',
        'low_stock_alert',
        'reservation_updated',
        'new_reservation',
        'payment_updated',
        'payment_status_updated',
        'voucher_updated',
        'new_voucher_available'
      ]
    },
    realtimeFeatures: {
      'Database Tables': [
        'users - User profile updates',
        'restaurants - Restaurant data changes',
        'orders - New orders & status updates',
        'menu_items - Menu availability changes',
        'inventory_items - Stock level alerts',
        'reservations - New bookings',
        'messages - Chat messages',
        'payments - Payment status',
        'vouchers - New promotions'
      ],
      'Live Notifications': [
        'New orders for restaurant staff',
        'Order status updates for customers',
        'Low stock alerts for managers',
        'New reservations for hosts',
        'Payment confirmations',
        'New vouchers/promotions',
        'Menu item availability changes'
      ]
    }
  });
});

// 404 handler (should be after all routes but before error handler)
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     error: 'Not Found',
//     message: `Route ${req.originalUrl} not found.`
//   });
// });

// Error handling middleware (phải đặt cuối cùng)
// app.use(errorHandler);

// ================================
// 🚀 INITIALIZE REALTIME SERVER
// ================================

const httpServer = http.createServer(app);

// ================================
// 🚀 INITIALIZE REALTIME CHAT & SUPABASE
// ================================

// Initialize Socket.IO service for realtime chat + Supabase Realtime
const realtimeServices = initializeRealtimeChat(httpServer);
export const socketService = realtimeServices.chatSocketService;
export const supabaseRealtimeService = realtimeServices.supabaseRealtimeService;

// ================================
// 🚀 START SERVER WITH SOCKET.IO & GRAPHQL
// ================================

const port = process.env.EXPRESS_PORT || 8080;

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