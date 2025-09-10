import { PrismaClient } from '@prisma/client';
import { 
  CreateNotificationInput, 
  UpdateNotificationInput,
  QueryNotificationsInput,
  BulkNotificationInput,
  BroadcastNotificationInput,
  NotificationPreferencesInput,
  NotificationType,
  NotificationStatus
} from '../schemas/notificationSchemas';
import prisma from '@/config/prisma';
import { 
  sendNotificationToUser, 
  sendNotificationToRestaurant, 
  sendNotificationToOrganization,
  broadcastNotificationStatusUpdate
} from '@/config/realtime';
import { sendRealtimeEvent } from '@/config/supabase';

// ================================
// 📢 NOTIFICATION SERVICES
// ================================

/**
 * Create a single notification
 */
export const createNotification = async (data: CreateNotificationInput) => {
  try {
    const notification = await prisma.notifications.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true
          }
        }
      }
    });

    // Gửi thông báo realtime cho user
    if (notification.user_id) {
      sendNotificationToUser(notification.user_id, notification);
    }

    // Gửi thông báo realtime cho restaurant dựa trên related_type
    if (notification.related_type === 'restaurant' && notification.related_id) {
      sendNotificationToRestaurant(notification.related_id, notification);
    }

    // Gửi thông báo realtime cho organization dựa trên related_type
    if (notification.related_type === 'organization' && notification.related_id) {
      sendNotificationToOrganization(notification.related_id, notification);
    }

    // Gửi thông báo cho restaurant nếu có trong metadata
    if (notification.metadata && typeof notification.metadata === 'object') {
      const metadata = notification.metadata as any;
      if (metadata.restaurant_id) {
        sendNotificationToRestaurant(metadata.restaurant_id, notification);
      }
      if (metadata.organization_id) {
        sendNotificationToOrganization(metadata.organization_id, notification);
      }
    }

    // Gửi sự kiện realtime legacy để tương thích ngược
    sendRealtimeEvent('notification_created', {
      notification,
      user_id: notification.user_id
    }, `user_${notification.user_id}`);

    console.log(`🔔 Đã tạo và gửi thông báo realtime: ${notification.type} cho user ${notification.user_id}`);

    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

/**
 * Get notifications for a user with pagination and filters
 */
export const getUserNotifications = async (params: QueryNotificationsInput) => {
  try {
    const {
      user_id,
      type,
      status,
      priority,
      from_date,
      to_date,
      page,
      limit,
      sort_by,
      sort_order
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (user_id) where.user_id = user_id;
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    
    if (from_date || to_date) {
      where.created_at = {};
      if (from_date) where.created_at.gte = new Date(from_date);
      if (to_date) where.created_at.lte = new Date(to_date);
    }

    // Get notifications with count
    const [notifications, total] = await Promise.all([
      prisma.notifications.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true
            }
          }
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: limit
      }),
      prisma.notifications.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('❌ Error getting user notifications:', error);
    throw new Error('Failed to get notifications');
  }
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (id: string, user_id?: string) => {
  try {
    const where: any = { id };
    if (user_id) where.user_id = user_id;

    const notification = await prisma.notifications.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true
          }
        }
      }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  } catch (error) {
    console.error('❌ Error getting notification:', error);
    throw error;
  }
};

/**
 * Update notification (mainly for marking as read)
 */
export const updateNotification = async (id: string, data: UpdateNotificationInput) => {
  try {
    // Lấy thông báo cũ trước khi cập nhật
    const existingNotification = await prisma.notifications.findUnique({
      where: { id }
    });

    if (!existingNotification) {
      throw new Error('Không tìm thấy thông báo');
    }

    const updateData: any = { ...data };
    
    // Nếu đánh dấu là đã đọc, cập nhật read_at
    if (data.status === 'read' && !data.read_at) {
      updateData.read_at = new Date().toISOString();
    }

    const notification = await prisma.notifications.update({
      where: { id },
      data: updateData
    });

    // Gửi thông báo realtime về việc cập nhật trạng thái
    if (notification.user_id) {
      sendNotificationToUser(notification.user_id, notification);
      
      // Gửi sự kiện cập nhật trạng thái riêng
      broadcastNotificationStatusUpdate(notification.user_id, notification.id, notification.status);
    }

    // Gửi thông báo cho restaurant/organization nếu có
    if (notification.related_type === 'restaurant' && notification.related_id) {
      sendNotificationToRestaurant(notification.related_id, notification);
    }

    if (notification.related_type === 'organization' && notification.related_id) {
      sendNotificationToOrganization(notification.related_id, notification);
    }

    // Gửi sự kiện legacy
    sendRealtimeEvent('notification_updated', {
      notification,
      user_id: notification.user_id
    }, `user_${notification.user_id}`);

    console.log(`🔄 Đã cập nhật thông báo realtime: ${notification.id} - status: ${notification.status}`);

    return notification;
  } catch (error) {
    console.error('Lỗi cập nhật thông báo:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string) => {
  try {
    // Lấy thông báo trước khi xóa để gửi realtime event
    const notification = await prisma.notifications.findUnique({
      where: { id }
    });

    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }

    await prisma.notifications.delete({
      where: { id }
    });

    // Gửi thông báo realtime về việc xóa
    if (notification.user_id) {
      sendRealtimeEvent('notification_deleted', {
        notification_id: id,
        user_id: notification.user_id
      }, `user_${notification.user_id}`);
    }

    // Gửi thông báo cho restaurant/organization nếu có
    if (notification.related_type === 'restaurant' && notification.related_id) {
      sendRealtimeEvent('notification_deleted', {
        notification_id: id,
        restaurant_id: notification.related_id
      }, `restaurant_${notification.related_id}`);
    }

    if (notification.related_type === 'organization' && notification.related_id) {
      sendRealtimeEvent('notification_deleted', {
        notification_id: id,
        organization_id: notification.related_id
      }, `organization_${notification.related_id}`);
    }

    console.log(`🗑️ Đã xóa thông báo realtime: ${id}`);

    return { message: 'Thông báo đã được xóa thành công' };
  } catch (error) {
    console.error('Lỗi xóa thông báo:', error);
    throw error;
  }
};

/**
 * Bulk operations on notifications
 */
export const bulkUpdateNotifications = async (data: BulkNotificationInput) => {
  try {
    const { notification_ids, action } = data;

    // Lấy tất cả thông báo trước khi cập nhật
    const notifications = await prisma.notifications.findMany({
      where: {
        id: { in: notification_ids }
      }
    });

    let updateData: any = {};
    
    switch (action) {
      case 'mark_read':
        updateData = {
          status: 'read',
          read_at: new Date()
        };
        break;
      case 'mark_unread':
        updateData = {
          status: 'unread',
          read_at: null
        };
        break;
      case 'archive':
        updateData = {
          status: 'archived'
        };
        break;
      case 'delete':
        // Gửi thông báo realtime trước khi xóa
        for (const notification of notifications) {
          if (notification.user_id) {
            sendRealtimeEvent('notification_deleted', {
              notification_id: notification.id,
              user_id: notification.user_id
            }, `user_${notification.user_id}`);
          }
        }
        
        await prisma.notifications.deleteMany({
          where: {
            id: { in: notification_ids }
          }
        });

        console.log(`🗑️ Đã xóa hàng loạt ${notification_ids.length} thông báo`);
        return { 
          message: `Đã xóa ${notification_ids.length} thông báo thành công`,
          count: notification_ids.length 
        };
    }

    // Cập nhật hàng loạt
    const result = await prisma.notifications.updateMany({
      where: {
        id: { in: notification_ids }
      },
      data: updateData
    });

    // Lấy thông báo đã cập nhật để gửi realtime
    const updatedNotifications = await prisma.notifications.findMany({
      where: {
        id: { in: notification_ids }
      }
    });

    // Gửi thông báo realtime cho từng thông báo đã cập nhật
    for (const notification of updatedNotifications) {
      if (notification.user_id) {
        sendNotificationToUser(notification.user_id, notification);
        
        // Gửi sự kiện cập nhật trạng thái
        broadcastNotificationStatusUpdate(notification.user_id, notification.id, notification.status);
      }

      // Gửi cho restaurant/organization nếu có
      if (notification.related_type === 'restaurant' && notification.related_id) {
        sendNotificationToRestaurant(notification.related_id, notification);
      }

      if (notification.related_type === 'organization' && notification.related_id) {
        sendNotificationToOrganization(notification.related_id, notification);
      }
    }

    console.log(`📦 Đã cập nhật hàng loạt ${result.count} thông báo với hành động: ${action}`);

    return {
      message: `Đã ${action === 'mark_read' ? 'đánh dấu đã đọc' : 
                 action === 'mark_unread' ? 'đánh dấu chưa đọc' : 
                 'lưu trữ'} ${result.count} thông báo thành công`,
      count: result.count
    };
  } catch (error) {
    console.error('Lỗi cập nhật hàng loạt thông báo:', error);
    throw error;
  }
};

/**
 * Get unread notification count for user
 */
export const getUnreadCount = async (user_id: string) => {
  try {
    const count = await prisma.notifications.count({
      where: {
        user_id,
        status: 'unread'
      }
    });

    return { count };
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    throw new Error('Failed to get unread count');
  }
};

/**
 * Mark all notifications as read for user
 */
export const markAllAsRead = async (userId: string) => {
  try {
    // Lấy tất cả thông báo chưa đọc trước khi cập nhật
    const unreadNotifications = await prisma.notifications.findMany({
      where: {
        user_id: userId,
        status: 'unread'
      }
    });

    const result = await prisma.notifications.updateMany({
      where: {
        user_id: userId,
        status: 'unread'
      },
      data: {
        status: 'read',
        read_at: new Date()
      }
    });

    // Gửi thông báo realtime cho user về việc đánh dấu tất cả là đã đọc
    sendRealtimeEvent('all_notifications_read', {
      user_id: userId,
      count: result.count
    }, `user_${userId}`);

    // Gửi sự kiện cập nhật trạng thái cho từng thông báo
    for (const notification of unreadNotifications) {
      broadcastNotificationStatusUpdate(userId, notification.id, 'read');
    }

    console.log(`✅ Đã đánh dấu tất cả ${result.count} thông báo là đã đọc cho user ${userId}`);

    return {
      message: `Đã đánh dấu ${result.count} thông báo là đã đọc`,
      count: result.count
    };
  } catch (error) {
    console.error('Lỗi đánh dấu tất cả thông báo là đã đọc:', error);
    throw error;
  }
};

/**
 * Broadcast notification to multiple users
 */
export const broadcastNotification = async (data: BroadcastNotificationInput) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      user_ids,
      user_roles,
      restaurant_ids,
      organization_ids,
      metadata,
      action_url,
      scheduled_at,
      expires_at
    } = data;

    let targetUserIds: string[] = [];

    // Get user IDs based on criteria
    if (user_ids) {
      targetUserIds = [...user_ids];
    }

    // Add users by roles
    if (user_roles && user_roles.length > 0) {
      const usersWithRoles = await prisma.users.findMany({
        where: {
          role: { in: user_roles as any }
        },
        select: { id: true }
      });
      targetUserIds = [...targetUserIds, ...usersWithRoles.map(u => u.id)];
    }

    // Add users by restaurant IDs
    if (restaurant_ids && restaurant_ids.length > 0) {
      const restaurantUsers = await prisma.restaurant_staffs.findMany({
        where: {
          restaurant_id: { in: restaurant_ids }
        },
        select: { user_id: true }
      });
      targetUserIds = [...targetUserIds, ...restaurantUsers.map(rs => rs.user_id)];
    }

    // Add users by organization IDs
    if (organization_ids && organization_ids.length > 0) {
      const orgUsers = await prisma.organization_memberships.findMany({
        where: {
          organization_id: { in: organization_ids }
        },
        select: { user_id: true }
      });
      targetUserIds = [...targetUserIds, ...orgUsers.map(om => om.user_id)];
    }

    // Remove duplicates
    targetUserIds = [...new Set(targetUserIds)];

    if (targetUserIds.length === 0) {
      throw new Error('No target users found');
    }

    // Create notifications for all target users
    const notificationData = targetUserIds.map(user_id => ({
      title,
      message,
      type,
      priority,
      user_id,
      metadata,
      action_url,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      expires_at: expires_at ? new Date(expires_at) : undefined,
      created_at: new Date(),
      updated_at: new Date()
    }));

    const notifications = await prisma.notifications.createMany({
      data: notificationData
    });

    // Lấy thông báo vừa tạo để gửi realtime với đầy đủ thông tin
    const createdNotifications = await prisma.notifications.findMany({
      where: {
        user_id: { in: targetUserIds },
        created_at: {
          gte: new Date(Date.now() - 5000) // Lấy thông báo tạo trong 5 giây qua
        }
      },
      orderBy: { created_at: 'desc' },
      take: targetUserIds.length
    });

    // Gửi thông báo realtime chi tiết cho từng user
    createdNotifications.forEach(notification => {
      if (notification.user_id) {
        sendNotificationToUser(notification.user_id, notification);
        
        // Gửi thông báo cho restaurant nếu có
        if (restaurant_ids && restaurant_ids.length > 0) {
          restaurant_ids.forEach(restaurant_id => {
            sendNotificationToRestaurant(restaurant_id, notification);
          });
        }

        // Gửi thông báo cho organization nếu có
        if (organization_ids && organization_ids.length > 0) {
          organization_ids.forEach(organization_id => {
            sendNotificationToOrganization(organization_id, notification);
          });
        }
      }
    });

    // Gửi sự kiện broadcast chung
    sendRealtimeEvent('notification_broadcast', {
      title,
      message,
      type,
      priority,
      user_count: targetUserIds.length,
      restaurant_count: restaurant_ids?.length || 0,
      organization_count: organization_ids?.length || 0
    });

    console.log(`📡 Đã phát sóng thành công ${notifications.count} thông báo tới ${targetUserIds.length} người dùng`);

    return {
      count: notifications.count,
      target_users: targetUserIds.length,
      message: `Đã phát sóng thông báo tới ${targetUserIds.length} người dùng thành công`
    };
  } catch (error) {
    console.error('❌ Error broadcasting notification:', error);
    throw new Error('Failed to broadcast notification');
  }
};

// ================================
// 🎯 SPECIFIC NOTIFICATION HELPERS
// ================================

/**
 * Send order notification
 */
export const sendOrderNotification = async (
  user_id: string,
  order_id: string,
  type: NotificationType,
  additional_data?: any
) => {
  const order = await prisma.orders.findUnique({
    where: { id: order_id },
    include: {
      restaurants: { select: { name: true } },
      customers: { select: { full_name: true } }
    }
  });

  if (!order) throw new Error('Order not found');

  const notificationMessages = {
    order_created: `Đơn hàng #${order.order_code} đã được tạo tại ${order.restaurants.name}`,
    order_confirmed: `Đơn hàng #${order.order_code} đã được xác nhận`,
    order_preparing: `Đơn hàng #${order.order_code} đang được chuẩn bị`,
    order_ready: `Đơn hàng #${order.order_code} đã sẵn sàng để giao`,
    order_delivered: `Đơn hàng #${order.order_code} đã được giao thành công`,
    order_cancelled: `Đơn hàng #${order.order_code} đã bị hủy`,
    order_payment_success: `Thanh toán đơn hàng #${order.order_code} thành công`,
    order_payment_failed: `Thanh toán đơn hàng #${order.order_code} thất bại`
  };

  return await createNotification({
    title: 'Cập nhật đơn hàng',
    message: notificationMessages[type as keyof typeof notificationMessages] || 'Cập nhật đơn hàng',
    type,
    priority: 'medium',
    user_id,
    related_id: order_id,
    related_type: 'order',
    action_url: `/orders/${order_id}`,
    metadata: { order_code: order.order_code, restaurant_name: order.restaurants.name, ...additional_data }
  });
};

/**
 * Send reservation notification
 */
export const sendReservationNotification = async (
  user_id: string,
  reservation_id: string,
  type: NotificationType,
  additional_data?: any
) => {
  const reservation = await prisma.reservations.findUnique({
    where: { id: reservation_id },
    include: {
      tables: { 
        include: {
          restaurants: { select: { name: true } }
        }
      },
      customers: { select: { full_name: true } }
    }
  });

  if (!reservation) throw new Error('Reservation not found');

  const notificationMessages = {
    reservation_created: `Đặt bàn tại ${reservation.tables.restaurants.name} đã được tạo`,
    reservation_confirmed: `Đặt bàn tại ${reservation.tables.restaurants.name} đã được xác nhận`,
    reservation_cancelled: `Đặt bàn tại ${reservation.tables.restaurants.name} đã bị hủy`,
    reservation_reminder: `Nhắc nhở: Bạn có lịch đặt bàn tại ${reservation.tables.restaurants.name}`
  };

  return await createNotification({
    title: 'Cập nhật đặt bàn',
    message: notificationMessages[type as keyof typeof notificationMessages] || 'Cập nhật đặt bàn',
    type,
    priority: type === 'reservation_reminder' ? 'high' : 'medium',
    user_id,
    related_id: reservation_id,
    related_type: 'reservation',
    action_url: `/reservations/${reservation_id}`,
    metadata: { 
      restaurant_name: reservation.tables.restaurants.name,
      reservation_date: reservation.reservation_date,
      ...additional_data 
    }
  });
};

/**
 * Send inventory alert notification
 */
export const sendInventoryAlert = async (restaurant_id: string, item_name: string, current_quantity: number) => {
  const restaurantStaffs = await prisma.restaurant_staffs.findMany({
    where: { restaurant_id },
    include: { users: true }
  });

  const notifications = restaurantStaffs.map(staff => 
    createNotification({
      title: 'Cảnh báo tồn kho',
      message: `${item_name} sắp hết hàng (còn ${current_quantity})`,
      type: 'low_inventory',
      priority: 'high',
      user_id: staff.user_id,
      related_id: restaurant_id,
      related_type: 'inventory',
      action_url: `/restaurant/${restaurant_id}/inventory`,
      metadata: { item_name, current_quantity }
    })
  );

  return await Promise.all(notifications);
};

/**
 * Get notification preferences for user
 */
export const getNotificationPreferences = async (user_id: string) => {
  try {
    // For now, return default preferences since we haven't implemented the preferences table
    return {
      user_id,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      notification_types: [],
      quiet_hours_start: null,
      quiet_hours_end: null,
      timezone: 'UTC'
    };
  } catch (error) {
    console.error('❌ Error getting notification preferences:', error);
    throw new Error('Failed to get notification preferences');
  }
};

/**
 * Update notification preferences for user
 */
export const updateNotificationPreferences = async (data: NotificationPreferencesInput) => {
  try {
    // For now, just return the data since we haven't implemented the preferences table
    return data;
  } catch (error) {
    console.error('❌ Error updating notification preferences:', error);
    throw new Error('Failed to update notification preferences');
  }
};

export default {
  createNotification,
  getUserNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  bulkUpdateNotifications,
  getUnreadCount,
  markAllAsRead,
  broadcastNotification,
  sendOrderNotification,
  sendReservationNotification,
  sendInventoryAlert,
  getNotificationPreferences,
  updateNotificationPreferences
};
