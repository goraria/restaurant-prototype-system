import { z } from 'zod';

// ================================
// 🌟 REVIEW SCHEMAS
// ================================

// Base review schema
const BaseReviewSchema = z.object({
  rating: z.number()
    .min(1, 'Đánh giá tối thiểu 1 sao')
    .max(5, 'Đánh giá tối đa 5 sao')
    .int('Đánh giá phải là số nguyên'),
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không được quá 255 ký tự')
    .optional(),
  content: z.string()
    .max(2000, 'Nội dung đánh giá không được quá 2000 ký tự')
    .optional(),
  photos: z.array(z.string().url('URL ảnh không hợp lệ'))
    .max(10, 'Tối đa 10 ảnh cho mỗi đánh giá')
    .optional()
    .default([])
});

// Create review schemas
export const CreateRestaurantReviewSchema = BaseReviewSchema.extend({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ'),
  order_id: z.string()
    .uuid('ID đơn hàng không hợp lệ')
    .optional()
});

export const CreateMenuItemReviewSchema = BaseReviewSchema.extend({
  menu_item_id: z.string()
    .uuid('ID món ăn không hợp lệ'),
  order_id: z.string()
    .uuid('ID đơn hàng không hợp lệ')
    .optional()
});

export const CreateOrderReviewSchema = BaseReviewSchema.extend({
  order_id: z.string()
    .uuid('ID đơn hàng không hợp lệ')
});

// Update review schema
export const UpdateReviewSchema = BaseReviewSchema.partial().extend({
  status: z.enum(['active', 'hidden', 'flagged', 'deleted'])
    .optional()
});

// Review response schema
export const ReviewResponseSchema = z.object({
  response: z.string()
    .min(1, 'Phản hồi không được để trống')
    .max(1000, 'Phản hồi không được quá 1000 ký tự')
});

// Review query schemas
export const ReviewQuerySchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  menu_item_id: z.string()
    .uuid('ID món ăn không hợp lệ')
    .optional(),
  customer_id: z.string()
    .uuid('ID khách hàng không hợp lệ')
    .optional(),
  order_id: z.string()
    .uuid('ID đơn hàng không hợp lệ')
    .optional(),
  rating: z.number()
    .min(1, 'Đánh giá tối thiểu 1 sao')
    .max(5, 'Đánh giá tối đa 5 sao')
    .int('Đánh giá phải là số nguyên')
    .optional(),
  status: z.enum(['active', 'hidden', 'flagged', 'deleted'])
    .optional(),
  has_photos: z.boolean()
    .optional(),
  has_response: z.boolean()
    .optional(),
  sort_by: z.enum(['created_at', 'rating', 'updated_at'])
    .optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc'])
    .optional().default('desc'),
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
    .default(20),
  date_from: z.string()
    .datetime('Ngày bắt đầu không hợp lệ')
    .optional(),
  date_to: z.string()
    .datetime('Ngày kết thúc không hợp lệ')
    .optional()
});

// Review statistics schema
export const ReviewStatsQuerySchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  menu_item_id: z.string()
    .uuid('ID món ăn không hợp lệ')
    .optional(),
  period: z.enum(['7d', '30d', '90d', '1y', 'all'])
    .optional().default('30d'),
  date_from: z.string()
    .datetime('Ngày bắt đầu không hợp lệ')
    .optional(),
  date_to: z.string()
    .datetime('Ngày kết thúc không hợp lệ')
    .optional()
});

// Bulk review operations
export const BulkReviewActionSchema = z.object({
  review_ids: z.array(z.string().uuid('ID đánh giá không hợp lệ'))
    .min(1, 'Phải chọn ít nhất 1 đánh giá')
    .max(100, 'Tối đa 100 đánh giá cho mỗi thao tác'),
  action: z.enum(['hide', 'show', 'flag', 'unflag', 'delete']),
  reason: z.string()
    .max(500, 'Lý do không được quá 500 ký tự')
    .optional()
});

// Review moderation schema
export const ReviewModerationSchema = z.object({
  action: z.enum(['approve', 'reject', 'flag', 'unflag']),
  reason: z.string()
    .max(500, 'Lý do không được quá 500 ký tự')
    .optional(),
  moderator_notes: z.string()
    .max(1000, 'Ghi chú không được quá 1000 ký tự')
    .optional()
});

// Review export schema
export const ReviewExportSchema = z.object({
  restaurant_id: z.string()
    .uuid('ID nhà hàng không hợp lệ')
    .optional(),
  format: z.enum(['csv', 'excel', 'json'])
    .optional().default('csv'),
  date_from: z.string()
    .datetime('Ngày bắt đầu không hợp lệ')
    .optional(),
  date_to: z.string()
    .datetime('Ngày kết thúc không hợp lệ')
    .optional(),
  include_photos: z.boolean()
    .optional()
    .default(false),
  include_responses: z.boolean()
    .optional()
    .default(true)
});

// ================================
// 🏷️ TYPE EXPORTS
// ================================

export type CreateRestaurantReviewRequest = z.infer<typeof CreateRestaurantReviewSchema>;
export type CreateMenuItemReviewRequest = z.infer<typeof CreateMenuItemReviewSchema>;
export type CreateOrderReviewRequest = z.infer<typeof CreateOrderReviewSchema>;
export type UpdateReviewRequest = z.infer<typeof UpdateReviewSchema>;
export type ReviewResponseRequest = z.infer<typeof ReviewResponseSchema>;
export type ReviewQueryRequest = z.infer<typeof ReviewQuerySchema>;
export type ReviewStatsQueryRequest = z.infer<typeof ReviewStatsQuerySchema>;
export type BulkReviewActionRequest = z.infer<typeof BulkReviewActionSchema>;
export type ReviewModerationRequest = z.infer<typeof ReviewModerationSchema>;
export type ReviewExportRequest = z.infer<typeof ReviewExportSchema>;
