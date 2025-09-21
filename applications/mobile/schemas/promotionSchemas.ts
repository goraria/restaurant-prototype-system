import { z } from 'zod';

// ================================
// 🎟️ VOUCHER & PROMOTION SCHEMAS
// ================================

// Voucher schemas (existing patterns)
export const CreateVoucherSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  code: z.string()
    .min(3, 'Mã voucher tối thiểu 3 ký tự')
    .max(50, 'Mã voucher tối đa 50 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Mã voucher chỉ chứa chữ in hoa, số, gạch dưới và gạch ngang'),
  name: z.string()
    .min(1, 'Tên voucher không được để trống')
    .max(100, 'Tên voucher không được quá 100 ký tự'),
  description: z.string()
    .max(500, 'Mô tả không được quá 500 ký tự')
    .optional(),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number()
    .min(0, 'Giá trị giảm giá phải lớn hơn 0'),
  min_order_value: z.number()
    .min(0, 'Giá trị đơn hàng tối thiểu phải lớn hơn 0')
    .optional(),
  max_discount: z.number()
    .min(0, 'Giá trị giảm tối đa phải lớn hơn 0')
    .optional(),
  usage_limit: z.number()
    .min(1, 'Giới hạn sử dụng phải lớn hơn 0')
    .optional(),
  start_date: z.string()
    .datetime('Ngày bắt đầu không hợp lệ'),
  end_date: z.string()
    .datetime('Ngày kết thúc không hợp lệ'),
  is_active: z.boolean()
    .optional()
    .default(true)
});

// ================================
// 🎟️ VOUCHER & PROMOTION SCHEMAS
// ================================

// Base Promotion Schema (matches Prisma model exactly)
export const PromotionSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed_amount', 'buy_one_get_one', 'combo_deal', 'happy_hour', 'seasonal']),
  discount_value: z.number().min(0), // Decimal(12,2) from database
  conditions: z.any().optional(), // Json field
  applicable_items: z.array(z.string()), // String array
  time_restrictions: z.any().optional(), // Json field
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
});

// Promotion schemas
export const CreatePromotionSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ'),
  name: z.string()
    .min(1, 'Tên khuyến mãi không được để trống')
    .max(100, 'Tên khuyến mãi không được quá 100 ký tự'),
  description: z.string()
    .max(500, 'Mô tả không được quá 500 ký tự')
    .optional(),
  type: z.enum(['percentage', 'fixed_amount', 'buy_one_get_one', 'combo_deal', 'happy_hour', 'seasonal']),
  discount_value: z.number()
    .min(0, 'Giá trị giảm giá phải lớn hơn hoặc bằng 0'),
  conditions: z.any().optional(), // Json field for flexible conditions
  applicable_items: z.array(z.string())
    .default([]), // Array of item IDs (strings)
  time_restrictions: z.any().optional(), // Json field for time restrictions
  start_date: z.date('Ngày bắt đầu không hợp lệ'),
  end_date: z.date('Ngày kết thúc không hợp lệ'),
  is_active: z.boolean()
    .default(true)
});

// Update schemas
export const UpdateVoucherSchema = CreateVoucherSchema.partial().omit({ code: true });
export const UpdatePromotionSchema = CreatePromotionSchema.partial().omit({ restaurant_id: true });

// Query schemas
export const VoucherQuerySchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  code: z.string()
    .optional(),
  discount_type: z.enum(['percentage', 'fixed_amount'])
    .optional(),
  is_active: z.boolean()
    .optional(),
  is_expired: z.boolean()
    .optional(),
  sort_by: z.enum(['created_at', 'start_date', 'end_date', 'used_count'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  page: z.number()
    .min(1, 'Trang phải lớn hơn 0')
    .int('Trang phải là số nguyên')
    .optional()
    .default(1),
  limit: z.number()
    .min(1, 'Giới hạn phải lớn hơn 0')
    .max(100, 'Giới hạn tối đa 100')
    .int('Giới hạn phải là số nguyên')
    .optional()
    .default(20)
});

export const PromotionQuerySchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  type: z.enum(['percentage', 'fixed_amount', 'buy_one_get_one', 'combo_deal', 'happy_hour', 'seasonal'])
    .optional(),
  is_active: z.boolean()
    .optional(),
  is_expired: z.boolean()
    .optional(),
  applicable_to_item: z.string()
    .uuid('ID món ăn không hợp lệ')
    .optional(),
  sort_by: z.enum(['created_at', 'start_date', 'end_date', 'discount_value'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  page: z.number()
    .min(1, 'Trang phải lớn hơn 0')
    .int('Trang phải là số nguyên')
    .optional()
    .default(1),
  limit: z.number()
    .min(1, 'Giới hạn phải lớn hơn 0')
    .max(100, 'Giới hạn tối đa 100')
    .int('Giới hạn phải là số nguyên')
    .optional()
    .default(20)
});

// Voucher application schema
export const ApplyVoucherSchema = z.object({
  voucher_code: z.string()
    .min(1, 'Mã voucher không được để trống'),
  order_total: z.number()
    .min(0, 'Tổng tiền đơn hàng phải lớn hơn 0'),
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ'),
  menu_items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).optional()
});

// Promotion check schema
export const CheckPromotionsSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ'),
  order_total: z.number()
    .min(0, 'Tổng tiền đơn hàng phải lớn hơn 0'),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  customer_id: z.string()
    .uuid('ID khách hàng không hợp lệ')
    .optional(),
  menu_items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  order_time: z.string()
    .datetime('Thời gian đặt hàng không hợp lệ')
    .optional()
});

// Combined discount calculation schema
export const CalculateDiscountSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ'),
  order_total: z.number()
    .min(0, 'Tổng tiền đơn hàng phải lớn hơn 0'),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  customer_id: z.string()
    .uuid('ID khách hàng không hợp lệ')
    .optional(),
  menu_items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  voucher_code: z.string()
    .optional(),
  order_time: z.string()
    .datetime('Thời gian đặt hàng không hợp lệ')
    .optional()
});

// Bulk operations
export const BulkVoucherActionSchema = z.object({
  voucher_ids: z.array(z.string().uuid('ID voucher không hợp lệ'))
    .min(1, 'Phải chọn ít nhất 1 voucher')
    .max(50, 'Tối đa 50 voucher cho mỗi thao tác'),
  action: z.enum(['activate', 'deactivate', 'delete', 'extend']),
  extend_days: z.number()
    .min(1, 'Số ngày gia hạn phải lớn hơn 0')
    .optional()
});

export const BulkPromotionActionSchema = z.object({
  promotion_ids: z.array(z.string().uuid('ID khuyến mãi không hợp lệ'))
    .min(1, 'Phải chọn ít nhất 1 khuyến mãi')
    .max(50, 'Tối đa 50 khuyến mãi cho mỗi thao tác'),
  action: z.enum(['activate', 'deactivate', 'delete', 'extend']),
  extend_days: z.number()
    .min(1, 'Số ngày gia hạn phải lớn hơn 0')
    .optional()
});

// Analytics schemas
export const DiscountAnalyticsSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  period: z.enum(['7d', '30d', '90d', '1y', 'all'])
    .optional()
    .default('30d'),
  type: z.enum(['vouchers', 'promotions', 'both'])
    .optional()
    .default('both'),
  date_from: z.string()
    .datetime('Ngày bắt đầu không hợp lệ')
    .optional(),
  date_to: z.string()
    .datetime('Ngày kết thúc không hợp lệ')
    .optional()
});

// ================================
// 🏷️ TYPE EXPORTS
// ================================

export type CreateVoucherRequest = z.infer<typeof CreateVoucherSchema>;
export type CreatePromotionRequest = z.infer<typeof CreatePromotionSchema>;
export type UpdateVoucherRequest = z.infer<typeof UpdateVoucherSchema>;
export type UpdatePromotionRequest = z.infer<typeof UpdatePromotionSchema>;
export type VoucherQueryRequest = z.infer<typeof VoucherQuerySchema>;
export type PromotionQueryRequest = z.infer<typeof PromotionQuerySchema>;
export type ApplyVoucherRequest = z.infer<typeof ApplyVoucherSchema>;
export type CheckPromotionsRequest = z.infer<typeof CheckPromotionsSchema>;
export type CalculateDiscountRequest = z.infer<typeof CalculateDiscountSchema>;
export type BulkVoucherActionRequest = z.infer<typeof BulkVoucherActionSchema>;
export type BulkPromotionActionRequest = z.infer<typeof BulkPromotionActionSchema>;
export type DiscountAnalyticsRequest = z.infer<typeof DiscountAnalyticsSchema>;
