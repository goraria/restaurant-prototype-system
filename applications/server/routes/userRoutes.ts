import { Router } from 'express';
// import { userController } from '@/controllers/userController';
// Import middleware (tạm thời comment để không lỗi)
// import { authMiddleware, adminMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
// const userControllerInstance = new userController();

// Public routes (không cần auth)

// Protected routes (cần auth)
// router.use(authMiddleware); // Uncomment khi có auth middleware

// // User profile routes
// router.get('/me', userControllerInstance.getMe);
// router.put('/me', userControllerInstance.updateCurrentUser);

// // User search routes
// router.get('/search', userControllerInstance.searchUsers);
// router.get('/stats', userControllerInstance.getUserStats);

// // Get user by identifier
// router.get('/email/:email', userControllerInstance.getUserByEmail);
// router.get('/clerk/:clerkId', userControllerInstance.getUserByClerkId);

// CRUD routes
// router.get('/', userControllerInstance.getUsers);
// router.post('/', userControllerInstance.createUser);
// router.put('/:id', userControllerInstance.updateUser);
// router.delete('/:id', userControllerInstance.deleteUser);
// router.get('/:id', userControllerInstance.getUserById); // Đặt cuối để tránh xung đột

// Admin only routes
// router.use(adminMiddleware); // Uncomment khi có admin middleware

export default router;
