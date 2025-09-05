import { Router } from 'express';
import {
  createReservationController,
  getReservationsController,
  getReservationByIdController,
  updateReservationController,
  updateReservationStatusController,
  deleteReservationController,
  checkAvailabilityController,
  bulkUpdateReservationsController,
  createWalkInController,
  getReservationAnalyticsController,
  getTodayReservationsController,
  getUpcomingReservationsController
} from '@/controllers/reservationControllers';
import {
  requireAuth,
  requireCustomer,
  requireStaff,
  requireManager,
  requireAdmin,
  requireRestaurantAccess
} from '@/middlewares/authMiddlewares';

const router = Router();

// ================================
// 🎯 RESERVATION ROUTES
// ================================

/**
 * @route   POST /api/reservations
 * @desc    Tạo đặt bàn mới
 * @access  Private (Customer, Staff, Manager, Admin)
 * @body    CreateReservationType
 */
router.post('/', createReservationController);

/**
 * @route   GET /api/reservations
 * @desc    Lấy danh sách đặt bàn với filter và pagination
 * @access  Private (Staff, Manager, Admin)
 * @query   ReservationQueryType
 */
router.get('/', getReservationsController);

/**
 * @route   GET /api/reservations/today
 * @desc    Lấy danh sách đặt bàn hôm nay
 * @access  Private (Staff, Manager, Admin)
 */
router.get('/today', getTodayReservationsController);

/**
 * @route   GET /api/reservations/upcoming
 * @desc    Lấy danh sách đặt bàn sắp tới (trong 2 tiếng)
 * @access  Private (Staff, Manager, Admin)
 */
router.get('/upcoming', getUpcomingReservationsController);

/**
 * @route   POST /api/reservations/check-availability
 * @desc    Kiểm tra tình trạng bàn trống
 * @access  Public
 * @body    CheckAvailabilityType
 */
router.post('/check-availability', checkAvailabilityController);

/**
 * @route   POST /api/reservations/walk-in
 * @desc    Tạo khách vãng lai (walk-in customer)
 * @access  Private (Staff, Manager, Admin)
 * @body    CreateWalkInType
 */
router.post('/walk-in', createWalkInController);

/**
 * @route   PATCH /api/reservations/bulk-update
 * @desc    Cập nhật hàng loạt đặt bàn
 * @access  Private (Manager, Admin)
 * @body    BulkUpdateReservationType
 */
router.patch('/bulk-update', bulkUpdateReservationsController);

/**
 * @route   POST /api/reservations/analytics
 * @desc    Phân tích thống kê đặt bàn
 * @access  Private (Manager, Admin)
 * @body    ReservationAnalyticsType
 */
router.post('/analytics', getReservationAnalyticsController);

/**
 * @route   GET /api/reservations/:id
 * @desc    Lấy thông tin đặt bàn theo ID
 * @access  Private (Owner, Staff, Manager, Admin)
 * @param   id - Reservation ID
 */
router.get('/:id', getReservationByIdController);

/**
 * @route   PUT /api/reservations/:id
 * @desc    Cập nhật thông tin đặt bàn
 * @access  Private (Owner, Staff, Manager, Admin)
 * @param   id - Reservation ID
 * @body    UpdateReservationType
 */
router.put('/:id', updateReservationController);

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Cập nhật trạng thái đặt bàn
 * @access  Private (Staff, Manager, Admin)
 * @param   id - Reservation ID
 * @body    UpdateReservationStatusType
 */
router.patch('/:id/status', updateReservationStatusController);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Xóa đặt bàn
 * @access  Private (Owner, Manager, Admin)
 * @param   id - Reservation ID
 */
router.delete('/:id', deleteReservationController);

// ================================
// 🔐 ROLE-BASED AUTHENTICATION EXAMPLES
// ================================

/**
 * API cho nhiều role - Staff hoặc Manager có thể xem reservations
 * Ví dụ: /api/reservations/staff-manager-view
 */
router.get('/staff-manager-view', requireAuth(['staff', 'manager']), getReservationsController);

/**
 * API cho 1 role duy nhất - Chỉ Admin có thể xem analytics
 * Ví dụ: /api/reservations/admin-analytics
 */
router.get('/admin-analytics', requireAuth(['admin']), getReservationAnalyticsController);

/**
 * API cho khách hàng - Customer có thể tạo reservation và check availability
 * Ví dụ: /api/reservations/customer-check-availability
 */
router.get('/customer-check-availability', requireCustomer, checkAvailabilityController);

/**
 * API cho nhà hàng cụ thể - Staff/Manager chỉ xem reservations của nhà hàng họ quản lý
 * Ví dụ: /api/reservations/restaurant-today
 */
router.get('/restaurant-today', 
  requireAuth(['staff', 'manager']), 
  requireRestaurantAccess(), 
  getTodayReservationsController
);

/**
 * API cho từng role cụ thể
 */
router.get('/staff-upcoming', requireStaff, getUpcomingReservationsController);
router.post('/manager-walkin', requireManager, createWalkInController);
router.put('/admin-bulk-update', requireAdmin, bulkUpdateReservationsController);

export default router;
