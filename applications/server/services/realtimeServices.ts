import { PrismaClient, order_status_enum, payment_status_enum, reservation_status_enum } from '@prisma/client';
import { 
  broadcastToUser, 
  broadcastToRestaurant, 
  broadcastOrderUpdate,
  sendRealtimeEvent 
} from '../config/realtime';

// Prisma client instance
const prisma = new PrismaClient();

// ================================
// 🔄 REALTIME CRUD OPERATIONS
// ================================

/**
 * Create user with realtime broadcast
 */
export const createUserRealtime = async (userData: any) => {
  try {
    const user = await prisma.users.create({
      data: userData
    });

    // Broadcast to all admin/staff
    sendRealtimeEvent('user_created', { user });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user with realtime broadcast
 */
export const updateUserRealtime = async (userId: string, updateData: any) => {
  try {
    const user = await prisma.users.update({
      where: { id: userId },
      data: updateData
    });

    // Broadcast to user's connections
    broadcastToUser(userId, 'profile_updated', { user });
    
    // Broadcast to admins
    sendRealtimeEvent('user_updated', { user, userId });

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Create order with realtime broadcast
 */
export const createOrderRealtime = async (orderData: any) => {
  try {
    const order = await prisma.orders.create({
      data: orderData,
      include: {
        customers: true,
        restaurants: true,
        order_items: {
          include: {
            menu_items: true
          }
        }
      }
    });

    // Broadcast to customer
    broadcastToUser(order.customer_id, 'order_created', { order });
    
    // Broadcast to restaurant staff
    broadcastToRestaurant(order.restaurant_id, 'new_order', { order });
    
    // Broadcast to admin dashboard
    sendRealtimeEvent('new_order', { order });

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update order status with realtime broadcast
 */
export const updateOrderStatusRealtime = async (orderId: string, status: order_status_enum, updatedBy: string) => {
  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: { 
        status,
        updated_at: new Date()
      },
      include: {
        customers: true,
        restaurants: true,
        order_items: {
          include: {
            menu_items: true
          }
        }
      }
    });

    // Create status history
    await prisma.order_status_history.create({
      data: {
        order_id: orderId,
        status,
        changed_by_user_id: updatedBy,
        notes: `Status changed to ${status}`
      }
    });

    // Broadcast to customer
    broadcastToUser(order.customer_id, 'order_status_updated', { 
      orderId, 
      status, 
      order 
    });
    
    // Broadcast to restaurant staff
    broadcastToRestaurant(order.restaurant_id, 'order_status_changed', { 
      orderId, 
      status, 
      order 
    });
    
    // Broadcast to order trackers
    broadcastOrderUpdate(orderId, 'status_updated', { 
      orderId, 
      status, 
      order 
    });

    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Update menu item availability with realtime broadcast
 */
export const updateMenuItemAvailabilityRealtime = async (
  menuItemId: string, 
  isAvailable: boolean, 
  updatedBy: string
) => {
  try {
    const menuItem = await prisma.menu_items.update({
      where: { id: menuItemId },
      data: { 
        is_available: isAvailable,
        updated_at: new Date()
      },
      include: {
        menus: {
          include: {
            restaurants: true
          }
        }
      }
    });

    // Broadcast to restaurant staff
    broadcastToRestaurant(menuItem.menus.restaurant_id, 'menu_item_availability_changed', {
      menuItem,
      isAvailable,
      updatedBy
    });
    
    // Broadcast to menu subscribers
    sendRealtimeEvent('menu_item_updated', {
      menuItemId,
      menuId: menuItem.menu_id,
      isAvailable,
      menuItem
    });

    return menuItem;
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    throw error;
  }
};

/**
 * Update inventory with realtime broadcast and low stock alerts
 */
export const updateInventoryRealtime = async (
  inventoryItemId: string, 
  quantity: number, 
  updatedBy: string
) => {
  try {
    const inventoryItem = await prisma.inventory_items.update({
      where: { id: inventoryItemId },
      data: { 
        quantity,
        updated_at: new Date()
      },
      include: {
        restaurants: true
      }
    });

    // Check for low stock
    const lowStock = quantity <= Number(inventoryItem.min_quantity || 0);
    
    // Broadcast to restaurant staff
    broadcastToRestaurant(inventoryItem.restaurant_id, 'inventory_updated', {
      inventoryItem,
      currentStock: quantity,
      lowStock,
      updatedBy
    });

    // Send low stock alert if needed
    if (lowStock) {
      broadcastToRestaurant(inventoryItem.restaurant_id, 'low_stock_alert', {
        inventoryItem,
        currentStock: quantity,
        minimumStock: inventoryItem.min_quantity
      });
    }

    return inventoryItem;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

/**
 * Create reservation with realtime broadcast
 */
export const createReservationRealtime = async (reservationData: any) => {
  try {
    const reservation = await prisma.reservations.create({
      data: reservationData,
      include: {
        customers: true,
        tables: true
      }
    });

    // Broadcast to customer if available
    if (reservation.customer_id) {
      broadcastToUser(reservation.customer_id, 'reservation_created', { reservation });
    }
    
    // Broadcast to restaurant staff via table's restaurant
    const table = await prisma.tables.findUnique({
      where: { id: reservation.table_id },
      include: { restaurants: true }
    });
    
    if (table) {
      broadcastToRestaurant(table.restaurant_id, 'new_reservation', { reservation });
    }

    return reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

/**
 * Update reservation status with realtime broadcast
 */
export const updateReservationStatusRealtime = async (
  reservationId: string, 
  status: reservation_status_enum, 
  updatedBy: string
) => {
  try {
    const reservation = await prisma.reservations.update({
      where: { id: reservationId },
      data: { 
        status,
        updated_at: new Date()
      },
      include: {
        customers: true,
        tables: true
      }
    });

    // Broadcast to customer if available
    if (reservation.customer_id) {
      broadcastToUser(reservation.customer_id, 'reservation_status_updated', {
        reservationId,
        status,
        reservation
      });
    }
    
    // Broadcast to restaurant staff via table's restaurant
    const table = await prisma.tables.findUnique({
      where: { id: reservation.table_id },
      include: { restaurants: true }
    });
    
    if (table) {
      broadcastToRestaurant(table.restaurant_id, 'reservation_updated', {
        reservationId,
        status,
        reservation
      });
    }

    return reservation;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};

/**
 * Create message with realtime broadcast
 */
export const createMessageRealtime = async (messageData: any) => {
  try {
    const message = await prisma.messages.create({
      data: messageData,
      include: {
        senders: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true
          }
        },
        conversations: true
      }
    });

    // Broadcast to conversation participants
    sendRealtimeEvent('new_message', { message }, `conversation_${message.conversation_id}`);

    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

/**
 * Update payment status with realtime broadcast
 */
export const updatePaymentStatusRealtime = async (
  paymentId: string, 
  status: payment_status_enum, 
  transactionData?: any
) => {
  try {
    const payment = await prisma.payments.update({
      where: { id: paymentId },
      data: {
        status,
        processed_at: status === 'completed' ? new Date() : undefined,
        gateway_response: transactionData || undefined,
        updated_at: new Date()
      }
    });

    // Update order payment status if needed
    if (status === 'completed') {
      await prisma.orders.update({
        where: { id: payment.order_id },
        data: { payment_status: 'completed' }
      });
    }

    // Get order with related data
    const order = await prisma.orders.findUnique({
      where: { id: payment.order_id },
      include: {
        customers: true,
        restaurants: true
      }
    });

    if (order) {
      // Broadcast to customer
      broadcastToUser(order.customer_id, 'payment_status_updated', {
        paymentId,
        status,
        payment,
        orderId: payment.order_id
      });
      
      // Broadcast to restaurant staff
      broadcastToRestaurant(order.restaurant_id, 'payment_updated', {
        paymentId,
        status,
        payment
      });
    }

    return payment;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Bulk update menu items (for batch operations)
 */
export const bulkUpdateMenuItemsRealtime = async (
  menuId: string, 
  updates: Array<{ id: string; data: any }>,
  updatedBy: string
) => {
  try {
    const results = [];
    
    for (const update of updates) {
      const menuItem = await prisma.menu_items.update({
        where: { id: update.id },
        data: {
          ...update.data,
          updated_at: new Date()
        }
      });
      results.push(menuItem);
    }

    // Get restaurant info for broadcasting
    const menu = await prisma.menus.findUnique({
      where: { id: menuId },
      include: { restaurants: true }
    });

    if (menu) {
      // Broadcast bulk update to restaurant staff
      broadcastToRestaurant(menu.restaurant_id, 'menu_bulk_updated', {
        menuId,
        updatedItems: results,
        updatedBy
      });
      
      // Broadcast to menu subscribers
      sendRealtimeEvent('menu_bulk_updated', {
        menuId,
        updatedItems: results
      });
    }

    return results;
  } catch (error) {
    console.error('Error bulk updating menu items:', error);
    throw error;
  }
};

/**
 * Get realtime statistics for dashboard
 */
export const getRealtimeStatistics = async (restaurantId?: string) => {
  try {
    const whereClause = restaurantId ? { restaurant_id: restaurantId } : {};
    
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      activeReservations
    ] = await Promise.all([
      prisma.orders.count({ where: whereClause }),
      prisma.orders.count({ 
        where: { 
          ...whereClause, 
          status: 'pending' 
        } 
      }),
      prisma.orders.count({ 
        where: { 
          ...whereClause, 
          status: 'completed' 
        } 
      }),
      prisma.orders.aggregate({
        where: { 
          ...whereClause, 
          status: 'completed' 
        },
        _sum: { final_amount: true }
      }),
      prisma.reservations.count({
        where: {
          status: 'confirmed',
          reservation_date: {
            gte: new Date()
          },
          ...(restaurantId && {
            tables: {
              restaurant_id: restaurantId
            }
          })
        }
      })
    ]);

    const stats = {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.final_amount || 0,
      activeReservations,
      timestamp: new Date().toISOString()
    };

    // Broadcast stats update
    if (restaurantId) {
      broadcastToRestaurant(restaurantId, 'stats_updated', stats);
    } else {
      sendRealtimeEvent('global_stats_updated', stats);
    }

    return stats;
  } catch (error) {
    console.error('Error getting realtime statistics:', error);
    throw error;
  }
};

/**
 * Update table status with realtime broadcast
 */
export const updateTableStatusRealtime = async (
  tableId: string, 
  status: any, 
  updatedBy: string
) => {
  try {
    const table = await prisma.tables.update({
      where: { id: tableId },
      data: { 
        status,
        updated_at: new Date()
      },
      include: {
        restaurants: true
      }
    });

    // Broadcast to restaurant staff
    broadcastToRestaurant(table.restaurant_id, 'table_status_updated', {
      table,
      status,
      updatedBy
    });

    return table;
  } catch (error) {
    console.error('Error updating table status:', error);
    throw error;
  }
};

/**
 * Create review with realtime broadcast
 */
export const createReviewRealtime = async (reviewData: any) => {
  try {
    const review = await prisma.reviews.create({
      data: reviewData,
      include: {
        customers: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        restaurants: true,
        menu_items: true,
        orders: true
      }
    });

    // Broadcast to restaurant
    if (review.restaurant_id) {
      broadcastToRestaurant(review.restaurant_id, 'new_review', { review });
    }

    // Broadcast global review event
    sendRealtimeEvent('review_created', { review });

    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export { prisma };
