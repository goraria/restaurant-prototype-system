# 🔄 THIẾT LẬP SOCKET.IO SUBSCRIPTIONS CHO CẬP NHẬT REALTIME
## Hệ thống quản lý nhà hàng đa nền tảng

---

## 🎯 **TỔNG QUAN SOCKET.IO TRONG DỰ ÁN**

### **Mục đích sử dụng:**
- 📱 **Cập nhật trạng thái đơn hàng** realtime cho khách hàng
- 👨‍🍳 **Thông báo đơn hàng mới** cho nhân viên bếp
- 🪑 **Đồng bộ trạng thái bàn ăn** giữa các thiết bị
- 📊 **Cập nhật dashboard** analytics realtime
- 🔔 **Push notifications** cho tất cả users

---

## 🏗️ **KIẾN TRÚC SOCKET.IO SERVER**

### **1. Cài đặt và cấu hình Server:**

```javascript
// applications/server/app/socketServer.js
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { verifySocketAuth } from '../middlewares/auth.middleware.js';

const app = express();
const httpServer = createServer(app);

// Cấu hình Socket.IO với CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",  // Admin dashboard
      "http://localhost:3001",  // Staff interface
      "exp://192.168.1.100:8081" // Mobile app
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware xác thực cho Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await verifySocketAuth(token);
    socket.userId = user.id;
    socket.userRole = user.role;
    socket.restaurantId = user.restaurantId;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});
```

### **2. Tổ chức Namespaces và Rooms:**

```javascript
// Namespace cho từng loại ứng dụng
const adminNamespace = io.of('/admin');
const staffNamespace = io.of('/staff');
const customerNamespace = io.of('/customer');

// Socket connection handlers
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join rooms dựa trên role và restaurant
  socket.join(`restaurant_${socket.restaurantId}`);
  socket.join(`user_${socket.userId}`);
  
  if (socket.userRole === 'staff') {
    socket.join(`staff_${socket.restaurantId}`);
  }
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});
```

---

## 📋 **CÁC EVENTS CHÍNH TRONG HỆ THỐNG**

### **1. Order Management Events:**

```javascript
// applications/server/services/order.service.js
import { io } from '../app/socketServer.js';

class OrderService {
  
  // Tạo đơn hàng mới
  async createOrder(orderData) {
    const newOrder = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: { menuItem: true }
        },
        table: true,
        customer: true
      }
    });
    
    // Emit đến staff của nhà hàng
    io.to(`staff_${orderData.restaurantId}`).emit('new_order', {
      order: newOrder,
      timestamp: new Date(),
      priority: this.calculatePriority(newOrder)
    });
    
    // Emit đến customer
    io.to(`user_${orderData.customerId}`).emit('order_created', {
      orderId: newOrder.id,
      status: 'PENDING',
      estimatedTime: 25 // minutes
    });
    
    return newOrder;
  }
  
  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId, newStatus, staffId) {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        updatedBy: staffId,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        restaurant: true
      }
    });
    
    // Emit đến customer
    io.to(`user_${updatedOrder.customerId}`).emit('order_status_updated', {
      orderId: orderId,
      status: newStatus,
      message: this.getStatusMessage(newStatus),
      estimatedTime: this.calculateEstimatedTime(newStatus)
    });
    
    // Emit đến all staff
    io.to(`staff_${updatedOrder.restaurantId}`).emit('order_updated', {
      orderId: orderId,
      status: newStatus,
      updatedBy: staffId
    });
    
    return updatedOrder;
  }
}
```

### **2. Table Management Events:**

```javascript
// applications/server/services/table.service.js
class TableService {
  
  // Cập nhật trạng thái bàn
  async updateTableStatus(tableId, status, staffId) {
    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { 
        status: status,
        lastUpdated: new Date(),
        updatedBy: staffId
      },
      include: { restaurant: true }
    });
    
    // Emit đến tất cả staff trong nhà hàng
    io.to(`staff_${updatedTable.restaurantId}`).emit('table_status_updated', {
      tableId: tableId,
      status: status,
      tableNumber: updatedTable.number,
      updatedBy: staffId,
      timestamp: new Date()
    });
    
    // Emit đến admin dashboard
    io.to(`restaurant_${updatedTable.restaurantId}`).emit('table_update', {
      tableId: tableId,
      status: status,
      occupancy: await this.getRestaurantOccupancy(updatedTable.restaurantId)
    });
    
    return updatedTable;
  }
}
```

### **3. Kitchen Display Events:**

```javascript
// applications/server/services/kitchen.service.js
class KitchenService {
  
  // Bắt đầu chế biến món ăn
  async startCooking(orderItemId, staffId) {
    const orderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { 
        status: 'COOKING',
        startedAt: new Date(),
        cookId: staffId
      },
      include: {
        order: true,
        menuItem: true
      }
    });
    
    // Emit đến kitchen display
    io.to(`staff_${orderItem.order.restaurantId}`).emit('cooking_started', {
      orderItemId: orderItemId,
      orderId: orderItem.orderId,
      menuItem: orderItem.menuItem.name,
      estimatedCookTime: orderItem.menuItem.cookingTimeMinutes,
      cookId: staffId
    });
    
    return orderItem;
  }
  
  // Hoàn thành món ăn
  async completeOrderItem(orderItemId, staffId) {
    const orderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date()
      },
      include: {
        order: {
          include: {
            orderItems: true,
            customer: true
          }
        }
      }
    });
    
    // Kiểm tra nếu tất cả items đã hoàn thành
    const allCompleted = orderItem.order.orderItems.every(
      item => item.status === 'COMPLETED'
    );
    
    if (allCompleted) {
      // Cập nhật trạng thái đơn hàng
      await this.updateOrderStatus(orderItem.orderId, 'READY', staffId);
      
      // Emit đến customer
      io.to(`user_${orderItem.order.customerId}`).emit('order_ready', {
        orderId: orderItem.orderId,
        message: 'Đơn hàng của bạn đã sẵn sàng!',
        pickupInstructions: 'Vui lòng đến quầy để nhận đơn hàng'
      });
    }
    
    return orderItem;
  }
}
```

---

## 🖥️ **CLIENT-SIDE IMPLEMENTATION**

### **1. Next.js Admin Dashboard:**

```javascript
// applications/admin/hooks/useSocketConnection.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';

export function useSocketConnection() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { getToken } = useAuth();
  
  useEffect(() => {
    const initSocket = async () => {
      const token = await getToken();
      
      const socketInstance = io('http://localhost:3001/admin', {
        auth: { token },
        transports: ['websocket']
      });
      
      socketInstance.on('connect', () => {
        console.log('Admin connected to socket');
        setConnected(true);
      });
      
      socketInstance.on('disconnect', () => {
        console.log('Admin disconnected from socket');
        setConnected(false);
      });
      
      setSocket(socketInstance);
    };
    
    initSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);
  
  return { socket, connected };
}

// applications/admin/components/Dashboard/RealtimeStats.jsx
import { useSocketConnection } from '../../hooks/useSocketConnection';
import { useState, useEffect } from 'react';

export function RealtimeStats() {
  const { socket } = useSocketConnection();
  const [stats, setStats] = useState({
    activeOrders: 0,
    availableTables: 0,
    revenue: 0
  });
  
  useEffect(() => {
    if (!socket) return;
    
    // Lắng nghe cập nhật realtime
    socket.on('new_order', (data) => {
      setStats(prev => ({
        ...prev,
        activeOrders: prev.activeOrders + 1
      }));
    });
    
    socket.on('order_completed', (data) => {
      setStats(prev => ({
        ...prev,
        activeOrders: prev.activeOrders - 1,
        revenue: prev.revenue + data.amount
      }));
    });
    
    socket.on('table_update', (data) => {
      // Cập nhật số bàn available
      fetchTableStats();
    });
    
    return () => {
      socket.off('new_order');
      socket.off('order_completed');
      socket.off('table_update');
    };
  }, [socket]);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard title="Đơn hàng đang xử lý" value={stats.activeOrders} />
      <StatCard title="Bàn trống" value={stats.availableTables} />
      <StatCard title="Doanh thu hôm nay" value={stats.revenue} />
    </div>
  );
}
```

### **2. Next.js Staff Interface:**

```javascript
// applications/client/components/Kitchen/OrderQueue.jsx
import { useSocketConnection } from '../../hooks/useSocketConnection';
import { useState, useEffect } from 'react';

export function OrderQueue() {
  const { socket } = useSocketConnection();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (!socket) return;
    
    // Lắng nghe đơn hàng mới
    socket.on('new_order', (orderData) => {
      setOrders(prev => [orderData.order, ...prev]);
      
      // Hiển thị notification
      showNotification({
        title: 'Đơn hàng mới!',
        message: `Bàn ${orderData.order.table.number} - ${orderData.order.orderItems.length} món`,
        sound: true
      });
    });
    
    // Lắng nghe cập nhật trạng thái
    socket.on('order_updated', (data) => {
      setOrders(prev => 
        prev.map(order => 
          order.id === data.orderId 
            ? { ...order, status: data.status }
            : order
        )
      );
    });
    
    return () => {
      socket.off('new_order');
      socket.off('order_updated');
    };
  }, [socket]);
  
  const handleStartCooking = (orderItemId) => {
    socket.emit('start_cooking', {
      orderItemId,
      timestamp: new Date()
    });
  };
  
  const handleCompleteItem = (orderItemId) => {
    socket.emit('complete_order_item', {
      orderItemId,
      timestamp: new Date()
    });
  };
  
  return (
    <div className="order-queue">
      {orders.map(order => (
        <OrderCard 
          key={order.id}
          order={order}
          onStartCooking={handleStartCooking}
          onCompleteItem={handleCompleteItem}
        />
      ))}
    </div>
  );
}
```

### **3. React Native Mobile App:**

```javascript
// applications/mobile/hooks/useSocketConnection.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export function useSocketConnection() {
  const [socket, setSocket] = useState(null);
  const { user, getToken } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const initSocket = async () => {
      const token = await getToken();
      
      const socketInstance = io('http://192.168.1.100:3001/customer', {
        auth: { token },
        transports: ['websocket']
      });
      
      socketInstance.on('connect', () => {
        console.log('Customer connected to socket');
      });
      
      setSocket(socketInstance);
    };
    
    initSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);
  
  return { socket };
}

// applications/mobile/components/OrderTracking.jsx
import { useSocketConnection } from '../hooks/useSocketConnection';
import { useState, useEffect } from 'react';
import { showPushNotification } from '../utils/notifications';

export function OrderTracking({ orderId }) {
  const { socket } = useSocketConnection();
  const [orderStatus, setOrderStatus] = useState('PENDING');
  const [estimatedTime, setEstimatedTime] = useState(25);
  
  useEffect(() => {
    if (!socket) return;
    
    // Lắng nghe cập nhật trạng thái đơn hàng
    socket.on('order_status_updated', (data) => {
      if (data.orderId === orderId) {
        setOrderStatus(data.status);
        setEstimatedTime(data.estimatedTime);
        
        // Hiển thị push notification
        showPushNotification({
          title: 'Cập nhật đơn hàng',
          body: data.message,
          sound: true
        });
      }
    });
    
    socket.on('order_ready', (data) => {
      if (data.orderId === orderId) {
        setOrderStatus('READY');
        
        showPushNotification({
          title: 'Đơn hàng sẵn sàng! 🍽️',
          body: data.message,
          sound: true,
          vibrate: true
        });
      }
    });
    
    return () => {
      socket.off('order_status_updated');
      socket.off('order_ready');
    };
  }, [socket, orderId]);
  
  return (
    <View style={styles.container}>
      <OrderStatusIndicator status={orderStatus} />
      <Text>Thời gian dự kiến: {estimatedTime} phút</Text>
    </View>
  );
}
```

---

## ⚡ **TỐI ỦU HÓA PERFORMANCE**

### **1. Connection Pooling:**

```javascript
// applications/server/config/socketConfig.js
export const socketConfig = {
  // Giới hạn connection per IP
  maxHttpBufferSize: 1e6, // 1MB
  pingTimeout: 60000,
  pingInterval: 25000,
  
  // Connection pooling
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  
  // Compression
  compression: true,
  perMessageDeflate: true
};
```

### **2. Room Management:**

```javascript
// Quản lý rooms hiệu quả
class RoomManager {
  static joinUserToRooms(socket, user) {
    // Essential rooms only
    socket.join(`user_${user.id}`);
    socket.join(`restaurant_${user.restaurantId}`);
    
    // Role-specific rooms
    if (user.role === 'staff') {
      socket.join(`staff_${user.restaurantId}`);
    }
  }
  
  static leaveAllRooms(socket) {
    const rooms = [...socket.rooms];
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  }
}
```

### **3. Event Throttling:**

```javascript
// Throttle frequent events
import { throttle } from 'lodash';

const throttledTableUpdate = throttle((tableData) => {
  io.to(`staff_${tableData.restaurantId}`).emit('table_status_updated', tableData);
}, 1000); // Tối đa 1 lần/giây
```

---

## 🔒 **BẢO MẬT VÀ AUTHENTICATION**

### **1. Token Validation:**

```javascript
// applications/server/middlewares/socketAuth.js
import jwt from 'jsonwebtoken';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function verifySocketAuth(token) {
  try {
    // Verify Clerk token
    const decoded = jwt.verify(token, process.env.CLERK_JWT_KEY);
    const user = await clerkClient.users.getUser(decoded.sub);
    
    // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { restaurant: true }
    });
    
    return {
      id: dbUser.id,
      clerkId: user.id,
      role: dbUser.role,
      restaurantId: dbUser.restaurantId
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### **2. Permission-based Events:**

```javascript
// Kiểm tra quyền trước khi emit events
socket.on('update_order_status', async (data) => {
    // Chỉ staff và admin mới được cập nhật
    if (!['staff', 'admin'].includes(socket.userRole)) {
        socket.emit('error', { message: 'Không có quyền thực hiện' });
        return;
    }

    // Chỉ được cập nhật order trong restaurant của mình
    const order = await prisma.order.findUnique({
        where: { id: data.orderId }
    });

    if (order.restaurantId !== socket.restaurantId) {
        socket.emit('error', { message: 'Không có quyền truy cập' });
        return;
    }

    // Proceed with update
    await orderServices.updateOrderStatus(data.orderId, data.status, socket.userId);
});
```

---

## 📊 **MONITORING VÀ DEBUGGING**

### **1. Connection Monitoring:**

```javascript
// applications/server/utils/socketMonitor.js
class SocketMonitor {
  static logConnection(socket) {
    console.log(`[${new Date().toISOString()}] User ${socket.userId} connected from ${socket.handshake.address}`);
    
    // Log to monitoring service
    this.sendToMonitoring({
      event: 'socket_connect',
      userId: socket.userId,
      userRole: socket.userRole,
      timestamp: new Date(),
      ip: socket.handshake.address
    });
  }
  
  static logEvent(socket, eventName, data) {
    console.log(`[${new Date().toISOString()}] ${eventName} from user ${socket.userId}`);
    
    // Log significant events
    if (['new_order', 'order_updated', 'payment_completed'].includes(eventName)) {
      this.sendToMonitoring({
        event: eventName,
        userId: socket.userId,
        data: data,
        timestamp: new Date()
      });
    }
  }
}
```

### **2. Error Handling:**

```javascript
// Global error handler cho Socket.IO
io.on('connection', (socket) => {
  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
    
    // Send user-friendly error
    socket.emit('error', {
      message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      code: 'SOCKET_ERROR'
    });
  });
  
  // Handle client disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.userId} disconnected: ${reason}`);
    SocketMonitor.logEvent(socket, 'disconnect', { reason });
  });
});
```

---

## 🎯 **KẾT LUẬN**

Socket.IO subscriptions trong hệ thống nhà hàng này cung cấp:

1. **⚡ Realtime Experience:** Cập nhật tức thì cho tất cả users
2. **🏗️ Scalable Architecture:** Namespace và room management hiệu quả  
3. **🔒 Secure Communication:** Authentication và authorization đầy đủ
4. **📊 Comprehensive Monitoring:** Logging và debugging tools
5. **🚀 Performance Optimized:** Connection pooling và event throttling

Hệ thống này đảm bảo trải nghiệm người dùng mượt mà và đồng bộ giữa tất cả các nền tảng trong dự án.
    