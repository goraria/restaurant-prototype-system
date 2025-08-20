import { z } from 'zod';
import { 
  UuidSchema, 
  EmailSchema, 
  PhoneSchema, 
  DecimalSchema 
} from './core';

// ================================
// ⭐ REVIEW SCHEMAS
// ================================

export const ReviewBaseSchema = z.object({
  restaurant_id: UuidSchema,
  customer_id: UuidSchema,
  order_id: UuidSchema.optional(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().optional(),
  food_rating: z.number().min(1).max(5).optional(),
  service_rating: z.number().min(1).max(5).optional(),
  ambiance_rating: z.number().min(1).max(5).optional(),
  value_rating: z.number().min(1).max(5).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'hidden']).default('pending'),
  is_verified: z.boolean().default(false),
  helpful_count: z.number().int().default(0),
  response_text: z.string().optional(),
  responded_by: UuidSchema.optional(),
  responded_at: z.string().datetime().optional(),
});

export const ReviewCreateSchema = ReviewBaseSchema;
export const ReviewUpdateSchema = ReviewBaseSchema.partial().omit({ 
  restaurant_id: true,
  customer_id: true 
});

export const ReviewSchema = ReviewBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📞 SUPPORT TICKET SCHEMAS
// ================================

export const SupportTicketBaseSchema = z.object({
  restaurant_id: UuidSchema.optional(),
  customer_id: UuidSchema.optional(),
  order_id: UuidSchema.optional(),
  ticket_number: z.string().min(1).max(20),
  subject: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.enum(['general', 'order', 'payment', 'technical', 'complaint', 'suggestion']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['open', 'in_progress', 'waiting_response', 'resolved', 'closed']).default('open'),
  assigned_to: UuidSchema.optional(),
  resolution: z.string().optional(),
  customer_email: EmailSchema.optional(),
  customer_phone: PhoneSchema.optional(),
});

export const SupportTicketCreateSchema = SupportTicketBaseSchema;
export const SupportTicketUpdateSchema = SupportTicketBaseSchema.partial().omit({ 
  ticket_number: true 
});

export const SupportTicketSchema = SupportTicketBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 💬 SUPPORT MESSAGE SCHEMAS
// ================================

export const SupportMessageBaseSchema = z.object({
  ticket_id: UuidSchema,
  sender_id: UuidSchema.optional(),
  sender_type: z.enum(['customer', 'staff', 'system']),
  message: z.string().min(1),
  is_internal: z.boolean().default(false),
  attachments: z.array(z.string()).optional(),
});

export const SupportMessageCreateSchema = SupportMessageBaseSchema;
export const SupportMessageUpdateSchema = SupportMessageBaseSchema.partial().omit({ 
  ticket_id: true,
  sender_type: true 
});

export const SupportMessageSchema = SupportMessageBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 📊 ANALYTICS SCHEMAS
// ================================

export const AnalyticsBaseSchema = z.object({
  restaurant_id: UuidSchema,
  metric_type: z.enum([
    'daily_sales', 
    'menu_item_performance', 
    'customer_retention', 
    'staff_performance',
    'table_turnover',
    'peak_hours',
    'inventory_turnover',
    'customer_satisfaction'
  ]),
  metric_date: z.string().date(),
  metric_value: DecimalSchema,
  metric_data: z.record(z.any()).optional(),
  period_type: z.enum(['hour', 'day', 'week', 'month', 'year']).default('day'),
});

export const AnalyticsCreateSchema = AnalyticsBaseSchema;
export const AnalyticsUpdateSchema = AnalyticsBaseSchema.partial().omit({ 
  restaurant_id: true,
  metric_type: true,
  metric_date: true 
});

export const AnalyticsSchema = AnalyticsBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 🎯 PROMOTION SCHEMAS
// ================================

export const PromotionBaseSchema = z.object({
  restaurant_id: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed_amount', 'buy_one_get_one', 'free_item']),
  value: DecimalSchema,
  minimum_order: DecimalSchema.optional(),
  maximum_discount: DecimalSchema.optional(),
  code: z.string().max(20).optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  usage_limit: z.number().int().optional(),
  usage_count: z.number().int().default(0),
  applicable_menu_items: z.array(UuidSchema).optional(),
  applicable_categories: z.array(UuidSchema).optional(),
  is_active: z.boolean().default(true),
  terms_conditions: z.string().optional(),
});

export const PromotionCreateSchema = PromotionBaseSchema;
export const PromotionUpdateSchema = PromotionBaseSchema.partial().omit({ restaurant_id: true });

export const PromotionSchema = PromotionBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🏷️ PROMOTION USAGE SCHEMAS
// ================================

export const PromotionUsageBaseSchema = z.object({
  promotion_id: UuidSchema,
  order_id: UuidSchema,
  customer_id: UuidSchema,
  discount_amount: DecimalSchema,
});

export const PromotionUsageCreateSchema = PromotionUsageBaseSchema;

export const PromotionUsageSchema = PromotionUsageBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 📋 NOTIFICATION SCHEMAS
// ================================

export const NotificationBaseSchema = z.object({
  user_id: UuidSchema,
  title: z.string().min(1).max(100),
  message: z.string().min(1),
  type: z.enum(['info', 'success', 'warning', 'error', 'promotion']),
  is_read: z.boolean().default(false),
  action_url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const NotificationCreateSchema = NotificationBaseSchema;
export const NotificationUpdateSchema = NotificationBaseSchema.partial().omit({ 
  user_id: true 
});

export const NotificationSchema = NotificationBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type exports
export type ReviewType = z.infer<typeof ReviewSchema>;
export type ReviewCreateType = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdateType = z.infer<typeof ReviewUpdateSchema>;

export type SupportTicketType = z.infer<typeof SupportTicketSchema>;
export type SupportTicketCreateType = z.infer<typeof SupportTicketCreateSchema>;
export type SupportTicketUpdateType = z.infer<typeof SupportTicketUpdateSchema>;

export type SupportMessageType = z.infer<typeof SupportMessageSchema>;
export type SupportMessageCreateType = z.infer<typeof SupportMessageCreateSchema>;
export type SupportMessageUpdateType = z.infer<typeof SupportMessageUpdateSchema>;

export type AnalyticsType = z.infer<typeof AnalyticsSchema>;
export type AnalyticsCreateType = z.infer<typeof AnalyticsCreateSchema>;
export type AnalyticsUpdateType = z.infer<typeof AnalyticsUpdateSchema>;

export type PromotionType = z.infer<typeof PromotionSchema>;
export type PromotionCreateType = z.infer<typeof PromotionCreateSchema>;
export type PromotionUpdateType = z.infer<typeof PromotionUpdateSchema>;

export type PromotionUsageType = z.infer<typeof PromotionUsageSchema>;
export type PromotionUsageCreateType = z.infer<typeof PromotionUsageCreateSchema>;

export type NotificationType = z.infer<typeof NotificationSchema>;
export type NotificationCreateType = z.infer<typeof NotificationCreateSchema>;
export type NotificationUpdateType = z.infer<typeof NotificationUpdateSchema>;
