# Debug Guide: Vấn đề User bị xóa rồi lại được tạo lại

## Vấn đề
Sau khi xóa user từ Clerk, một lúc sau hệ thống lại đồng bộ user vừa xóa lên database.

## Nguyên nhân có thể
1. **Event order không đúng**: Clerk gửi `user.created` sau `user.deleted`
2. **Event retry**: Webhook failed nên Clerk retry event cũ
3. **Event duplicate**: Clerk gửi duplicate events
4. **Timestamp issues**: Event cũ được process muộn

## Giải pháp đã implement

### 1. Kiểm tra timestamp trong user.created
```typescript
// Bỏ qua events cũ hơn 5 phút
const eventCreatedAt = new Date(user.created_at);
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

if (eventCreatedAt < fiveMinutesAgo) {
  // Bỏ qua event cũ
}
```

### 2. Kiểm tra user đã tồn tại
```typescript
// Kiểm tra user active trước khi tạo
const { data: existingUser } = await supabase
  .from("users")
  .select("id, created_at, deleted_at")
  .eq("clerk_id", user.id)
  .single();

if (existingUser && !existingUser.deleted_at) {
  // Bỏ qua - user vẫn active
}
```

### 3. Enhanced logging
- Log chi tiết timestamp của events
- Log thông tin user được xóa
- Track duplicate events

## Debug Commands

### 1. Kiểm tra user cụ thể
```bash
curl "http://localhost:3000/api/clerk/debug?clerk_id=user_xxx"
```

### 2. Xem danh sách users gần đây
```bash
curl "http://localhost:3000/api/clerk/debug"
```

### 3. Force delete user (testing)
```bash
curl -X POST "http://localhost:3000/api/clerk/debug" \
  -H "Content-Type: application/json" \
  -d '{"action": "force_delete", "clerk_id": "user_xxx"}'
```

### 4. Kiểm tra user có tồn tại không
```bash
curl -X POST "http://localhost:3000/api/clerk/debug" \
  -H "Content-Type: application/json" \
  -d '{"action": "check_user", "clerk_id": "user_xxx"}'
```

## Monitoring

### Clerk Dashboard
1. Vào Clerk Dashboard
2. Chọn **Webhooks** 
3. Xem **Event Logs** để track:
   - Thứ tự events
   - Retry attempts
   - Response status

### Application Logs
Xem console logs để track:
```
🎉 User creation event received!
🗑️ User deletion event received!
⚠️ User đã tồn tại và vẫn active trong database
⏰ Event quá cũ (>5 phút), có thể là retry hoặc duplicate
```

## Recommended Solutions

### 1. Tạo Event Log Table (Khuyến nghị)
```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL,
  clerk_id VARCHAR NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_clerk_id ON webhook_events(clerk_id);
CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
```

### 2. Implement Idempotency
```typescript
// Check if event was already processed
const existingEvent = await supabase
  .from('webhook_events')
  .select('id')
  .eq('clerk_id', user.id)
  .eq('event_type', 'user.created')
  .gte('created_at', user.created_at)
  .single();

if (existingEvent) {
  return "Event already processed";
}
```

### 3. Use Soft Delete (Alternative)
Thay vì hard delete, có thể dùng soft delete:
```typescript
// Soft delete
await supabase
  .from('users')
  .update({ 
    deleted_at: new Date().toISOString(),
    status: 'deleted' 
  })
  .eq('clerk_id', user.id);
```

## Testing Scenarios

### Test 1: Normal Flow
1. Tạo user trong Clerk
2. Kiểm tra user được tạo trong DB
3. Xóa user trong Clerk
4. Kiểm tra user được xóa trong DB

### Test 2: Duplicate Events
1. Tạo user
2. Manually call webhook với same event
3. Verify không tạo duplicate

### Test 3: Event Order
1. Simulate user.deleted event
2. Simulate user.created event với old timestamp
3. Verify user không được tạo lại

## Production Checklist
- [ ] Enable webhook event logging
- [ ] Set up monitoring alerts
- [ ] Implement idempotency keys
- [ ] Consider rate limiting
- [ ] Add retry mechanism for failed operations
- [ ] Monitor Clerk webhook delivery status
