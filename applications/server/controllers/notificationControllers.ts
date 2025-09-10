import { Request, Response } from 'express';
import { z } from 'zod';
import * as notificationServices from '../services/notificationServices';
import {
  CreateNotificationSchema,
  UpdateNotificationSchema,
  QueryNotificationsSchema,
  BulkNotificationSchema,
  NotificationPreferencesSchema,
  BroadcastNotificationSchema
} from '../schemas/notificationSchemas';

// Extend Express Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
    [key: string]: any;
  };
}

/**
 * Create a new notification
 * POST /api/notifications
 */
export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = CreateNotificationSchema.parse(req.body);
    
    const notification = await notificationServices.createNotification(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get notifications for current user
 * GET /api/notifications
 */
export const getUserNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const validatedQuery = QueryNotificationsSchema.parse({
      ...req.query,
      user_id: req.user.id
    });
    
    const result = await notificationServices.getUserNotifications(
      validatedQuery
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error getting user notifications:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get notification by ID
 * GET /api/notifications/:id
 */
export const getNotificationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required'
      });
    }

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const notification = await notificationServices.getNotificationById(id, user_id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('❌ Error getting notification by ID:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update notification
 * PUT /api/notifications/:id
 */
export const updateNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required'
      });
    }

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const validatedData = UpdateNotificationSchema.parse(req.body);
    
    const notification = await notificationServices.updateNotification(
      id, 
      validatedData
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    console.error('❌ Error updating notification:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required'
      });
    }

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const deleted = await notificationServices.deleteNotification(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required'
      });
    }

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const notification = await notificationServices.updateNotification(id, { 
      status: 'read' 
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Mark all notifications as read for user
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const count = await notificationServices.markAllAsRead(user_id);
    
    res.json({
      success: true,
      message: `${count} notifications marked as read`
    });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get unread notifications count
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const count = await notificationServices.getUnreadCount(user_id);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('❌ Error getting unread notifications count:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Bulk operations on notifications
 * POST /api/notifications/bulk
 */
export const bulkNotificationAction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const validatedData = BulkNotificationSchema.parse(req.body);
    
    const result = await notificationServices.bulkUpdateNotifications(
      validatedData
    );
    
    res.json({
      success: true,
      message: `Bulk ${validatedData.action} completed`,
      data: { affectedCount: result }
    });
  } catch (error) {
    console.error('❌ Error in bulk notification action:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Broadcast notification to multiple users (Admin only)
 * POST /api/notifications/broadcast
 */
export const broadcastNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check admin permissions
    if (!req.user?.role || !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const validatedData = BroadcastNotificationSchema.parse(req.body);
    
    const result = await notificationServices.broadcastNotification(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Notification broadcast sent successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error broadcasting notification:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get notification preferences for user
 * GET /api/notifications/preferences
 */
export const getNotificationPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const preferences = await notificationServices.getNotificationPreferences(user_id);
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('❌ Error getting notification preferences:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update notification preferences for user
 * PUT /api/notifications/preferences
 */
export const updateNotificationPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const validatedData = NotificationPreferencesSchema.parse({
      ...req.body,
      user_id
    });
    
    const preferences = await notificationServices.updateNotificationPreferences(validatedData);
    
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    console.error('❌ Error updating notification preferences:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ================================
// 🔴 REALTIME NOTIFICATION ENDPOINTS
// ================================

/**
 * Join user notification room (for realtime)
 * POST /api/notifications/realtime/join-user
 */
export const joinUserNotificationRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id } = req.body;
    
    // Kiểm tra quyền truy cập
    if (!req.user || (req.user.id !== user_id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập phòng thông báo này'
      });
    }

    res.json({
      success: true,
      message: 'Đã tham gia phòng thông báo user thành công',
      room: `user_${user_id}`,
      events: [
        'notification_created',
        'notification_updated', 
        'notification_deleted',
        'notification_status_updated',
        'all_notifications_read'
      ]
    });
  } catch (error) {
    console.error('❌ Lỗi tham gia phòng thông báo user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ nội bộ'
    });
  }
};

/**
 * Join restaurant notification room (for realtime)
 * POST /api/notifications/realtime/join-restaurant
 */
export const joinRestaurantNotificationRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { restaurant_id } = req.body;
    
    // Kiểm tra quyền truy cập restaurant
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    res.json({
      success: true,
      message: 'Đã tham gia phòng thông báo restaurant thành công',
      room: `restaurant_${restaurant_id}`,
      events: [
        'restaurant_notification_created',
        'restaurant_notification_updated',
        'restaurant_notification_deleted'
      ]
    });
  } catch (error) {
    console.error('❌ Lỗi tham gia phòng thông báo restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ nội bộ'
    });
  }
};

/**
 * Join organization notification room (for realtime)
 * POST /api/notifications/realtime/join-organization
 */
export const joinOrganizationNotificationRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { organization_id } = req.body;
    
    // Kiểm tra quyền truy cập organization
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    res.json({
      success: true,
      message: 'Đã tham gia phòng thông báo organization thành công',
      room: `organization_${organization_id}`,
      events: [
        'organization_notification_created',
        'organization_notification_updated',
        'organization_notification_deleted'
      ]
    });
  } catch (error) {
    console.error('❌ Lỗi tham gia phòng thông báo organization:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ nội bộ'
    });
  }
};

/**
 * Get realtime notification status
 * GET /api/notifications/realtime/status
 */
export const getRealtimeStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    // Lấy số lượng thông báo chưa đọc
    const unreadCount = await notificationServices.getUnreadCount(req.user.id);
    
    res.json({
      success: true,
      data: {
        user_id: req.user.id,
        unread_count: unreadCount,
        realtime_connected: true,
        available_rooms: [
          `user_${req.user.id}`,
          'general_notifications'
        ],
        supported_events: [
          'notification_created',
          'notification_updated',
          'notification_deleted',
          'notification_status_updated',
          'all_notifications_read',
          'notification_broadcast'
        ]
      }
    });
  } catch (error) {
    console.error('❌ Lỗi lấy trạng thái realtime:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ nội bộ'
    });
  }
};
