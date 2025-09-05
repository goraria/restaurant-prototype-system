# Chat API Documentation

## Overview
Hệ thống chat real-time sử dụng REST API và Socket.IO để cung cấp tính năng chat giữa khách hàng và nhân viên nhà hàng.

## REST API Endpoints

### Conversations

#### 1. Tạo conversation mới
```http
POST /chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurant_id": "uuid-optional",
  "customer_id": "uuid-optional", 
  "staff_id": "uuid-optional",
  "type": "support|feedback|complaint|inquiry",
  "title": "string-optional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "restaurant_id": "uuid",
    "customer_id": "uuid",
    "staff_id": "uuid",
    "type": "support",
    "status": "active",
    "title": "string",
    "last_message_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "customer": {
      "id": "uuid",
      "full_name": "string",
      "avatar_url": "string"
    },
    "staff": {
      "id": "uuid", 
      "full_name": "string",
      "avatar_url": "string"
    },
    "unread_count": 0
  },
  "message": "Conversation created successfully"
}
```

#### 2. Lấy danh sách conversations
```http
GET /chat/conversations?restaurant_id=uuid&customer_id=uuid&staff_id=uuid&status=active&type=support&page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "restaurant_id": "uuid",
      "customer_id": "uuid", 
      "staff_id": "uuid",
      "type": "support",
      "status": "active",
      "title": "string",
      "last_message_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "customer": {
        "id": "uuid",
        "full_name": "string", 
        "avatar_url": "string"
      },
      "staff": {
        "id": "uuid",
        "full_name": "string",
        "avatar_url": "string"
      },
      "unread_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

#### 3. Lấy conversation theo ID
```http
GET /chat/conversations/:id
Authorization: Bearer <token>
```

#### 4. Cập nhật conversation
```http
PUT /chat/conversations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active|resolved|closed",
  "title": "string",
  "staff_id": "uuid"
}
```

#### 5. Xóa conversation
```http
DELETE /chat/conversations/:id
Authorization: Bearer <token>
```

#### 6. Gán nhân viên cho conversation
```http
POST /chat/conversations/:id/assign-staff
Authorization: Bearer <token>
Content-Type: application/json

{
  "staff_id": "uuid"
}
```

#### 7. Đóng conversation
```http
POST /chat/conversations/:id/close
Authorization: Bearer <token>
```

#### 8. Giải quyết conversation
```http
POST /chat/conversations/:id/resolve
Authorization: Bearer <token>
```

### Messages

#### 1. Gửi tin nhắn
```http
POST /chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversation_id": "uuid",
  "content": "string",
  "message_type": "text|image|file|system",
  "attachments": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "conversation_id": "uuid",
    "sender_id": "uuid",
    "content": "string",
    "message_type": "text",
    "attachments": ["url1", "url2"],
    "is_read": false,
    "created_at": "2024-01-01T00:00:00Z",
    "sender": {
      "id": "uuid",
      "full_name": "string",
      "avatar_url": "string",
      "role": "customer|staff|manager|admin|super_admin"
    }
  },
  "message": "Message sent successfully"
}
```

#### 2. Lấy tin nhắn theo conversation
```http
GET /chat/conversations/:conversation_id/messages?page=1&limit=50
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "uuid",
      "content": "string",
      "message_type": "text",
      "attachments": ["url1", "url2"],
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z",
      "sender": {
        "id": "uuid",
        "full_name": "string",
        "avatar_url": "string",
        "role": "customer|staff|manager|admin|super_admin"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "total_pages": 2
  }
}
```

#### 3. Lấy tin nhắn theo ID
```http
GET /chat/messages/:id
Authorization: Bearer <token>
```

#### 4. Cập nhật tin nhắn
```http
PUT /chat/messages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "string",
  "is_read": true
}
```

#### 5. Xóa tin nhắn
```http
DELETE /chat/messages/:id
Authorization: Bearer <token>
```

#### 6. Đánh dấu tin nhắn đã đọc
```http
POST /chat/messages/mark-read
Authorization: Bearer <token>
Content-Type: application/json

{
  "message_ids": ["uuid1", "uuid2"]
}
```

### Unread Count

#### 1. Số tin nhắn chưa đọc theo conversation
```http
GET /chat/conversations/:conversation_id/unread-count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unread_count": 5
  }
}
```

#### 2. Số tin nhắn chưa đọc của user
```http
GET /chat/unread-count
Authorization: Bearer <token>
```

## Socket.IO Events

### Connection
```javascript
// Kết nối với authentication
const socket = io('http://localhost:8080', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events (Emit)

#### 1. Join conversation
```javascript
socket.emit('join_conversation', {
  conversation_id: 'uuid'
});
```

#### 2. Leave conversation
```javascript
socket.emit('leave_conversation', {
  conversation_id: 'uuid'
});
```

#### 3. Send message
```javascript
socket.emit('send_message', {
  conversation_id: 'uuid',
  content: 'Hello world!',
  message_type: 'text',
  attachments: ['url1', 'url2']
});
```

#### 4. Mark messages as read
```javascript
socket.emit('mark_messages_read', {
  conversation_id: 'uuid',
  message_ids: ['uuid1', 'uuid2']
});
```

#### 5. Typing indicator
```javascript
// Bắt đầu gõ
socket.emit('typing_start', {
  conversation_id: 'uuid'
});

// Dừng gõ
socket.emit('typing_stop', {
  conversation_id: 'uuid'
});
```

### Server Events (Listen)

#### 1. Conversation joined
```javascript
socket.on('conversation_joined', (data) => {
  console.log('Joined conversation:', data.conversation);
});
```

#### 2. User joined conversation
```javascript
socket.on('user_joined_conversation', (data) => {
  console.log('User joined:', data.user);
});
```

#### 3. User left conversation
```javascript
socket.on('user_left_conversation', (data) => {
  console.log('User left:', data.user);
});
```

#### 4. New message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
});
```

#### 5. Message sent confirmation
```javascript
socket.on('message_sent', (data) => {
  console.log('Message sent:', data.message_id);
});
```

#### 6. Messages marked as read
```javascript
socket.on('messages_marked_read', (data) => {
  console.log('Messages read:', data.message_ids);
});
```

#### 7. User typing
```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data.user, data.is_typing);
});
```

#### 8. Error
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
});
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Invalid data | Dữ liệu đầu vào không hợp lệ |
| 401 | User not authenticated | Người dùng chưa đăng nhập |
| 403 | Access denied | Không có quyền truy cập |
| 404 | Conversation not found | Không tìm thấy conversation |
| 500 | Internal server error | Lỗi server |

## Authentication

Tất cả API endpoints và Socket.IO connections đều yêu cầu Clerk token:

```javascript
// REST API
headers: {
  'Authorization': 'Bearer your-clerk-token'
}

// Socket.IO
const socket = io('http://localhost:8080', {
  auth: {
    token: 'your-clerk-token'
  }
});
```

## Permissions

### Customer
- Tạo conversation với nhà hàng
- Gửi tin nhắn trong conversation của mình
- Xem tin nhắn trong conversation của mình

### Staff
- Xem tất cả conversations của nhà hàng
- Gửi tin nhắn trong bất kỳ conversation nào
- Đánh dấu tin nhắn đã đọc
- Đóng/resolve conversations

### Manager/Admin
- Tất cả quyền của Staff
- Gán nhân viên cho conversations
- Xóa conversations và messages

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  customer_id UUID REFERENCES users(id),
  staff_id UUID REFERENCES users(id),
  type conversation_type_enum DEFAULT 'support',
  status conversation_status_enum DEFAULT 'active',
  title VARCHAR(255),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  attachments TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Example Usage

### Frontend React Component
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatComponent = ({ conversationId, token }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      auth: { token }
    });

    newSocket.emit('join_conversation', { conversation_id: conversationId });

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [conversationId, token]);

  const sendMessage = (content) => {
    socket.emit('send_message', {
      conversation_id: conversationId,
      content,
      message_type: 'text'
    });
  };

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
};
```

### Backend Service Integration
```javascript
import { chatService } from './services/chatService';
import { socketService } from './services/socketService';

// Tạo conversation mới
const conversation = await chatService.createConversation({
  restaurant_id: 'restaurant-uuid',
  customer_id: 'customer-uuid',
  type: 'support'
});

// Gửi thông báo real-time
socketService.sendToUser('customer-uuid', 'new_conversation', {
  conversation
});
```
