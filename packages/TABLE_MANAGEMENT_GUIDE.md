# 🪑 TABLE MANAGEMENT SYSTEM - HƯỚNG DẪN SỬ DỤNG

## 📋 **Tổng Quan**

Hệ thống Table Management cung cấp đầy đủ các chức năng quản lý bàn ăn, đặt bàn và phiên phục vụ trong nhà hàng. Hệ thống được thiết kế riêng biệt với Order Management để đảm bảo tính độc lập và dễ bảo trì.

## 🏗️ **Kiến Trúc Hệ Thống**

### **1. Thành Phần Chính**
- **📂 schemas/tableSchemas.ts**: Validation schemas với Zod
- **⚙️ services/tableServices.ts**: Business logic và database operations
- **🎮 controllers/tableControllers.ts**: HTTP request/response handling
- **🛣️ routes/tableRoutes.ts**: API endpoint definitions

### **2. Ba Module Chính**
- **🪑 Tables**: Quản lý bàn ăn (vị trí, sức chứa, trạng thái)
- **📅 Reservations**: Hệ thống đặt bàn trước
- **🍽️ Table Orders**: Phiên phục vụ tại bàn

---

## 🪑 **MODULE TABLES**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  restaurant_id: string (UUID)
  table_number: number
  capacity: number
  location?: string
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'out_of_order'
  qr_code?: string
  created_at: Date
  updated_at: Date
}
```

### **API Endpoints**

#### **🔹 Tạo Bàn Mới**
```http
POST /api/tables
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "table_number": 5,
  "capacity": 4,
  "location": "Tầng 1 - Cửa sổ",
  "status": "available"
}
```

#### **🔹 Lấy Danh Sách Bàn**
```http
GET /api/tables?restaurant_id=uuid&status=available&page=1&limit=10
```

**Query Parameters:**
- `restaurant_id`: ID nhà hàng
- `status`: Trạng thái bàn
- `location`: Vị trí bàn (tìm kiếm partial)
- `min_capacity`, `max_capacity`: Khoảng sức chứa
- `page`, `limit`: Phân trang
- `sort_by`, `sort_order`: Sắp xếp

#### **🔹 Kiểm Tra Bàn Trống**
```http
POST /api/tables/check-availability
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "party_size": 4,
  "reservation_date": "2024-01-15T19:00:00Z",
  "duration_hours": 2
}
```

#### **🔹 Cập Nhật Trạng Thái Nhiều Bàn**
```http
PATCH /api/tables/status
Content-Type: application/json

{
  "table_ids": ["uuid1", "uuid2", "uuid3"],
  "status": "maintenance"
}
```

#### **🔹 Cập Nhật Bàn**
```http
PUT /api/tables/:id
Content-Type: application/json

{
  "capacity": 6,
  "location": "Tầng 2 - VIP",
  "status": "available"
}
```

---

## 📅 **MODULE RESERVATIONS**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  table_id: string (UUID)
  customer_id?: string (UUID)
  customer_name: string
  customer_phone: string
  customer_email?: string
  party_size: number
  reservation_date: Date
  duration_hours: number
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  created_at: Date
  updated_at: Date
}
```

### **API Endpoints**

#### **🔹 Tạo Đặt Bàn**
```http
POST /api/reservations
Content-Type: application/json

{
  "table_id": "uuid",
  "customer_name": "Nguyễn Văn A",
  "customer_phone": "0901234567",
  "customer_email": "customer@email.com",
  "party_size": 4,
  "reservation_date": "2024-01-15T19:00:00Z",
  "duration_hours": 2,
  "notes": "Sinh nhật"
}
```

#### **🔹 Lấy Danh Sách Đặt Bàn**
```http
GET /api/reservations?status=confirmed&date_from=2024-01-15&date_to=2024-01-16
```

**Query Parameters:**
- `table_id`: ID bàn
- `customer_id`: ID khách hàng
- `customer_phone`: Số điện thoại (tìm kiếm partial)
- `status`: Trạng thái đặt bàn
- `date_from`, `date_to`: Khoảng thời gian
- `party_size_min`, `party_size_max`: Khoảng số người

#### **🔹 Xác Nhận Đặt Bàn**
```http
POST /api/reservations/confirm
Content-Type: application/json

{
  "reservation_id": "uuid",
  "notes": "Đã xác nhận qua điện thoại"
}
```

#### **🔹 Check-in Khách Hàng**
```http
POST /api/reservations/check-in
Content-Type: application/json

{
  "reservation_id": "uuid",
  "table_id": "uuid",
  "party_size": 4,
  "staff_id": "uuid"
}
```

---

## 🍽️ **MODULE TABLE ORDERS**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  table_id: string (UUID)
  session_code: string
  staff_id?: string (UUID)
  order_id?: string (UUID)
  status: 'active' | 'completed' | 'cancelled'
  opened_at: Date
  closed_at?: Date
  total_amount?: number
}
```

### **API Endpoints**

#### **🔹 Tạo Phiên Bàn**
```http
POST /api/table-orders
Content-Type: application/json

{
  "table_id": "uuid",
  "staff_id": "uuid",
  "session_code": "ABC123"
}
```

#### **🔹 Lấy Danh Sách Phiên Bàn**
```http
GET /api/table-orders?status=active&table_id=uuid
```

#### **🔹 Cập Nhật Phiên Bàn**
```http
PUT /api/table-orders/:id
Content-Type: application/json

{
  "status": "completed",
  "total_amount": 500000
}
```

---

## 📊 **MODULE STATISTICS**

### **🔹 Thống Kê Bàn**
```http
GET /api/stats/tables?restaurant_id=uuid&date_from=2024-01-01&date_to=2024-01-31
```

**Response:**
```json
{
  "total_tables": 20,
  "available_tables": 15,
  "occupied_tables": 3,
  "maintenance_tables": 2,
  "total_reservations": 150,
  "confirmed_reservations": 140,
  "reservation_rate": 93.33,
  "avg_order_value": 450000
}
```

### **🔹 Thống Kê Đặt Bàn**
```http
GET /api/stats/reservations?restaurant_id=uuid&date_from=2024-01-01&date_to=2024-01-31
```

**Response:**
```json
{
  "total_reservations": 150,
  "pending_reservations": 10,
  "confirmed_reservations": 120,
  "completed_reservations": 100,
  "cancelled_reservations": 15,
  "no_show_reservations": 5,
  "success_rate": 66.67,
  "cancellation_rate": 10.0,
  "no_show_rate": 3.33
}
```

---

## 🔧 **TÍNH NĂNG ĐỘC ĐÁO**

### **1. Smart Availability Check**
- Tự động tìm bàn phù hợp với sức chứa
- Buffer time 2 giờ để tránh trùng lặp
- Ưu tiên bàn vừa đủ (không quá lớn)

### **2. Session Management**
- Tự động tạo mã phiên duy nhất
- Kết nối với hệ thống đơn hàng
- Tự động cập nhật trạng thái bàn

### **3. Comprehensive Validation**
- Kiểm tra UUID format
- Validate capacity vs party size
- Conflict detection cho reservations
- Business rule validation

### **4. Advanced Filtering**
- Multiple field filtering
- Date range queries
- Partial text search
- Pagination với sort options

---

## 🚀 **CÁCH SỬ DỤNG TRONG DỰ ÁN**

### **1. Import Routes**
```typescript
// app.ts hoặc main router file
import tableRoutes from './routes/tableRoutes';

app.use('/api', tableRoutes);
```

### **2. Sử Dụng Services Trực Tiếp**
```typescript
import * as tableServices from './services/tableServices';

// Kiểm tra bàn trống
const availableTables = await tableServices.checkTableAvailability({
  restaurant_id: 'uuid',
  party_size: 4,
  reservation_date: new Date('2024-01-15T19:00:00Z'),
  duration_hours: 2
});

// Tạo đặt bàn
const reservation = await tableServices.createReservation({
  table_id: availableTables[0].id,
  customer_name: 'Nguyễn Văn A',
  customer_phone: '0901234567',
  party_size: 4,
  reservation_date: new Date('2024-01-15T19:00:00Z')
});
```

### **3. Frontend Integration Examples**

#### **React Component - Table Availability**
```jsx
const checkAvailability = async () => {
  const response = await fetch('/api/tables/check-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurant_id: selectedRestaurant,
      party_size: partySize,
      reservation_date: selectedDate,
      duration_hours: 2
    })
  });
  
  const data = await response.json();
  setAvailableTables(data.data);
};
```

#### **React Component - Reservation Management**
```jsx
const createReservation = async (formData) => {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (response.ok) {
    toast.success('Đặt bàn thành công!');
    refreshReservations();
  }
};
```

---

## 🎯 **WORKFLOW ĐIỂN HÌNH**

### **1. Quy Trình Đặt Bàn Online**
```
1. Khách hàng chọn nhà hàng & thời gian
2. Hệ thống check availability
3. Khách hàng chọn bàn & điền thông tin
4. Tạo reservation với status 'pending'
5. Nhà hàng xác nhận → status 'confirmed'
6. Khách đến → check-in → status 'seated'
7. Hoàn thành → status 'completed'
```

### **2. Quy Trình Walk-in**
```
1. Khách đến nhà hàng
2. Staff kiểm tra bàn trống
3. Check-in trực tiếp (không cần reservation)
4. Tạo table order session
5. Phục vụ & order đồ ăn
6. Thanh toán & đóng session
```

### **3. Quy Trình Quản Lý Bàn**
```
1. Staff update trạng thái bàn realtime
2. Monitor reservations sắp tới
3. Prepare bàn trước giờ khách đến
4. Handle walk-in requests
5. Clean up sau khi khách ra về
6. Update availability cho reservations tiếp theo
```

---

## ✅ **VALIDATION RULES**

### **Tables**
- `table_number`: Unique trong mỗi restaurant
- `capacity`: Minimum 1, maximum 20
- `status`: Phải thuộc enum values
- `restaurant_id`: Phải tồn tại trong database

### **Reservations**
- `party_size`: Không được vượt quá capacity của bàn
- `reservation_date`: Không được là thời gian quá khứ
- `customer_phone`: Format số điện thoại Việt Nam
- Không được trùng thời gian với reservation khác

### **Table Orders**
- `table_id`: Bàn phải có status 'available' khi tạo
- `session_code`: Unique và tự động generate
- `staff_id`: Phải tồn tại và có role phù hợp

---

## 🛡️ **BẢO MẬT & PHÂN QUYỀN**

### **Roles & Permissions**
- **👑 Admin**: Full access tất cả operations
- **🏪 Restaurant Manager**: Quản lý bàn của restaurant riêng
- **👨‍🍳 Staff**: CRUD reservations, table orders
- **👤 Customer**: Chỉ đọc own reservations

### **Data Protection**
- Validate tất cả input với Zod schemas
- UUID validation để tránh injection
- Rate limiting cho public endpoints
- Input sanitization

---

## 📝 **NOTES & BEST PRACTICES**

### **1. Performance**
- Sử dụng database indexes cho frequent queries
- Implement caching cho table availability
- Batch operations cho bulk updates

### **2. Error Handling**
- Tất cả errors đều có Vietnamese messages
- Consistent error response format
- Proper HTTP status codes

### **3. Business Logic**
- Buffer time 2 giờ giữa các reservations
- Auto-cleanup expired reservations
- Smart table suggestion algorithm

### **4. Integration**
- Tách biệt hoàn toàn với Order Management
- Ready để integrate với Payment system
- Notification system hooks

---

## 🔗 **LIÊN KẾT VỚI HỆ THỐNG KHÁC**

### **Menu System**
- Table orders có thể link với orders từ menu
- QR code scanning để access menu

### **User Management**
- Customer accounts cho repeat reservations
- Staff assignment và tracking

### **Notification System**
- SMS/Email confirmations
- Reminder notifications
- Real-time updates

---

## 🎉 **KẾT LUẬN**

Hệ thống Table Management đã được thiết kế hoàn chỉnh với:

✅ **3 Module chính**: Tables, Reservations, Table Orders  
✅ **Full CRUD operations** cho tất cả entities  
✅ **Advanced filtering & pagination**  
✅ **Smart business logic** (availability check, conflict detection)  
✅ **Comprehensive statistics**  
✅ **Vietnamese error messages**  
✅ **Type-safe với TypeScript & Zod**  
✅ **Consistent API design**  
✅ **Ready for production**  

Hệ thống có thể được sử dụng độc lập hoặc tích hợp với các module khác trong restaurant management system.
