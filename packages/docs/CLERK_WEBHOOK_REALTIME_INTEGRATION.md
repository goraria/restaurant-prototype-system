# 🚀 Clerk Webhook + Supabase Realtime Integration

## 📋 Tổng Quan
Hệ thống tích hợp hoàn chỉnh giữa Clerk webhooks và Supabase realtime để đồng bộ hóa real-time cho Expo và NextJS clients.

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Clerk Events  │───▶│  Server Webhook │───▶│ Supabase        │
│                 │    │   Controller    │    │ Realtime        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Database        │    │ Socket.IO       │
                       │ Updates         │    │ Broadcast       │
                       └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                          ┌─────────────────────────┐
                                          │   Connected Clients     │
                                          │  ┌─────────┐ ┌─────────┐│
                                          │  │  Expo   │ │ NextJS  ││
                                          │  │  App    │ │  Web    ││
                                          │  └─────────┘ └─────────┘│
                                          └─────────────────────────┘
```

## 🔧 Server-Side Implementation

### 1. Webhook Controller (`controllers/webhookController.ts`)
- ✅ Xử lý tất cả Clerk webhook events
- ✅ Realtime broadcasting cho mọi event quan trọng
- ✅ Database synchronization với error handling

### 2. Realtime Configuration (`config/realtime.ts`)
- ✅ `publishRealtimeUpdate()` function
- ✅ Socket.IO integration
- ✅ Global broadcasting capability

### 3. Supported Events với Realtime Sync:

#### 👤 User Events
- **user.created**: Broadcast user registration
- **user.updated**: Broadcast profile updates với role changes
- **user.deleted**: Broadcast soft deletion events

#### 🏢 Organization Events
- **organization.created**: Broadcast new organization creation
- **organization.updated**: Broadcast organization info changes
- **organization.deleted**: Broadcast deletion requests

#### 👥 Membership Events
- **organizationMembership.created**: Broadcast role assignments
- **organizationMembership.updated**: Broadcast role changes
- **organizationMembership.deleted**: Broadcast member removals

## 📱 Client Integration

### Expo App Integration
```typescript
// hooks/useClerkWebhookSync.ts
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useClerkWebhookSync = (serverUrl: string) => {
  useEffect(() => {
    const socket = io(serverUrl);

    // Listen for user events
    socket.on('user.created', (data) => {
      console.log('New user registered:', data);
      // Update local state/cache
    });

    socket.on('user.updated', (data) => {
      console.log('User updated:', data);
      // Sync profile changes
      if (data.changes?.role) {
        // Handle role changes
        updateUserRole(data.user);
      }
    });

    socket.on('organization.created', (data) => {
      console.log('New organization:', data);
      // Refresh organization list
    });

    socket.on('membership.created', (data) => {
      console.log('New membership:', data);
      // Update user permissions
    });

    return () => socket.disconnect();
  }, [serverUrl]);
};
```

### NextJS Web Integration
```typescript
// hooks/useRealtimeSync.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useRealtimeSync = () => {
  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER_URL!);

    // Organization events
    socket.on('organization.updated', (data) => {
      // Update organization in global state
      updateOrganization(data.organization);
    });

    socket.on('membership.updated', (data) => {
      // Handle role changes
      if (data.newRole !== data.user.role) {
        refreshUserPermissions(data.user.id);
      }
    });

    return () => socket.disconnect();
  }, []);
};
```

## 🔧 Environment Setup

### Server Environment
```env
# Clerk Configuration
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxx
CLERK_SECRET_KEY=sk_xxxxx

# Supabase Configuration  
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx
```

### Client Environment (Expo)
```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### Client Environment (NextJS)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

## 🚀 Deployment Checklist

### Server-Side
- ✅ Webhook controller implemented với realtime sync
- ✅ Realtime configuration với publishRealtimeUpdate
- ✅ Socket.IO properly configured
- ✅ Error handling và logging
- ✅ Database synchronization working

### Client-Side
- 📋 Implement useClerkWebhookSync hook trong Expo
- 📋 Implement useRealtimeSync hook trong NextJS
- 📋 Handle permission updates on role changes
- 📋 Update local state khi nhận events
- 📋 Error handling cho connection issues

## 🔍 Testing

### Test Webhook Events
```bash
# Test user creation
curl -X POST http://localhost:3001/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: test" \
  -d '{"type": "user.created", "data": {...}}'
```

### Monitor Realtime Events
- Check server logs cho broadcast messages
- Monitor client console cho received events
- Verify database updates tương ứng với events

## 📈 Benefits

1. **Real-time Synchronization**: Mọi client updates ngay lập tức
2. **Multi-platform Support**: Works với cả Expo và NextJS
3. **Scalable Architecture**: Socket.IO handles nhiều concurrent connections
4. **Error Resilience**: Comprehensive error handling
5. **Event Tracking**: Full audit trail của mọi changes

## 🎯 Next Steps

1. Test integration với actual Clerk webhooks
2. Implement client-side hooks trong apps
3. Add monitoring và analytics
4. Setup production deployment
5. Add rate limiting cho webhook endpoints

---
*Tích hợp này đảm bảo ứng dụng restaurant management của bạn có real-time synchronization hoàn chỉnh giữa tất cả platforms!* 🍽️✨
