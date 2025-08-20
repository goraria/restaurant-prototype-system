# 📚 DATABASE SCHEMA DOCUMENTATION
## Chi tiết từng bảng và chức năng trong hệ thống Restaurant Management

---

## 🏢 **ORGANIZATION & USER MANAGEMENT**

### 📍 `addresses`
**Chức năng**: Lưu trữ địa chỉ giao hàng của khách hàng
- **Mục đích**: Hỗ trợ delivery orders với nhiều địa chỉ cho mỗi customer
- **Quan hệ**: Liên kết với `users` và `orders`
- **Tính năng đặc biệt**: `is_default` để đánh dấu địa chỉ mặc định
- **Use case**: Khách hàng có thể lưu nhiều địa chỉ (nhà, công ty, bạn bè)

### 🏷️ `categories`
**Chức năng**: Phân loại menu items theo category tree
- **Mục đích**: Tổ chức thực đơn theo danh mục phân cấp (Món chính > Hải sản > Tôm)
- **Quan hệ**: Self-referencing với `parent_id`, liên kết với `menu_items`
- **Tính năng đặc biệt**: Hỗ trợ hierarchy với parent-child relationships
- **Use case**: Phân loại món ăn, dễ dàng filter và search

---

## 💬 **REAL-TIME COMMUNICATION**

### 💬 `conversations`
**Chức năng**: Quản lý cuộc trò chuyện giữa customer và staff
- **Mục đích**: Hỗ trợ khách hàng real-time, xử lý khiếu nại, feedback
- **Quan hệ**: Liên kết với `restaurants`, `users` (customer & staff), `messages`
- **Types**: support, feedback, complaint, inquiry
- **Use case**: Chat support, báo cáo vấn đề, góp ý cải thiện

### 📩 `messages`
**Chức năng**: Lưu trữ tin nhắn trong conversations
- **Mục đích**: Chi tiết nội dung chat, attachments, tracking read status
- **Quan hệ**: Thuộc về `conversations`, gửi bởi `users`
- **Types**: text, image, file, system (automated messages)
- **Use case**: Lịch sử chat, đính kèm hình ảnh, file

---

## 🏢 **ORGANIZATION HIERARCHY**

### 🏢 `organizations`
**Chức năng**: Tổ chức cấp cao nhất (công ty)
- **Mục đích**: Multi-tenant system, mỗi công ty có thể có nhiều chains
- **Quan hệ**: Owned by `users`, có nhiều `restaurant_chains` và `restaurants`
- **Tính năng đặc biệt**: `code` unique để phân biệt organizations
- **Use case**: Công ty A có chuỗi FastFood và chuỗi Coffee

### 🔗 `restaurant_chains`
**Chức năng**: Chuỗi nhà hàng trong organization
- **Mục đích**: Nhóm các restaurants cùng thương hiệu
- **Quan hệ**: Thuộc về `organizations`, có nhiều `restaurants`
- **Use case**: McDonald's Vietnam có nhiều chi nhánh

### 🏪 `restaurants`
**Chức năng**: Chi nhánh nhà hàng cụ thể
- **Mục đích**: Đơn vị hoạt động chính, nơi customers đặt bàn/món
- **Quan hệ**: Hub center - liên kết với tất cả tables, menus, staff, orders
- **Tính năng đặc biệt**: `opening_hours` JSON, `status` enum
- **Use case**: KFC Nguyễn Huệ, McDonald's Quận 1

---

## 🍽️ **MENU MANAGEMENT**

### 📋 `menus`
**Chức năng**: Thực đơn của từng restaurant
- **Mục đích**: Mỗi restaurant có thể có nhiều menus (breakfast, lunch, dinner)
- **Quan hệ**: Thuộc về `restaurants`, chứa nhiều `menu_items`
- **Use case**: Menu buổi sáng, Menu đặc biệt cuối tuần

### 🍕 `menu_items`
**Chức năng**: Món ăn/đồ uống cụ thể
- **Mục đích**: Sản phẩm chính customers order
- **Quan hệ**: Thuộc về `menus` và `categories`, có `recipes`, được order trong `order_items`
- **Tính năng đặc biệt**: `allergens`, `dietary_info` arrays, `preparation_time`
- **Use case**: Pizza Margherita, Coca Cola, Phở Bò

---

## 🪑 **TABLE & RESERVATION MANAGEMENT**

### 🪑 `tables`
**Chức năng**: Bàn ăn trong restaurant
- **Mục đích**: Quản lý capacity, QR code ordering, reservation
- **Quan hệ**: Thuộc về `restaurants`, có `reservations` và `table_orders`
- **Tính năng đặc biệt**: `qr_code` unique cho contactless ordering
- **Use case**: Bàn 01 (4 chỗ), Bàn VIP (8 chỗ)

### 📅 `reservations`
**Chức năng**: Đặt bàn trước
- **Mục đích**: Customers book tables for specific time
- **Quan hệ**: Book specific `tables`, made by `users`
- **Tính năng đặc biệt**: `duration_hours`, `party_size`, multiple status tracking
- **Use case**: Đặt bàn 2 người lúc 7PM thứ 7

### 📱 `table_orders`
**Chức năng**: Session ordering tại bàn
- **Mục đích**: QR code ordering, multiple people can order to same table
- **Quan hệ**: Link `tables` with `orders`, managed by `staff`
- **Tính năng đặc biệt**: `session_code` để multiple devices cùng order
- **Use case**: Scan QR → Order → Staff serve to table

---

## 🛒 **ORDER MANAGEMENT**

### 🛒 `orders`
**Chức năng**: Đơn hàng của customers
- **Mục đích**: Core business transaction
- **Quan hệ**: From `customers`, to `restaurants`, contains `order_items`
- **Types**: dine_in, takeaway, delivery
- **Tính năng đặc biệt**: Multiple pricing fields, `payment_status` tracking
- **Use case**: Đơn delivery 2 pizza + 1 cola = 450k

### 🍽️ `order_items`
**Chức năng**: Chi tiết món trong order
- **Mục đích**: Specific items với quantity, special instructions
- **Quan hệ**: Thuộc về `orders`, reference `menu_items`
- **Tính năng đặc biệt**: `cooking_status` để track kitchen progress
- **Use case**: 2x Pizza Margherita, không hành tây

### 📈 `order_status_history`
**Chức năng**: Lịch sử thay đổi trạng thái order
- **Mục đích**: Audit trail, tracking workflow
- **Quan hệ**: Track changes in `orders`, changed by `users`
- **Use case**: Pending → Confirmed → Preparing → Ready → Served

---

## 💳 **PAYMENT MANAGEMENT**

### 💳 `payments`
**Chức năng**: Giao dịch thanh toán
- **Mục đích**: Process payments cho orders
- **Quan hệ**: Pay for specific `orders`
- **Methods**: cash, card, momo, zalopay, vnpay, etc.
- **Tính năng đặc biệt**: `gateway_response` JSON, `transaction_id`
- **Use case**: Thanh toán 450k qua MoMo

---

## 👨‍💼 **STAFF MANAGEMENT**

### 👥 `restaurant_staffs`
**Chức năng**: Nhân viên làm việc tại restaurant
- **Mục đích**: Link `users` với `restaurants` theo roles
- **Roles**: manager, chef, waiter, cashier, etc.
- **Tính năng đặc biệt**: `hourly_rate`, `joined_at`, `left_at`
- **Use case**: John là chef tại KFC Nguyen Hue

### 📅 `staff_schedules`
**Chức năng**: Lịch làm việc của staff
- **Mục đích**: Quản lý ca làm việc
- **Quan hệ**: Schedule for `staff` at `restaurants`
- **Shifts**: morning, afternoon, evening, night, full_day
- **Use case**: John làm ca sáng 8AM-2PM thứ 2

### ⏰ `staff_attendance`
**Chức năng**: Chấm công thực tế
- **Mục đích**: Track actual work hours vs scheduled
- **Quan hệ**: Actual attendance for `staff_schedules`
- **Tính năng đặc biệt**: `check_in_time`, `overtime_hours`, `break_duration`
- **Use case**: John check-in 8:05AM (late 5 mins)

---

## 🏪 **INVENTORY MANAGEMENT**

### 📦 `inventory_items`
**Chức năng**: Nguyên liệu và vật tư trong kho
- **Mục đích**: Quản lý stock, cost control, expiry tracking
- **Quan hệ**: Belongs to `restaurants`, used in `recipes`
- **Tính năng đặc biệt**: `min_quantity` alerts, `expiry_date`
- **Use case**: 50kg thịt bò, hết hạn 15/08/2025

### 📊 `inventory_transactions`
**Chức năng**: Lịch sử nhập/xuất kho
- **Mục đích**: Track movement của inventory_items
- **Types**: purchase, usage, adjustment, waste, return
- **Use case**: Nhập 100kg gạo, xuất 10kg làm cơm

### 👨‍🍳 `recipes`
**Chức năng**: Công thức chế biến món ăn
- **Mục đích**: Standardize cooking, cost calculation
- **Quan hệ**: For specific `menu_items`, contains `recipe_ingredients`
- **Use case**: Công thức Pizza Margherita

### 🥬 `recipe_ingredients`
**Chức năng**: Nguyên liệu cần cho từng recipe
- **Mục đích**: Link `recipes` với `inventory_items`
- **Tính năng đặc biệt**: Specific `quantity` và `unit`
- **Use case**: Pizza cần 200g bột mì, 100g cheese

---

## 🎟️ **PROMOTIONS & VOUCHERS**

### 🎫 `vouchers`
**Chức năng**: Mã giảm giá
- **Mục đích**: Customer retention, marketing campaigns
- **Types**: percentage, fixed_amount
- **Tính năng đặc biệt**: `usage_limit`, `min_order_value`, date range
- **Use case**: SUMMER20 giảm 20%, tối đa 50k

### 📝 `voucher_usages`
**Chức năng**: Lịch sử sử dụng voucher
- **Mục đích**: Prevent duplicate usage, tracking
- **Quan hệ**: Track `vouchers` used by `users` in `orders`
- **Use case**: User ABC đã dùng SUMMER20 lúc 3PM

### 🎉 `promotions`
**Chức năng**: Khuyến mãi tự động
- **Mục đích**: Auto-apply discounts based on conditions
- **Types**: buy_one_get_one, combo_deal, happy_hour
- **Tính năng đặc biệt**: `conditions` JSON, `applicable_items`
- **Use case**: Mua 2 pizza tặng 1 cola

---

## ⭐ **REVIEWS & RATINGS**

### ⭐ `reviews`
**Chức năng**: Đánh giá và review
- **Mục đích**: Customer feedback, service quality improvement
- **Quan hệ**: `customers` review `restaurants`, `orders`, `menu_items`
- **Tính năng đặc biệt**: 1-5 star rating, photos, restaurant response
- **Use case**: 5 sao, "Pizza ngon, service tốt"

---

## 📊 **ANALYTICS & REPORTING**

### 📈 `revenue_reports`
**Chức năng**: Báo cáo doanh thu
- **Mục đích**: Business intelligence, performance tracking
- **Types**: daily, weekly, monthly, yearly
- **Tính năng đặc biệt**: JSON breakdowns by hour, payment method, order type
- **Use case**: Doanh thu tháng 7: 100M, 1500 orders

---

## 👤 **USER MANAGEMENT**

### 👤 `users`
**Chức năng**: Tất cả users trong system
- **Roles**: customer, staff, manager, admin, super_admin
- **Tính năng đặc biệt**: Clerk integration, customer statistics
- **Use case**: Customers order food, Staff serve, Admins manage

### 📊 `user_statistics`
**Chức năng**: Thống kê hoạt động user
- **Mục đích**: Customer behavior analysis, loyalty tracking
- **Metrics**: total_orders, successful_reservations, loyalty_points
- **Use case**: VIP customer with 50 orders, 1000 loyalty points

---

## 📋 **ENUMS REFERENCE**

### Status Enums
- `user_status_enum`: active, inactive, suspended, banned
- `restaurant_status_enum`: active, inactive, maintenance, closed
- `order_status_enum`: pending → confirmed → preparing → ready → served → completed
- `payment_status_enum`: pending → processing → completed/failed

### Role Enums  
- `user_role_enum`: customer, staff, manager, admin, super_admin
- `restaurant_staff_role_enum`: chef, waiter, cashier, manager, etc.

### Business Enums
- `order_type_enum`: dine_in, takeaway, delivery
- `payment_method_enum`: cash, card, momo, zalopay, vnpay
- `voucher_discount_type_enum`: percentage, fixed_amount

---

## 🎯 **OPTIMIZATIONS APPLIED**

### ❌ **Removed (Non-Restaurant Features)**
- `sessions` - Clerk handles authentication
- `last_login_at` - Clerk provides this data
- Social media features (follows, likes, comments)
- E-commerce features (cart_items - using session storage instead)

### ✅ **Kept (Core Restaurant Features)**
- Real-time chat for customer support
- User statistics for reservation/order tracking
- Complete restaurant management workflow
- Multi-tenant organization structure

### 🚀 **Result**
- **Focus**: 100% restaurant management
- **Performance**: Optimized for restaurant workflows
- **Maintainability**: Clean, purpose-built schema
- **Scalability**: Multi-tenant ready with proper indexing
