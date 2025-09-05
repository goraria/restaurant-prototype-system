# Clerk Authentication Integration Guide

## Tổng quan

Dự án đã được chuyển đổi từ JWT authentication sang Clerk Authentication để cung cấp:

- ✅ **Xác thực an toàn** với Clerk
- ✅ **Webhook đồng bộ** user data từ Clerk về database
- ✅ **Real-time authentication** cho Socket.IO
- ✅ **TypeScript support** đầy đủ
- ✅ **Backward compatibility** với các API cũ

## Cài đặt và Cấu hình

### 1. Environment Variables

Thêm các biến môi trường sau vào file `.env`:

```env
# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Clerk Dashboard Setup

1. **Tạo Clerk Application:**
   - Đăng nhập vào [Clerk Dashboard](https://dashboard.clerk.com)
   - Tạo application mới
   - Copy Secret Key và Publishable Key

2. **Cấu hình Webhooks:**
   - Vào Settings > Webhooks
   - Thêm endpoint: `https://your-domain.com/api/clerk/webhooks`
   - Chọn events: `user.created`, `user.updated`, `user.deleted`
   - Copy Webhook Secret

### 3. Database Schema

User schema đã được cập nhật với field `clerk_id`:

```prisma
model users {
  id                String           @id @default(uuid()) @db.Uuid
  clerk_id          String?          @unique @db.VarChar(255) // Clerk Auth ID
  username          String           @unique @db.VarChar(50)
  email             String           @unique @db.VarChar(255)
  // ... other fields
}
```

Chạy migration:

```bash
yarn migrate
```

## API Changes

### Authentication Middleware

```typescript
// Trước (JWT)
import { verifyToken } from '@/middlewares/authMiddleware';
app.use('/api/protected', verifyToken, routes);

// Sau (Clerk)
import { requireAuthentication } from '@/middlewares/authMiddleware';
app.use('/api/protected', requireAuthentication, routes);
```

### Accessing User Data

```typescript
// Trong controllers
export const getProfile = async (req: Request, res: Response) => {
  // req.user chứa thông tin user từ database
  const userId = req.user.id;        // Database ID
  const clerkId = req.user.clerk_id; // Clerk ID
  const email = req.user.email;
  const role = req.user.role;
  
  // ... logic
};
```

## API Endpoints

### Clerk Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clerk/webhooks` | Webhook receiver (public) |
| GET | `/api/clerk/me` | Get current user info |
| PUT | `/api/clerk/users/:id` | Update user metadata |
| POST | `/api/clerk/sync/:clerk_id` | Manual user sync |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/profile` | Update user profile |
| GET | `/users/addresses` | Get user addresses |
| POST | `/users/addresses` | Add new address |
| PUT | `/users/addresses/:id` | Update address |
| DELETE | `/users/addresses/:id` | Delete address |
| GET | `/users/orders` | Get order history |
| GET | `/users/statistics` | Get user statistics |

## Socket.IO Authentication

Socket.IO đã được cập nhật để sử dụng Clerk session tokens:

```javascript
// Client-side connection
const socket = io('http://localhost:8080', {
  auth: {
    token: await getToken() // Clerk session token
  }
});
```

## Webhook Flow

1. **User signs up** on frontend (Clerk)
2. **Clerk sends webhook** to `/api/clerk/webhooks`
3. **Server creates user** in database with `clerk_id`
4. **User can access** protected routes

### Webhook Events Handled

- `user.created` → Tạo user mới trong database
- `user.updated` → Cập nhật thông tin user
- `user.deleted` → Đánh dấu user là inactive

## Frontend Integration

### Next.js với Clerk

```typescript
// pages/_app.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

// API calls với authentication
const apiCall = async () => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## Migration từ JWT

### 1. Existing Users

Để migrate users hiện có:

```sql
-- Thêm clerk_id field nếu chưa có
ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255) UNIQUE;

-- Users hiện có sẽ cần đăng ký lại với Clerk
-- Hoặc implement migration script để tạo Clerk users
```

### 2. Backward Compatibility

Middleware hỗ trợ cả JWT và Clerk tokens:

```typescript
// Middleware tự động detect token type
app.use('/api', requireAuthentication); // Works with both JWT & Clerk
```

## Testing

### 1. Webhook Testing

```bash
# Test webhook với ngrok
ngrok http 8080

# Cập nhật webhook URL trong Clerk Dashboard
# Test với Clerk Dashboard webhook tester
```

### 2. API Testing

```bash
# Get Clerk token từ frontend
const token = await getToken();

# Test API call
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/users/me
```

## Troubleshooting

### Common Issues

1. **Webhook 400 Error:**
   - Kiểm tra `CLERK_WEBHOOK_SECRET`
   - Verify endpoint URL trong Clerk Dashboard

2. **User not found:**
   - Đảm bảo webhook đã tạo user trong database
   - Check user có `clerk_id` mapping

3. **Socket.IO authentication fails:**
   - Verify token format
   - Check token không expired

### Debug Mode

```typescript
// Enable debug logging
process.env.DEBUG = 'clerk:*';
```

## Production Deployment

### 1. Environment Setup

```env
# Production values
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 2. Webhook URL

Cập nhật webhook URL trong Clerk Dashboard:
- Development: `https://your-ngrok-url.ngrok.io/api/clerk/webhooks`
- Production: `https://your-domain.com/api/clerk/webhooks`

### 3. CORS Configuration

```typescript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://your-admin-domain.com'
  ],
  credentials: true
}));
```

## Support

Nếu có vấn đề, check:

1. [Clerk Documentation](https://clerk.com/docs)
2. [Webhook Logs](https://dashboard.clerk.com/webhooks)
3. Server logs cho error details
