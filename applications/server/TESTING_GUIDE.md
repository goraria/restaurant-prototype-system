# 🧪 Testing Guide

## Testing with GraphQL Playground

Mở browser và vào: http://localhost:8080/graphql

### 1. Test User Query
```graphql
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
```

### 2. Test Conversations
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

Variables:
```json
{
  "userId": "user-123",
  "type": "customer_support"
}
```

### 3. Test Messages
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
  }
}
```

Variables:
```json
{
  "conversationId": "conv-123",
  "limit": "20",
  "offset": "0"
}
```

## Testing Socket.IO

### 1. HTML Test Client
Tạo file `test-socket.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Test</title>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
    <h1>Socket.IO Chat Test</h1>
    <div id="status">Disconnected</div>
    
    <div>
        <input type="text" id="messageInput" placeholder="Type message...">
        <button onclick="sendMessage()">Send</button>
    </div>
    
    <div id="messages"></div>

    <script>
        const socket = io('http://localhost:8080', {
            auth: {
                token: 'test-token-123'
            }
        });

        const statusDiv = document.getElementById('status');
        const messagesDiv = document.getElementById('messages');

        socket.on('connect', () => {
            statusDiv.innerHTML = '🟢 Connected';
            console.log('Connected to server');
            
            // Join a test conversation
            socket.emit('join_conversation', {
                conversation_id: 'test-conv-123'
            });
        });

        socket.on('disconnect', () => {
            statusDiv.innerHTML = '🔴 Disconnected';
            console.log('Disconnected from server');
        });

        socket.on('new_message', (data) => {
            const messageEl = document.createElement('div');
            messageEl.innerHTML = `
                <strong>${data.user.full_name}:</strong> 
                ${data.message.content}
                <small>(${new Date(data.message.created_at).toLocaleTimeString()})</small>
            `;
            messagesDiv.appendChild(messageEl);
        });

        socket.on('user_typing', (data) => {
            console.log('User typing:', data);
        });

        function sendMessage() {
            const input = document.getElementById('messageInput');
            if (input.value.trim()) {
                socket.emit('send_message', {
                    conversation_id: 'test-conv-123',
                    content: input.value,
                    message_type: 'text'
                });
                input.value = '';
            }
        }
    </script>
</body>
</html>
```

### 2. Node.js Test Client
```javascript
// test-socket.js
const io = require('socket.io-client');

const socket = io('http://localhost:8080', {
    auth: {
        token: 'test-token-456'
    }
});

socket.on('connect', () => {
    console.log('✅ Connected to server');
    
    // Join conversation
    socket.emit('join_conversation', {
        conversation_id: 'test-conv-123'
    });
    
    // Send test message
    setTimeout(() => {
        socket.emit('send_message', {
            conversation_id: 'test-conv-123',
            content: 'Hello from Node.js client!',
            message_type: 'text'
        });
    }, 1000);
});

socket.on('new_message', (data) => {
    console.log('📩 New message:', data);
});

socket.on('user_joined', (data) => {
    console.log('👋 User joined:', data);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
});
```

Chạy test:
```bash
node test-socket.js
```

## 📊 Performance Testing

### 1. Load Testing GraphQL với Artillery
```yaml
# artillery-graphql.yml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
  processor: "./graphql-processor.js"

scenarios:
  - name: "GraphQL Users Query"
    weight: 50
    engine: http
    requests:
      - post:
          url: "/graphql"
          headers:
            Content-Type: "application/json"
          json:
            query: "query { users { id username full_name } }"
  
  - name: "GraphQL Conversations Query"
    weight: 50
    engine: http
    requests:
      - post:
          url: "/graphql"
          headers:
            Content-Type: "application/json"
          json:
            query: "query GetConversations($userId: String!) { conversations(userId: $userId) { id type title } }"
            variables:
              userId: "user-123"
```

### 2. Socket.IO Load Testing
```javascript
// socket-load-test.js
const io = require('socket.io-client');

const CONCURRENT_CONNECTIONS = 100;
const MESSAGES_PER_CONNECTION = 10;

async function loadTest() {
    const clients = [];
    
    // Create concurrent connections
    for (let i = 0; i < CONCURRENT_CONNECTIONS; i++) {
        const socket = io('http://localhost:8080', {
            auth: { token: `test-token-${i}` }
        });
        
        socket.on('connect', () => {
            console.log(`Client ${i} connected`);
            
            // Send messages
            for (let j = 0; j < MESSAGES_PER_CONNECTION; j++) {
                setTimeout(() => {
                    socket.emit('send_message', {
                        conversation_id: 'load-test-conv',
                        content: `Message ${j} from client ${i}`,
                        message_type: 'text'
                    });
                }, j * 100);
            }
        });
        
        clients.push(socket);
    }
    
    // Cleanup after test
    setTimeout(() => {
        clients.forEach(socket => socket.close());
        console.log('Load test completed');
    }, 30000);
}

loadTest();
```

## 🔍 Debug & Monitor

### 1. Debug GraphQL Queries
```typescript
// Enable GraphQL debug in app/index.ts
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // GraphQL playground
    customFormatErrorFn: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            locations: error.locations,
            path: error.path,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
}));
```

### 2. Socket.IO Debug
```typescript
// Enable Socket.IO debug logs
import { createServer } from 'http';
import { Server } from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: process.env.EXPRESS_CLIENT_URL,
        credentials: true
    },
    // Enable debug
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

// Log all events
io.engine.on("connection_error", (err) => {
    console.log('❌ Socket connection error:', err.req);
    console.log('❌ Error code:', err.code);
    console.log('❌ Error message:', err.message);
    console.log('❌ Error context:', err.context);
});
```

### 3. Real-time Monitoring
```javascript
// monitor.js - Real-time server stats
const io = require('socket.io-client');

const socket = io('http://localhost:8080', {
    auth: { token: 'monitor-token' }
});

socket.on('connect', () => {
    console.log('📊 Monitor connected');
    
    setInterval(() => {
        // Request server stats
        socket.emit('get_server_stats');
    }, 5000);
});

socket.on('server_stats', (stats) => {
    console.log('📈 Server Stats:', {
        connectedClients: stats.connectedClients,
        activeRooms: stats.activeRooms,
        messagesPerMinute: stats.messagesPerMinute,
        memoryUsage: stats.memoryUsage
    });
});
```

## 🚀 Deployment Checklist

### 1. Environment Setup
- [ ] DATABASE_URL configured
- [ ] CLERK_SECRET_KEY configured  
- [ ] CORS origins updated
- [ ] SSL certificates installed

### 2. Security
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection headers

### 3. Performance
- [ ] Database indexing optimized
- [ ] GraphQL query depth limiting
- [ ] Socket.IO connection limits
- [ ] Memory leak monitoring

### 4. Monitoring
- [ ] Error logging setup
- [ ] Performance metrics
- [ ] Health check endpoints
- [ ] Uptime monitoring

Bây giờ bạn đã có:
✅ Server hoàn chình với Socket.IO + GraphQL
✅ Examples cho React, Vue, Next.js clients  
✅ Testing guides và tools
✅ Performance monitoring
✅ Production deployment guide

Server đang chạy tại: http://localhost:8080
GraphQL Playground: http://localhost:8080/graphql
Socket.IO Chat: ws://localhost:8080
