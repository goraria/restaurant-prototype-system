# 🚀 Realtime Integration Guide

## 📝 Tổng quan

Dự án đã được tích hợp hoàn toàn với hệ thống Realtime kết hợp **Socket.IO** và **Supabase Realtime** để cung cấp cập nhật dữ liệu thời gian thực cho tất cả các bảng trong database.

## 🏗️ Kiến trúc Realtime

### Backend Services
- **Socket.IO Server**: WebSocket connections cho client
- **Supabase Realtime**: Database change detection
- **Realtime Service**: CRUD operations với auto broadcast
- **Prisma Integration**: ORM với realtime wrapper functions

### Luồng dữ liệu
```
Database Change → Supabase Realtime → Socket.IO → Connected Clients
     ↑                                                      ↓
Client Action → Prisma Service → Database Update
```

## 🔌 Client Integration

### 1. Setup Socket.IO Client

#### React/Vue/Angular
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: true
});

// User authentication và join rooms
socket.emit('user_online', userId);
socket.emit('join_restaurant', restaurantId);
socket.emit('track_order', orderId);
```

#### React Native
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  forceNew: true
});
```

### 2. Event Listeners

#### Order Realtime Events
```typescript
// Track order status changes
socket.on('order_status_updated', (data) => {
  console.log('Order status:', data.status);
  // Update UI
  updateOrderStatus(data.orderId, data.status, data.order);
});

// New orders for restaurant staff
socket.on('new_order', (data) => {
  console.log('New order received:', data.order);
  // Show notification
  showNotification('New Order', `Order ${data.order.order_code} received`);
  // Update order list
  addNewOrderToList(data.order);
});

// Order cooking status updates
socket.on('order_status_changed', (data) => {
  // Update order in restaurant dashboard
  updateRestaurantOrderStatus(data.orderId, data.status);
});
```

#### Menu & Inventory Events
```typescript
// Menu item availability changes
socket.on('menu_item_availability_changed', (data) => {
  console.log('Menu item availability:', data.isAvailable);
  // Update menu display
  updateMenuItemAvailability(data.menuItem.id, data.isAvailable);
});

// Inventory low stock alerts
socket.on('low_stock_alert', (data) => {
  console.log('Low stock alert:', data.inventoryItem.name);
  // Show urgent notification
  showUrgentAlert(`Low Stock: ${data.inventoryItem.name} (${data.currentStock} left)`);
});

// Bulk menu updates
socket.on('menu_bulk_updated', (data) => {
  console.log('Menu bulk update:', data.updatedItems.length);
  // Refresh menu section
  refreshMenuSection(data.menuId);
});
```

#### Reservation Events
```typescript
// New reservations for restaurant
socket.on('new_reservation', (data) => {
  console.log('New reservation:', data.reservation);
  // Update reservation calendar
  addReservationToCalendar(data.reservation);
});

// Reservation status updates for customers
socket.on('reservation_status_updated', (data) => {
  console.log('Reservation status:', data.status);
  // Update customer's reservation view
  updateReservationStatus(data.reservationId, data.status);
});
```

#### Chat & Messaging Events
```typescript
// New messages in conversation
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  // Update chat UI
  addMessageToChat(data.message);
  // Show notification if chat not active
  if (!isChatActive()) {
    showChatNotification(data.message);
  }
});
```

#### Payment Events
```typescript
// Payment status updates
socket.on('payment_status_updated', (data) => {
  console.log('Payment status:', data.status);
  // Update payment UI
  updatePaymentStatus(data.paymentId, data.status);
  
  if (data.status === 'completed') {
    showSuccessMessage('Payment completed successfully!');
  }
});
```

#### Statistics & Dashboard Events
```typescript
// Real-time statistics updates
socket.on('stats_updated', (data) => {
  console.log('Statistics updated:', data);
  // Update dashboard charts
  updateDashboardStats(data);
});

// Global stats for admin dashboard
socket.on('global_stats_updated', (data) => {
  console.log('Global statistics:', data);
  // Update admin dashboard
  updateGlobalDashboard(data);
});
```

### 3. User Presence & Status

```typescript
// User online/offline status
socket.on('user_status_changed', (data) => {
  console.log('User status:', data.userId, data.status);
  // Update user presence indicator
  updateUserPresence(data.userId, data.status);
});

// Join/leave specific rooms
socket.emit('join_restaurant', restaurantId);
socket.emit('subscribe_menu', menuId);
socket.emit('track_order', orderId);

// Leave rooms when navigating away
socket.emit('leave_restaurant', restaurantId);
socket.emit('unsubscribe_menu', menuId);
socket.emit('stop_tracking_order', orderId);
```

## 📱 Platform-Specific Implementation

### React.js Hook Example
```typescript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useRealtimeOrder = (orderId: string) => {
  const [order, setOrder] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Track specific order
    newSocket.emit('track_order', orderId);

    // Listen for order updates
    newSocket.on('order_status_updated', (data) => {
      if (data.orderId === orderId) {
        setOrder(data.order);
      }
    });

    return () => {
      newSocket.emit('stop_tracking_order', orderId);
      newSocket.disconnect();
    };
  }, [orderId]);

  return { order, socket };
};
```

### Vue.js Composition API
```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

export function useRealtimeRestaurant(restaurantId: string) {
  const orders = ref([]);
  const reservations = ref([]);
  const inventory = ref([]);
  let socket = null;

  onMounted(() => {
    socket = io('http://localhost:3000');
    
    socket.emit('join_restaurant', restaurantId);
    
    socket.on('new_order', (data) => {
      orders.value.unshift(data.order);
    });
    
    socket.on('new_reservation', (data) => {
      reservations.value.push(data.reservation);
    });
    
    socket.on('inventory_updated', (data) => {
      const index = inventory.value.findIndex(item => item.id === data.inventoryItem.id);
      if (index !== -1) {
        inventory.value[index] = data.inventoryItem;
      }
    });
  });

  onUnmounted(() => {
    if (socket) {
      socket.emit('leave_restaurant', restaurantId);
      socket.disconnect();
    }
  });

  return { orders, reservations, inventory };
}
```

### React Native Example
```typescript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Alert } from 'react-native';

export const useRealtimeNotifications = (userId: string) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('user_online', userId);

    // Listen for various notifications
    newSocket.on('order_status_updated', (data) => {
      Alert.alert('Order Update', `Your order status: ${data.status}`);
      setNotifications(prev => [...prev, {
        type: 'order_update',
        title: 'Order Update',
        message: `Order ${data.orderId} is now ${data.status}`,
        timestamp: new Date()
      }]);
    });

    newSocket.on('reservation_status_updated', (data) => {
      Alert.alert('Reservation Update', `Your reservation is ${data.status}`);
      setNotifications(prev => [...prev, {
        type: 'reservation_update',
        title: 'Reservation Update',
        message: `Reservation status: ${data.status}`,
        timestamp: new Date()
      }]);
    });

    return () => {
      newSocket.emit('user_offline', userId);
      newSocket.disconnect();
    };
  }, [userId]);

  return { socket, notifications };
};
```

## 🔧 Configuration

### Environment Variables
Thêm vào `.env`:
```env
# Supabase Realtime
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Socket.IO
SOCKET_PORT=3000
SOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Client Configuration
```typescript
// Realtime client config
export const realtimeConfig = {
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  autoConnect: true,
  transports: ['websocket'],
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 10
};
```

## 🎯 Event Categories

### 1. User Events
- `user_created` - New user registration
- `user_updated` - User profile changes
- `profile_updated` - User profile data update
- `user_status_changed` - Online/offline status

### 2. Order Events
- `new_order` - New order created
- `order_created` - Order confirmation for customer
- `order_status_updated` - Order status changes
- `order_status_changed` - Order status for restaurant

### 3. Menu Events
- `menu_item_updated` - Menu item changes
- `menu_item_availability_changed` - Item availability
- `menu_bulk_updated` - Bulk menu changes

### 4. Inventory Events
- `inventory_updated` - Stock level changes
- `low_stock_alert` - Low inventory warnings
- `inventory_transaction_created` - Inventory transactions

### 5. Reservation Events
- `new_reservation` - New reservation for restaurant
- `reservation_created` - Reservation confirmation for customer
- `reservation_status_updated` - Reservation status changes
- `reservation_updated` - Reservation changes for restaurant

### 6. Payment Events
- `payment_status_updated` - Payment status changes
- `payment_updated` - Payment updates for restaurant

### 7. Chat Events
- `new_message` - New chat messages

### 8. Table Events
- `table_status_updated` - Table status changes

### 9. Review Events
- `new_review` - New reviews
- `review_created` - Review notifications

### 10. Statistics Events
- `stats_updated` - Restaurant statistics
- `global_stats_updated` - Global dashboard stats

## 📊 Performance Tips

### 1. Connection Management
- Reuse socket connections
- Disconnect when not needed
- Handle reconnection properly

### 2. Event Optimization
- Only subscribe to needed events
- Unsubscribe when leaving pages
- Use specific room targeting

### 3. Error Handling
```typescript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Handle connection errors
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Handle disconnection
});
```

## 🚀 Getting Started

1. **Install client dependencies**:
```bash
npm install socket.io-client
```

2. **Initialize socket connection**:
```typescript
import io from 'socket.io-client';
const socket = io('http://localhost:3000');
```

3. **Authenticate and join rooms**:
```typescript
socket.emit('user_online', userId);
socket.emit('join_restaurant', restaurantId);
```

4. **Listen for events**:
```typescript
socket.on('new_order', handleNewOrder);
socket.on('order_status_updated', handleOrderUpdate);
```

5. **Cleanup on unmount**:
```typescript
socket.emit('user_offline', userId);
socket.disconnect();
```

Hệ thống realtime giờ đã hoàn toàn tích hợp và sẵn sàng sử dụng! 🎉
