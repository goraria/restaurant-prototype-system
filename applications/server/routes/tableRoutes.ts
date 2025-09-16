import { Router } from 'express';
import {
	getAllTable,
	createTable,
	getTables,
	checkTableAvailability,
	updateTableStatus,
	// getTableById,
	// updateTable,
	// deleteTable,
	// getTablesByRestaurantId,
	createReservation,
	getReservations,
	confirmReservation,
	checkInTable,
	// getReservationById,
	// updateReservation,
	createTableOrder,
	getTableOrders,
	// getTableOrderById,
	// updateTableOrder,
	getTableStats,
	getReservationStats,
} from '@/controllers/tableControllers';

const router = Router();

// ================================
// 🪑 TABLE ROUTES
// ================================

router.get("/", getAllTable)

// 🔹 Tạo bàn mới
router.post('/tables', createTable);

// 🔹 Lấy danh sách bàn với filter & pagination
router.get('/tables', getTables);

// 🔹 Kiểm tra bàn trống
router.post('/tables/check-availability', checkTableAvailability);

// 🔹 Cập nhật trạng thái nhiều bàn
router.patch('/tables/status', updateTableStatus);

// 🔹 Lấy bàn theo ID
// router.get('/tables/:id', getTableById);

// 🔹 Cập nhật bàn
// router.put('/tables/:id', updateTable);

// 🔹 Xóa bàn
// router.delete('/tables/:id', deleteTable);

// 🔹 Lấy bàn theo nhà hàng
// router.get('/restaurants/:restaurantId/tables', getTablesByRestaurantId);

// ================================
// 📅 RESERVATION ROUTES
// ================================

// 🔹 Tạo đặt bàn mới
router.post('/reservations', createReservation);

// 🔹 Lấy danh sách đặt bàn với filter & pagination
router.get('/reservations', getReservations);

// 🔹 Xác nhận đặt bàn
router.post('/reservations/confirm', confirmReservation);

// 🔹 Check-in khách hàng
router.post('/reservations/check-in', checkInTable);

// 🔹 Lấy đặt bàn theo ID
// router.get('/reservations/:id', getReservationById);

// 🔹 Cập nhật đặt bàn
// router.put('/reservations/:id', updateReservation);

// ================================
// 🍽️ TABLE ORDER ROUTES
// ================================

// 🔹 Tạo phiên bàn mới
router.post('/table-orders', createTableOrder);

// 🔹 Lấy danh sách phiên bàn với filter & pagination
router.get('/table-orders', getTableOrders);

// 🔹 Lấy phiên bàn theo ID
// router.get('/table-orders/:id', getTableOrderById);

// 🔹 Cập nhật phiên bàn
// router.put('/table-orders/:id', updateTableOrder);

// ================================
// 📊 STATISTICS ROUTES
// ================================

// 🔹 Thống kê bàn
router.get('/stats/tables', getTableStats);

// 🔹 Thống kê đặt bàn
router.get('/stats/reservations', getReservationStats);

export default router;
