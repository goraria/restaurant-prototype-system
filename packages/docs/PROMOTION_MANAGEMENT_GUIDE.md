# 🎯 Hệ Thống Quản Lý Khuyến Mãi và Voucher

## 📋 Tổng Quan

Hệ thống quản lý tích hợp **Vouchers** và **Promotions** với khả năng tính toán giảm giá tối ưu, phân tích thống kê và quản lý theo từng nhà hàng.

## 🏗️ Kiến Trúc Hệ Thống

### 📊 Database Schema

#### Vouchers Table
```sql
- id (UUID, Primary Key)
- restaurant_id (UUID, Optional - null = áp dụng toàn hệ thống)
- code (String, Unique - mã voucher)
- name (String - tên voucher)
- description (Text - mô tả)
- discount_type (Enum: percentage, fixed_amount)
- discount_value (Decimal - giá trị giảm)
- min_order_value (Decimal, Optional - đơn hàng tối thiểu)
- max_discount (Decimal, Optional - giảm tối đa)
- usage_limit (Int, Optional - giới hạn sử dụng)
- used_count (Int - số lần đã dùng)
- start_date, end_date (DateTime - thời gian hiệu lực)
- is_active (Boolean - trạng thái hoạt động)
```

#### Promotions Table
```sql
- id (UUID, Primary Key)
- restaurant_id (UUID - thuộc nhà hàng cụ thể)
- name (String - tên khuyến mãi)
- description (Text - mô tả)
- type (Enum: percentage, fixed_amount, buy_one_get_one, combo_deal, happy_hour, seasonal)
- discount_value (Decimal - giá trị giảm)
- conditions (JSON - điều kiện áp dụng)
- applicable_items (String[] - món áp dụng)
- time_restrictions (JSON - giới hạn thời gian)
- start_date, end_date (DateTime - thời gian hiệu lực)
- is_active (Boolean - trạng thái hoạt động)
```

### 🔄 Kiến Trúc Tách Biệt với Unified Service

#### Lý Do Tách Biệt:
1. **Vouchers**: Mã thủ công, theo dõi usage, có thể dùng nhiều lần
2. **Promotions**: Tự động áp dụng, điều kiện phức tạp, giới hạn thời gian

#### Unified Service Layer:
- `calculateBestDiscount()` - So sánh và chọn ưu đãi tốt nhất
- `getDiscountAnalytics()` - Thống kê tích hợp cả hai loại

## 🎯 API Endpoints

### 🎟️ Voucher Management

#### Admin/Manager Operations
```typescript
// Tạo voucher mới
POST /api/vouchers
Body: {
  restaurant_id?: string,
  code: string,
  name: string,
  description?: string,
  discount_type: "percentage" | "fixed_amount",
  discount_value: number,
  min_order_value?: number,
  max_discount?: number,
  usage_limit?: number,
  start_date: string,
  end_date: string,
  is_active?: boolean
}

// Lấy danh sách voucher với filter
GET /api/vouchers?restaurant_id=&code=&discount_type=&is_active=&is_expired=&page=1&limit=20

// Cập nhật voucher
PUT /api/vouchers/:id
Body: UpdateVoucherRequest

// Xóa voucher
DELETE /api/vouchers/:id
```

#### Customer Operations
```typescript
// Áp dụng voucher
POST /api/vouchers/apply
Body: {
  voucher_code: string,
  order_total: number,
  restaurant_id: string,
  menu_items: Array<{
    id: string,
    price: number,
    quantity: number
  }>
}

// Lấy voucher có thể sử dụng
GET /api/my-vouchers?restaurant_id=
```

### 🎯 Promotion Management

#### Admin/Manager Operations
```typescript
// Tạo khuyến mãi mới
POST /api/promotions
Body: {
  restaurant_id: string,
  name: string,
  description?: string,
  type: "percentage" | "fixed_amount" | "buy_one_get_one" | "combo_deal" | "happy_hour" | "seasonal",
  discount_value: number,
  conditions?: {
    min_order_value?: number,
    min_quantity?: number,
    order_type?: string,
    day_of_week?: number[]
  },
  applicable_items?: string[],
  time_restrictions?: {
    start_time?: string,
    end_time?: string,
    days_of_week?: number[]
  },
  start_date: string,
  end_date: string,
  is_active?: boolean
}

// Lấy danh sách khuyến mãi
GET /api/promotions?restaurant_id=&type=&is_active=&is_expired=&page=1&limit=20

// Cập nhật khuyến mãi
PUT /api/promotions/:id

// Xóa khuyến mãi
DELETE /api/promotions/:id
```

#### Customer Operations
```typescript
// Kiểm tra khuyến mãi áp dụng
POST /api/promotions/check
Body: {
  restaurant_id: string,
  order_total: number,
  order_type: string,
  customer_id: string,
  menu_items: Array<{
    id: string,
    price: number,
    quantity: number
  }>,
  order_time?: string
}

// Lấy khuyến mãi có sẵn
GET /api/my-promotions?restaurant_id=
```

### 🧮 Combined Discount System

```typescript
// Tính toán ưu đãi tốt nhất
POST /api/calculate-discount
Body: {
  restaurant_id: string,
  order_total: number,
  order_type: string,
  customer_id: string,
  menu_items: Array<{
    id: string,
    price: number,
    quantity: number
  }>,
  voucher_code?: string,
  order_time?: string
}

Response: {
  all_discounts: Array<{
    type: "voucher" | "promotion",
    discount_amount: number,
    final_amount: number,
    // ... discount details
  }>,
  best_discount: {
    type: "voucher" | "promotion",
    discount_amount: number,
    final_amount: number,
    // ... best discount details
  },
  savings: number
}
```

### 📊 Analytics

```typescript
// Thống kê ưu đãi
GET /api/analytics?restaurant_id=&period=7d&type=both&date_from=&date_to=

// Thống kê theo nhà hàng
GET /api/restaurants/:restaurant_id/vouchers
GET /api/restaurants/:restaurant_id/promotions
```

## 🔧 Business Logic

### 📋 Voucher Validation Rules

1. **Thời gian hiệu lực**: `start_date <= now <= end_date`
2. **Trạng thái**: `is_active = true`
3. **Giới hạn sử dụng**: `used_count < usage_limit` (nếu có)
4. **Đơn hàng tối thiểu**: `order_total >= min_order_value` (nếu có)
5. **Nhà hàng**: `restaurant_id = null` (toàn hệ thống) hoặc khớp với restaurant

### 🎯 Promotion Application Logic

1. **Điều kiện cơ bản**: Thời gian, trạng thái, nhà hàng
2. **Điều kiện đặc biệt**:
   - Giá trị đơn hàng tối thiểu
   - Số lượng món tối thiểu
   - Loại đơn hàng (dine-in, takeaway, delivery)
   - Ngày trong tuần
3. **Giới hạn thời gian**:
   - Khung giờ trong ngày
   - Ngày cụ thể trong tuần
4. **Món áp dụng**: Kiểm tra `applicable_items`

### 💰 Discount Calculation

#### Percentage Discount
```typescript
if (applicable_items.length > 0) {
  // Áp dụng cho món cụ thể
  applicableTotal = items.filter(item => applicable_items.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  discount = (applicableTotal * discount_value) / 100;
} else {
  // Áp dụng toàn đơn
  discount = (order_total * discount_value) / 100;
}
```

#### Buy One Get One (BOGO)
```typescript
applicable_items.forEach(itemId => {
  const item = order_items.find(i => i.id === itemId);
  if (item) {
    const freeItems = Math.floor(item.quantity / 2);
    discount += freeItems * item.price;
  }
});
```

## 🎨 Frontend Integration Examples

### React Hook Example
```typescript
const useDiscountCalculation = () => {
  const calculateDiscount = async (orderData: CalculateDiscountRequest) => {
    const response = await fetch('/api/calculate-discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  };

  return { calculateDiscount };
};
```

### Vue.js Composition API Example
```typescript
export function usePromotions() {
  const promotions = ref([]);
  
  const checkPromotions = async (orderData) => {
    const response = await $fetch('/api/promotions/check', {
      method: 'POST',
      body: orderData
    });
    promotions.value = response.data;
    return response.data;
  };

  return { promotions, checkPromotions };
}
```

## 🔐 Permission & Security

### Role-Based Access
```typescript
// Admin/Super Admin: Toàn quyền
// Manager: Quản lý nhà hàng của mình
// Staff: Chỉ xem, áp dụng voucher/promotion
// Customer: Xem và sử dụng ưu đãi
```

### Input Validation
- Tất cả input được validate bằng Zod schemas
- Sanitize mã voucher (uppercase, trim)
- Validate date ranges
- Check business rules

## 📈 Performance Optimization

### Database Indexing
```sql
-- Vouchers
CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_restaurant_active ON vouchers(restaurant_id, is_active);
CREATE INDEX idx_vouchers_dates ON vouchers(start_date, end_date);

-- Promotions  
CREATE INDEX idx_promotions_restaurant_active ON promotions(restaurant_id, is_active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_applicable_items ON promotions USING GIN(applicable_items);
```

### Caching Strategy
```typescript
// Cache active promotions by restaurant
const cacheKey = `promotions:${restaurant_id}:active`;
// Cache voucher validation results
const voucherCacheKey = `voucher:${voucher_code}:valid`;
```

## 🧪 Testing Examples

### Unit Test - Voucher Application
```typescript
describe('Voucher Application', () => {
  test('should apply percentage voucher correctly', async () => {
    const voucher = {
      code: 'SAVE20',
      discount_type: 'percentage',
      discount_value: 20,
      min_order_value: 100
    };
    
    const result = await applyVoucher('user_id', {
      voucher_code: 'SAVE20',
      order_total: 150,
      restaurant_id: 'restaurant_id'
    });
    
    expect(result.discount_amount).toBe(30); // 20% of 150
    expect(result.final_amount).toBe(120);
  });
});
```

### Integration Test - Best Discount Calculation
```typescript
test('should return best discount among voucher and promotions', async () => {
  const orderData = {
    restaurant_id: 'restaurant_id',
    order_total: 200,
    voucher_code: 'SAVE10', // 10% = 20đ
    // có promotion 50đ fixed
  };
  
  const result = await calculateBestDiscount('user_id', orderData);
  
  expect(result.best_discount.type).toBe('promotion');
  expect(result.best_discount.discount_amount).toBe(50);
  expect(result.savings).toBe(50);
});
```

## 🚀 Deployment Considerations

### Environment Variables
```env
# Voucher settings
VOUCHER_CODE_LENGTH=8
MAX_VOUCHER_USAGE_PER_USER=5

# Promotion settings  
PROMOTION_CACHE_TTL=300
MAX_CONCURRENT_PROMOTIONS=10

# Analytics
ANALYTICS_RETENTION_DAYS=365
```

### Monitoring & Alerts
- Monitor voucher usage rates
- Alert on high discount amounts
- Track promotion performance
- Monitor failed discount calculations

---

## 📞 Support & Contact

- **API Documentation**: Swagger UI tại `/api-docs`
- **Database Schema**: Xem `schema.prisma`
- **Error Handling**: Tất cả lỗi trả về JSON với `success: false`
- **Rate Limiting**: 100 requests/minute cho discount calculation

Hệ thống này cung cấp giải pháp hoàn chỉnh cho việc quản lý voucher và khuyến mãi với khả năng mở rộng cao và hiệu suất tối ưu.
