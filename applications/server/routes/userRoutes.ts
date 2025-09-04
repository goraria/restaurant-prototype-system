import { Router } from 'express';
import {
  getCurrentUser,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserOrders,
  getUserStatistics,
  deleteUserController
} from '@/controllers/userControllers';
import {
  requireAuth,
  requireCustomer,
  requireRestaurantAccess
} from '@/middlewares/authMiddleware';
import { getOrdersController, getRestaurantOrdersController } from '@/controllers/orderControllers';

const router = Router();

// All routes are protected - auth middleware is applied in main app

// User profile routes
router.get('/me', getCurrentUser);
router.put('/profile', updateUserProfile);

// User addresses routes
router.get('/addresses', getUserAddresses);
router.post('/addresses', addUserAddress);
router.put('/addresses/:id', updateUserAddress);
router.delete('/addresses/:id', deleteUserAddress);

// User orders and statistics
router.get('/orders', getUserOrders);
router.get('/statistics', getUserStatistics);

// ================================
// 🔐 ROLE-BASED AUTHENTICATION EXAMPLES
// ================================

// API cho nhiều role - Staff hoặc Manager có thể xem orders
router.get('/all-orders', requireAuth(['staff', 'manager']), getOrdersController);

// API cho 1 role duy nhất - Chỉ Admin có thể xóa user
router.delete('/:id', requireAuth(['admin']), deleteUserController);

// API cho khách hàng - Chỉ customer có thể xem profile
router.get('/profile', requireCustomer, getCurrentUser);

// API cho nhà hàng cụ thể - Staff/Manager chỉ xem orders của nhà hàng họ quản lý
router.get('/restaurant/orders', 
  requireAuth(['staff', 'manager']), 
  requireRestaurantAccess(), 
  getRestaurantOrdersController
);

export default router;
