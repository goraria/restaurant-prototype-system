# 🚀 Supabase Realtime Integration Documentation

## 📋 Overview

Dự án này đã được tích hợp **Supabase Realtime** để cung cấp tính năng **cập nhật dữ liệu realtime** cho tất cả các bảng quan trọng trong hệ thống. Khi admin hoặc staff cập nhật bất kỳ dữ liệu nào, client sẽ nhận được thông báo realtime ngay lập tức.

## 🔧 Setup Instructions

### 1. **Environment Variables**

Thêm các biến môi trường sau vào file `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. **Enable Realtime in Supabase**

Trong Supabase Dashboard:
1. Vào **Database** → **Replication**
2. Enable realtime cho các bảng:
   - `users`
   - `restaurants`
   - `orders`
   - `menu_items`
   - `inventory_items`
   - `reservations`
   - `messages`
   - `payments`
   - `vouchers`

```sql
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE restaurants;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_items;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE vouchers;
```

## 🎯 Realtime Features

### **📊 Database Tables with Realtime**

| Table | Events | Client Events |
|-------|--------|---------------|
| `users` | INSERT, UPDATE, DELETE | `user_updated`, `profile_updated` |
| `restaurants` | INSERT, UPDATE, DELETE | `restaurant_updated`, `restaurant_data_updated` |
| `orders` | INSERT, UPDATE, DELETE | `order_updated`, `new_order`, `order_status_updated`, `kitchen_new_order` |
| `menu_items` | INSERT, UPDATE, DELETE | `menu_updated`, `menu_item_updated` |
| `inventory_items` | INSERT, UPDATE, DELETE | `inventory_updated`, `low_stock_alert` |
| `reservations` | INSERT, UPDATE, DELETE | `reservation_updated`, `new_reservation` |
| `messages` | INSERT, UPDATE, DELETE | `new_message` |
| `payments` | INSERT, UPDATE, DELETE | `payment_updated`, `payment_status_updated` |
| `vouchers` | INSERT, UPDATE, DELETE | `voucher_updated`, `new_voucher_available` |

### **🔄 Socket.IO Room Management**

| Room Pattern | Purpose |
|--------------|---------|
| `user_{userId}` | User-specific notifications |
| `restaurant_{restaurantId}` | Restaurant-wide updates |
| `restaurant_{restaurantId}_kitchen` | Kitchen-specific notifications |
| `conversation_{conversationId}` | Chat messages |
| `order_{orderId}` | Order tracking |
| `menu_{menuId}` | Menu updates |

## 💻 Client-Side Usage

### **1. Connect to Socket.IO**

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

// User authentication
socket.emit('user_online', { 
  userId: 'user-id', 
  role: 'customer' 
});
```

### **2. Join Specific Rooms**

```javascript
// Join restaurant room (for staff)
socket.emit('join_restaurant', { 
  restaurantId: 'restaurant-id', 
  role: 'staff' 
});

// Track specific order
socket.emit('track_order', 'order-id');

// Subscribe to menu updates
socket.emit('subscribe_menu', 'menu-id');
```

### **3. Listen to Realtime Events**

```javascript
// New order notification (for restaurant staff)
socket.on('new_order', (data) => {
  console.log('New order received:', data.order);
  // Update UI with new order
});

// Order status update (for customers)
socket.on('order_status_updated', (data) => {
  console.log('Order status changed:', data.order.status);
  // Update order tracking UI
});

// Low stock alert (for managers)
socket.on('low_stock_alert', (data) => {
  console.log('Low stock warning:', data.item);
  // Show notification to restock
});

// Menu item availability change
socket.on('menu_item_updated', (data) => {
  console.log('Menu item changed:', data.item);
  // Update menu display
});

// New reservation (for hosts)
socket.on('new_reservation', (data) => {
  console.log('New reservation:', data.reservation);
  // Update reservation list
});

// Payment confirmation
socket.on('payment_status_updated', (data) => {
  console.log('Payment status:', data.payment);
  // Update payment UI
});
```

## 🛠️ Server-Side Usage

### **1. Import Notification Service**

```typescript
import RealtimeNotificationService, { quickNotify } from '@/services/realtimeNotificationService';
```

### **2. Send Notifications**

```typescript
// Quick notifications
quickNotify.orderReceived('restaurant-id', orderData);
quickNotify.orderReady('customer-id', orderData);
quickNotify.paymentSuccess('customer-id', paymentData);
quickNotify.lowStock('restaurant-id', inventoryItem);

// Detailed notifications
RealtimeNotificationService.notifyNewOrder('restaurant-id', orderData);
RealtimeNotificationService.notifyLowStockAlert('restaurant-id', inventoryItem);
RealtimeNotificationService.notifyNewVoucher('all', voucherData);
```

### **3. Custom Events**

```typescript
import { broadcastToRestaurant, notifyOrderUpdate } from '@/config/realtime';

// Broadcast custom event to restaurant
broadcastToRestaurant('restaurant-id', 'custom_event', {
  message: 'Custom notification',
  data: customData
});

// Notify specific order room
notifyOrderUpdate('order-id', 'order_ready', {
  status: 'ready',
  estimatedTime: '5 minutes'
});
```

## 📱 Use Cases

### **👨‍🍳 For Kitchen Staff**
```javascript
// Listen for new orders
socket.on('kitchen_new_order', (data) => {
  // Show new order on kitchen display
  addToKitchenQueue(data.order);
});

// Update order status
function markOrderReady(orderId) {
  // This will trigger realtime update to customer
  updateOrderStatus(orderId, 'ready');
}
```

### **👤 For Customers**
```javascript
// Track order status
socket.emit('track_order', orderId);
socket.on('order_status_updated', (data) => {
  updateOrderProgress(data.order.status);
});

// Receive payment confirmations
socket.on('payment_status_updated', (data) => {
  if (data.payment.status === 'completed') {
    showSuccessMessage('Payment successful!');
  }
});
```

### **👨‍💼 For Managers**
```javascript
// Monitor low stock
socket.on('low_stock_alert', (data) => {
  if (data.severity === 'critical') {
    showUrgentAlert(`${data.item.name} is out of stock!`);
  }
});

// Track new reservations
socket.on('new_reservation', (data) => {
  addReservationToCalendar(data.reservation);
});
```

### **📊 For Admin Dashboard**
```javascript
// Monitor all system events
socket.on('user_updated', (data) => {
  updateUserStats();
});

socket.on('order_updated', (data) => {
  updateOrderMetrics();
});

socket.on('restaurant_updated', (data) => {
  refreshRestaurantList();
});
```

## 🚀 Benefits

### **✅ For Customers**
- **Real-time order tracking** - Biết ngay khi order được xác nhận, đang chuẩn bị, sẵn sàng
- **Instant payment confirmations** - Xác nhận thanh toán ngay lập tức
- **Live menu updates** - Thấy ngay khi món ăn hết hàng hoặc có món mới
- **Reservation notifications** - Thông báo khi đặt bàn được xác nhận

### **✅ For Staff**
- **Instant order notifications** - Nhận order mới ngay lập tức
- **Real-time inventory alerts** - Cảnh báo khi hàng sắp hết
- **Live reservation updates** - Quản lý đặt bàn realtime
- **Kitchen coordination** - Đồng bộ giữa frontend và kitchen

### **✅ For Managers**
- **Live dashboard updates** - Dashboard tự động cập nhật
- **Stock management** - Quản lý tồn kho realtime
- **Revenue tracking** - Theo dõi doanh thu realtime
- **Staff coordination** - Phối hợp nhân viên hiệu quả

### **✅ For Admin**
- **System monitoring** - Giám sát hệ thống realtime
- **User activity tracking** - Theo dõi hoạt động người dùng
- **Performance metrics** - Số liệu hiệu suất realtime
- **Multi-restaurant management** - Quản lý nhiều nhà hàng

## 🔧 Advanced Configuration

### **Custom Event Listeners**

```typescript
// In your controller
import { broadcastSystemUpdate } from '@/config/realtime';

export const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await prisma.menu_items.update({
      where: { id: req.params.id },
      data: req.body
    });

    // Supabase Realtime will automatically notify
    // But you can also send custom notifications
    broadcastSystemUpdate('menu_item_manual_update', {
      item: updatedItem,
      updatedBy: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **Conditional Notifications**

```typescript
// Only notify during business hours
const notifyIfBusinessHours = (callback: () => void) => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 8 && hour <= 22) { // 8 AM - 10 PM
    callback();
  }
};

// Usage
notifyIfBusinessHours(() => {
  quickNotify.orderReceived(restaurantId, orderData);
});
```

## 🎯 Best Practices

1. **Đặt tên event rõ ràng** - Sử dụng naming convention nhất quán
2. **Kiểm tra permissions** - Chỉ gửi thông báo cho người có quyền
3. **Throttle notifications** - Tránh spam notifications
4. **Handle connection errors** - Xử lý khi mất kết nối
5. **Clean up listeners** - Remove event listeners khi component unmount

## 🔍 Debugging

### **Check Active Channels**
```typescript
import { getActiveChannels } from '@/config/realtime';

console.log('Active Supabase channels:', getActiveChannels());
```

### **Monitor Connected Users**
```typescript
import { getConnectedUsers, getRoomMembers } from '@/config/realtime';

console.log('Connected users:', getConnectedUsers());
console.log('Restaurant room members:', getRoomMembers('restaurant_123'));
```

### **Enable Debug Logs**
```typescript
// In development, enable debug logging
if (process.env.NODE_ENV === 'development') {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    
    socket.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });
  });
}
```

---

**🎉 Với tích hợp này, toàn bộ hệ thống sẽ có khả năng cập nhật realtime, mang lại trải nghiệm người dùng tuyệt vời và hiệu quả quản lý cao!**
