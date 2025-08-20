import { Router } from 'express';
import { orderController } from '@/controllers/orderController';
// Import middleware (tạm thời comment để không lỗi)
// import { authMiddleware, staffMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const orderControllerInstance = new orderController();

// Public routes
router.get('/code/:code', orderControllerInstance.getOrderByCode);
router.get('/stats', orderControllerInstance.getOrderStats);

// Protected routes (cần auth)
// router.use(authMiddleware); // Uncomment khi có auth middleware

// Customer routes
router.get('/my-orders', orderControllerInstance.getMyOrders);

// CRUD routes
router.get('/', orderControllerInstance.getOrders);
router.post('/', orderControllerInstance.createOrder);
router.put('/:id', orderControllerInstance.updateOrder);

// Special action routes
router.post('/:id/cancel', orderControllerInstance.cancelOrder);
router.get('/:id', orderControllerInstance.getOrderById); // Đặt cuối

// Staff routes
// router.use(staffMiddleware); // Uncomment khi có staff middleware
router.put('/items/:itemId/cooking-status', orderControllerInstance.updateItemCookingStatus);

export default router;
