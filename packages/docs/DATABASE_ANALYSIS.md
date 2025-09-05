# 🍽️ PHÂN TÍCH CƠ SỞ DỮ LIỆU QUẢN LÝ NHÀ HÀNG ĐA NỀN TẢNG

## 📋 Tổng Quan Hệ Thống

Cơ sở dữ liệu được thiết kế cho ứng dụng quản lý nhà hàng đa nền tảng với:
- **Mobile App (Expo)**: Dành cho khách hàng đặt bàn, gọi món, thanh toán
- **Web Admin (Next.js)**: Quản lý toàn bộ hệ thống
- **Web Staff (Next.js)**: Giao diện cho nhân viên nhà hàng
- **Server (Express.js)**: API RESTful + GraphQL
- **Auth**: Clerk Authentication
- **Database**: Supabase (PostgreSQL)

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu

### 1. 👥 Quản Lý Người Dùng & Tổ Chức
```
organizations (Tổ chức/Công ty)
├── restaurant_chains (Chuỗi nhà hàng)
│   └── restaurants (Nhà hàng cụ thể)
│       ├── restaurant_staffs (Nhân viên)
│       ├── tables (Bàn ăn)
│       ├── menus (Thực đơn)
│       └── inventory_items (Kho nguyên liệu)
```

### 2. 🍽️ Quản Lý Menu & Món Ăn
```
menus
├── menu_items (Món ăn/đồ uống)
│   ├── recipes (Công thức nấu ăn)
│   │   └── recipe_ingredients (Nguyên liệu cần thiết)
│   ├── categories (Phân loại món ăn)
│   └── reviews (Đánh giá món ăn)
```

### 3. 🪑 Quản Lý Bàn & Đặt Bàn
```
tables (Bàn ăn)
├── reservations (Đặt bàn)
└── table_orders (Phiên gọi món tại bàn)
```

### 4. 🛒 Quản Lý Đơn Hàng
```
orders (Đơn hàng)
├── order_items (Chi tiết món trong đơn)
│   └── cooking_status (Trạng thái chế biến)
├── order_status_history (Lịch sử trạng thái)
├── payments (Thanh toán)
└── reviews (Đánh giá đơn hàng)
```

### 5. 🏪 Quản Lý Kho & Nguyên Liệu
```
inventory_items (Nguyên liệu)
├── inventory_transactions (Giao dịch nhập/xuất)
├── recipe_ingredients (Liên kết với công thức)
└── logistics_orders (Vận chuyển giữa các cửa hàng)
    └── logistics_order_items (Chi tiết vận chuyển)
```

### 6. 👨‍💼 Quản Lý Nhân Viên
```
restaurant_staffs (Nhân viên nhà hàng)
├── staff_schedules (Lịch làm việc)
└── staff_attendance (Chấm công)
```

### 7. 💰 Quản Lý Thanh Toán & Khuyến Mãi
```
payments (Thanh toán)
├── Hỗ trợ: Tiền mặt, Thẻ, Chuyển khoản
├── Ví điện tử: MoMo, ZaloPay, ViettelPay, VNPay, ShopeePay
vouchers (Mã giảm giá)
├── voucher_usages (Lịch sử sử dụng)
promotions (Khuyến mãi nhà hàng)
```

### 8. 📊 Thống Kê & Báo Cáo
```
revenue_reports (Báo cáo doanh thu)
├── Theo ngày/tuần/tháng/năm
├── Phân tích theo phương thức thanh toán
├── Top món ăn bán chạy
└── Phân tích theo giờ
```

## 🚀 Tính Năng Chính

### 📱 Mobile App (Khách Hàng)
- ✅ Đăng ký/Đăng nhập qua Clerk
- ✅ Xem menu theo nhà hàng
- ✅ Đặt bàn trực tuyến
- ✅ Quét QR code để gọi món tại bàn
- ✅ Thanh toán qua ví điện tử
- ✅ Đánh giá món ăn và dịch vụ
- ✅ Theo dõi lịch sử đơn hàng
- ✅ Nhận voucher và khuyến mãi

### 💻 Web Admin (Quản Lý)
- ✅ Dashboard tổng quan doanh thu
- ✅ Quản lý chuỗi nhà hàng
- ✅ Quản lý menu và giá cả
- ✅ Quản lý kho nguyên liệu
- ✅ Báo cáo thống kê chi tiết
- ✅ Quản lý nhân viên và lịch làm việc
- ✅ Thiết lập khuyến mãi
- ✅ Quản lý voucher

### 👨‍🍳 Web Staff (Nhân Viên)
- ✅ Nhận đơn hàng từ khách
- ✅ Cập nhật trạng thái chế biến món ăn
- ✅ Quản lý bàn ăn
- ✅ Xử lý thanh toán
- ✅ Chấm công
- ✅ Xem lịch làm việc

## 🔧 Tối Ưu Hóa Database

### 📈 Indexes Quan Trọng
```sql
-- Tìm kiếm nhanh đơn hàng theo trạng thái
idx_orders_status_created
idx_order_items_cooking_status

-- Tìm kiếm bàn theo trạng thái
idx_tables_status
idx_reservations_date_status

-- Thống kê doanh thu
idx_revenue_reports_restaurant_date
idx_payments_method_status

-- Quản lý nhân viên
idx_staff_schedules_restaurant_date
idx_staff_attendance_date
```

### 🚀 Constraints & Validations
```sql
-- Đảm bảo duy nhất
uq_restaurant_org_code (Mã nhà hàng trong tổ chức)
uq_restaurant_staff (Nhân viên không trùng nhà hàng)

-- Check constraints (cần setup migration)
quantity > 0 (Số lượng món ăn)
rating BETWEEN 1 AND 5 (Đánh giá từ 1-5 sao)
```

## 🔄 Flow Hoạt Động Chính

### 1. 🍽️ Đặt Bàn & Gọi Món
```
1. Khách đặt bàn qua app → reservations
2. Nhân viên xác nhận → cập nhật status
3. Khách đến nhà hàng → tạo table_orders
4. Quét QR để gọi món → order_items
5. Bếp nhận đơn → cập nhật cooking_status
6. Phục vụ món ăn → served_at timestamp
```

### 2. 💳 Thanh Toán
```
1. Khách chọn phương thức → payments
2. Xử lý qua gateway → transaction_id
3. Cập nhật trạng thái → payment_status
4. Tạo hóa đơn → orders.final_amount
5. Giải phóng bàn → tables.status = available
```

### 3. 📊 Thống Kê Tự Động
```
1. Trigger sau mỗi đơn hoàn thành
2. Cập nhật revenue_reports hàng ngày
3. Tính toán popular_items
4. Phân tích payment_methods_breakdown
```

## 🔐 Bảo Mật & Quyền Hạn

### Phân Quyền
- **Admin**: Toàn quyền trên organizations
- **Manager**: Quản lý restaurants cụ thể  
- **Staff**: Chỉ đọc/ghi trong phạm vi nhà hàng
- **Customer**: Chỉ đọc menu, tạo orders

### Bảo Mật Dữ Liệu
- ✅ Clerk Authentication
- ✅ JWT Sessions với rotation
- ✅ Soft delete cho dữ liệu quan trọng
- ✅ Audit trail qua status_history
- ✅ Rate limiting cho verification

## 📱 API Design

### RESTful Endpoints
```
GET /api/restaurants/:id/menu
POST /api/reservations
GET /api/orders/:id/status
PUT /api/orders/:id/cooking-status
POST /api/payments/process
GET /api/reports/revenue/:restaurant_id
```

### GraphQL Queries
```graphql
query RestaurantDetails($id: ID!) {
  restaurant(id: $id) {
    name
    tables {
      number
      status
      capacity
    }
    menu {
      categories {
        name
        items {
          name
          price
          available
        }
      }
    }
  }
}
```

## 🚀 Triển Khai & Scaling

### Horizontal Scaling
- 📊 Sharding theo restaurant_id
- 🗂️ Partition revenue_reports theo tháng
- 💾 Cache menu items (Redis)
- 📱 CDN cho product images

### Performance Optimization
- ⚡ Connection pooling
- 📈 Query optimization với EXPLAIN
- 🔄 Background jobs cho reports
- 📊 Real-time updates qua WebSocket

## 🎯 Next Steps

1. **Migration Scripts**: Tạo constraints & triggers
2. **Seed Data**: Data mẫu cho development
3. **API Documentation**: OpenAPI/Swagger specs
4. **Testing**: Unit tests cho business logic
5. **Monitoring**: Logs & metrics cho production

---

✨ **Kết Luận**: Database được thiết kế toàn diện, có thể mở rộng và tối ưu cho việc quản lý nhà hàng đa nền tảng với hiệu suất cao.
