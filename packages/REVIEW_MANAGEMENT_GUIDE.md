# 🌟 Review Management System Documentation

## 📋 Tổng quan

Hệ thống quản lý đánh giá (Review Management System) cung cấp đầy đủ các tính năng để khách hàng đánh giá nhà hàng, món ăn, đơn hàng và cho phép nhà hàng phản hồi đánh giá.

## 🏗️ Kiến trúc hệ thống

### Thành phần chính:
- **Schemas**: Validation cho các loại đánh giá
- **Services**: Logic nghiệp vụ cho quản lý đánh giá
- **Controllers**: HTTP request/response handling
- **Routes**: API endpoints

## 📊 Database Schema

### Model `reviews`
```prisma
model reviews {
  id            String             @id @default(uuid())
  customer_id   String             @db.Uuid
  restaurant_id String?            @db.Uuid
  order_id      String?            @db.Uuid
  menu_item_id  String?            @db.Uuid
  rating        Int                // 1-5 stars
  title         String?
  content       String?
  photos        String[]           // Photo URLs
  status        review_status_enum @default(active)
  response      String?            // Restaurant response
  responded_at  DateTime?
  created_at    DateTime           @default(now())
  updated_at    DateTime           @default(now())
}
```

## 🔧 API Endpoints

### Tạo đánh giá

#### 1. Đánh giá nhà hàng
```http
POST /api/reviews/restaurant
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "order_id": "uuid", // optional
  "rating": 5,
  "title": "Nhà hàng tuyệt vời!",
  "content": "Phục vụ chu đáo, món ăn ngon...",
  "photos": ["url1", "url2"]
}
```

#### 2. Đánh giá món ăn
```http
POST /api/reviews/menu-item
Content-Type: application/json

{
  "menu_item_id": "uuid",
  "order_id": "uuid", // optional
  "rating": 4,
  "title": "Món ăn ngon",
  "content": "Vị rất đậm đà...",
  "photos": ["url1"]
}
```

#### 3. Đánh giá đơn hàng
```http
POST /api/reviews/order
Content-Type: application/json

{
  "order_id": "uuid",
  "rating": 5,
  "title": "Giao hàng nhanh",
  "content": "Đơn hàng được giao đúng giờ..."
}
```

### Lấy đánh giá

#### 1. Lấy danh sách đánh giá (có filter)
```http
GET /api/reviews?restaurant_id=uuid&rating=5&page=1&limit=20
```

**Query Parameters:**
- `restaurant_id`: ID nhà hàng
- `menu_item_id`: ID món ăn
- `customer_id`: ID khách hàng
- `order_id`: ID đơn hàng
- `rating`: Điểm đánh giá (1-5)
- `status`: Trạng thái (active, hidden, flagged, deleted)
- `has_photos`: Có ảnh hay không (true/false)
- `has_response`: Có phản hồi hay không (true/false)
- `sort_by`: Sắp xếp theo (created_at, rating, updated_at)
- `sort_order`: Thứ tự (asc, desc)
- `page`: Trang (default: 1)
- `limit`: Số lượng (default: 20, max: 100)
- `date_from`: Từ ngày
- `date_to`: Đến ngày

#### 2. Lấy đánh giá theo ID
```http
GET /api/reviews/:reviewId
```

#### 3. Lấy đánh giá của khách hàng
```http
GET /api/reviews/my-reviews?page=1&limit=10
```

#### 4. Lấy đánh giá nhà hàng
```http
GET /api/reviews/restaurant/:restaurantId?rating=5&page=1
```

#### 5. Lấy đánh giá món ăn
```http
GET /api/reviews/menu-item/:menuItemId?page=1
```

### Cập nhật đánh giá

#### 1. Cập nhật đánh giá
```http
PUT /api/reviews/:reviewId
Content-Type: application/json

{
  "rating": 4,
  "title": "Tiêu đề mới",
  "content": "Nội dung cập nhật...",
  "photos": ["url1", "url2"]
}
```

#### 2. Phản hồi đánh giá (Staff/Manager)
```http
POST /api/reviews/:reviewId/response
Content-Type: application/json

{
  "response": "Cảm ơn quý khách đã đánh giá. Chúng tôi sẽ cải thiện..."
}
```

### Xóa đánh giá

```http
DELETE /api/reviews/:reviewId
```

### Thống kê đánh giá

#### 1. Thống kê tổng quan
```http
GET /api/reviews/stats?period=30d&restaurant_id=uuid
```

**Query Parameters:**
- `period`: Khoảng thời gian (7d, 30d, 90d, 1y, all)
- `restaurant_id`: ID nhà hàng
- `menu_item_id`: ID món ăn
- `date_from`: Từ ngày
- `date_to`: Đến ngày

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_reviews": 150,
      "average_rating": 4.2,
      "reviews_with_photos": 45,
      "reviews_with_responses": 120,
      "response_rate": 80.0
    },
    "rating_distribution": [
      { "rating": 5, "count": 60, "percentage": 40.0 },
      { "rating": 4, "count": 45, "percentage": 30.0 },
      { "rating": 3, "count": 30, "percentage": 20.0 },
      { "rating": 2, "count": 10, "percentage": 6.7 },
      { "rating": 1, "count": 5, "percentage": 3.3 }
    ],
    "recent_reviews": [...],
    "period": {
      "start_date": "2024-07-01T00:00:00Z",
      "end_date": "2024-08-01T00:00:00Z",
      "period_type": "30d"
    }
  }
}
```

#### 2. Thống kê nhà hàng
```http
GET /api/reviews/restaurant/:restaurantId/stats?period=90d
```

#### 3. Thống kê món ăn
```http
GET /api/reviews/menu-item/:menuItemId/stats?period=30d
```

### Quản lý hàng loạt (Staff/Manager)

```http
POST /api/reviews/bulk-action
Content-Type: application/json

{
  "review_ids": ["uuid1", "uuid2", "uuid3"],
  "action": "hide", // hide, show, flag, unflag, delete
  "reason": "Nội dung không phù hợp"
}
```

## 🔐 Authentication & Authorization

### Quyền truy cập:
- **Customer**: Tạo, xem, sửa, xóa đánh giá của chính mình
- **Staff**: Phản hồi đánh giá của nhà hàng
- **Manager**: Quản lý tất cả đánh giá, thao tác hàng loạt
- **Admin**: Toàn quyền

### Middleware authentication:
```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}
```

## 📝 Validation Rules

### Đánh giá:
- `rating`: Bắt buộc, 1-5 sao
- `title`: Tối đa 255 ký tự
- `content`: Tối đa 2000 ký tự
- `photos`: Tối đa 10 ảnh

### Phản hồi:
- `response`: Bắt buộc, 1-1000 ký tự

### Queries:
- `page`: Tối thiểu 1
- `limit`: 1-100
- `rating`: 1-5

## 🏪 Business Logic

### Quy tắc tạo đánh giá:
1. **Đánh giá nhà hàng**: Yêu cầu đơn hàng hoàn thành (tuỳ chọn)
2. **Đánh giá món ăn**: Phải đã đặt món đó
3. **Đánh giá đơn hàng**: Đơn hàng phải hoàn thành
4. **Không được đánh giá trùng**: Một đơn/món chỉ đánh giá 1 lần

### Quy tắc phản hồi:
1. Chỉ staff của nhà hàng mới được phản hồi
2. Mỗi đánh giá chỉ phản hồi 1 lần
3. Tự động cập nhật `responded_at`

## 📊 Analytics Features

### Thống kê cung cấp:
- **Tổng số đánh giá**
- **Điểm trung bình**
- **Phân bố đánh giá theo sao**
- **Tỷ lệ phản hồi**
- **Đánh giá có ảnh**
- **Đánh giá gần đây**

### Bộ lọc thống kê:
- Theo thời gian (7d, 30d, 90d, 1y, all)
- Theo nhà hàng
- Theo món ăn
- Tùy chọn ngày cụ thể

## 🚀 Usage Examples

### 1. Khách hàng đánh giá sau khi ăn
```javascript
// Tạo đánh giá nhà hàng
const reviewData = {
  restaurant_id: "rest-123",
  order_id: "order-456",
  rating: 5,
  title: "Trải nghiệm tuyệt vời!",
  content: "Phục vụ tốt, món ăn ngon, không gian đẹp",
  photos: ["photo1.jpg", "photo2.jpg"]
};

const response = await fetch('/api/reviews/restaurant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reviewData)
});
```

### 2. Nhà hàng phản hồi đánh giá
```javascript
// Phản hồi đánh giá
const responseData = {
  response: "Cảm ơn quý khách! Chúng tôi rất vui khi được phục vụ bạn."
};

await fetch('/api/reviews/review-123/response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(responseData)
});
```

### 3. Xem thống kê đánh giá
```javascript
// Lấy thống kê 30 ngày gần đây
const stats = await fetch('/api/reviews/restaurant/rest-123/stats?period=30d');
```

## 🔄 Workflow

### Quy trình đánh giá:
1. **Khách hàng đặt món/hoàn thành đơn hàng**
2. **Tạo đánh giá** (nhà hàng/món ăn/đơn hàng)
3. **Nhà hàng nhận thông báo**
4. **Staff phản hồi đánh giá**
5. **Khách hàng nhận thông báo phản hồi**

### Quy trình kiểm duyệt:
1. **Đánh giá được tạo** (status: active)
2. **Manager kiểm tra nội dung**
3. **Ẩn/Gắn cờ nếu vi phạm**
4. **Khách hàng có thể khiếu nại**

## 🎯 Best Practices

### Cho developers:
1. **Luôn validate input** với Zod schemas
2. **Xử lý errors gracefully**
3. **Sử dụng pagination** cho danh sách dài
4. **Cache thống kê** cho performance
5. **Log tất cả actions** cho audit trail

### Cho business:
1. **Phản hồi nhanh** các đánh giá negative
2. **Cảm ơn** đánh giá positive
3. **Theo dõi trends** qua analytics
4. **Cải thiện** dựa trên feedback
5. **Khuyến khích** khách hàng đánh giá

## 🐛 Error Handling

### Common errors:
- `400`: Dữ liệu không hợp lệ
- `401`: Chưa đăng nhập
- `403`: Không có quyền
- `404`: Không tìm thấy
- `409`: Đã đánh giá rồi

### Error response format:
```json
{
  "success": false,
  "message": "Mô tả lỗi bằng tiếng Việt"
}
```

## 📈 Performance Tips

1. **Index database** trên các trường thường query
2. **Pagination** thay vì load tất cả
3. **Cache** thống kê cho truy vấn nhanh
4. **Optimize images** trước khi upload
5. **Rate limiting** để tránh spam

---

Hệ thống Review Management cung cấp đầy đủ tính năng để quản lý đánh giá hiệu quả, tăng tương tác với khách hàng và cải thiện chất lượng dịch vụ nhà hàng.
