import { Router } from 'express';
import {
  createMenu,
  getMenuById,
  getMenus,
  getMenusByRestaurantId,
  updateMenu,
  deleteMenu,
  createMenuItem,
  getMenuItemById,
  getMenuItems,
  getFeaturedMenuItems,
  updateMenuItem,
  deleteMenuItem,
  bulkUpdateMenuItems,
  bulkToggleAvailability,
  getMenuStats
} from '@/controllers/menuControllers';

// Import middleware (tạm thời comment để không lỗi)
// import { authMiddleware, restaurantManagerMiddleware } from '@/middlewares/authMiddleware';

const router = Router();

// ================================
// 🍽️ MENU ROUTES
// ================================

// Public routes - Không cần authentication
router.get('/restaurant/:restaurantId', getMenusByRestaurantId); // Lấy menu của nhà hàng
router.get('/restaurant/:restaurantId/stats', getMenuStats); // Thống kê menu của nhà hàng

// Protected routes - Cần authentication
// router.use(authMiddleware); // Uncomment khi có auth middleware

// Menu CRUD operations
router.get('/', getMenus); // Lấy danh sách menu với filter
router.post('/', createMenu); // Tạo menu mới
router.get('/:id', getMenuById); // Lấy menu theo ID
router.put('/:id', updateMenu); // Cập nhật menu
router.delete('/:id', deleteMenu); // Xóa menu

// ================================
// 🍽️ MENU ITEM ROUTES
// ================================

// Public routes cho menu items
router.get('/items/featured', getFeaturedMenuItems); // Lấy món ăn nổi bật

// Protected routes cho menu items
router.get('/items', getMenuItems); // Lấy danh sách món ăn với filter
router.post('/items', createMenuItem); // Tạo món ăn mới
router.get('/items/:id', getMenuItemById); // Lấy món ăn theo ID
router.put('/items/:id', updateMenuItem); // Cập nhật món ăn
router.delete('/items/:id', deleteMenuItem); // Xóa món ăn

// Bulk operations cho menu items
router.put('/items/bulk/update', bulkUpdateMenuItems); // Cập nhật hàng loạt món ăn
router.put('/items/bulk/availability', bulkToggleAvailability); // Bật/tắt trạng thái hàng loạt

// Restaurant manager only routes
// router.use(restaurantManagerMiddleware); // Uncomment khi có restaurant manager middleware

export default router;