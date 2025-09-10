// ================================
// 🔌 Realtime Configuration - Socket.IO + Supabase
// ================================

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocketService } from '@/config/socket';
import { 
  initializeSupabaseRealtime, 
  subscribeToAllTables
} from '@/config/supabase';

let io: SocketIOServer;
let chatSocketService: any;
let supabaseRealtimeService: any;

/**
 * Initialize complete realtime system (Socket.IO + Supabase)
 * @param server - HTTP server instance
 * @returns Combined realtime services
 */
export const initializeRealtimeChat = (server: http.Server) => {
  // Initialize Socket.IO service
  chatSocketService = initializeSocketService(server);
  io = chatSocketService.getIO();

  // Initialize Supabase Realtime
  supabaseRealtimeService = initializeSupabaseRealtime(io);
  
  if (supabaseRealtimeService) {
    // Subscribe to all database tables for realtime updates
    subscribeToAllTables();
  }

  console.log('✅ Complete Realtime System initialized (Socket.IO + Supabase)');
  
  // Enhanced socket event handlers
  setupEnhancedSocketHandlers();
  
  return {
    chatSocketService,
    supabaseRealtimeService,
    io
  };
};
/**
 * Setup enhanced socket event handlers
 */
export const setupEnhancedSocketHandlers = () => {
  if (!io) return;
  
  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);
    
    // User presence events
    socket.on('user_online', (userId) => {
      socket.join(`user_${userId}`);
      socket.broadcast.emit('user_status_changed', {
        userId,
        status: 'online',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('user_offline', (userId) => {
      socket.leave(`user_${userId}`);
      socket.broadcast.emit('user_status_changed', {
        userId,
        status: 'offline',
        timestamp: new Date().toISOString()
      });
    });

    // Restaurant tracking events
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`👨‍🍳 Socket ${socket.id} joined restaurant ${restaurantId}`);
    });

    socket.on('leave_restaurant', (restaurantId) => {
      socket.leave(`restaurant_${restaurantId}`);
      console.log(`👨‍🍳 Socket ${socket.id} left restaurant ${restaurantId}`);
    });

    // Order tracking events
    socket.on('track_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} tracking order ${orderId}`);
    });

    socket.on('stop_tracking_order', (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} stopped tracking order ${orderId}`);
    });

    // Menu subscription events
    socket.on('subscribe_menu', (menuId) => {
      socket.join(`menu_${menuId}`);
      console.log(`📋 Socket ${socket.id} subscribed to menu ${menuId}`);
    });

    socket.on('unsubscribe_menu', (menuId) => {
      socket.leave(`menu_${menuId}`);
      console.log(`📋 Socket ${socket.id} unsubscribed from menu ${menuId}`);
    });

    // Notification events - Thêm các sự kiện cho thông báo
    socket.on('join_user_notifications', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`🔔 Socket ${socket.id} tham gia nhận thông báo cho user ${userId}`);
    });

    socket.on('join_restaurant_notifications', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`🏪 Socket ${socket.id} tham gia nhận thông báo nhà hàng ${restaurantId}`);
    });

    socket.on('join_organization_notifications', (organizationId) => {
      socket.join(`organization_${organizationId}`);
      console.log(`🏢 Socket ${socket.id} tham gia nhận thông báo tổ chức ${organizationId}`);
    });

    socket.on('mark_notification_read', (data) => {
      const { notificationId, userId } = data;
      socket.to(`user_${userId}`).emit('notification_read', {
        notificationId,
        timestamp: new Date().toISOString()
      });
      console.log(`✅ Đánh dấu thông báo ${notificationId} đã đọc cho user ${userId}`);
    });

    socket.on('mark_all_notifications_read', (userId) => {
      socket.to(`user_${userId}`).emit('all_notifications_read', {
        userId,
        timestamp: new Date().toISOString()
      });
      console.log(`✅ Đánh dấu tất cả thông báo đã đọc cho user ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });
  });
};

/**
 * Send realtime notification to specific user
 * @param userId - Target user ID
 * @param data - Notification data
 */
export const sendRealtimeNotification = (userId: string, data: any) => {
  if (chatSocketService) {
    chatSocketService.sendToUser(userId, 'notification', data);
  }
  
  // Also use Supabase realtime for backup
  sendRealtimeEvent('user_notification', data, `user_${userId}`);
};

/**
 * Gửi thông báo realtime đến user cụ thể
 * @param userId - ID người dùng
 * @param notification - Dữ liệu thông báo
 */
export const sendNotificationToUser = (userId: string, notification: any) => {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', {
      notification,
      timestamp: new Date().toISOString()
    });
    console.log(`🔔 Đã gửi thông báo realtime đến user ${userId}`);
  }
};

/**
 * Gửi thông báo đến tất cả nhân viên nhà hàng
 * @param restaurantId - ID nhà hàng
 * @param notification - Dữ liệu thông báo
 */
export const sendNotificationToRestaurant = (restaurantId: string, notification: any) => {
  if (io) {
    io.to(`restaurant_${restaurantId}`).emit('restaurant_notification', {
      notification,
      timestamp: new Date().toISOString()
    });
    console.log(`🏪 Đã gửi thông báo đến nhà hàng ${restaurantId}`);
  }
};

/**
 * Gửi thông báo đến tất cả thành viên tổ chức
 * @param organizationId - ID tổ chức
 * @param notification - Dữ liệu thông báo
 */
export const sendNotificationToOrganization = (organizationId: string, notification: any) => {
  if (io) {
    io.to(`organization_${organizationId}`).emit('organization_notification', {
      notification,
      timestamp: new Date().toISOString()
    });
    console.log(`🏢 Đã gửi thông báo đến tổ chức ${organizationId}`);
  }
};

/**
 * Phát sóng cập nhật trạng thái thông báo
 * @param userId - ID người dùng
 * @param notificationId - ID thông báo
 * @param status - Trạng thái mới
 */
export const broadcastNotificationStatusUpdate = (userId: string, notificationId: string, status: string) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification_status_updated', {
      notificationId,
      status,
      timestamp: new Date().toISOString()
    });
    console.log(`🔄 Đã cập nhật trạng thái thông báo ${notificationId} thành ${status}`);
  }
};

/**
 * Broadcast message to conversation participants
 * @param conversationId - Conversation ID
 * @param event - Event name
 * @param data - Event data
 */
export const broadcastToConversation = (conversationId: string, event: string, data: any) => {
  if (chatSocketService) {
    chatSocketService.sendToConversation(conversationId, event, data);
  }
  
  // Also broadcast via Socket.IO rooms
  if (io) {
    io.to(`conversation_${conversationId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Broadcast to restaurant staff
 * @param restaurantId - Restaurant ID
 * @param event - Event name
 * @param data - Event data
 */
export const broadcastToRestaurant = (restaurantId: string, event: string, data: any) => {
  if (io) {
    io.to(`restaurant_${restaurantId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Broadcast to specific user
 * @param userId - User ID
 * @param event - Event name
 * @param data - Event data
 */
export const broadcastToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Broadcast order updates
 * @param orderId - Order ID
 * @param event - Event name
 * @param data - Event data
 */
export const broadcastOrderUpdate = (orderId: string, event: string, data: any) => {
  if (io) {
    io.to(`order_${orderId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Send event to specific room or all connected clients
 * @param event - Event name
 * @param data - Event data
 * @param room - Optional room name
 */
export const sendRealtimeEvent = (event: string, data: any, room?: string) => {
  if (!io) return;
  
  if (room) {
    io.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  } else {
    io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get Socket.IO instance
 * @returns Socket.IO server instance
 */
export const getSocketIO = () => io;

/**
 * Get chat socket service
 * @returns Chat socket service instance
 */
export const getChatSocketService = () => chatSocketService;

/**
 * Get Supabase realtime service
 * @returns Supabase realtime service instance
 */
export const getSupabaseRealtimeService = () => supabaseRealtimeService;

/**
 * Publish realtime update to all connected clients
 * @param event - Event name
 * @param data - Event data
 * @param channel - Optional channel/room name
 */
export const publishRealtimeUpdate = (event: string, data: any, channel?: string) => {
  if (!io) {
    console.warn('⚠️ Socket.IO not initialized, cannot publish realtime update');
    return;
  }

  const payload = {
    ...data,
    timestamp: new Date().toISOString(),
    source: 'webhook'
  };

  if (channel) {
    io.to(channel).emit(event, payload);
    console.log(`📡 Realtime update published to channel "${channel}":`, event);
  } else {
    io.emit(event, payload);
    console.log(`📡 Realtime update published globally:`, event);
  }
};
