# Voucher Management System

## Tổng quan

Hệ thống quản lý voucher với các tính năng đầy đủ bao gồm:
- Tạo, sửa, xóa voucher
- Validation voucher khi áp dụng
- Theo dõi lịch sử sử dụng
- Hỗ trợ voucher theo nhà hàng hoặc toàn cục

## Cấu trúc Files

```
├── schemas/
│   └── voucherSchemas.ts     # Zod validation schemas
├── services/
│   └── voucherServices.ts    # Business logic
├── controllers/
│   └── voucherControllers.ts # HTTP request handlers
└── routes/
    └── voucherRoutes.ts      # API endpoints
```

## API Endpoints

### 1. Tạo voucher mới
```http
POST /api/vouchers
Content-Type: application/json

{
  "restaurant_id": "uuid", // optional, null for global voucher
  "code": "SAVE20",
  "name": "Giảm giá 20%",
  "description": "Voucher giảm giá 20% cho đơn hàng từ 100k",
  "discount_type": "percentage", // "percentage" | "fixed_amount"
  "discount_value": 20,
  "min_order_value": 100000,
  "max_discount": 50000,
  "usage_limit": 100,
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "is_active": true
}
```

### 2. Lấy danh sách voucher
```http
GET /api/vouchers?page=1&limit=10&is_active=true&restaurant_id=uuid&discount_type=percentage
```

### 3. Lấy voucher theo ID
```http
GET /api/vouchers/:id
```

### 4. Lấy voucher theo code
```http
GET /api/vouchers/code/:code
```

### 5. Cập nhật voucher
```http
PUT /api/vouchers/:id
Content-Type: application/json

{
  "name": "Tên mới",
  "discount_value": 25,
  "is_active": false
}
```

### 6. Xóa voucher (soft delete)
```http
DELETE /api/vouchers/:id
```

### 7. Xóa vĩnh viễn voucher
```http
DELETE /api/vouchers/:id/hard
```

### 8. Validate voucher trước khi áp dụng
```http
POST /api/vouchers/validate
Content-Type: application/json

{
  "code": "SAVE20",
  "user_id": "uuid",
  "order_value": 150000,
  "restaurant_id": "uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "voucher": { ... },
    "discount_amount": 30000,
    "final_amount": 120000,
    "error_message": null
  }
}
```

### 9. Sử dụng voucher
```http
POST /api/vouchers/use
Content-Type: application/json

{
  "voucher_id": "uuid",
  "user_id": "uuid",
  "order_id": "uuid" // optional
}
```

### 10. Lấy lịch sử sử dụng voucher
```http
GET /api/vouchers/:id/usage
```

### 11. Lấy voucher đang hoạt động cho nhà hàng
```http
GET /api/vouchers/restaurant/:restaurant_id/active
```

## Zod Schemas

### CreateVoucherSchema
Validation cho tạo voucher mới với các rule:
- `code`: bắt buộc, unique, max 50 ký tự
- `name`: bắt buộc, max 100 ký tự
- `discount_type`: "percentage" hoặc "fixed_amount"
- `discount_value`: số dương, nếu percentage thì <= 100
- `start_date` < `end_date`

### UpdateVoucherSchema
Validation cho cập nhật voucher (partial update)

### VoucherQuerySchema
Validation cho query parameters khi filter voucher

### ApplyVoucherSchema
Validation khi validate voucher cho đơn hàng

## Service Methods

### VoucherService.createVoucher(data)
- Kiểm tra code unique
- Validate restaurant_id (nếu có)
- Tạo voucher mới

### VoucherService.validateVoucher(data)
Kiểm tra voucher có thể áp dụng:
- Voucher tồn tại và active
- Trong thời gian hiệu lực
- Đúng nhà hàng (nếu có giới hạn)
- Đạt minimum order value
- Chưa vượt usage limit
- User chưa sử dụng voucher này

### VoucherService.useVoucher(voucher_id, user_id, order_id)
Ghi nhận việc sử dụng voucher:
- Tạo record trong voucher_usages
- Tăng used_count của voucher

## Error Handling

Tất cả API trả về cấu trúc response nhất quán:

```json
{
  "success": boolean,
  "message": string,
  "data": object, // chỉ có khi success = true
  "errors": array // chỉ có khi validation error
}
```

## Examples

### Tạo voucher giảm giá 15%
```bash
curl -X POST http://localhost:3000/api/vouchers \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME15",
    "name": "Chào mừng khách hàng mới",
    "description": "Giảm 15% cho đơn hàng đầu tiên",
    "discount_type": "percentage",
    "discount_value": 15,
    "min_order_value": 50000,
    "max_discount": 30000,
    "usage_limit": 500,
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-06-30T23:59:59Z"
  }'
```

### Kiểm tra voucher có thể dùng được không
```bash
curl -X POST http://localhost:3000/api/vouchers/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME15",
    "user_id": "user-uuid",
    "order_value": 100000,
    "restaurant_id": "restaurant-uuid"
  }'
```

### Áp dụng voucher vào đơn hàng
```bash
curl -X POST http://localhost:3000/api/vouchers/use \
  -H "Content-Type: application/json" \
  -d '{
    "voucher_id": "voucher-uuid",
    "user_id": "user-uuid",
    "order_id": "order-uuid"
  }'
```

## Database Schema

Voucher schema dựa trên Prisma schema có sẵn:

```prisma
model vouchers {
  id              String                     @id @default(uuid()) @db.Uuid
  restaurant_id   String?                    @db.Uuid // null = global voucher
  code            String                     @unique @db.VarChar(50)
  name            String                     @db.VarChar(100)
  description     String?                    @db.Text
  discount_type   voucher_discount_type_enum // percentage | fixed_amount
  discount_value  Decimal                    @db.Decimal(12, 2)
  min_order_value Decimal?                   @db.Decimal(12, 2)
  max_discount    Decimal?                   @db.Decimal(12, 2)
  usage_limit     Int?
  used_count      Int                        @default(0)
  start_date      DateTime                   @db.Timestamptz(6)
  end_date        DateTime                   @db.Timestamptz(6)
  is_active       Boolean                    @default(true)
  created_at      DateTime                   @default(now()) @db.Timestamptz(6)
  updated_at      DateTime                   @updatedAt @db.Timestamptz(6)
  
  restaurants     restaurants?               @relation(fields: [restaurant_id], references: [id])
  usages          voucher_usages[]
}

model voucher_usages {
  id         String   @id @default(uuid()) @db.Uuid
  voucher_id String   @db.Uuid
  user_id    String   @db.Uuid
  order_id   String?  @db.Uuid
  used_at    DateTime @default(now()) @db.Timestamptz(6)
  
  vouchers   vouchers @relation(fields: [voucher_id], references: [id])
  users      users    @relation(fields: [user_id], references: [id])
  orders     orders?  @relation(fields: [order_id], references: [id])
}
```

## Integration

Để sử dụng voucher routes trong ứng dụng, thêm vào main app file:

```typescript
import voucherRoutes from './routes/voucherRoutes';

app.use('/api/vouchers', voucherRoutes);
```
