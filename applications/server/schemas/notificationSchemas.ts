import { z } from 'zod';

// Notification types for different user roles and actions
export const NotificationTypeSchema = z.enum([
  // Order notifications
  'order_created',
  'order_confirmed', 
  'order_preparing',
  'order_ready',
  'order_delivered',
  'order_cancelled',
  'order_payment_success',
  'order_payment_failed',
  
  // Reservation notifications
  'reservation_created',
  'reservation_confirmed',
  'reservation_cancelled',
  'reservation_reminder',
  
  // Staff notifications
  'shift_assigned',
  'shift_reminder',
  'schedule_updated',
  'attendance_reminder',
  
  // Restaurant notifications
  'new_review',
  'low_inventory',
  'menu_updated',
  'promotion_created',
  'voucher_expires_soon',
  
  // Organization notifications
  'member_joined',
  'member_left',
  'role_changed',
  'organization_updated',
  
  // System notifications
  'system_maintenance',
  'feature_announcement',
  'security_alert',
  
  // Chat notifications
  'new_message',
  'conversation_started'
]);

export const NotificationPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const NotificationStatusSchema = z.enum(['unread', 'read', 'archived']);

// Create notification schema
export const CreateNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  type: NotificationTypeSchema,
  priority: NotificationPrioritySchema.default('medium'),
  user_id: z.string().uuid('Invalid user ID'),
  related_id: z.string().uuid().optional(), // ID of related entity (order, reservation, etc.)
  related_type: z.string().optional(), // Type of related entity
  action_url: z.string().url().optional(), // URL for notification action
  metadata: z.record(z.string(), z.any()).optional(), // Additional data
  scheduled_at: z.string().datetime().optional(), // For scheduled notifications
  expires_at: z.string().datetime().optional() // When notification expires
});

// Update notification schema
export const UpdateNotificationSchema = z.object({
  status: NotificationStatusSchema.optional(),
  read_at: z.string().datetime().optional()
});

// Query notifications schema
export const QueryNotificationsSchema = z.object({
  user_id: z.string().uuid().optional(),
  type: NotificationTypeSchema.optional(),
  status: NotificationStatusSchema.optional(),
  priority: NotificationPrioritySchema.optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort_by: z.enum(['created_at', 'priority', 'type']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Bulk operations schema
export const BulkNotificationSchema = z.object({
  notification_ids: z.array(z.string().uuid()).min(1, 'At least one notification ID required'),
  action: z.enum(['mark_read', 'mark_unread', 'archive', 'delete'])
});

// Notification preferences schema
export const NotificationPreferencesSchema = z.object({
  user_id: z.string().uuid(),
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  notification_types: z.array(NotificationTypeSchema).optional(),
  quiet_hours_start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  quiet_hours_end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  timezone: z.string().default('UTC')
});

// Send notification to multiple users schema
export const BroadcastNotificationSchema = z.object({
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  type: NotificationTypeSchema,
  priority: NotificationPrioritySchema.default('medium'),
  user_ids: z.array(z.string().uuid()).optional(),
  user_roles: z.array(z.string()).optional(),
  restaurant_ids: z.array(z.string().uuid()).optional(),
  organization_ids: z.array(z.string().uuid()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  action_url: z.string().url().optional(),
  scheduled_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional()
});

// Template for common notifications
export const NotificationTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  title_template: z.string().min(1).max(255),
  message_template: z.string().min(1).max(1000),
  type: NotificationTypeSchema,
  priority: NotificationPrioritySchema.default('medium'),
  variables: z.array(z.string()).optional() // List of template variables like {{user_name}}, {{order_id}}
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
export type QueryNotificationsInput = z.infer<typeof QueryNotificationsSchema>;
export type BulkNotificationInput = z.infer<typeof BulkNotificationSchema>;
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;
export type BroadcastNotificationInput = z.infer<typeof BroadcastNotificationSchema>;
export type NotificationTemplateInput = z.infer<typeof NotificationTemplateSchema>;
