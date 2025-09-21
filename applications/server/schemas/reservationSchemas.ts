import { z } from 'zod';

// ================================
// 🎯 RESERVATION SCHEMAS
// ================================

// Base Reservation Schema
export const ReservationSchema = z.object({
  id: z.string().uuid(),
  table_id: z.string().uuid(),
  customer_id: z.string().uuid().optional(),
  customer_name: z.string().min(1).max(100),
  customer_phone: z.string().min(1).max(20),
  customer_email: z.string().email().max(255).optional(),
  party_size: z.number().int().min(1),
  reservation_date: z.date(),
  duration_hours: z.number().min(0.25).max(24),
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show']),
  special_requests: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Reservation Schema
export const CreateReservationSchema = z.object({
  table_id: z.string().uuid("ID bàn không hợp lệ"),
  customer_id: z.string().uuid("ID khách hàng không hợp lệ").optional(),
  customer_name: z.string()
    .min(1, "Tên khách hàng là bắt buộc")
    .max(100, "Tên khách hàng không được quá 100 ký tự"),
  customer_phone: z.string()
    .min(1, "Số điện thoại là bắt buộc")
    .max(20, "Số điện thoại không được quá 20 ký tự"),
  customer_email: z.string()
    .email("Email không hợp lệ")
    .max(255, "Email không được quá 255 ký tự")
    .optional(),
  party_size: z.number()
    .int("Số người phải là số nguyên")
    .min(1, "Số người phải ít nhất 1")
    .max(50, "Số người không được quá 50"),
  reservation_date: z.date("Thời gian đặt bàn không hợp lệ")
    .refine((date) => date > new Date(), "Thời gian đặt bàn phải trong tương lai"),
  duration_hours: z.number()
    .min(0.25, "Thời gian tối thiểu 15 phút")
    .max(24, "Thời gian tối đa 24 tiếng")
    .default(2),
  special_requests: z.string().optional(),
  notes: z.string().optional(),
});

// Update Reservation Schema
export const UpdateReservationSchema = z.object({
  customer_name: z.string()
    .min(1, "Tên khách hàng là bắt buộc")
    .max(100, "Tên khách hàng không được quá 100 ký tự")
    .optional(),
  customer_phone: z.string()
    .min(1, "Số điện thoại là bắt buộc")
    .max(20, "Số điện thoại không được quá 20 ký tự")
    .optional(),
  customer_email: z.string()
    .email("Email không hợp lệ")
    .max(255, "Email không được quá 255 ký tự")
    .optional(),
  party_size: z.number()
    .int("Số người phải là số nguyên")
    .min(1, "Số người phải ít nhất 1")
    .max(50, "Số người không được quá 50")
    .optional(),
  reservation_date: z.date("Thời gian đặt bàn không hợp lệ")
    .refine((date) => date > new Date(), "Thời gian đặt bàn phải trong tương lai")
    .optional(),
  duration_hours: z.number()
    .min(0.25, "Thời gian tối thiểu 15 phút")
    .max(24, "Thời gian tối đa 24 tiếng")
    .optional(),
  special_requests: z.string().optional(),
  notes: z.string().optional(),
});

// Reservation Status Update Schema
export const UpdateReservationStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'], {
    message: "Trạng thái không hợp lệ"
  }),
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Reservation Query Schema
export const ReservationQuerySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ").optional(),
  table_id: z.string().uuid("ID bàn không hợp lệ").optional(),
  customer_id: z.string().uuid("ID khách hàng không hợp lệ").optional(),
  status: z.enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show']).optional(),
  date_from: z.string().datetime("Ngày bắt đầu không hợp lệ").optional(),
  date_to: z.string().datetime("Ngày kết thúc không hợp lệ").optional(),
  customer_phone: z.string().optional(),
  customer_name: z.string().optional(),
  page: z.number().min(1, "Trang phải lớn hơn 0").default(1),
  limit: z.number().min(1, "Giới hạn phải lớn hơn 0").max(100, "Giới hạn tối đa 100").default(10),
  sort_by: z.enum(['reservation_date', 'created_at', 'customer_name', 'party_size']).default('reservation_date'),
  sort_order: z.enum(['asc', 'desc']).default('asc')
});

// Check Table Availability Schema
export const CheckAvailabilitySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  reservation_date: z.string().datetime("Thời gian không hợp lệ"),
  duration_hours: z.number()
    .min(0.5, "Thời gian tối thiểu 30 phút")
    .max(8, "Thời gian tối đa 8 tiếng")
    .default(2),
  party_size: z.number()
    .min(1, "Số người phải ít nhất 1")
    .max(20, "Số người không được quá 20"),
  table_id: z.string().uuid("ID bàn không hợp lệ").optional()
});

// Bulk Reservation Operations Schema
export const BulkUpdateReservationSchema = z.object({
  reservation_ids: z.array(z.string().uuid("ID đặt bàn không hợp lệ"))
    .min(1, "Phải chọn ít nhất 1 đặt bàn"),
  status: z.enum(['confirmed', 'cancelled', 'no_show'], {
    message: "Trạng thái không hợp lệ"
  }),
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Reservation Analytics Schema
export const ReservationAnalyticsSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  date_from: z.string().datetime("Ngày bắt đầu không hợp lệ"),
  date_to: z.string().datetime("Ngày kết thúc không hợp lệ"),
  group_by: z.enum(['day', 'week', 'month', 'hour']).default('day')
});

// Walk-in Customer Schema (for immediate seating)
export const CreateWalkInSchema = z.object({
  table_id: z.string().uuid("ID bàn không hợp lệ"),
  customer_name: z.string()
    .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
    .max(100, "Tên khách hàng không được quá 100 ký tự"),
  customer_phone: z.string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
    .optional(),
  party_size: z.number()
    .min(1, "Số người phải ít nhất 1")
    .max(20, "Số người không được quá 20"),
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Waitlist Schema (when no tables available)
export const CreateWaitlistSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  customer_name: z.string()
    .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
    .max(100, "Tên khách hàng không được quá 100 ký tự"),
  customer_phone: z.string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  customer_email: z.string()
    .email("Email không hợp lệ")
    .optional(),
  party_size: z.number()
    .min(1, "Số người phải ít nhất 1")
    .max(20, "Số người không được quá 20"),
  preferred_time: z.string()
    .datetime("Thời gian ưa thích không hợp lệ"),
  max_wait_time: z.number()
    .min(15, "Thời gian chờ tối thiểu 15 phút")
    .max(480, "Thời gian chờ tối đa 8 tiếng")
    .default(120), // 2 hours
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Export all schemas
export type CreateReservationType = z.infer<typeof CreateReservationSchema>;
export type UpdateReservationType = z.infer<typeof UpdateReservationSchema>;
export type UpdateReservationStatusType = z.infer<typeof UpdateReservationStatusSchema>;
export type ReservationQueryType = z.infer<typeof ReservationQuerySchema>;
export type CheckAvailabilityType = z.infer<typeof CheckAvailabilitySchema>;
export type BulkUpdateReservationType = z.infer<typeof BulkUpdateReservationSchema>;
export type ReservationAnalyticsType = z.infer<typeof ReservationAnalyticsSchema>;
export type CreateWalkInType = z.infer<typeof CreateWalkInSchema>;
export type CreateWaitlistType = z.infer<typeof CreateWaitlistSchema>;
