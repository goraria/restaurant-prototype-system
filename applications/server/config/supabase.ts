import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Server as SocketIOServer } from 'socket.io';

// Supabase client instance
let supabaseClient: SupabaseClient;
let realtimeChannels: Map<string, RealtimeChannel> = new Map();
let socketIO: SocketIOServer;
let isSubscriptionInitialized = false;

/**
 * Initialize Supabase realtime connection
 */
export const initializeSupabaseRealtime = (io: SocketIOServer) => {
  const supabaseUrl = process.env.EXPRESS_SUPABASE_REALTIME;
  const supabaseKey = process.env.EXPRESS_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Key missing');
    return null;
  }

  // Create Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });

  socketIO = io;

  console.log('✅ Supabase Realtime initialized');
  return supabaseClient;
};

/**
 * Subscribe to table changes for realtime updates
 */
export const subscribeToTableChanges = (tableName: string, schema: string = 'public') => {
  if (!supabaseClient) {
    console.error('❌ Supabase client not initialized');
    return null;
  }

  const channelName = `${schema}:${tableName}`;
  
  // Check if already subscribed
  if (realtimeChannels.has(channelName)) {
    console.log(`📡 Already subscribed to ${channelName}`);
    return realtimeChannels.get(channelName);
  }

  console.log(`🔄 Attempting to subscribe to ${tableName}...`);

  const channel = supabaseClient
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: schema,
        table: tableName
      },
      (payload) => {
        handleDatabaseChange(tableName, payload);
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to ${tableName} changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Error subscribing to ${tableName}:`, err);
        // Remove from channels map on error to allow retry
        realtimeChannels.delete(channelName);
      } else if (status === 'CLOSED') {
        console.log(`🔒 Connection closed for ${tableName}`);
        realtimeChannels.delete(channelName);
      } else {
        console.log(`📡 ${tableName} subscription status:`, status);
      }
    });

  realtimeChannels.set(channelName, channel);
  return channel;
};

/**
 * Handle database changes and broadcast to clients
 */
export const handleDatabaseChange = (tableName: string, payload: any) => {
  const { eventType, new: newRecord, old: oldRecord } = payload;
  
  console.log(`📊 ${tableName} ${eventType}:`, {
    eventType,
    newRecord: newRecord?.id || 'N/A',
    oldRecord: oldRecord?.id || 'N/A'
  });

  // Broadcast to all connected clients
  if (socketIO) {
    socketIO.emit(`${tableName}_${eventType.toLowerCase()}`, {
      eventType,
      tableName,
      data: newRecord || oldRecord,
      timestamp: new Date().toISOString()
    });
  }

  // Send specific events based on table and event type
  broadcastSpecificEvents(tableName, eventType, newRecord, oldRecord);
};

/**
 * Broadcast specific events based on table changes
 */
export const broadcastSpecificEvents = (
  tableName: string, 
  eventType: string, 
  newRecord: any, 
  oldRecord: any
) => {
  if (!socketIO) return;

  // Handle existing specific handlers
  switch (tableName) {
    case 'notifications':
      handleNotificationChanges(eventType, newRecord, oldRecord);
      break;
    case 'users':
      handleUserChanges(eventType, newRecord, oldRecord);
      break;
    case 'orders':
      handleOrderChanges(eventType, newRecord, oldRecord);
      break;
    case 'menu_items':
      handleMenuChanges(eventType, newRecord, oldRecord);
      break;
    case 'restaurants':
      handleRestaurantChanges(eventType, newRecord, oldRecord);
      break;
    case 'inventory_items':
      handleInventoryChanges(eventType, newRecord, oldRecord);
      break;
    case 'messages':
      handleMessageChanges(eventType, newRecord, oldRecord);
      break;
    case 'reservations':
      handleReservationChanges(eventType, newRecord, oldRecord);
      break;
    case 'payments':
      handlePaymentChanges(eventType, newRecord, oldRecord);
      break;
    default:
      // Generic handler for all other tables
      handleGenericTableChange(tableName, eventType, newRecord, oldRecord);
      break;
  }
};

/**
 * Generic handler for all table changes
 */
export const handleGenericTableChange = (
  tableName: string, 
  eventType: string, 
  newRecord: any, 
  oldRecord: any
) => {
  if (!socketIO) return;

  const recordId = newRecord?.id || oldRecord?.id;

  // Broadcast generic events
  socketIO.emit(`${tableName}_${eventType.toLowerCase()}`, {
    eventType,
    tableName,
    data: newRecord || oldRecord,
    recordId,
    timestamp: new Date().toISOString()
  });

  // Broadcast to specific rooms based on table type
  switch (tableName) {
    case 'addresses':
    case 'user_statistics':
      // User-specific data
      if (newRecord?.user_id || oldRecord?.user_id) {
        const userId = newRecord?.user_id || oldRecord?.user_id;
        socketIO.to(`user_${userId}`).emit(`${tableName}_change`, {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    case 'restaurant_staffs':
    case 'staff_schedules':
    case 'staff_attendance':
    case 'menus':
    case 'tables':
    case 'revenue_reports':
      // Restaurant-specific data
      if (newRecord?.restaurant_id || oldRecord?.restaurant_id) {
        const restaurantId = newRecord?.restaurant_id || oldRecord?.restaurant_id;
        socketIO.to(`restaurant_${restaurantId}`).emit(`${tableName}_change`, {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    case 'conversations':
      // Broadcast to conversation participants
      if (newRecord?.customer_id || oldRecord?.customer_id) {
        const customerId = newRecord?.customer_id || oldRecord?.customer_id;
        socketIO.to(`user_${customerId}`).emit('conversation_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      if (newRecord?.staff_id || oldRecord?.staff_id) {
        const staffId = newRecord?.staff_id || oldRecord?.staff_id;
        socketIO.to(`user_${staffId}`).emit('conversation_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    case 'table_orders':
      // Broadcast to table and restaurant
      if (newRecord?.table_id || oldRecord?.table_id) {
        const tableId = newRecord?.table_id || oldRecord?.table_id;
        socketIO.to(`table_${tableId}`).emit('table_order_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    case 'organization_memberships':
      // Broadcast to organization members
      if (newRecord?.organization_id || oldRecord?.organization_id) {
        const organizationId = newRecord?.organization_id || oldRecord?.organization_id;
        socketIO.to(`organization_${organizationId}`).emit('membership_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      // Notify the user about their membership change
      if (newRecord?.user_id || oldRecord?.user_id) {
        const userId = newRecord?.user_id || oldRecord?.user_id;
        socketIO.to(`user_${userId}`).emit('membership_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    case 'voucher_usages':
      // Broadcast to user who used voucher
      if (newRecord?.user_id || oldRecord?.user_id) {
        const userId = newRecord?.user_id || oldRecord?.user_id;
        socketIO.to(`user_${userId}`).emit('voucher_usage_change', {
          eventType,
          data: newRecord || oldRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;

    default:
      // Generic broadcast for other tables
      socketIO.emit(`${tableName}_change`, {
        eventType,
        tableName,
        data: newRecord || oldRecord,
        timestamp: new Date().toISOString()
      });
      break;
  }

  console.log(`📊 Generic handler processed ${tableName} ${eventType} for record ${recordId}`);
};

/**
 * Handle notification changes
 */
export const handleNotificationChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const notificationId = newRecord?.id || oldRecord?.id;
  const userId = newRecord?.user_id || oldRecord?.user_id;
  const restaurantId = newRecord?.restaurant_id || oldRecord?.restaurant_id;
  const organizationId = newRecord?.organization_id || oldRecord?.organization_id;
  
  console.log(`🔔 Notification ${eventType}: ${notificationId} for user ${userId}`);
  
  switch (eventType) {
    case 'INSERT':
      // Thông báo mới được tạo - gửi realtime đến user
      if (userId) {
        socketIO.to(`user_${userId}`).emit('new_notification', {
          notification: newRecord,
          timestamp: new Date().toISOString()
        });
        console.log(`📱 Gửi thông báo realtime đến user ${userId}`);
      }
      
      // Gửi đến nhà hàng nếu có
      if (restaurantId) {
        socketIO.to(`restaurant_${restaurantId}`).emit('restaurant_notification', {
          notification: newRecord,
          timestamp: new Date().toISOString()
        });
        console.log(`🏪 Gửi thông báo đến nhà hàng ${restaurantId}`);
      }
      
      // Gửi đến tổ chức nếu có
      if (organizationId) {
        socketIO.to(`organization_${organizationId}`).emit('organization_notification', {
          notification: newRecord,
          timestamp: new Date().toISOString()
        });
        console.log(`🏢 Gửi thông báo đến tổ chức ${organizationId}`);
      }
      break;
      
    case 'UPDATE':
      // Thông báo được cập nhật (ví dụ: đánh dấu đã đọc)
      if (userId) {
        socketIO.to(`user_${userId}`).emit('notification_updated', {
          notificationId,
          oldData: oldRecord,
          newData: newRecord,
          timestamp: new Date().toISOString()
        });
        
        // Nếu thông báo được đánh dấu đã đọc
        if (oldRecord?.status === 'unread' && newRecord?.status === 'read') {
          socketIO.to(`user_${userId}`).emit('notification_read', {
            notificationId,
            timestamp: new Date().toISOString()
          });
          console.log(`✅ Thông báo ${notificationId} đã được đánh dấu đã đọc`);
        }
        
        // Nếu thông báo được lưu trữ
        if (newRecord?.status === 'archived' && oldRecord?.status !== 'archived') {
          socketIO.to(`user_${userId}`).emit('notification_archived', {
            notificationId,
            timestamp: new Date().toISOString()
          });
          console.log(`📁 Thông báo ${notificationId} đã được lưu trữ`);
        }
      }
      break;
      
    case 'DELETE':
      // Thông báo được xóa
      if (userId) {
        socketIO.to(`user_${userId}`).emit('notification_deleted', {
          notificationId,
          timestamp: new Date().toISOString()
        });
        console.log(`🗑️ Thông báo ${notificationId} đã được xóa`);
      }
      break;
  }
};

/**
 * Handle user table changes
 */
export const handleUserChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const userId = newRecord?.id || oldRecord?.id;
  
  switch (eventType) {
    case 'INSERT':
      socketIO.emit('user_created', {
        user: newRecord,
        timestamp: new Date().toISOString()
      });
      // Notify user's connections
      socketIO.to(`user_${userId}`).emit('profile_updated', newRecord);
      break;
      
    case 'UPDATE':
      socketIO.emit('user_updated', {
        user: newRecord,
        changes: getChangedFields(oldRecord, newRecord),
        timestamp: new Date().toISOString()
      });
      // Notify user's connections
      socketIO.to(`user_${userId}`).emit('profile_updated', newRecord);
      break;
      
    case 'DELETE':
      socketIO.emit('user_deleted', {
        userId: oldRecord.id,
        timestamp: new Date().toISOString()
      });
      break;
  }
};

/**
 * Handle order table changes
 */
export const handleOrderChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const orderId = newRecord?.id || oldRecord?.id;
  const customerId = newRecord?.customer_id || oldRecord?.customer_id;
  const restaurantId = newRecord?.restaurant_id || oldRecord?.restaurant_id;
  
  switch (eventType) {
    case 'INSERT':
      // Notify restaurant staff
      socketIO.to(`restaurant_${restaurantId}`).emit('new_order', {
        order: newRecord,
        timestamp: new Date().toISOString()
      });
      
      // Notify customer
      socketIO.to(`user_${customerId}`).emit('order_created', {
        order: newRecord,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'UPDATE':
      const statusChanged = oldRecord?.status !== newRecord?.status;
      
      if (statusChanged) {
        // Notify customer about status change
        socketIO.to(`user_${customerId}`).emit('order_status_updated', {
          orderId,
          oldStatus: oldRecord.status,
          newStatus: newRecord.status,
          order: newRecord,
          timestamp: new Date().toISOString()
        });
        
        // Notify restaurant staff
        socketIO.to(`restaurant_${restaurantId}`).emit('order_status_changed', {
          orderId,
          status: newRecord.status,
          order: newRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;
  }
};

/**
 * Handle menu item changes
 */
export const handleMenuChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const menuItemId = newRecord?.id || oldRecord?.id;
  const menuId = newRecord?.menu_id || oldRecord?.menu_id;
  
  switch (eventType) {
    case 'INSERT':
      socketIO.emit('menu_item_added', {
        menuItem: newRecord,
        menuId,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'UPDATE':
      const availabilityChanged = oldRecord?.is_available !== newRecord?.is_available;
      const priceChanged = oldRecord?.price !== newRecord?.price;
      
      socketIO.emit('menu_item_updated', {
        menuItem: newRecord,
        changes: {
          availabilityChanged,
          priceChanged,
          oldPrice: oldRecord?.price,
          newPrice: newRecord?.price
        },
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'DELETE':
      socketIO.emit('menu_item_removed', {
        menuItemId,
        menuId,
        timestamp: new Date().toISOString()
      });
      break;
  }
};

/**
 * Handle restaurant changes
 */
export const handleRestaurantChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const restaurantId = newRecord?.id || oldRecord?.id;
  
  switch (eventType) {
    case 'UPDATE':
      // Notify all users tracking this restaurant
      socketIO.to(`restaurant_${restaurantId}`).emit('restaurant_updated', {
        restaurant: newRecord,
        changes: getChangedFields(oldRecord, newRecord),
        timestamp: new Date().toISOString()
      });
      break;
  }
};

/**
 * Handle inventory changes
 */
export const handleInventoryChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const restaurantId = newRecord?.restaurant_id || oldRecord?.restaurant_id;
  
  switch (eventType) {
    case 'UPDATE':
      const stockChanged = oldRecord?.current_stock !== newRecord?.current_stock;
      const lowStock = newRecord?.current_stock <= (newRecord?.minimum_stock || 0);
      
      if (stockChanged) {
        // Notify restaurant staff about stock changes
        socketIO.to(`restaurant_${restaurantId}`).emit('inventory_updated', {
          item: newRecord,
          oldStock: oldRecord.current_stock,
          newStock: newRecord.current_stock,
          lowStock,
          timestamp: new Date().toISOString()
        });
        
        if (lowStock) {
          socketIO.to(`restaurant_${restaurantId}`).emit('low_stock_alert', {
            item: newRecord,
            currentStock: newRecord.current_stock,
            minimumStock: newRecord.minimum_stock,
            timestamp: new Date().toISOString()
          });
        }
      }
      break;
  }
};

/**
 * Handle message changes (chat)
 */
export const handleMessageChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const conversationId = newRecord?.conversation_id || oldRecord?.conversation_id;
  
  switch (eventType) {
    case 'INSERT':
      // Notify conversation participants
      socketIO.to(`conversation_${conversationId}`).emit('new_message', {
        message: newRecord,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'UPDATE':
      if (newRecord?.is_read !== oldRecord?.is_read) {
        socketIO.to(`conversation_${conversationId}`).emit('message_read', {
          messageId: newRecord.id,
          isRead: newRecord.is_read,
          timestamp: new Date().toISOString()
        });
      }
      break;
  }
};

/**
 * Handle reservation changes
 */
export const handleReservationChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  const customerId = newRecord?.customer_id || oldRecord?.customer_id;
  const restaurantId = newRecord?.restaurant_id || oldRecord?.restaurant_id;
  
  switch (eventType) {
    case 'INSERT':
      // Notify restaurant staff
      socketIO.to(`restaurant_${restaurantId}`).emit('new_reservation', {
        reservation: newRecord,
        timestamp: new Date().toISOString()
      });
      
      // Notify customer
      socketIO.to(`user_${customerId}`).emit('reservation_created', {
        reservation: newRecord,
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'UPDATE':
      const statusChanged = oldRecord?.status !== newRecord?.status;
      
      if (statusChanged) {
        socketIO.to(`user_${customerId}`).emit('reservation_status_updated', {
          reservation: newRecord,
          oldStatus: oldRecord.status,
          newStatus: newRecord.status,
          timestamp: new Date().toISOString()
        });
        
        socketIO.to(`restaurant_${restaurantId}`).emit('reservation_updated', {
          reservation: newRecord,
          timestamp: new Date().toISOString()
        });
      }
      break;
  }
};

/**
 * Handle payment changes
 */
export const handlePaymentChanges = (eventType: string, newRecord: any, oldRecord: any) => {
  switch (eventType) {
    case 'UPDATE':
      const statusChanged = oldRecord?.status !== newRecord?.status;
      
      if (statusChanged) {
        socketIO.emit('payment_status_updated', {
          payment: newRecord,
          oldStatus: oldRecord.status,
          newStatus: newRecord.status,
          timestamp: new Date().toISOString()
        });
      }
      break;
  }
};

/**
 * Subscribe to multiple tables at once
 */
export const subscribeToAllTables = () => {
  if (isSubscriptionInitialized) {
    console.log('📡 Table subscriptions already initialized');
    return;
  }

  const tables = [
    // ================================
    // 🏢 ORGANIZATION & USER MANAGEMENT
    // ================================
    'addresses',
    'categories', 
    'organizations',
    'organization_memberships',
    'restaurant_chains',
    'users',
    'user_statistics',
    
    // ================================
    // 💬 REAL-TIME COMMUNICATION
    // ================================
    'conversations',
    'messages',
    'notifications',
    
    // ================================
    // 🍕 RESTAURANT & MENU MANAGEMENT
    // ================================
    'restaurants',
    'menus',
    'menu_items',
    'tables',
    
    // ================================
    // 📅 RESERVATIONS & TABLE ORDERS
    // ================================
    'reservations',
    'table_orders',
    
    // ================================
    // 🛒 ORDERS & PAYMENTS
    // ================================
    'orders',
    'order_items',
    'order_status_history',
    'payments',
    
    // ================================
    // 👥 STAFF MANAGEMENT
    // ================================
    'restaurant_staffs',
    'staff_schedules',
    'staff_attendance',
    
    // ================================
    // 📦 INVENTORY & RECIPES
    // ================================
    'inventory_items',
    'inventory_transactions',
    'recipes',
    'recipe_ingredients',
    
    // ================================
    // 🎟️ PROMOTIONS & VOUCHERS
    // ================================
    'vouchers',
    'voucher_usages',
    'promotions',
    
    // ================================
    // ⭐ REVIEWS & ANALYTICS
    // ================================
    'reviews',
    'revenue_reports'
  ];

  console.log(`🔄 Initializing subscriptions for ${tables.length} tables...`);

  tables.forEach(table => {
    subscribeToTableChanges(table);
  });

  isSubscriptionInitialized = true;
  console.log(`✅ Subscribed to ${tables.length} tables for realtime updates`);
};

/**
 * Unsubscribe from a specific table
 */
export const unsubscribeFromTable = (tableName: string, schema: string = 'public') => {
  const channelName = `${schema}:${tableName}`;
  const channel = realtimeChannels.get(channelName);
  
  if (channel) {
    supabaseClient.removeChannel(channel);
    realtimeChannels.delete(channelName);
    console.log(`✅ Unsubscribed from ${tableName}`);
  }
};

/**
 * Unsubscribe from all tables
 */
export const unsubscribeFromAllTables = () => {
  realtimeChannels.forEach((channel, channelName) => {
    supabaseClient.removeChannel(channel);
  });
  realtimeChannels.clear();
  isSubscriptionInitialized = false;
  console.log('✅ Unsubscribed from all tables');
};

/**
 * Get changed fields between old and new records
 */
export const getChangedFields = (oldRecord: any, newRecord: any): string[] => {
  if (!oldRecord || !newRecord) return [];
  
  const changes: string[] = [];
  Object.keys(newRecord).forEach(key => {
    if (oldRecord[key] !== newRecord[key]) {
      changes.push(key);
    }
  });
  
  return changes;
};

/**
 * Send custom realtime event
 */
export const sendRealtimeEvent = (event: string, data: any, room?: string) => {
  if (!socketIO) return;
  
  if (room) {
    socketIO.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  } else {
    socketIO.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get Supabase client instance
 */
export const getSupabaseClient = () => supabaseClient;

/**
 * Get all active channels
 */
export const getActiveChannels = () => Array.from(realtimeChannels.keys());
