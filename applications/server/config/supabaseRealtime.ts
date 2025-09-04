import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Server as SocketIOServer } from 'socket.io';

// Supabase client instance
let supabaseClient: SupabaseClient;
let realtimeChannels: Map<string, RealtimeChannel> = new Map();
let socketIO: SocketIOServer;

/**
 * Initialize Supabase realtime connection
 */
export const initializeSupabaseRealtime = (io: SocketIOServer) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

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
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to ${tableName} changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Error subscribing to ${tableName}`);
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

  switch (tableName) {
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
      console.log(`📊 Unhandled table change: ${tableName}`);
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
  const tables = [
    'users',
    'orders',
    'menu_items',
    'restaurants',
    'inventory_items',
    'messages',
    'reservations',
    'payments',
    'order_items',
    'vouchers',
    'promotions',
    'reviews'
  ];

  tables.forEach(table => {
    subscribeToTableChanges(table);
  });

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
