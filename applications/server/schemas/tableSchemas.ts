import { z } from 'zod';

// ================================
// 🪑 TABLE SCHEMAS
// ================================

// Base table schema
export const TableSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  table_number: z.string().min(1).max(20),
  capacity: z.number().int().min(1).max(50),
  location: z.string().max(50).nullable(),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance', 'out_of_order']),
  qr_code: z.string().max(255).nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create table schema
export const CreateTableSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng phải là UUID hợp lệ"),
  table_number: z.string().min(1, "Số bàn là bắt buộc").max(20, "Số bàn không được quá 20 ký tự"),
  capacity: z.number().int().min(1, "Sức chứa phải từ 1 người trở lên").max(50, "Sức chứa không được quá 50 người").default(4),
  location: z.string().max(50, "Vị trí không được quá 50 ký tự").optional(),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance', 'out_of_order']).default('available'),
  qr_code: z.string().max(255, "Mã QR không được quá 255 ký tự").optional(),
});

// Update table schema
export const UpdateTableSchema = z.object({
  table_number: z.string().min(1, "Số bàn là bắt buộc").max(20, "Số bàn không được quá 20 ký tự").optional(),
  capacity: z.number().int().min(1, "Sức chứa phải từ 1 người trở lên").max(50, "Sức chứa không được quá 50 người").optional(),
  location: z.string().max(50, "Vị trí không được quá 50 ký tự").optional(),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance', 'out_of_order']).optional(),
  qr_code: z.string().max(255, "Mã QR không được quá 255 ký tự").optional(),
});

// Table query schema
export const TableQuerySchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance', 'out_of_order']).optional(),
  location: z.string().optional(),
  min_capacity: z.number().int().min(1).optional(),
  max_capacity: z.number().int().min(1).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  sort_by: z.enum(['table_number', 'capacity', 'location', 'status', 'created_at']).default('table_number').optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc').optional(),
});

// ================================
// 📅 RESERVATION SCHEMAS
// ================================

// Base reservation schema
export const ReservationSchema = z.object({
  id: z.string().uuid(),
  table_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable(),
  customer_name: z.string().min(1).max(100),
  customer_phone: z.string().min(1).max(20),
  customer_email: z.string().email().nullable(),
  party_size: z.number().int().min(1),
  reservation_date: z.date(),
  duration_hours: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show']),
  special_requests: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create reservation schema
export const CreateReservationSchema = z.object({
  table_id: z.string().uuid("ID bàn phải là UUID hợp lệ"),
  customer_id: z.string().uuid("ID khách hàng phải là UUID hợp lệ").nullable().optional(),
  customer_name: z.string().min(1, "Tên khách hàng là bắt buộc").max(100, "Tên khách hàng không được quá 100 ký tự"),
  customer_phone: z.string().min(1, "Số điện thoại là bắt buộc").max(20, "Số điện thoại không được quá 20 ký tự"),
  customer_email: z.string().email("Email không hợp lệ").nullable().optional(),
  party_size: z.number().int().min(1, "Số người phải từ 1 trở lên"),
  reservation_date: z.string().transform((str) => new Date(str)).refine((date) => date > new Date(), {
    message: "Ngày đặt bàn phải trong tương lai"
  }),
  duration_hours: z.number().positive("Thời gian phải là số dương").default(2).optional(),
  special_requests: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Update reservation schema
export const UpdateReservationSchema = z.object({
  customer_name: z.string().min(1, "Tên khách hàng là bắt buộc").max(100, "Tên khách hàng không được quá 100 ký tự").optional(),
  customer_phone: z.string().min(1, "Số điện thoại là bắt buộc").max(20, "Số điện thoại không được quá 20 ký tự").optional(),
  customer_email: z.string().email("Email không hợp lệ").nullable().optional(),
  party_size: z.number().int().min(1, "Số người phải từ 1 trở lên").optional(),
  reservation_date: z.string().transform((str) => new Date(str)).refine((date) => date > new Date(), {
    message: "Ngày đặt bàn phải trong tương lai"
  }).optional(),
  duration_hours: z.number().positive("Thời gian phải là số dương").optional(),
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show']).optional(),
  special_requests: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Reservation query schema
export const ReservationQuerySchema = z.object({
  table_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  customer_phone: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show']).optional(),
  date_from: z.string().transform((str) => new Date(str)).optional(),
  date_to: z.string().transform((str) => new Date(str)).optional(),
  party_size_min: z.number().int().min(1).optional(),
  party_size_max: z.number().int().min(1).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  sort_by: z.enum(['reservation_date', 'customer_name', 'party_size', 'status', 'created_at']).default('reservation_date').optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc').optional(),
});

// ================================
// 🍽️ TABLE ORDER SCHEMAS
// ================================

// Base table order schema
export const TableOrderSchema = z.object({
  id: z.string().uuid(),
  table_id: z.string().uuid(),
  order_id: z.string().uuid().nullable(),
  session_code: z.string().min(1).max(20),
  status: z.enum(['active', 'completed', 'cancelled']),
  opened_at: z.date(),
  closed_at: z.date().nullable(),
  total_amount: z.number().positive().nullable(),
  staff_id: z.string().uuid().nullable(),
});

// Create table order schema
export const CreateTableOrderSchema = z.object({
  table_id: z.string().uuid("ID bàn phải là UUID hợp lệ"),
  session_code: z.string().min(1, "Mã phiên là bắt buộc").max(20, "Mã phiên không được quá 20 ký tự").optional(),
  staff_id: z.string().uuid("ID nhân viên phải là UUID hợp lệ").nullable().optional(),
});

// Update table order schema
export const UpdateTableOrderSchema = z.object({
  order_id: z.string().uuid("ID đơn hàng phải là UUID hợp lệ").nullable().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  total_amount: z.number().positive("Tổng tiền phải là số dương").nullable().optional(),
  staff_id: z.string().uuid("ID nhân viên phải là UUID hợp lệ").nullable().optional(),
});

// Table order query schema
export const TableOrderQuerySchema = z.object({
  table_id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  staff_id: z.string().uuid().optional(),
  session_code: z.string().optional(),
  date_from: z.string().transform((str) => new Date(str)).optional(),
  date_to: z.string().transform((str) => new Date(str)).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  sort_by: z.enum(['opened_at', 'closed_at', 'total_amount', 'status']).default('opened_at').optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc').optional(),
});

// ================================
// 🔍 SPECIALIZED SCHEMAS
// ================================

// Table availability check schema
export const TableAvailabilitySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng phải là UUID hợp lệ"),
  party_size: z.number().int().min(1, "Số người phải từ 1 trở lên"),
  reservation_date: z.string().transform((str) => new Date(str)).refine((date) => date > new Date(), {
    message: "Ngày đặt bàn phải trong tương lai"
  }),
  duration_hours: z.number().positive("Thời gian phải là số dương").default(2).optional(),
});

// Table status update schema
export const UpdateTableStatusSchema = z.object({
  table_ids: z.array(z.string().uuid("ID bàn phải là UUID hợp lệ")).min(1, "Phải có ít nhất 1 bàn"),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance', 'out_of_order']),
});

// QR code generation schema
export const GenerateQRCodeSchema = z.object({
  table_id: z.string().uuid("ID bàn phải là UUID hợp lệ"),
  restaurant_id: z.string().uuid("ID nhà hàng phải là UUID hợp lệ"),
});

// Reservation confirmation schema
export const ConfirmReservationSchema = z.object({
  reservation_id: z.string().uuid("ID đặt bàn phải là UUID hợp lệ"),
  notes: z.string().nullable().optional(),
});

// Table check-in schema (khi khách đến)
export const TableCheckInSchema = z.object({
  reservation_id: z.string().uuid("ID đặt bàn phải là UUID hợp lệ").optional(),
  table_id: z.string().uuid("ID bàn phải là UUID hợp lệ"),
  party_size: z.number().int().min(1, "Số người phải từ 1 trở lên"),
  staff_id: z.string().uuid("ID nhân viên phải là UUID hợp lệ"),
});

// ================================
// 📊 STATISTICS SCHEMAS
// ================================

// Table statistics query schema
export const TableStatsQuerySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng phải là UUID hợp lệ"),
  date_from: z.string().transform((str) => new Date(str)).optional(),
  date_to: z.string().transform((str) => new Date(str)).optional(),
});

// Reservation statistics query schema
export const ReservationStatsQuerySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng phải là UUID hợp lệ"),
  date_from: z.string().transform((str) => new Date(str)).optional(),
  date_to: z.string().transform((str) => new Date(str)).optional(),
});

// ================================
// 📤 TYPE EXPORTS
// ================================

export type Table = z.infer<typeof TableSchema>;
export type CreateTable = z.infer<typeof CreateTableSchema>;
export type UpdateTable = z.infer<typeof UpdateTableSchema>;
export type TableQuery = z.infer<typeof TableQuerySchema>;

export type Reservation = z.infer<typeof ReservationSchema>;
export type CreateReservation = z.infer<typeof CreateReservationSchema>;
export type UpdateReservation = z.infer<typeof UpdateReservationSchema>;
export type ReservationQuery = z.infer<typeof ReservationQuerySchema>;

export type TableOrder = z.infer<typeof TableOrderSchema>;
export type CreateTableOrder = z.infer<typeof CreateTableOrderSchema>;
export type UpdateTableOrder = z.infer<typeof UpdateTableOrderSchema>;
export type TableOrderQuery = z.infer<typeof TableOrderQuerySchema>;

export type TableAvailability = z.infer<typeof TableAvailabilitySchema>;
export type UpdateTableStatus = z.infer<typeof UpdateTableStatusSchema>;
export type GenerateQRCode = z.infer<typeof GenerateQRCodeSchema>;
export type ConfirmReservation = z.infer<typeof ConfirmReservationSchema>;
export type TableCheckIn = z.infer<typeof TableCheckInSchema>;
export type TableStatsQuery = z.infer<typeof TableStatsQuerySchema>;
export type ReservationStatsQuery = z.infer<typeof ReservationStatsQuerySchema>;
