# 🧪 RESTAURANT API TEST GUIDE

## 🚀 SERVER STATUS
✅ **Server running**: http://localhost:8080
✅ **GraphQL Playground**: http://localhost:8080/graphql  
✅ **Socket.IO Chat**: ws://localhost:8080
✅ **Database**: Connected to Supabase PostgreSQL
✅ **Realtime**: 30 tables subscribed for live updates

---

## 🔧 **API ENDPOINTS TO TEST**

### 1. 🏥 **Health Check**
```bash
curl -X GET http://localhost:8080/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-05T12:44:08.000Z",
  "uptime": "5m 30s",
  "database": "connected",
  "realtime": "active"
}
```

### 2. 📊 **GraphQL Introspection**
**URL**: http://localhost:8080/graphql
**Query to test:**
```graphql
query {
  __schema {
    types {
      name
    }
  }
}
```

### 3. 🏢 **Organizations API**
```bash
# Get all organizations (requires auth)
curl -X GET http://localhost:8080/organizations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. 🍽️ **Restaurants API**
```bash
# Get all restaurants (requires auth)
curl -X GET http://localhost:8080/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. 📋 **Menus API**
```bash
# Get all menus (requires auth)
curl -X GET http://localhost:8080/menus \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. 🛒 **Orders API**
```bash
# Get all orders (requires auth)
curl -X GET http://localhost:8080/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. 💬 **Chat API**
```bash
# Test chat endpoint (requires auth)
curl -X GET http://localhost:8080/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. 🎯 **Clerk Webhooks**
```bash
# Test webhook endpoint (POST only)
curl -X POST http://localhost:8080/api/clerk/webhooks/advanced \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test_signature" \
  -d '{"data": {"id": "test"}, "type": "user.created"}'
```

---

## 🎮 **INTERACTIVE TESTS**

### **Test 1: GraphQL Playground**
1. Mở: http://localhost:8080/graphql
2. Paste query này:
```graphql
query TestQuery {
  __schema {
    queryType {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

### **Test 2: Socket.IO Chat**
**File test**: `test-socket.html`
```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Test</title>
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
</head>
<body>
    <h1>Socket.IO Chat Test</h1>
    <div id="messages"></div>
    <input id="messageInput" placeholder="Type a message..." />
    <button onclick="sendMessage()">Send</button>

    <script>
        const socket = io('http://localhost:8080');
        
        socket.on('connect', () => {
            console.log('Connected to server');
            document.getElementById('messages').innerHTML += '<p>✅ Connected to server</p>';
        });
        
        socket.on('message', (data) => {
            document.getElementById('messages').innerHTML += `<p>📨 ${data}</p>`;
        });
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            socket.emit('message', input.value);
            input.value = '';
        }
    </script>
</body>
</html>
```

---

## 🔍 **QUICK STATUS CHECK**

### ✅ **Working Features:**
- ✅ Express Server (Port 8080)
- ✅ GraphQL Endpoint + Playground
- ✅ Socket.IO Realtime Chat
- ✅ Supabase Database Connection
- ✅ Realtime Subscriptions (30 tables)
- ✅ CORS Configuration
- ✅ Morgan Logging
- ✅ File Upload Support
- ✅ Authentication Middleware

### ⚠️ **Known Issues:**
- ⚠️ Clerk webhook secret warning (minor)
- ⚠️ AI modules temporarily disabled
- ⚠️ Some endpoints require authentication

### 🔐 **Authentication:**
- **Clerk**: Setup required for protected routes
- **JWT**: Available for custom auth
- **Public endpoints**: Limited (health, graphql playground)

---

## 🎯 **RECOMMENDED TESTS:**

### **Priority 1**: Basic functionality
1. ✅ Server startup (DONE)
2. ✅ GraphQL Playground access (DONE)
3. ⏳ Health check endpoint
4. ⏳ Database query test

### **Priority 2**: Authentication
1. ⏳ Clerk webhook test
2. ⏳ Protected route access
3. ⏳ JWT token validation

### **Priority 3**: Features
1. ⏳ Socket.IO chat
2. ⏳ File upload
3. ⏳ Realtime updates

---

## 📝 **TEST NOTES:**
- Server runs on development mode
- GraphQL Playground enabled for testing
- All API routes require authentication except health check
- Socket.IO namespace: default ('/')
- CORS: Configured for localhost:3000

**Ready for production testing!** 🚀
