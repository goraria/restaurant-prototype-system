import { Router } from 'express';
import * as tableControllers from '../controllers/tableControllers';

const router = Router();

// ================================
// 🪑 TABLE ROUTES
// ================================

// 🔹 Tạo bàn mới
router.post('/tables', tableControllers.createTable);

// 🔹 Lấy danh sách bàn với filter & pagination
router.get('/tables', tableControllers.getTables);

// 🔹 Kiểm tra bàn trống
router.post('/tables/check-availability', tableControllers.checkTableAvailability);

// 🔹 Cập nhật trạng thái nhiều bàn
router.patch('/tables/status', tableControllers.updateTableStatus);

// 🔹 Lấy bàn theo ID
router.get('/tables/:id', tableControllers.getTableById);

// 🔹 Cập nhật bàn
router.put('/tables/:id', tableControllers.updateTable);

// 🔹 Xóa bàn
router.delete('/tables/:id', tableControllers.deleteTable);

// 🔹 Lấy bàn theo nhà hàng
router.get('/restaurants/:restaurantId/tables', tableControllers.getTablesByRestaurantId);

// ================================
// 📅 RESERVATION ROUTES
// ================================

// 🔹 Tạo đặt bàn mới
router.post('/reservations', tableControllers.createReservation);

// 🔹 Lấy danh sách đặt bàn với filter & pagination
router.get('/reservations', tableControllers.getReservations);

// 🔹 Xác nhận đặt bàn
router.post('/reservations/confirm', tableControllers.confirmReservation);

// 🔹 Check-in khách hàng
router.post('/reservations/check-in', tableControllers.checkInTable);

// 🔹 Lấy đặt bàn theo ID
router.get('/reservations/:id', tableControllers.getReservationById);

// 🔹 Cập nhật đặt bàn
router.put('/reservations/:id', tableControllers.updateReservation);

// ================================
// 🍽️ TABLE ORDER ROUTES
// ================================

// 🔹 Tạo phiên bàn mới
router.post('/table-orders', tableControllers.createTableOrder);

// 🔹 Lấy danh sách phiên bàn với filter & pagination
router.get('/table-orders', tableControllers.getTableOrders);

// 🔹 Lấy phiên bàn theo ID
router.get('/table-orders/:id', tableControllers.getTableOrderById);

// 🔹 Cập nhật phiên bàn
router.put('/table-orders/:id', tableControllers.updateTableOrder);

// ================================
// 📊 STATISTICS ROUTES
// ================================

// 🔹 Thống kê bàn
router.get('/stats/tables', tableControllers.getTableStats);

// 🔹 Thống kê đặt bàn
router.get('/stats/reservations', tableControllers.getReservationStats);

export default router;
