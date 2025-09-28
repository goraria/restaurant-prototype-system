import { Router } from 'express';
import {
  getAllReservations,
  updateStatusReservation,
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
  getUpcomingReservationsController,
  createWaitlistController,
  getWaitlistController,
  updateWaitlistStatusController,
  getReservationsByCustomerController,
  searchReservationsByPhoneController,
  getDailyReservationStatsController,
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

router.get("/", getAllReservations)

router.patch("/:id", updateStatusReservation)
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
router.get('/staff-manager-view', getReservationsController);
// router.get('/staff-manager-view', requireAuth(['staff-manager-viewaff', 'manager']), getReservationsController);

/**
 * API cho 1 role duy nhất - Chỉ Admin có thể xem analytics
 * Ví dụ: /api/reservations/admin-analytics
 */
router.get('/admin-analytics', getReservationAnalyticsController);
// router.get('/admin-analytics', requireAuth(['admin']), getReservationAnalyticsController);

/**
 * API cho khách hàng - Customer có thể tạo reservation và check availability
 * Ví dụ: /api/reservations/customer-check-availability
 */
router.get('/customer-check-availability', checkAvailabilityController);
// router.get('/customer-check-availability', requireCustomer, checkAvailabilityController);

/**
 * API cho nhà hàng cụ thể - Staff/Manager chỉ xem reservations của nhà hàng họ quản lý
 * Ví dụ: /api/reservations/restaurant-today
 */
// router.get('/restaurant-today',
//   requireAuth(['staff', 'manager']),
//   requireRestaurantAccess(),
//   getTodayReservationsController
// );

/**
 * API cho từng role cụ thể
 */
router.get('/staff-upcoming', getUpcomingReservationsController);
router.post('/manager-walkin', createWalkInController);
router.put('/admin-bulk-update', bulkUpdateReservationsController);
// router.get('/staff-upcoming', requireStaff, getUpcomingReservationsController);
// router.post('/manager-walkin', requireManager, createWalkInController);
// router.put('/admin-bulk-update', requireAdmin, bulkUpdateReservationsController);

// ================================
// 🎯 WAITLIST ROUTES
// ================================

/**
 * @route   POST /api/reservations/waitlist
 * @desc    Tạo danh sách chờ
 * @access  Public
 * @body    CreateWaitlistType
 */
router.post('/waitlist', createWaitlistController);

/**
 * @route   GET /api/reservations/waitlist
 * @desc    Lấy danh sách chờ
 * @access  Private (Staff, Manager, Admin)
 * @query   restaurant_id, status
 */
router.get('/waitlist', getWaitlistController);

/**
 * @route   PATCH /api/reservations/waitlist/:id/status
 * @desc    Cập nhật trạng thái danh sách chờ
 * @access  Private (Staff, Manager, Admin)
 * @param   id - Waitlist ID
 * @body    { status, notes }
 */
router.patch('/waitlist/:id/status', updateWaitlistStatusController);

// ================================
// 🔍 SEARCH & CUSTOMER ROUTES
// ================================

/**
 * @route   GET /api/reservations/customer/:customer_id
 * @desc    Lấy đặt bàn theo khách hàng
 * @access  Private (Customer, Staff, Manager, Admin)
 * @param   customer_id - Customer ID
 * @query   status
 */
router.get('/customer/:customer_id', getReservationsByCustomerController);

/**
 * @route   GET /api/reservations/search/phone
 * @desc    Tìm kiếm đặt bàn theo số điện thoại
 * @access  Private (Staff, Manager, Admin)
 * @query   phone, restaurant_id
 */
router.get('/search/phone', searchReservationsByPhoneController);

// ================================
// 📊 STATISTICS ROUTES
// ================================

/**
 * @route   GET /api/reservations/stats/daily
 * @desc    Lấy thống kê đặt bàn theo ngày
 * @access  Private (Manager, Admin)
 * @query   restaurant_id, date
 */
router.get('/stats/daily', getDailyReservationStatsController);

export default router;
