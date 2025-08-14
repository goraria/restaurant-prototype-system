import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from "node:url";
import { connectDB } from '@config/database';
import apiRoutes from '@routes/userRoutesNew';
// import { ClerkExpressRequireAuth } from '@clerk/express'; // Ví dụ nếu dùng Clerk

/* ROUTE IMPORTS */
import authRoutes from "@routes/authRoutes";
import productRoutes from "@routes/productRoutes";
import postRoutes from "@routes/postRoutes";
import taskRoutes from "@routes/taskRoutes";
import userRoutes from "@routes/userRoutes";

/* CONFIGURATIONS */
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Kết nối Database
connectDB();

// Middlewares Cơ bản
// app.use(cors()); // Cho phép Cross-Origin Resource Sharing
// app.use(helmet()); // Bảo mật ứng dụng bằng cách thiết lập các HTTP headers
// app.use(morgan('dev')); // Logging HTTP requests (chế độ 'dev' cho development)
// app.use(express.json()); // Parse JSON request bodies (thay thế body-parser.json)
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

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
app.use("/post", postRoutes)
app.use("/users", userRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Gắn các routes API (ví dụ /api/v1)
app.use('/api/v1', apiRoutes);

// Middleware xử lý lỗi cơ bản (Nên đặt cuối cùng)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!', message: err.message });
});

// Middleware xử lý không tìm thấy route (404)
app.use((req: Request, res: Response) => {
    res.status(404).send({ error: 'Not Found', message: `Route ${req.originalUrl} not found.` });
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

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