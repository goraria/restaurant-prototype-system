import express from 'express';
import {
  createOrderController as createOrder,
  getOrdersController as getOrders,
  getOrderStatsController as getOrderStats,
  getOrderAnalyticsController as getOrderAnalytics,
  getMyOrdersController as getMyOrders,
  getCurrentOrderController as getCurrentOrder,
  getRestaurantOrdersController as getRestaurantOrders,
  getPendingOrdersController as getPendingOrders,
  getRestaurantDashboardController as getRestaurantDashboard,
  getOrderByCodeController as getOrderByCode,
  getOrderByIdController as getOrderById,
  updateOrderController as updateOrder,
  cancelOrderController as cancelOrder,
  bulkOrderActionsController as bulkOrderActions,
  getKitchenOrdersController as getKitchenOrders,
  updateCookingStatusController as updateCookingStatus,

} from '@/controllers/orderControllers';

const router = express.Router();

// ================================
// 🛒 ORDER MANAGEMENT ROUTES
// ================================

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới
 * @access  Private (Customer/Staff)
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders
 * @desc    Lấy danh sách đơn hàng với bộ lọc
 * @access  Private (Admin/Staff)
 */
router.get('/', getOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Lấy thống kê đơn hàng
 * @access  Private (Admin/Staff)
 */
router.get('/stats', getOrderStats);

/**
 * @route   GET /api/orders/analytics
 * @desc    Lấy analytics chi tiết cho orders
 * @access  Private (Admin/Manager)
 */
router.get('/analytics', getOrderAnalytics);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Lấy đơn hàng của customer hiện tại
 * @access  Private (Customer)
 */
router.get('/my-orders', getMyOrders);

/**
 * @route   GET /api/orders/current
 * @desc    Lấy đơn hàng hiện tại của customer (đang active)
 * @access  Private (Customer)
 */
router.get('/current', getCurrentOrder);

/**
 * @route   GET /api/orders/restaurant
 * @desc    Lấy đơn hàng của restaurant hiện tại
 * @access  Private (Restaurant Staff)
 */
router.get('/restaurant', getRestaurantOrders);

/**
 * @route   GET /api/orders/restaurant/pending
 * @desc    Lấy đơn hàng đang chờ xử lý của restaurant
 * @access  Private (Restaurant Staff)
 */
router.get('/restaurant/pending', getPendingOrders);

/**
 * @route   GET /api/orders/restaurant/dashboard
 * @desc    Dashboard cho restaurant
 * @access  Private (Restaurant Staff)
 */
router.get('/restaurant/dashboard', getRestaurantDashboard);

/**
 * @route   GET /api/orders/code/:orderCode
 * @desc    Lấy đơn hàng theo mã order
 * @access  Public
 */
router.get('/code/:orderCode', getOrderByCode);

/**
 * @route   GET /api/orders/:id
 * @desc    Lấy thông tin đơn hàng theo ID
 * @access  Private
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Cập nhật đơn hàng
 * @access  Private (Staff/Admin)
 */
router.put('/:id', updateOrder);

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    Hủy đơn hàng
 * @access  Private (Customer/Staff)
 */
router.post('/:id/cancel', cancelOrder);

/**
 * @route   POST /api/orders/bulk-actions
 * @desc    Thực hiện hành động hàng loạt trên orders
 * @access  Private (Staff/Admin)
 */
router.post('/bulk-actions', bulkOrderActions);

// ================================
// 🍳 KITCHEN MANAGEMENT ROUTES
// ================================

/**
 * @route   GET /api/orders/kitchen/orders
 * @desc    Lấy danh sách đơn hàng cho bếp
 * @access  Private (Kitchen Staff)
 */
router.get('/kitchen/orders', getKitchenOrders);

/**
 * @route   PUT /api/orders/kitchen/cooking-status
 * @desc    Cập nhật trạng thái nấu ăn
 * @access  Private (Kitchen Staff)
 */
router.put('/kitchen/cooking-status', updateCookingStatus);

export default router;
