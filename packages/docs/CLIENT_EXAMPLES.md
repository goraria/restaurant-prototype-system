# 🚀 Client Integration Examples

## 📱 React Client với GraphQL & Socket.IO

### 1. Install Dependencies
```bash
npm install @apollo/client graphql socket.io-client
# hoặc
yarn add @apollo/client graphql socket.io-client
```

### 2. Apollo Client Setup
```typescript
// apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Lấy token từ Clerk hoặc storage
  const token = localStorage.getItem('clerk-token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### 3. React App Setup
```typescript
// App.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo';
import ChatApp from './components/ChatApp';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <ChatApp />
      </div>
    </ApolloProvider>
  );
}

export default App;
```

### 4. GraphQL Queries
```typescript
// queries.ts
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      full_name
      avatar_url
      role
      status
    }
  }
`;

export const GET_CONVERSATIONS = gql`
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
`;

export const GET_MESSAGES = gql`
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
    }
  }
`;
```

### 5. Socket.IO Hook
```typescript
// hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

export const useSocket = (authToken: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!authToken) return;

    const socketInstance = io('http://localhost:8080', {
      auth: { token: authToken }
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to chat server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from chat server');
    });

    socketInstance.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    socketInstance.on('user_typing', (data) => {
      if (data.is_typing) {
        setTypingUsers(prev => [...prev, data.user.id]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.user.id));
      }
    });

    socketInstance.on('user_status_changed', (data) => {
      console.log('User status changed:', data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [authToken]);

  const sendMessage = (conversationId: string, content: string) => {
    socket?.emit('send_message', {
      conversation_id: conversationId,
      content,
      message_type: 'text'
    });
  };

  const joinConversation = (conversationId: string) => {
    socket?.emit('join_conversation', {
      conversation_id: conversationId
    });
  };

  const startTyping = (conversationId: string) => {
    socket?.emit('typing_start', {
      conversation_id: conversationId
    });
  };

  const stopTyping = (conversationId: string) => {
    socket?.emit('typing_stop', {
      conversation_id: conversationId
    });
  };

  return {
    socket,
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    joinConversation,
    startTyping,
    stopTyping
  };
};
```

### 6. Chat Component
```typescript
// components/ChatApp.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSocket } from '../hooks/useSocket';
import { GET_USERS, GET_CONVERSATIONS, GET_MESSAGES } from '../queries';

const ChatApp: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState('user-123'); // Lấy từ Clerk
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Lấy token từ Clerk
  const authToken = 'your-clerk-token-here';
  
  // Socket.IO hook
  const { isConnected, messages, sendMessage, joinConversation, startTyping, stopTyping } = useSocket(authToken);
  
  // GraphQL queries
  const { data: usersData } = useQuery(GET_USERS);
  const { data: conversationsData } = useQuery(GET_CONVERSATIONS, {
    variables: { userId: currentUserId }
  });
  const { data: messagesData } = useQuery(GET_MESSAGES, {
    variables: { 
      conversationId: selectedConversation,
      limit: "50",
      offset: "0"
    },
    skip: !selectedConversation
  });

  useEffect(() => {
    if (selectedConversation) {
      joinConversation(selectedConversation);
    }
  }, [selectedConversation, joinConversation]);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      sendMessage(selectedConversation, messageText);
      setMessageText('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (selectedConversation) {
      startTyping(selectedConversation);
      // Debounce stop typing
      setTimeout(() => stopTyping(selectedConversation), 1000);
    }
  };

  return (
    <div className="chat-app">
      <h1>Chat App 💬</h1>
      <div className="connection-status">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="chat-layout">
        {/* Conversations List */}
        <div className="conversations-list">
          <h3>Conversations</h3>
          {conversationsData?.conversations?.map((conv: any) => (
            <div
              key={conv.id}
              className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
              onClick={() => setSelectedConversation(conv.id)}
            >
              <h4>{conv.title || `Conversation ${conv.id.slice(0, 8)}`}</h4>
              <p>Type: {conv.type}</p>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="messages">
                {messagesData?.messages?.map((message: any) => (
                  <div key={message.id} className="message">
                    <strong>User {message.sender_id.slice(0, 8)}:</strong>
                    <p>{message.content}</p>
                    <small>{new Date(message.created_at).toLocaleTimeString()}</small>
                  </div>
                ))}
                {/* Realtime messages */}
                {messages.map((message: any) => (
                  <div key={message.id} className="message realtime">
                    <strong>User {message.sender_id.slice(0, 8)}:</strong>
                    <p>{message.content}</p>
                    <small>{new Date(message.created_at).toLocaleTimeString()}</small>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="users-list">
          <h3>Users</h3>
          {usersData?.users?.map((user: any) => (
            <div key={user.id} className="user-item">
              <img src={user.avatar_url || '/default-avatar.png'} alt={user.full_name} />
              <div>
                <h4>{user.full_name}</h4>
                <p>@{user.username}</p>
                <span className={`status ${user.status}`}>{user.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
```

### 7. CSS Styling
```css
/* styles.css */
.chat-app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.connection-status {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 20px;
}

.chat-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  height: 600px;
}

.conversations-list, .users-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
}

.conversation-item, .user-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.conversation-item:hover {
  background: #f0f0f0;
}

.conversation-item.active {
  background: #e3f2fd;
}

.chat-area {
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  border-bottom: 1px solid #eee;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
}

.message.realtime {
  background: #e8f5e8;
}

.message-input {
  padding: 15px;
  display: flex;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.message-input button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status.online {
  background: #4caf50;
  color: white;
}

.status.offline {
  background: #9e9e9e;
  color: white;
}

.no-conversation {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}
```

## 🌐 Vue 3 Client với GraphQL & Socket.IO

### 1. Install Dependencies
```bash
npm install @apollo/client graphql socket.io-client vue-apollo-composable
```

### 2. Apollo Setup
```typescript
// apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### 3. Vue Chat Composable
```typescript
// composables/useChat.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import io, { Socket } from 'socket.io-client';
import { GET_CONVERSATIONS, GET_MESSAGES } from '../queries';

export function useChat(userId: string, authToken: string) {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const messages = ref([]);
  const selectedConversation = ref<string | null>(null);

  // GraphQL queries
  const { result: conversationsResult } = useQuery(GET_CONVERSATIONS, {
    userId
  });

  const { result: messagesResult } = useQuery(GET_MESSAGES, {
    conversationId: selectedConversation,
    limit: "50",
    offset: "0"
  }, {
    enabled: () => !!selectedConversation.value
  });

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

  const sendMessage = (conversationId: string, content: string) => {
    socket.value?.emit('send_message', {
      conversation_id: conversationId,
      content,
      message_type: 'text'
    });
  };

  return {
    socket,
    isConnected,
    messages,
    selectedConversation,
    conversations: conversationsResult,
    messagesFromDb: messagesResult,
    sendMessage
  };
}
```

### 4. Vue Chat Component
```vue
<!-- ChatApp.vue -->
<template>
  <div class="chat-app">
    <h1>Vue Chat App 💬</h1>
    
    <div class="connection-status">
      Status: {{ isConnected ? '🟢 Connected' : '🔴 Disconnected' }}
    </div>

    <div class="chat-layout">
      <!-- Conversations -->
      <div class="conversations-list">
        <h3>Conversations</h3>
        <div 
          v-for="conv in conversations?.conversations" 
          :key="conv.id"
          class="conversation-item"
          :class="{ active: selectedConversation === conv.id }"
          @click="selectedConversation = conv.id"
        >
          <h4>{{ conv.title || `Conversation ${conv.id.slice(0, 8)}` }}</h4>
          <p>Type: {{ conv.type }}</p>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <div class="messages">
          <div 
            v-for="message in allMessages" 
            :key="message.id"
            class="message"
          >
            <strong>User {{ message.sender_id.slice(0, 8) }}:</strong>
            <p>{{ message.content }}</p>
            <small>{{ formatTime(message.created_at) }}</small>
          </div>
        </div>

        <div class="message-input">
          <input 
            v-model="messageText"
            @keyup.enter="handleSendMessage"
            placeholder="Type a message..."
          />
          <button @click="handleSendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChat } from '../composables/useChat';

const userId = 'user-123';
const authToken = 'your-clerk-token';
const messageText = ref('');

const { 
  isConnected, 
  messages, 
  selectedConversation, 
  conversations,
  messagesFromDb,
  sendMessage 
} = useChat(userId, authToken);

const allMessages = computed(() => {
  const dbMessages = messagesFromDb.value?.messages || [];
  return [...dbMessages, ...messages.value];
});

const handleSendMessage = () => {
  if (messageText.value.trim() && selectedConversation.value) {
    sendMessage(selectedConversation.value, messageText.value);
    messageText.value = '';
  }
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString();
};
</script>
```

## 📱 Next.js với GraphQL & Socket.IO

### 1. Setup Apollo Client (SSR-friendly)
```typescript
// lib/apollo.ts
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Add auth header logic here
    }
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
});
```

### 2. Chat Page
```typescript
// pages/chat.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSocket } from '../hooks/useSocket';
import { GET_CONVERSATIONS } from '../queries';

export default function ChatPage() {
  const [userId, setUserId] = useState('user-123');
  const { isConnected, sendMessage } = useSocket('auth-token');
  
  const { data, loading, error } = useQuery(GET_CONVERSATIONS, {
    variables: { userId }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Next.js Chat</h1>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {/* Chat UI */}
    </div>
  );
}
```

## 🧪 Testing GraphQL & Socket.IO

### 1. GraphQL Testing (với Jest)
```typescript
// __tests__/graphql.test.ts
import { apolloClient } from '../apollo';
import { GET_USERS } from '../queries';

describe('GraphQL Queries', () => {
  it('should fetch users successfully', async () => {
    const { data } = await apolloClient.query({
      query: GET_USERS
    });
    
    expect(data.users).toBeDefined();
    expect(Array.isArray(data.users)).toBe(true);
  });
});
```

### 2. Socket.IO Testing
```typescript
// __tests__/socket.test.ts
import io from 'socket.io-client';

describe('Socket.IO Connection', () => {
  let socket: any;

  beforeEach(() => {
    socket = io('http://localhost:8080', {
      auth: { token: 'test-token' }
    });
  });

  afterEach(() => {
    socket.close();
  });

  it('should connect successfully', (done) => {
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      done();
    });
  });

  it('should send and receive messages', (done) => {
    socket.emit('send_message', {
      conversation_id: 'test-conv',
      content: 'Hello test',
      message_type: 'text'
    });

    socket.on('new_message', (data: any) => {
      expect(data.message.content).toBe('Hello test');
      done();
    });
  });
});
```

## 🚀 Production Deployment

### 1. Environment Variables
```bash
# .env.production
EXPRESS_ENV=production
EXPRESS_PORT=8080
EXPRESS_CLIENT_URL=https://your-frontend.com
EXPRESS_MOBILE_URL=https://your-mobile-app.com
```

### 2. Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
```

### 3. Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name your-api-domain.com;

    location /graphql {
        proxy_pass http://localhost:8080/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
