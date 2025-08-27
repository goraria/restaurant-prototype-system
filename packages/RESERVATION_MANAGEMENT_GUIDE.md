# 📋 RESERVATION MANAGEMENT SYSTEM

Hệ thống quản lý đặt bàn toàn diện cho nhà hàng với các tính năng nâng cao.

## 🎯 Tính năng chính

### 1. **Quản lý đặt bàn**
- ✅ Tạo đặt bàn với validation đầy đủ
- ✅ Kiểm tra xung đột thời gian
- ✅ Quản lý trạng thái đặt bàn (pending → confirmed → seated → completed)
- ✅ Cập nhật thông tin đặt bàn
- ✅ Hủy/xóa đặt bàn

### 2. **Kiểm tra tình trạng bàn**
- ✅ Kiểm tra bàn trống theo thời gian
- ✅ Tìm bàn phù hợp với số người
- ✅ Tránh xung đột thời gian đặt bàn

### 3. **Khách vãng lai (Walk-in)**
- ✅ Xử lý khách không đặt bàn trước
- ✅ Tự động tạo reservation và chuyển sang trạng thái seated

### 4. **Thống kê và báo cáo**
- ✅ Phân tích đặt bàn theo thời gian
- ✅ Thống kê theo trạng thái
- ✅ Báo cáo hiệu suất

### 5. **Quản lý hàng loạt**
- ✅ Cập nhật nhiều đặt bàn cùng lúc
- ✅ Xác nhận/hủy hàng loạt

## 🔧 API Endpoints

### **Đặt bàn cơ bản**

```http
POST /api/reservations
Content-Type: application/json

{
  "table_id": "uuid",
  "customer_name": "Nguyễn Văn A", 
  "customer_phone": "0123456789",
  "customer_email": "email@example.com",
  "party_size": 4,
  "reservation_date": "2025-08-28T19:00:00Z",
  "duration_hours": 2,
  "special_requests": "Gần cửa sổ"
}
```

### **Kiểm tra bàn trống**

```http
POST /api/reservations/check-availability
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "reservation_date": "2025-08-28T19:00:00Z", 
  "duration_hours": 2,
  "party_size": 4
}
```

### **Lấy danh sách đặt bàn**

```http
GET /api/reservations?page=1&limit=10&status=confirmed&date_from=2025-08-28T00:00:00Z&date_to=2025-08-28T23:59:59Z
```

### **Cập nhật trạng thái**

```http
PATCH /api/reservations/{id}/status
Content-Type: application/json

{
  "status": "seated",
  "notes": "Khách đã đến và được xếp chỗ"
}
```

### **Walk-in Customer**

```http
POST /api/reservations/walk-in
Content-Type: application/json

{
  "table_id": "uuid",
  "customer_name": "Khách vãng lai",
  "customer_phone": "0987654321", 
  "party_size": 2
}
```

### **Bulk Update**

```http
PATCH /api/reservations/bulk-update
Content-Type: application/json

{
  "reservation_ids": ["uuid1", "uuid2"],
  "status": "confirmed",
  "notes": "Xác nhận hàng loạt"
}
```

### **Analytics**

```http
POST /api/reservations/analytics
Content-Type: application/json

{
  "restaurant_id": "uuid",
  "date_from": "2025-08-01T00:00:00Z",
  "date_to": "2025-08-31T23:59:59Z",
  "group_by": "day"
}
```

## 📊 Luồng trạng thái

```
pending → confirmed → seated → completed
    ↓         ↓         ↓
 cancelled  cancelled  completed
    ↓         ↓
 no_show   no_show
```

### **Quy tắc chuyển trạng thái:**
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `seated`, `cancelled`, `no_show`  
- `seated` → `completed`
- `completed`, `cancelled`, `no_show` → Không thể chuyển

## 🛠️ Business Logic

### **Validation Rules:**

1. **Thời gian đặt bàn:**
   - Phải trong tương lai
   - Thời gian tối thiểu: 30 phút
   - Thời gian tối đa: 8 giờ

2. **Số người:**
   - Tối thiểu: 1 người  
   - Tối đa: 20 người
   - Không vượt quá sức chứa bàn

3. **Xung đột thời gian:**
   - Kiểm tra overlap với reservations khác
   - Chỉ tính reservations có status: `confirmed`, `seated`

4. **Phone validation:**
   - Format: `(+84|0)[0-9]{9,10}`
   - VD: `0123456789`, `+84123456789`

### **Table Status Management:**

```typescript
// Khi seated
table.status = 'occupied'

// Khi completed/cancelled/no_show  
table.status = 'available'
```

### **Permission System:**

- **Customer**: Tạo, xem reservation của mình
- **Staff**: Xem, cập nhật reservations của restaurant
- **Manager**: Full access + bulk operations + analytics
- **Admin**: Full access tất cả restaurants

## 🎨 Frontend Integration

### **React Hook Example:**

```typescript
// Hook để lấy reservations
const useReservations = (filters: ReservationFilters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations?' + new URLSearchParams(filters));
      const result = await response.json();
      setData(result.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [filters]);

  return { data, loading, refetch: fetchReservations };
};

// Hook để tạo reservation
const useCreateReservation = () => {
  const [loading, setLoading] = useState(false);

  const createReservation = async (data: CreateReservationType) => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create reservation');
      
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { createReservation, loading };
};
```

### **Component Example:**

```tsx
const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: reservations } = useReservations({
    date_from: startOfDay(selectedDate).toISOString(),
    date_to: endOfDay(selectedDate).toISOString()
  });

  return (
    <div className="reservation-calendar">
      <Calendar 
        value={selectedDate}
        onChange={setSelectedDate}
      />
      
      <div className="reservation-list">
        {reservations.map(reservation => (
          <ReservationCard 
            key={reservation.id}
            reservation={reservation}
          />
        ))}
      </div>
    </div>
  );
};

const ReservationCard = ({ reservation }) => {
  const updateStatus = async (newStatus: string) => {
    await fetch(`/api/reservations/${reservation.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  return (
    <div className="reservation-card">
      <div className="customer-info">
        <h4>{reservation.customer_name}</h4>
        <p>{reservation.customer_phone}</p>
      </div>
      
      <div className="reservation-details">
        <p>Bàn: {reservation.tables.table_number}</p>
        <p>Số người: {reservation.party_size}</p>
        <p>Thời gian: {format(reservation.reservation_date, 'HH:mm')}</p>
      </div>
      
      <div className="actions">
        {reservation.status === 'pending' && (
          <button onClick={() => updateStatus('confirmed')}>
            Xác nhận
          </button>
        )}
        {reservation.status === 'confirmed' && (
          <button onClick={() => updateStatus('seated')}>
            Xếp chỗ
          </button>
        )}
      </div>
    </div>
  );
};
```

## 🧪 Testing

### **Unit Tests:**

```typescript
describe('Reservation Services', () => {
  test('should create reservation successfully', async () => {
    const data = {
      table_id: 'table-uuid',
      customer_name: 'Test Customer',
      customer_phone: '0123456789',
      party_size: 4,
      reservation_date: new Date().toISOString()
    };

    const result = await createReservation(data);
    expect(result.success).toBe(true);
    expect(result.data.customer_name).toBe('Test Customer');
  });

  test('should detect time conflicts', async () => {
    // Test conflict detection logic
  });
});
```

### **Integration Tests:**

```typescript
describe('Reservation API', () => {
  test('POST /api/reservations', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .send(validReservationData)
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

## 🚀 Performance Optimizations

### **Database Indexes:**
```sql
-- Reservations indexes (đã có trong schema)
CREATE INDEX idx_reservations_table ON reservations(table_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
```

### **Query Optimizations:**
- Sử dụng pagination cho large datasets
- Include relations cần thiết trong queries
- Cache availability checks

### **Caching Strategy:**
```typescript
// Redis cache cho availability checks
const cacheKey = `availability:${restaurant_id}:${date}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

## 📈 Monitoring & Analytics

### **Key Metrics:**
- Reservation conversion rate
- No-show rate  
- Average party size
- Peak booking times
- Table utilization rate

### **Error Tracking:**
- Validation errors
- Conflict detection failures
- System errors

## 🔒 Security

### **Input Validation:**
- Zod schemas cho tất cả inputs
- Phone number format validation
- Date range validation

### **Authorization:**
- Role-based access control
- Restaurant-scoped data access
- Owner/customer reservation access

### **Rate Limiting:**
```typescript
// Limit booking requests
app.use('/api/reservations', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
}));
```

## 🎯 Future Enhancements

1. **SMS/Email Notifications**
2. **Waiting List Management** 
3. **Recurring Reservations**
4. **Integration với Payment System**
5. **Mobile App Support**
6. **Real-time Updates với WebSockets**
7. **Multi-language Support**
8. **Advanced Analytics Dashboard**

---

## 📞 Support

Để được hỗ trợ về Reservation Management System, vui lòng liên hệ:
- Email: support@restaurant-system.com
- Documentation: https://docs.restaurant-system.com/reservations
