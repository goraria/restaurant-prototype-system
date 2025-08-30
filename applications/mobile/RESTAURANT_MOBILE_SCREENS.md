# Restaurant Mobile App Screens

## 📱 Tổng quan

Ứng dụng mobile nhà hàng với đầy đủ tính năng đặt bàn, gọi món, thanh toán và quản lý. Tất cả các màn hình đều sử dụng `react-native-reusables` components và thiết kế nhất quán.

## 🗂️ Cấu trúc thư mục mới (Đã tổ chức lại)

```
app/
├── (tabs)/                    # Tab navigation chính
│   ├── index.tsx             # Trang chủ - đã cập nhật navigation
│   ├── menu.tsx              # Menu - đã cập nhật navigation
│   ├── profile.tsx           # Profile - đã cập nhật navigation
│   └── notifications.tsx     # Notifications - đã cập nhật navigation
├── (booking)/                # Nhóm đặt bàn và quản lý
│   ├── _layout.tsx
│   ├── reservations.tsx      # Danh sách đặt bàn
│   ├── create-reservation.tsx # Tạo đặt bàn mới
│   ├── tables.tsx            # Quản lý bàn
│   └── cart.tsx              # Giỏ hàng
├── (restaurant)/             # Nhóm thông tin nhà hàng
│   ├── _layout.tsx
│   ├── promotions.tsx        # Khuyến mãi
│   ├── location.tsx          # Địa điểm
│   └── support.tsx           # Hỗ trợ
├── (account)/                # Nhóm tài khoản và lịch sử
│   ├── _layout.tsx
│   ├── history.tsx           # Lịch sử đặt bàn/đơn hàng
│   ├── payments.tsx          # Thanh toán
│   └── chat.tsx              # Chat real-time
└── (purple)/                 # Purple screens (không thay đổi)
```

## 🎯 Các màn hình đã hoàn thành

### ✅ Đã tạo và hoàn thiện

#### 📅 **Nhóm Booking (Đặt bàn và Quản lý)**
1. **Đặt bàn (Reservations)**
   - `/(booking)/reservations.tsx` - Danh sách đặt bàn
   - `/(booking)/create-reservation.tsx` - Tạo đặt bàn mới
   - Tính năng: Xem lịch sử, tạo đặt bàn, quản lý trạng thái

2. **Quản lý bàn (Tables)**
   - `/(booking)/tables.tsx` - Trạng thái bàn
   - Tính năng: Xem trạng thái bàn, scan QR code, đặt bàn nhanh

3. **Giỏ hàng (Cart)**
   - `/(booking)/cart.tsx` - Quản lý giỏ hàng
   - Tính năng: Thêm/xóa món, tính tổng, ước tính thời gian

#### 🏪 **Nhóm Restaurant (Thông tin nhà hàng)**
4. **Khuyến mãi (Promotions)**
   - `/(restaurant)/promotions.tsx` - Danh sách khuyến mãi
   - Tính năng: Xem khuyến mãi, mã giảm giá, phân loại

5. **Địa điểm (Location)**
   - `/(restaurant)/location.tsx` - Thông tin địa điểm
   - Tính năng: Thông tin nhà hàng, chỉ đường, phương tiện

6. **Hỗ trợ (Support)**
   - `/(restaurant)/support.tsx` - Trung tâm hỗ trợ
   - Tính năng: FAQ, liên hệ, thông tin nhà hàng

#### 👤 **Nhóm Account (Tài khoản và Lịch sử)**
7. **Lịch sử (History)**
   - `/(account)/history.tsx` - Lịch sử đặt bàn/đơn hàng
   - Tính năng: Xem lịch sử, đánh giá, đặt lại

8. **Thanh toán (Payments)**
   - `/(account)/payments.tsx` - Màn hình thanh toán
   - Tính năng: Chọn phương thức, nhập thông tin thẻ

9. **Chat (Chat)**
   - `/(account)/chat.tsx` - Danh sách chat
   - Tính năng: Chat với nhân viên, hỗ trợ real-time

### 🔄 Đã cập nhật navigation

1. **Trang chủ (Home)**
   - Cập nhật các nút dịch vụ để điều hướng đến các trang mới
   - Thêm navigation đến: Đặt bàn, Gọi món, Ưu đãi, Lịch sử

2. **Menu**
   - Cập nhật nút giỏ hàng để điều hướng đến `/(booking)/cart`
   - Thêm floating button để xem giỏ hàng

3. **Profile**
   - Cập nhật các menu item để điều hướng đến các trang mới
   - Thêm navigation đến: Đặt bàn, Khuyến mãi, Lịch sử

4. **Notifications**
   - Thêm các button để test navigation đến tất cả các trang mới
   - Giữ nguyên các link đến Purple screens

## 🎨 Thiết kế và UI

### Components sử dụng
- `@/components/ui/text` - Text components
- `@/components/ui/button` - Button components
- `@/components/ui/card` - Card components
- `@/components/ui/badge` - Badge components
- `@/components/ui/input` - Input components
- `@/components/ui/tabs` - Tabs components
- `@/components/ui/avatar` - Avatar components
- `@/components/ui/separator` - Separator components

### Icons sử dụng
- `lucide-react-native` - Tất cả icons
- Icons chính: Calendar, Users, MapPin, Clock, Star, Heart, etc.

### Màu sắc
- Sử dụng theme colors từ `react-native-reusables`
- Primary: Blue tones
- Success: Green tones
- Warning: Yellow/Orange tones
- Error: Red tones
- Muted: Gray tones

## 🚀 Tính năng chính

### 📅 Nhóm Booking
- **Đặt bàn**: Quản lý đặt bàn và lịch hẹn
- **Quản lý bàn**: Xem trạng thái và đặt bàn nhanh
- **Giỏ hàng**: Quản lý món ăn và thanh toán

### 🏪 Nhóm Restaurant
- **Khuyến mãi**: Xem ưu đãi và mã giảm giá
- **Địa điểm**: Thông tin nhà hàng và chỉ đường
- **Hỗ trợ**: FAQ và liên hệ

### 👤 Nhóm Account
- **Lịch sử**: Xem lịch sử đặt bàn và đơn hàng
- **Thanh toán**: Chọn phương thức và nhập thông tin
- **Chat**: Hỗ trợ real-time với nhân viên

## 🔧 Cài đặt và sử dụng

### Prerequisites
- Expo SDK
- React Native
- `react-native-reusables`
- `lucide-react-native`
- `expo-router`

### Navigation
Tất cả các màn hình đều sử dụng Expo Router với cấu trúc file-based routing:

```typescript
// Điều hướng đến các trang
router.push('/(booking)/reservations')        // Danh sách đặt bàn
router.push('/(booking)/create-reservation')  // Tạo đặt bàn
router.push('/(booking)/tables')              // Quản lý bàn
router.push('/(booking)/cart')                // Giỏ hàng
router.push('/(restaurant)/promotions')       // Khuyến mãi
router.push('/(restaurant)/location')         // Địa điểm
router.push('/(restaurant)/support')          // Hỗ trợ
router.push('/(account)/payments')            // Thanh toán
router.push('/(account)/history')             // Lịch sử
router.push('/(account)/chat')                // Chat
```

### Layout Files
Mỗi nhóm có `_layout.tsx` để cấu hình navigation stack:

```typescript
// Booking Layout
import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="reservations" />
      <Stack.Screen name="create-reservation" />
      <Stack.Screen name="tables" />
      <Stack.Screen name="cart" />
    </Stack>
  );
}
```

## 📝 Ghi chú

1. **TypeScript Errors**: Một số navigation có thể gặp lỗi TypeScript do route chưa được định nghĩa trong type system. Điều này sẽ được giải quyết khi Expo Router nhận diện các file mới.

2. **Console Logs**: Một số navigation hiện tại sử dụng `console.log` thay vì `router.push` để tránh lỗi TypeScript. Có thể thay thế bằng `router.push` khi cần thiết.

3. **Mock Data**: Tất cả dữ liệu hiện tại là mock data. Cần tích hợp với API thực tế khi deploy.

4. **Purple Screens**: Các màn hình trong thư mục `(purple)` được giữ nguyên và không bị ảnh hưởng bởi các thay đổi này.

5. **Cấu trúc mới**: Các màn hình đã được tổ chức lại theo nhóm chức năng để dễ quản lý và bảo trì.

## 🎯 Tiếp theo

1. **Tích hợp API**: Kết nối với backend API thực tế
2. **Real-time Features**: Implement WebSocket cho chat và notifications
3. **Payment Integration**: Tích hợp cổng thanh toán thực tế
4. **Push Notifications**: Thêm push notifications
5. **Offline Support**: Thêm tính năng offline
6. **Testing**: Viết unit tests và integration tests

**📞 Liên hệ:** Để thêm màn hình mới hoặc customize, vui lòng tạo issue hoặc pull request.
