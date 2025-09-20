# 🔐 Simple RLS Setup cho Users & Organizations

## 📋 Tổng quan

Hệ thống RLS (Row Level Security) đơn giản cho `users` và `organizations` tables, đồng bộ với Clerk authentication.

## 🚀 Cài đặt nhanh

### 1. Chạy SQL Policies
Copy nội dung file `supabase/rls-simple.sql` và paste vào Supabase SQL Editor, sau đó Execute.

### 2. Environment Variables
Đảm bảo có các variables trong `.env`:
```env
EXPRESS_SUPABASE_ANON_KEY=your_anon_key
EXPRESS_SUPABASE_SERVICE_ROLE_KEY=your_service_key
EXPRESS_SUPABASE_REALTIME=https://your-project.supabase.co
```

### 3. Test RLS
Server đã tích hợp routes tại `/rls/*`:

```bash
# Test public access
curl http://localhost:8080/rls/test/public

# Test authenticated access (cần Clerk JWT)
curl -H "Authorization: Bearer YOUR_CLERK_JWT" \
     http://localhost:8080/rls/test/profile

# Debug user context
curl -H "Authorization: Bearer YOUR_CLERK_JWT" \
     http://localhost:8080/rls/debug/context
```

## 🏗️ RLS Rules

### Users Table
- ✅ User chỉ xem/sửa profile của mình
- ✅ Admin xem/sửa tất cả users
- ✅ Cho phép tạo user mới (từ webhook)

### Organizations Table  
- ✅ Public có thể xem basic info các org active
- ✅ Members xem full details org của mình
- ✅ Admin xem tất cả orgs
- ✅ Authenticated users có thể tạo org mới

## 🧪 Testing Routes

| Route | Auth | Description |
|-------|------|-------------|
| `GET /rls/test/public` | ❌ | Test public access |
| `GET /rls/test/profile` | ✅ | Get user profile với RLS |
| `GET /rls/test/organizations` | ✅ | Get orgs (filtered by RLS) |
| `GET /rls/debug/context` | ✅ | Debug user context |
| `POST /rls/test/user` | ✅ | Tạo test user |
| `POST /rls/test/organization` | ✅ | Tạo test organization |

## 🔧 Sử dụng trong Code

```typescript
// Trong route handler
router.get('/my-route', requireSupabaseAuth, async (req, res) => {
  // req.supabase đã có context của user hiện tại
  const { data } = await req.supabase
    .from('users')
    .select('*'); // RLS tự động filter theo user
});
```

## 🛠️ Troubleshooting

### Lỗi thường gặp:
1. **User not found**: Chạy Clerk webhook để sync user vào database
2. **RLS block access**: Kiểm tra user role và permissions
3. **JWT invalid**: Đảm bảo Clerk token còn hạn và đúng format

### Debug commands:
```bash
# Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('users', 'organizations');

# List policies
SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('users', 'organizations');
```

## 📝 Next Steps

Khi cần thêm RLS cho tables khác:
1. Thêm policies vào `supabase/rls-simple.sql`
2. Update test routes trong `routes/rlsTestRoutes.ts`
3. Thêm middleware functions nếu cần

## 🔗 Files liên quan

- `supabase/rls-simple.sql` - SQL policies
- `routes/rlsTestRoutes.ts` - Test routes
- `middlewares/supabaseRLSMiddleware.ts` - RLS middleware
- `services/rlsManager.ts` - RLS service functions
