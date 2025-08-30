# Figma Screens - PetCare Pro Mobile App

Đây là bộ 12 màn hình được tạo dựa trên thiết kế Figma cho ứng dụng chăm sóc thú cưng PetCare Pro.

## 📱 Danh sách màn hình

### 1. **OnboardingScreen** (`onboarding.tsx`)
- Màn hình chào mừng và giới thiệu ứng dụng
- Hiển thị các tính năng chính
- Nút đăng ký và đăng nhập

### 2. **RegisterScreen** (`register.tsx`)
- Form đăng ký tài khoản mới
- Validation và điều khoản sử dụng
- Link chuyển đến màn hình đăng nhập

### 3. **LoginScreen** (`login.tsx`)
- Form đăng nhập
- Social login (Google, Facebook, Apple)
- Link quên mật khẩu và đăng ký

### 4. **HomeScreen** (`home.tsx`)
- Dashboard chính với thống kê
- Danh sách dịch vụ chính
- Lịch hẹn sắp tới
- Bác sĩ nổi bật

### 5. **PetsScreen** (`pets.tsx`)
- Danh sách thú cưng của người dùng
- Thông tin sức khỏe và trạng thái
- Thao tác nhanh (chụp ảnh, đặt lịch, hồ sơ)
- Nhắc nhở sức khỏe

### 6. **AppointmentScreen** (`appointment.tsx`)
- Form đặt lịch hẹn chi tiết
- Chọn dịch vụ, thú cưng, ngày giờ
- Chọn bác sĩ
- Tóm tắt và xác nhận

### 7. **AppointmentHistoryScreen** (`appointment-history.tsx`)
- Lịch sử lịch hẹn với tabs
- Trạng thái: sắp tới, hoàn thành, đã hủy
- Thao tác cho từng lịch hẹn

### 8. **PaymentScreen** (`payment.tsx`)
- Thanh toán cho dịch vụ
- Chọn phương thức thanh toán
- Form thông tin thẻ
- Tóm tắt đơn hàng

### 9. **PetProfileScreen** (`pet-profile.tsx`)
- Hồ sơ chi tiết thú cưng
- Chỉ số sức khỏe và tiến độ
- Lịch sử y tế và vaccine
- Thông tin cá nhân

### 10. **SettingsScreen** (`settings.tsx`)
- Cài đặt ứng dụng
- Thông tin tài khoản
- Tùy chọn thông báo và giao diện
- Hỗ trợ và về ứng dụng

### 11. **NotificationsScreen** (`notifications.tsx`)
- Danh sách thông báo
- Phân loại theo loại (lịch hẹn, nhắc nhở, tin nhắn)
- Thao tác đánh dấu đã đọc

### 12. **ChatScreen** (`chat.tsx`)
- Giao diện chat với bác sĩ
- Danh sách cuộc trò chuyện
- Gửi tin nhắn và file đính kèm
- Trạng thái tin nhắn

## 🎨 Thiết kế

### Components sử dụng
- Sử dụng `react-native-reusables` components
- UI components từ `@/components/ui/`
- Icons từ `lucide-react-native`
- Styling với Tailwind CSS

### Màu sắc
- Primary: Blue theme
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray scale

### Layout
- SafeAreaView cho tất cả màn hình
- ScrollView cho nội dung dài
- Card components cho grouping
- Consistent spacing và typography

## 🚀 Cách sử dụng

### Import màn hình
```typescript
import { 
  OnboardingScreen,
  RegisterScreen,
  LoginScreen,
  HomeScreen,
  PetsScreen,
  AppointmentScreen,
  AppointmentHistoryScreen,
  PaymentScreen,
  PetProfileScreen,
  SettingsScreen,
  NotificationsScreen,
  ChatScreen
} from '@/app/figma-screens';
```

### Navigation
```typescript
// Sử dụng với React Navigation
<Stack.Screen name="Onboarding" component={OnboardingScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="Login" component={LoginScreen} />
// ... các màn hình khác
```

### Customization
- Thay đổi màu sắc trong `tailwind.config.ts`
- Cập nhật text và content theo ngôn ngữ
- Thêm logic xử lý cho các button và form
- Kết nối với API và state management

## 📋 Tính năng chính

### Authentication
- Đăng ký/Đăng nhập
- Social login
- Validation form

### Pet Management
- Quản lý thông tin thú cưng
- Hồ sơ sức khỏe
- Lịch sử y tế

### Appointment System
- Đặt lịch hẹn
- Lịch sử lịch hẹn
- Nhắc nhở tự động

### Communication
- Chat với bác sĩ
- Thông báo push
- Tin nhắn hệ thống

### Payment
- Nhiều phương thức thanh toán
- Bảo mật thông tin
- Lịch sử giao dịch

## 🔧 Development

### Prerequisites
- React Native
- Expo
- TypeScript
- Tailwind CSS
- react-native-reusables

### Setup
1. Cài đặt dependencies
2. Copy các file màn hình vào project
3. Cập nhật navigation
4. Customize theo yêu cầu

### Testing
- Test trên iOS và Android
- Kiểm tra responsive design
- Validate form inputs
- Test navigation flow

## 📝 Notes

- Tất cả màn hình đều sử dụng TypeScript
- Responsive design cho mobile
- Accessibility friendly
- Performance optimized
- Clean code structure

## 🤝 Contributing

Khi thêm màn hình mới:
1. Tạo file `.tsx` trong thư mục `figma-screens`
2. Export trong `index.ts`
3. Cập nhật README
4. Test thoroughly

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.
