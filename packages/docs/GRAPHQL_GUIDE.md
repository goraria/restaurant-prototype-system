# 📡 GraphQL & Socket.IO Chat Guide

## 🚀 Tổng quan

Server hiện tại đã được tích hợp đầy đủ:
- **GraphQL**: Cho việc fetch data hiệu quả
- **Socket.IO**: Cho realtime chat giữa người với người
- **REST API**: Vẫn giữ nguyên cho backward compatibility

## 📡 GraphQL Endpoints

### Base URL
```
http://localhost:8080/graphql
```

### GraphQL Playground (Development)
Truy cập: `http://localhost:8080/graphql` trong browser để sử dụng GraphQL Playground

## 🔍 GraphQL Queries

### 1. Get All Users
```graphql
query GetUsers {
  users {
    id
    username
    email
    full_name
    avatar_url
    role
    status
    created_at
    updated_at
  }
}
```

### 2. Get User by ID
```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    username
    email
    full_name
    avatar_url
    role
    status
    created_at
    updated_at
  }
}
```

**Variables:**
```json
{
  "id": "user-id-here"
}
```

### 3. Get Conversations for User
```graphql
query GetConversations($userId: String!, $type: String) {
  conversations(userId: $userId, type: $type) {
    id
    restaurant_id
    customer_id
    staff_id
    type
    title
    status
    created_at
    updated_at
  }
}
```

**Variables:**
```json
{
  "userId": "user-id-here",
  "type": "customer_support"
}
```

### 4. Get Messages in Conversation
```graphql
query GetMessages($conversationId: String!, $limit: String, $offset: String) {
  messages(conversationId: $conversationId, limit: $limit, offset: $offset) {
    id
    conversation_id
    sender_id
    content
    message_type
    media_url
    is_read
    created_at
    updated_at
  }
}
```

**Variables:**
```json
{
  "conversationId": "conversation-id-here",
  "limit": "50",
  "offset": "0"
}
```

## 💬 Socket.IO Realtime Chat

### Connection URL
```
ws://localhost:8080
```

### Client Connection Example (JavaScript)
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: {
    token: 'your-auth-token-here'
  }
});

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to chat server');
});
```

### 📤 Client Events (Gửi từ Client lên Server)

#### 1. Join Conversation
```javascript
socket.emit('join_conversation', {
  conversation_id: 'conversation-id-here'
});
```

#### 2. Send Message
```javascript
socket.emit('send_message', {
  conversation_id: 'conversation-id-here',
  content: 'Hello world!',
  message_type: 'text'
});
```

#### 3. Mark Messages as Read
```javascript
socket.emit('mark_messages_read', {
  conversation_id: 'conversation-id-here',
  message_ids: ['msg-id-1', 'msg-id-2']
});
```

#### 4. Typing Indicators
```javascript
// Start typing
socket.emit('typing_start', {
  conversation_id: 'conversation-id-here'
});

// Stop typing
socket.emit('typing_stop', {
  conversation_id: 'conversation-id-here'
});
```

#### 5. User Status
```javascript
// User online
socket.emit('user_online', 'user-id-here');

// User offline
socket.emit('user_offline', 'user-id-here');
```

### 📥 Server Events (Nhận từ Server về Client)

#### 1. New Message Received
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
  // data = { conversation_id, message }
});
```

#### 2. User Joined/Left Conversation
```javascript
socket.on('user_joined_conversation', (data) => {
  console.log('User joined:', data);
});

socket.on('user_left_conversation', (data) => {
  console.log('User left:', data);
});
```

#### 3. Typing Indicators
```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  // data = { conversation_id, user, is_typing }
});
```

#### 4. Messages Marked as Read
```javascript
socket.on('messages_marked_read', (data) => {
  console.log('Messages read:', data);
  // data = { conversation_id, message_ids, read_by }
});
```

#### 5. User Status Changes
```javascript
socket.on('user_status_changed', (data) => {
  console.log('User status:', data);
  // data = { userId, status, timestamp }
});
```

#### 6. General Notifications
```javascript
socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

## 🛠️ Client Integration Examples

### React + Apollo Client (GraphQL)
```javascript
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${authToken}`,
  },
});

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      full_name
      avatar_url
    }
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          {user.full_name} (@{user.username})
        </li>
      ))}
    </ul>
  );
}
```

### React + Socket.IO Hook
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function useSocket(authToken) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socketInstance = io('http://localhost:8080', {
      auth: { token: authToken }
    });

    socketInstance.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    setSocket(socketInstance);

    return () => socketInstance.close();
  }, [authToken]);

  const sendMessage = (conversationId, content) => {
    socket?.emit('send_message', {
      conversation_id: conversationId,
      content,
      message_type: 'text'
    });
  };

  return { socket, messages, sendMessage };
}
```

### Vue 3 + Socket.IO Composable
```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

export function useChat(authToken) {
  const socket = ref(null);
  const messages = ref([]);
  const isConnected = ref(false);

  onMounted(() => {
    socket.value = io('http://localhost:8080', {
      auth: { token: authToken }
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
    });

    socket.value.on('new_message', (data) => {
      messages.value.push(data.message);
    });
  });

  onUnmounted(() => {
    socket.value?.close();
  });

  const sendMessage = (conversationId, content) => {
    socket.value?.emit('send_message', {
      conversation_id: conversationId,
      content,
      message_type: 'text'
    });
  };

  return {
    socket,
    messages,
    isConnected,
    sendMessage
  };
}
```

## 🔐 Authentication

Cả GraphQL và Socket.IO đều sử dụng Clerk authentication:

### GraphQL
Thêm header Authorization:
```javascript
headers: {
  'Authorization': `Bearer ${clerkToken}`
}
```

### Socket.IO
Truyền token qua auth:
```javascript
const socket = io('http://localhost:8080', {
  auth: {
    token: clerkToken
  }
});
```

## 🎯 Best Practices

1. **GraphQL cho Data Fetching**: Sử dụng GraphQL để fetch data, tận dụng việc chỉ lấy fields cần thiết
2. **Socket.IO cho Realtime**: Sử dụng Socket.IO cho tất cả realtime features (chat, notifications, typing indicators)
3. **Error Handling**: Luôn handle errors từ cả GraphQL và Socket.IO
4. **Connection Management**: Đảm bảo đóng socket connections khi component unmount
5. **Authentication**: Luôn truyền auth token cho cả GraphQL và Socket.IO

## 🚀 Next Steps

1. Implement cache strategies cho GraphQL
2. Add subscriptions cho GraphQL realtime updates
3. Implement file upload qua GraphQL
4. Add rate limiting cho Socket.IO events
5. Implement room-based permissions cho chat
