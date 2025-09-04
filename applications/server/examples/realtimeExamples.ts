// ================================
// 🧪 REALTIME SERVICE TEST EXAMPLES
// ================================

import { 
  createOrderRealtime,
  updateOrderStatusRealtime,
  createUserRealtime,
  updateMenuItemAvailabilityRealtime,
  updateInventoryRealtime,
  createReservationRealtime,
  updateReservationStatusRealtime,
  createMessageRealtime,
  updatePaymentStatusRealtime,
  bulkUpdateMenuItemsRealtime,
  getRealtimeStatistics
} from '../services/realtimeService';

// ================================
// 🔄 Example Usage Functions
// ================================

/**
 * Example: Create new user with realtime broadcast
 */
export const exampleCreateUser = async () => {
  try {
    const userData = {
      id: 'user_123',
      clerk_id: 'clerk_123',
      email: 'test@example.com',
      full_name: 'John Doe',
      role: 'customer',
      phone_number: '+84123456789',
      avatar_url: 'https://example.com/avatar.jpg'
    };

    const user = await createUserRealtime(userData);
    console.log('✅ User created with realtime broadcast:', user.id);
    
    // This will automatically broadcast:
    // - Event: 'user_created' to all admin/staff
    
    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error);
  }
};

/**
 * Example: Create new order with realtime broadcast
 */
export const exampleCreateOrder = async () => {
  try {
    const orderData = {
      restaurant_id: 'restaurant_123',
      customer_id: 'customer_123',
      order_code: 'ORD001',
      order_type: 'dine_in',
      total_amount: 250000,
      delivery_fee: 0,
      discount_amount: 25000,
      tax_amount: 25000,
      final_amount: 250000,
      status: 'pending',
      payment_status: 'pending',
      notes: 'Extra spicy please'
    };

    const order = await createOrderRealtime(orderData);
    console.log('✅ Order created with realtime broadcast:', order.order_code);
    
    // This will automatically broadcast:
    // - Event: 'order_created' to customer
    // - Event: 'new_order' to restaurant staff
    // - Event: 'new_order' to admin dashboard
    
    return order;
  } catch (error) {
    console.error('❌ Error creating order:', error);
  }
};

/**
 * Example: Update order status with realtime broadcast
 */
export const exampleUpdateOrderStatus = async (orderId: string) => {
  try {
    const order = await updateOrderStatusRealtime(orderId, 'preparing', 'staff_123');
    console.log('✅ Order status updated with realtime broadcast:', order.status);
    
    // This will automatically broadcast:
    // - Event: 'order_status_updated' to customer
    // - Event: 'order_status_changed' to restaurant staff
    // - Event: 'status_updated' to order trackers
    
    return order;
  } catch (error) {
    console.error('❌ Error updating order status:', error);
  }
};

/**
 * Example: Update menu item availability
 */
export const exampleUpdateMenuAvailability = async (menuItemId: string) => {
  try {
    const menuItem = await updateMenuItemAvailabilityRealtime(
      menuItemId, 
      false, // Set to unavailable
      'staff_123'
    );
    
    console.log('✅ Menu item availability updated:', menuItem.is_available);
    
    // This will automatically broadcast:
    // - Event: 'menu_item_availability_changed' to restaurant staff
    // - Event: 'menu_item_updated' to menu subscribers
    
    return menuItem;
  } catch (error) {
    console.error('❌ Error updating menu availability:', error);
  }
};

/**
 * Example: Update inventory with low stock alert
 */
export const exampleUpdateInventory = async (inventoryItemId: string) => {
  try {
    const inventoryItem = await updateInventoryRealtime(
      inventoryItemId,
      5, // New quantity (low stock)
      'staff_123'
    );
    
    console.log('✅ Inventory updated with realtime broadcast:', inventoryItem.quantity);
    
    // This will automatically broadcast:
    // - Event: 'inventory_updated' to restaurant staff
    // - Event: 'low_stock_alert' if quantity is low
    
    return inventoryItem;
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
  }
};

/**
 * Example: Create reservation with realtime broadcast
 */
export const exampleCreateReservation = async () => {
  try {
    const reservationData = {
      table_id: 'table_123',
      customer_id: 'customer_123',
      customer_name: 'John Doe',
      customer_phone: '+84123456789',
      customer_email: 'john@example.com',
      party_size: 4,
      reservation_date: new Date('2024-01-15T19:00:00Z'),
      duration_hours: 2,
      status: 'pending',
      special_requests: 'Window seat please'
    };

    const reservation = await createReservationRealtime(reservationData);
    console.log('✅ Reservation created with realtime broadcast:', reservation.id);
    
    // This will automatically broadcast:
    // - Event: 'reservation_created' to customer
    // - Event: 'new_reservation' to restaurant staff
    
    return reservation;
  } catch (error) {
    console.error('❌ Error creating reservation:', error);
  }
};

/**
 * Example: Update reservation status
 */
export const exampleUpdateReservationStatus = async (reservationId: string) => {
  try {
    const reservation = await updateReservationStatusRealtime(
      reservationId,
      'confirmed',
      'staff_123'
    );
    
    console.log('✅ Reservation status updated:', reservation.status);
    
    // This will automatically broadcast:
    // - Event: 'reservation_status_updated' to customer
    // - Event: 'reservation_updated' to restaurant staff
    
    return reservation;
  } catch (error) {
    console.error('❌ Error updating reservation status:', error);
  }
};

/**
 * Example: Create chat message
 */
export const exampleCreateMessage = async () => {
  try {
    const messageData = {
      conversation_id: 'conversation_123',
      sender_id: 'user_123',
      content: 'Hello, I need help with my order',
      message_type: 'text',
      attachments: []
    };

    const message = await createMessageRealtime(messageData);
    console.log('✅ Message created with realtime broadcast:', message.id);
    
    // This will automatically broadcast:
    // - Event: 'new_message' to conversation participants
    
    return message;
  } catch (error) {
    console.error('❌ Error creating message:', error);
  }
};

/**
 * Example: Update payment status
 */
export const exampleUpdatePaymentStatus = async (paymentId: string) => {
  try {
    const payment = await updatePaymentStatusRealtime(
      paymentId,
      'completed',
      { transaction_id: 'txn_123', gateway: 'momo' }
    );
    
    console.log('✅ Payment status updated:', payment.status);
    
    // This will automatically broadcast:
    // - Event: 'payment_status_updated' to customer
    // - Event: 'payment_updated' to restaurant staff
    
    return payment;
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
  }
};

/**
 * Example: Bulk update menu items
 */
export const exampleBulkUpdateMenu = async (menuId: string) => {
  try {
    const updates = [
      {
        id: 'menu_item_1',
        data: { price: 150000, is_available: true }
      },
      {
        id: 'menu_item_2', 
        data: { price: 200000, is_available: false }
      },
      {
        id: 'menu_item_3',
        data: { price: 100000, is_featured: true }
      }
    ];

    const results = await bulkUpdateMenuItemsRealtime(menuId, updates, 'manager_123');
    console.log('✅ Bulk menu update completed:', results.length, 'items updated');
    
    // This will automatically broadcast:
    // - Event: 'menu_bulk_updated' to restaurant staff
    // - Event: 'menu_bulk_updated' to menu subscribers
    
    return results;
  } catch (error) {
    console.error('❌ Error bulk updating menu:', error);
  }
};

/**
 * Example: Get realtime statistics
 */
export const exampleGetRealtimeStats = async (restaurantId?: string) => {
  try {
    const stats = await getRealtimeStatistics(restaurantId);
    console.log('✅ Realtime statistics retrieved:', stats);
    
    // This will automatically broadcast:
    // - Event: 'stats_updated' to restaurant (if restaurantId provided)
    // - Event: 'global_stats_updated' to admin dashboard (if no restaurantId)
    
    return stats;
  } catch (error) {
    console.error('❌ Error getting realtime statistics:', error);
  }
};

// ================================
// 🧪 Test Runner Function
// ================================

/**
 * Run all realtime service examples
 */
export const runRealtimeTests = async () => {
  console.log('🚀 Starting Realtime Service Tests...\n');

  try {
    // Test user creation
    console.log('1️⃣ Testing user creation...');
    await exampleCreateUser();
    
    // Test order creation and updates
    console.log('\n2️⃣ Testing order creation...');
    const order = await exampleCreateOrder();
    if (order) {
      console.log('\n3️⃣ Testing order status update...');
      await exampleUpdateOrderStatus(order.id);
    }
    
    // Test menu updates
    console.log('\n4️⃣ Testing menu availability update...');
    await exampleUpdateMenuAvailability('menu_item_123');
    
    // Test inventory updates
    console.log('\n5️⃣ Testing inventory update...');
    await exampleUpdateInventory('inventory_item_123');
    
    // Test reservation creation and updates
    console.log('\n6️⃣ Testing reservation creation...');
    const reservation = await exampleCreateReservation();
    if (reservation) {
      console.log('\n7️⃣ Testing reservation status update...');
      await exampleUpdateReservationStatus(reservation.id);
    }
    
    // Test messaging
    console.log('\n8️⃣ Testing message creation...');
    await exampleCreateMessage();
    
    // Test payment updates
    console.log('\n9️⃣ Testing payment status update...');
    await exampleUpdatePaymentStatus('payment_123');
    
    // Test bulk menu updates
    console.log('\n🔟 Testing bulk menu update...');
    await exampleBulkUpdateMenu('menu_123');
    
    // Test statistics
    console.log('\n1️⃣1️⃣ Testing realtime statistics...');
    await exampleGetRealtimeStats('restaurant_123');
    
    console.log('\n✅ All realtime tests completed successfully! 🎉');
    
  } catch (error) {
    console.error('\n❌ Realtime tests failed:', error);
  }
};

// ================================
// 🔄 Client-Side Event Examples
// ================================

/**
 * Example client-side event listeners (for documentation)
 */
export const clientSideExamples = {
  
  // React.js example
  reactExample: `
    import io from 'socket.io-client';
    import { useEffect, useState } from 'react';
    
    const socket = io('http://localhost:3000');
    
    function OrderTracker({ orderId }) {
      const [orderStatus, setOrderStatus] = useState('pending');
      
      useEffect(() => {
        socket.emit('track_order', orderId);
        
        socket.on('order_status_updated', (data) => {
          if (data.orderId === orderId) {
            setOrderStatus(data.status);
            console.log('Order status updated:', data.status);
          }
        });
        
        return () => {
          socket.emit('stop_tracking_order', orderId);
        };
      }, [orderId]);
      
      return <div>Order Status: {orderStatus}</div>;
    }
  `,
  
  // Vue.js example
  vueExample: `
    <template>
      <div>
        <h3>Restaurant Dashboard</h3>
        <div v-for="order in orders" :key="order.id">
          Order {{ order.order_code }} - {{ order.status }}
        </div>
      </div>
    </template>
    
    <script>
    import io from 'socket.io-client';
    
    export default {
      data() {
        return {
          orders: [],
          socket: null
        };
      },
      
      mounted() {
        this.socket = io('http://localhost:3000');
        this.socket.emit('join_restaurant', this.restaurantId);
        
        this.socket.on('new_order', (data) => {
          this.orders.unshift(data.order);
          this.$toast.success('New order received!');
        });
        
        this.socket.on('order_status_changed', (data) => {
          const index = this.orders.findIndex(o => o.id === data.orderId);
          if (index !== -1) {
            this.orders[index].status = data.status;
          }
        });
      },
      
      beforeDestroy() {
        this.socket.emit('leave_restaurant', this.restaurantId);
        this.socket.disconnect();
      }
    };
    </script>
  `,
  
  // React Native example
  reactNativeExample: `
    import io from 'socket.io-client';
    import { useEffect } from 'react';
    import { Alert } from 'react-native';
    
    export const useRealtimeNotifications = (userId) => {
      useEffect(() => {
        const socket = io('http://localhost:3000');
        
        socket.emit('user_online', userId);
        
        socket.on('order_status_updated', (data) => {
          Alert.alert(
            'Order Update',
            \`Your order status: \${data.status}\`,
            [{ text: 'OK' }]
          );
        });
        
        socket.on('reservation_status_updated', (data) => {
          Alert.alert(
            'Reservation Update', 
            \`Your reservation is \${data.status}\`,
            [{ text: 'OK' }]
          );
        });
        
        return () => {
          socket.emit('user_offline', userId);
          socket.disconnect();
        };
      }, [userId]);
    };
  `
};

export default {
  runRealtimeTests,
  clientSideExamples,
  // Individual test functions
  exampleCreateUser,
  exampleCreateOrder,
  exampleUpdateOrderStatus,
  exampleUpdateMenuAvailability,
  exampleUpdateInventory,
  exampleCreateReservation,
  exampleUpdateReservationStatus,
  exampleCreateMessage,
  exampleUpdatePaymentStatus,
  exampleBulkUpdateMenu,
  exampleGetRealtimeStats
};
