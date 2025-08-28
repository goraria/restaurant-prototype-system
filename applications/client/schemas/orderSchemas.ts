import { z } from 'zod';

// ================================
// 🔧 VALIDATION SCHEMAS 
// ================================

// Order Item Schema
export const OrderItemSchema = z.object({
  menu_item_id: z.string().uuid('Menu item ID không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng phải lớn hơn 0'),
  special_instructions: z.string().optional()
});

// Create Order Schema  
export const CreateOrderSchema = z.object({
  restaurant_id: z.string().uuid('Restaurant ID không hợp lệ'),
  customer_id: z.string().uuid('Customer ID không hợp lệ'),
  address_id: z.string().uuid('Address ID không hợp lệ').optional(),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']).default('dine_in'),
  items: z.array(OrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 món'),
  delivery_fee: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  tax_amount: z.number().min(0).default(0),
  final_amount: z.number().min(0),
  notes: z.string().optional(),
  estimated_time: z.number().int().positive().optional()
});

// Update Order Schema
export const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']).optional(),
  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  estimated_time: z.number().int().positive().optional(),
  notes: z.string().optional(),
  updated_by: z.string().uuid().optional()
});

// Cancel Order Schema
export const CancelOrderSchema = z.object({
  order_id: z.string().uuid('Order ID không hợp lệ'),
  reason: z.string().min(1, 'Lý do hủy đơn hàng là bắt buộc')
});

// Order Query Schema
export const OrderQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  restaurant_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  status: z.union([
    z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
    z.array(z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']))
  ]).optional(),
  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']).optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search_query: z.string().optional(),
  customer_name: z.string().optional(),
  order_code: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'total_amount', 'final_amount', 'order_code']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Order Statistics Schema
export const OrderStatsSchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  period: z.enum(['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'custom']),
  group_by: z.enum(['hour', 'day', 'week', 'month']),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).refine(data => {
  if (data.period === 'custom') {
    return data.from_date && data.to_date;
  }
  return true;
}, {
  message: 'from_date và to_date là bắt buộc khi period là custom',
  path: ['from_date']
});

// Kitchen Order Query Schema
export const KitchenOrderQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  restaurant_id: z.string().uuid().optional(),
  status: z.union([
    z.enum(['confirmed', 'preparing', 'ready']),
    z.array(z.enum(['confirmed', 'preparing', 'ready']))
  ]).default(['confirmed', 'preparing']),
  priority: z.enum(['oldest_first', 'newest_first']).default('oldest_first')
});

// Update Cooking Status Schema
export const UpdateCookingStatusSchema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(['confirmed', 'preparing', 'ready', 'completed']),
  chef_id: z.string().uuid().optional(),
  estimated_completion_time: z.string().datetime().optional(),
  notes: z.string().optional()
});

// Bulk Order Action Schema
export const BulkOrderActionSchema = z.object({
  order_ids: z.array(z.string().uuid()).min(1),
  action: z.enum(['update_status', 'assign_chef', 'set_priority']),
  action_data: z.object({
    status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']).optional(),
    chef_id: z.string().uuid().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    updated_by: z.string().uuid().optional()
  }).optional()
});

// Order Analytics Schema
export const OrderAnalyticsSchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  group_by: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  metrics: z.array(z.enum(['revenue', 'orders', 'customers', 'avg_order_value'])).default(['revenue', 'orders'])
});

// ================================
// 📋 TYPE EXPORTS
// ================================

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type OrderQueryInput = z.infer<typeof OrderQuerySchema>;
export type OrderStatsInput = z.infer<typeof OrderStatsSchema>;
export type KitchenOrderQueryInput = z.infer<typeof KitchenOrderQuerySchema>;
export type UpdateCookingStatusInput = z.infer<typeof UpdateCookingStatusSchema>;
export type BulkOrderActionInput = z.infer<typeof BulkOrderActionSchema>;
export type OrderAnalyticsInput = z.infer<typeof OrderAnalyticsSchema>;