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
import { fileURLToPath } from "node:url";
import { Server as SocketIOServer } from 'socket.io';
import prisma from '@/config/prisma';

/* ROUTE IMPORTS */
import authRoutes from "@/routes/authRoutes";
import productRoutes from "@/routes/productRoutes";
import taskRoutes from "@/routes/taskRoutes";
import userRoutes from "@/routes/userRoutes";

/* CONFIGURATIONS */
dotenv.config();

const app: Express = express();
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

/* STATIC FILES */
/* UPLOAD MULTER CONFIG */
// const __filename = fileURLToPath(process.env.url!);
// // const __dirname = path.resolve();
// const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "assets")));

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ): void => {
    cb(null, "assets");
  },
  filename: (
    req,
    file,
    cb
  ): void => {
    // cb(null, req.body.name);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const isProduction = process.env.EXPRESS_ENV === 'production';


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
app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/task", taskRoutes)
app.use("/users", userRoutes)

app.get('/', (
  req,
  res
) => {
  res.send('Hello World!');
});

/* MONGOOSE */

// connectDB();

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      process.env.EXPRESS_CLIENT_URL!,
      process.env.EXPRESS_MOBILE_URL!,
    ],
    credentials: true,
  },
});

// Lắng nghe kết nối realtime
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Ví dụ: lắng nghe sự kiện client gửi
  socket.on('ping', (data) => {
    socket.emit('pong', { msg: 'pong', data });
  });
  socket.on('get_users', async () => {
    const users = await prisma.users.findMany();
    socket.emit('users', users);
  });
  // Lắng nghe ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Cho phép các controller/service khác sử dụng io
export { io };

const port = process.env.EXPRESS_PORT || 8080;

///////////////////////////////////////////////////////////

// Xử lý tắt server an toàn (graceful shutdown) - tùy chọn
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  // Đóng các kết nối khác (DB, etc.) ở đây nếu cần
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  // Đóng các kết nối khác (DB, etc.) ở đây nếu cần
  process.exit(0);
});

///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////

// --- GraphQL Schema Demo ---
// Có thể tách riêng ra file schema + resolvers sau
const typeDefs = `#graphql
#  type User {
#    id: String!
#    username: String!
#    email: String!
#    first_name: String
#    last_name: String
#    full_name: String
#    phone_code: String
#    phone_number: String
#    avatar_url: String
#    cover_url: String
#    bio: String
#    status: String
#    role: String
#    created_at: String
#    updated_at: String
#  }
#  type Query {
#    hello: String
#    users: [User!]!
#  }
`;

// interface GraphQLContext extends BaseContext {
//   prisma: typeof prisma;
//   token: string | null;
// }
//
// const resolvers = {
//   Query: {
//     hello: () => 'Hello from GraphQL!',
//     users: async () => {
//       return await prisma.users.findMany();
//     },
//     // users: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
//     //   return ctx.prisma.users.findMany();
//   },
// };
//
// async function startApolloServer() {
//   const apolloServer = new ApolloServer<GraphQLContext>({
//     typeDefs,
//     resolvers,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });
//   await apolloServer.start();
//
//   // Tự viết handler thay vì @apollo/server/express4
//   const graphqlCors = cors({
//     origin: [
//       process.env.EXPRESS_CLIENT_URL!,
//       process.env.EXPRESS_MOBILE_URL!,
//     ],
//     credentials: true,
//   });
//   const jsonBody = bodyParser.json({ limit: '50mb' });
//
//   app.use('/graphql', graphqlCors, jsonBody, async (req, res) => {
//     try {
//       const headers = new HeaderMap();
//       for (const [key, value] of Object.entries(req.headers)) {
//         if (value !== undefined) {
//           headers.set(key, Array.isArray(value) ? value.join(', ') : value);
//         }
//       }
//       const httpGraphQLRequest = {
//         method: req.method?.toUpperCase() || 'GET',
//         headers,
//         search: req.url && req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '',
//         body: (req as any).body,
//       };
//       const authHeader = req.headers.authorization || '';
//       const token = authHeader.startsWith('Bearer ')
//         ? authHeader.substring(7)
//         : authHeader || null;
//
//       const ctx: GraphQLContext = { prisma, token };
//       const httpGraphQLResponse = await apolloServer.executeHTTPGraphQLRequest({
//         httpGraphQLRequest,
//         context: async () => ctx,
//       });
//
//       for (const [key, value] of httpGraphQLResponse.headers) {
//         res.setHeader(key, value);
//       }
//       res.status(httpGraphQLResponse.status || 200);
//
//       if (httpGraphQLResponse.body.kind === 'complete') {
//         res.send(httpGraphQLResponse.body.string);
//         return;
//       }
//       // incremental delivery / streaming
//       for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
//         res.write(chunk);
//       }
//       res.end();
//     } catch (e: any) {
//       console.error('GraphQL execution error:', e);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
// }

(async () => {
  // await startApolloServer();
  httpServer.listen(port, () => {
    console.log(`Server (HTTP + GraphQL) running at http://localhost:${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`Environment: ${process.env.EXPRESS_ENV}`);
  });
})();

///////////////////////////////////////////////////////////

// app.get('/', (req: Request, res: Response) => {
//     res.send('API is running...');
// });
//
// // Gắn các routes API (ví dụ /api/v1)
// app.use('/api/v1', apiRoutes);
//
// // Middleware xử lý lỗi cơ bản (Nên đặt cuối cùng)
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).send({ error: 'Something went wrong!', message: err.message });
// });
//
// // Middleware xử lý không tìm thấy route (404)
// app.use((req: Request, res: Response) => {
//     res.status(404).send({ error: 'Not Found', message: `Route ${req.originalUrl} not found.` });
// });

// // Khởi động server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log(`Environment: ${process.env.NODE_ENV}`);
// });
//
// // Xử lý tắt server an toàn (graceful shutdown) - tùy chọn
// process.on('SIGINT', () => {
//     console.log('SIGINT signal received: closing HTTP server');
//     // Đóng các kết nối khác (DB, etc.) ở đây nếu cần
//     process.exit(0);
// });
//
// process.on('SIGTERM', () => {
//     console.log('SIGTERM signal received: closing HTTP server');
//     // Đóng các kết nối khác (DB, etc.) ở đây nếu cần
//     process.exit(0);
// });