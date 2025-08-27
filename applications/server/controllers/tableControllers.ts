import { Request, Response } from 'express';
import { 
  CreateTableSchema,
  UpdateTableSchema,
  TableQuerySchema,
  CreateReservationSchema,
  UpdateReservationSchema,
  ReservationQuerySchema,
  CreateTableOrderSchema,
  UpdateTableOrderSchema,
  TableOrderQuerySchema,
  TableAvailabilitySchema,
  UpdateTableStatusSchema,
  ConfirmReservationSchema,
  TableCheckInSchema,
  TableStatsQuerySchema,
  ReservationStatsQuerySchema
} from '../schemas/tableSchemas';
import * as tableServices from '../services/tableServices';

// ================================
// 🪑 TABLE CONTROLLERS
// ================================

// Tạo bàn mới
export const createTable = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateTableSchema.parse(req.body);
    const table = await tableServices.createTable(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo bàn thành công',
      data: table
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo bàn',
      error: error.issues || error
    });
  }
};

// Lấy bàn theo ID
export const getTableById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const table = await tableServices.getTableById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin bàn thành công',
      data: table
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy bàn',
    });
  }
};

// Lấy danh sách bàn với filter
export const getTables = async (req: Request, res: Response) => {
  try {
    const validatedQuery = TableQuerySchema.parse(req.query);
    const result = await tableServices.getTables(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách bàn thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách bàn',
      error: error.issues || error
    });
  }
};

// Lấy bàn theo nhà hàng
export const getTablesByRestaurantId = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const tables = await tableServices.getTablesByRestaurantId(restaurantId);
    
    res.status(200).json({
      success: true,
      message: 'Lấy bàn của nhà hàng thành công',
      data: tables
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy bàn của nhà hàng',
    });
  }
};

// Cập nhật bàn
export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateTableSchema.parse(req.body);
    const table = await tableServices.updateTable(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật bàn thành công',
      data: table
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật bàn',
      error: error.issues || error
    });
  }
};

// Xóa bàn
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await tableServices.deleteTable(id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xóa bàn',
    });
  }
};

// Kiểm tra bàn trống
export const checkTableAvailability = async (req: Request, res: Response) => {
  try {
    const validatedData = TableAvailabilitySchema.parse(req.body);
    const availableTables = await tableServices.checkTableAvailability(validatedData);
    
    res.status(200).json({
      success: true,
      message: `Tìm thấy ${availableTables.length} bàn trống`,
      data: availableTables
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra bàn trống',
      error: error.issues || error
    });
  }
};

// Cập nhật trạng thái nhiều bàn
export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const validatedData = UpdateTableStatusSchema.parse(req.body);
    const result = await tableServices.updateTableStatus(validatedData);
    
    res.status(200).json({
      success: true,
      message: result.message,
      count: result.count
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái bàn',
      error: error.issues || error
    });
  }
};

// ================================
// 📅 RESERVATION CONTROLLERS
// ================================

// Tạo đặt bàn mới
export const createReservation = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateReservationSchema.parse(req.body);
    const reservation = await tableServices.createReservation(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo đặt bàn thành công',
      data: reservation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đặt bàn',
      error: error.issues || error
    });
  }
};

// Lấy đặt bàn theo ID
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await tableServices.getReservationById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin đặt bàn thành công',
      data: reservation
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy đặt bàn',
    });
  }
};

// Lấy danh sách đặt bàn
export const getReservations = async (req: Request, res: Response) => {
  try {
    const validatedQuery = ReservationQuerySchema.parse(req.query);
    const result = await tableServices.getReservations(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đặt bàn thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách đặt bàn',
      error: error.issues || error
    });
  }
};

// Cập nhật đặt bàn
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateReservationSchema.parse(req.body);
    const reservation = await tableServices.updateReservation(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật đặt bàn thành công',
      data: reservation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật đặt bàn',
      error: error.issues || error
    });
  }
};

// Xác nhận đặt bàn
export const confirmReservation = async (req: Request, res: Response) => {
  try {
    const validatedData = ConfirmReservationSchema.parse(req.body);
    const reservation = await tableServices.confirmReservation(validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Xác nhận đặt bàn thành công',
      data: reservation
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xác nhận đặt bàn',
      error: error.issues || error
    });
  }
};

// Check-in khách hàng
export const checkInTable = async (req: Request, res: Response) => {
  try {
    const validatedData = TableCheckInSchema.parse(req.body);
    const tableOrder = await tableServices.checkInTable(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Check-in thành công',
      data: tableOrder
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi check-in',
      error: error.issues || error
    });
  }
};

// ================================
// 🍽️ TABLE ORDER CONTROLLERS
// ================================

// Tạo table order
export const createTableOrder = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateTableOrderSchema.parse(req.body);
    const tableOrder = await tableServices.createTableOrder(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo phiên bàn thành công',
      data: tableOrder
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo phiên bàn',
      error: error.issues || error
    });
  }
};

// Lấy table order theo ID
export const getTableOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tableOrder = await tableServices.getTableOrderById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin phiên bàn thành công',
      data: tableOrder
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy phiên bàn',
    });
  }
};

// Lấy danh sách table orders
export const getTableOrders = async (req: Request, res: Response) => {
  try {
    const validatedQuery = TableOrderQuerySchema.parse(req.query);
    const result = await tableServices.getTableOrders(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách phiên bàn thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách phiên bàn',
      error: error.issues || error
    });
  }
};

// Cập nhật table order
export const updateTableOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateTableOrderSchema.parse(req.body);
    const tableOrder = await tableServices.updateTableOrder(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật phiên bàn thành công',
      data: tableOrder
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật phiên bàn',
      error: error.issues || error
    });
  }
};

// ================================
// 📊 STATISTICS CONTROLLERS
// ================================

// Thống kê bàn
export const getTableStats = async (req: Request, res: Response) => {
  try {
    const validatedQuery = TableStatsQuerySchema.parse(req.query);
    const stats = await tableServices.getTableStats(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thống kê bàn thành công',
      data: stats
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê bàn',
      error: error.issues || error
    });
  }
};

// Thống kê đặt bàn
export const getReservationStats = async (req: Request, res: Response) => {
  try {
    const validatedQuery = ReservationStatsQuerySchema.parse(req.query);
    const stats = await tableServices.getReservationStats(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thống kê đặt bàn thành công',
      data: stats
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê đặt bàn',
      error: error.issues || error
    });
  }
};
