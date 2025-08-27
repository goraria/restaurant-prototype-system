# 🏪 INVENTORY MANAGEMENT SYSTEM - HƯỚNG DẪN SỬ DỤNG

## 📋 **Tổng Quan**

Hệ thống Inventory Management cung cấp giải pháp toàn diện cho việc quản lý kho nguyên liệu, theo dõi giao dịch nhập/xuất, quản lý công thức món ăn và phân tích tồn kho trong nhà hàng.

## 🏗️ **Kiến Trúc Hệ Thống**

### **1. Thành Phần Chính**
- **📂 schemas/inventorySchemas.ts**: Validation schemas với Zod
- **⚙️ services/inventoryServices.ts**: Business logic và database operations  
- **🎮 controllers/inventoryControllers.ts**: HTTP request/response handling
- **🛣️ routes/inventoryRoutes.ts**: API endpoint definitions

### **2. Bốn Module Chính**
- **🏪 Inventory Items**: Quản lý nguyên liệu/vật tư kho
- **📦 Inventory Transactions**: Giao dịch nhập/xuất kho
- **👨‍🍳 Recipes**: Công thức món ăn và nguyên liệu
- **📊 Analytics**: Thống kê và báo cáo tồn kho

---

## 🏪 **MODULE INVENTORY ITEMS**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  restaurant_id: string (UUID)
  name: string
  description?: string
  unit: string (kg, lít, cái...)
  quantity: number
  min_quantity?: number
  max_quantity?: number
  unit_cost?: number
  supplier?: string
  expiry_date?: Date
  created_at: Date
  updated_at: Date
}
```

### **API Endpoints**

#### **🔹 Tạo Nguyên Liệu Mới**
```http
POST /api/inventory-items
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "name": "Thịt bò Úc",
  "description": "Thịt bò nhập khẩu từ Úc",
  "unit": "kg",
  "quantity": 50,
  "min_quantity": 10,
  "max_quantity": 100,
  "unit_cost": 250000,
  "supplier": "Công ty ABC",
  "expiry_date": "2024-02-15"
}
```

#### **🔹 Lấy Danh Sách Nguyên Liệu**
```http
GET /api/inventory-items?restaurant_id=uuid&low_stock=true&page=1&limit=10
```

**Query Parameters:**
- `restaurant_id`: ID nhà hàng
- `name`: Tên nguyên liệu (tìm kiếm partial)
- `supplier`: Nhà cung cấp (tìm kiếm partial)
- `unit`: Đơn vị tính
- `low_stock`: true/false - Nguyên liệu sắp hết
- `expiring_soon`: true/false - Nguyên liệu sắp hết hạn (7 ngày)
- `expired`: true/false - Nguyên liệu đã hết hạn
- `min_quantity`, `max_quantity`: Khoảng số lượng
- `min_cost`, `max_cost`: Khoảng giá
- `expiry_from`, `expiry_to`: Khoảng hạn sử dụng
- `page`, `limit`: Phân trang
- `sort_by`, `sort_order`: Sắp xếp

#### **🔹 Cập Nhật Hàng Loạt**
```http
PATCH /api/inventory-items/bulk-update
Content-Type: application/json

{
  "items": [
    {
      "id": "uuid1",
      "quantity": 25,
      "unit_cost": 260000
    },
    {
      "id": "uuid2", 
      "min_quantity": 5,
      "max_quantity": 80
    }
  ]
}
```

#### **🔹 Cảnh Báo Tồn Kho Thấp**
```http
GET /api/inventory-items/low-stock-alert?restaurant_id=uuid&threshold_days=7
```

**Response:**
```json
{
  "success": true,
  "data": {
    "low_stock_items": [
      {
        "id": "uuid",
        "name": "Thịt bò",
        "quantity": 5,
        "min_quantity": 10,
        "unit": "kg"
      }
    ],
    "expiring_soon_items": [
      {
        "id": "uuid",
        "name": "Sữa tươi",
        "expiry_date": "2024-01-20",
        "quantity": 10
      }
    ],
    "total_alerts": 2
  }
}
```

---

## 📦 **MODULE INVENTORY TRANSACTIONS**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  inventory_item_id: string (UUID)
  type: 'purchase' | 'usage' | 'adjustment' | 'waste' | 'return' | 'transfer'
  quantity: number (+ for in, - for out)
  unit_cost?: number
  total_cost?: number
  supplier?: string
  invoice_number?: string
  notes?: string
  created_at: Date
}
```

### **API Endpoints**

#### **🔹 Tạo Giao Dịch Kho**
```http
POST /api/inventory-transactions
Content-Type: application/json

{
  "inventory_item_id": "uuid",
  "type": "purchase",
  "quantity": 20,
  "unit_cost": 250000,
  "total_cost": 5000000,
  "supplier": "Công ty ABC",
  "invoice_number": "INV-2024-001",
  "notes": "Nhập hàng đầu tháng"
}
```

#### **🔹 Các Loại Giao Dịch**
- **purchase**: Nhập hàng từ nhà cung cấp
- **usage**: Sử dụng nguyên liệu trong sản xuất
- **adjustment**: Điều chỉnh tồn kho (kiểm kê)
- **waste**: Hao hụt/hỏng hóc
- **return**: Trả hàng nhà cung cấp
- **transfer**: Chuyển kho

#### **🔹 Lấy Danh Sách Giao Dịch**
```http
GET /api/inventory-transactions?restaurant_id=uuid&type=purchase&date_from=2024-01-01&date_to=2024-01-31
```

**Query Parameters:**
- `inventory_item_id`: ID nguyên liệu cụ thể
- `restaurant_id`: ID nhà hàng
- `type`: Loại giao dịch
- `supplier`: Nhà cung cấp
- `invoice_number`: Số hóa đơn
- `date_from`, `date_to`: Khoảng thời gian
- `min_amount`, `max_amount`: Khoảng số tiền
- `page`, `limit`: Phân trang
- `sort_by`, `sort_order`: Sắp xếp

---

## 👨‍🍳 **MODULE RECIPES**

### **Mô Hình Dữ Liệu**
```typescript
{
  id: string (UUID)
  menu_item_id: string (UUID)
  name: string
  description?: string
  instructions?: string
  prep_time?: number (phút)
  cook_time?: number (phút)
  serving_size?: number
  ingredients: [
    {
      inventory_item_id: string
      quantity: number
      unit: string
      notes?: string
    }
  ]
}
```

### **API Endpoints**

#### **🔹 Tạo Công Thức Mới**
```http
POST /api/recipes
Content-Type: application/json

{
  "menu_item_id": "uuid",
  "name": "Bò lúc lắc",
  "description": "Món bò lúc lắc truyền thống",
  "instructions": "1. Cắt thịt bò thành từng miếng vuông...",
  "prep_time": 15,
  "cook_time": 10,
  "serving_size": 2,
  "ingredients": [
    {
      "inventory_item_id": "uuid-beef",
      "quantity": 0.3,
      "unit": "kg",
      "notes": "Thịt bò thăn"
    },
    {
      "inventory_item_id": "uuid-onion", 
      "quantity": 1,
      "unit": "củ",
      "notes": "Hành tây tím"
    }
  ]
}
```

#### **🔹 Tính Chi Phí Công Thức**
```http
POST /api/recipes/calculate-cost
Content-Type: application/json

{
  "recipe_id": "uuid",
  "serving_size": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe_id": "uuid",
    "recipe_name": "Bò lúc lắc",
    "original_serving_size": 2,
    "calculated_serving_size": 4,
    "total_cost": 150000,
    "cost_per_serving": 37500,
    "cost_breakdown": [
      {
        "ingredient_name": "Thịt bò Úc",
        "quantity": 0.6,
        "unit": "kg",
        "unit_cost": 250000,
        "total_cost": 150000
      }
    ]
  }
}
```

#### **🔹 Lấy Danh Sách Công Thức**
```http
GET /api/recipes?restaurant_id=uuid&ingredient_id=uuid&min_prep_time=10&max_cook_time=30
```

**Query Parameters:**
- `menu_item_id`: ID món ăn cụ thể
- `restaurant_id`: ID nhà hàng
- `name`: Tên công thức (tìm kiếm partial)
- `ingredient_id`: Công thức chứa nguyên liệu này
- `min_prep_time`, `max_prep_time`: Khoảng thời gian chuẩn bị
- `min_cook_time`, `max_cook_time`: Khoảng thời gian nấu
- `page`, `limit`: Phân trang
- `sort_by`, `sort_order`: Sắp xếp

---

## 📊 **MODULE ANALYTICS**

### **🔹 Thống Kê Tồn Kho**
```http
GET /api/stats/inventory?restaurant_id=uuid&date_from=2024-01-01&date_to=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_items": 150,
    "low_stock_items": 12,
    "expired_items": 3,
    "expiring_soon_items": 8,
    "total_quantity": 2500,
    "recent_transactions": 45,
    "low_stock_percentage": 8.0,
    "top_used_ingredients_count": 10
  }
}
```

### **🔹 Báo Cáo Chi Tiết**
- **Giá trị tồn kho**: Tổng giá trị nguyên liệu theo các phương pháp tính khác nhau
- **Dự báo sử dụng**: Dự đoán nhu cầu nguyên liệu trong tương lai
- **Phân tích lãng phí**: Theo dõi nguyên liệu bị hư hỏng/hết hạn
- **Top nguyên liệu**: Nguyên liệu được sử dụng nhiều nhất

---

## 🔧 **TÍNH NĂNG ĐỘC ĐÁO**

### **1. Smart Stock Management**
- **Auto Low Stock Alerts**: Cảnh báo tự động khi tồn kho thấp
- **Expiry Tracking**: Theo dõi hạn sử dụng nguyên liệu
- **Usage Forecasting**: Dự báo nhu cầu sử dụng
- **Supplier Management**: Quản lý thông tin nhà cung cấp

### **2. Recipe Costing**
- **Real-time Cost Calculation**: Tính chi phí công thức theo thời gian thực
- **Portion Scaling**: Điều chỉnh chi phí theo khẩu phần
- **Ingredient Substitution**: Hỗ trợ thay thế nguyên liệu
- **Profit Margin Analysis**: Phân tích lợi nhuận món ăn

### **3. Transaction Tracking**
- **Multi-type Transactions**: Hỗ trợ nhiều loại giao dịch khác nhau
- **Invoice Integration**: Liên kết với hóa đơn nhập hàng
- **Audit Trail**: Theo dõi lịch sử thay đổi đầy đủ
- **Batch Operations**: Xử lý hàng loạt hiệu quả

### **4. Mobile Optimization**
- **QR Code Scanning**: Quét mã QR để kiểm tra nguyên liệu
- **Quick Stock Updates**: Cập nhật nhanh số lượng tồn kho
- **Offline Capabilities**: Hoạt động offline và đồng bộ sau
- **Voice Commands**: Nhập liệu bằng giọng nói

---

## 🚀 **WORKFLOW ĐIỂN HÌNH**

### **1. Quy Trình Nhập Kho**
```
1. Nhận hàng từ nhà cung cấp
2. Kiểm tra chất lượng & số lượng
3. Tạo transaction type 'purchase'
4. Hệ thống tự động cập nhật tồn kho
5. Lưu trữ thông tin hóa đơn
6. Gửi thông báo cho quản lý
```

### **2. Quy Trình Sử Dụng Nguyên Liệu**
```
1. Chef chuẩn bị món ăn theo recipe
2. Hệ thống tự động tính toán nguyên liệu cần dùng
3. Tạo transaction type 'usage'
4. Cập nhật tồn kho real-time
5. Kiểm tra low stock alerts
6. Đề xuất đặt hàng bổ sung
```

### **3. Quy Trình Kiểm Kê**
```
1. Lên kế hoạch kiểm kê định kỳ
2. Sử dụng mobile app để đếm thực tế
3. So sánh với số liệu hệ thống
4. Tạo adjustment transactions
5. Phân tích nguyên nhân chênh lệch
6. Cập nhật quy trình quản lý
```

---

## 📱 **MOBILE FEATURES**

### **🔹 QR Code Operations**
```http
POST /api/inventory/qr-check
Content-Type: application/json

{
  "qr_code": "INV_uuid_THIT_BO_UC",
  "restaurant_id": "uuid"
}
```

### **🔹 Quick Stock Update**
```http
POST /api/inventory/quick-update
Content-Type: application/json

{
  "inventory_item_id": "uuid",
  "new_quantity": 15,
  "update_reason": "recount",
  "notes": "Kiểm kê cuối ngày",
  "location": "Kho lạnh A"
}
```

---

## 🛡️ **BẢO MẬT & VALIDATION**

### **Data Validation**
- **Zod Schemas**: Validation đầy đủ cho tất cả inputs
- **Vietnamese Error Messages**: Thông báo lỗi bằng tiếng Việt
- **Business Logic Validation**: Kiểm tra logic nghiệp vụ
- **UUID Validation**: Đảm bảo tính hợp lệ của IDs

### **Security Features**
- **Input Sanitization**: Làm sạch dữ liệu đầu vào
- **SQL Injection Prevention**: Sử dụng Prisma ORM
- **Access Control**: Phân quyền theo restaurant
- **Audit Logging**: Ghi log đầy đủ các hoạt động

---

## 📊 **REPORTING & ANALYTICS**

### **1. Inventory Valuation Report**
- Tổng giá trị tồn kho theo phương pháp FIFO/LIFO
- Phân tích theo category/supplier
- Tracking giá trị theo thời gian

### **2. Usage Analysis Report**
- Top nguyên liệu sử dụng nhiều nhất
- Seasonal usage patterns
- Cost per dish analysis

### **3. Waste Management Report**
- Tracking nguyên liệu hết hạn
- Waste cost analysis
- Improvement suggestions

### **4. Supplier Performance Report**
- Delivery performance metrics
- Price trend analysis
- Quality assessment tracking

---

## 🔄 **INTEGRATION CAPABILITIES**

### **Menu System Integration**
- Recipe cost calculation tự động
- Menu pricing optimization
- Ingredient availability checking

### **Order System Integration**
- Real-time ingredient deduction
- Order feasibility checking
- Alternative suggestion system

### **Accounting System Integration**
- Cost of goods sold (COGS) calculation
- Purchase order automation
- Financial reporting integration

---

## 🎯 **BEST PRACTICES**

### **1. Inventory Management**
- Set appropriate min/max quantities
- Regular stock rotation (FIFO)
- Accurate receiving procedures
- Proper storage tracking

### **2. Recipe Management**
- Standardize portion sizes
- Regular cost updates
- Document preparation steps
- Track recipe modifications

### **3. Transaction Recording**
- Real-time entry preferred
- Include detailed notes
- Verify quantities
- Maintain invoice references

### **4. Data Maintenance**
- Regular data cleanup
- Archive old transactions
- Update supplier information
- Review low stock thresholds

---

## 🚀 **ADVANCED FEATURES**

### **1. AI-Powered Forecasting**
- Machine learning cho demand prediction
- Seasonal pattern recognition
- Automatic reorder suggestions
- Price optimization algorithms

### **2. IoT Integration**
- Smart scale connectivity
- Temperature monitoring
- Automatic expiry alerts
- RFID tag tracking

### **3. Blockchain Traceability**
- Supply chain tracking
- Food safety compliance
- Origin verification
- Quality assurance

---

## 🎉 **KẾT LUẬN**

Hệ thống Inventory Management đã được thiết kế toàn diện với:

✅ **4 Module chính**: Items, Transactions, Recipes, Analytics  
✅ **Smart Alerts**: Low stock, expiry warnings  
✅ **Recipe Costing**: Real-time cost calculation  
✅ **Mobile Optimization**: QR codes, quick updates  
✅ **Comprehensive Analytics**: Detailed reporting  
✅ **Vietnamese Localization**: Error messages & UI  
✅ **Type Safety**: TypeScript + Zod validation  
✅ **Production Ready**: Scalable architecture  

Hệ thống hỗ trợ đầy đủ quy trình quản lý kho từ nhập hàng → sử dụng → kiểm kê → báo cáo, giúp nhà hàng tối ưu hóa chi phí và nâng cao hiệu quả vận hành.
