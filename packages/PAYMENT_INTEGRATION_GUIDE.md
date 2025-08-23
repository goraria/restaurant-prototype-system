# Hệ thống Thanh Toán - Hướng dẫn tích hợp

## Tổng quan
Hệ thống thanh toán đã được tích hợp với các cổng thanh toán phổ biến tại Việt Nam và quốc tế:

### Các phương thức thanh toán được hỗ trợ:
- **VNPay**: Ví điện tử và Internet Banking
- **ZaloPay**: Ví điện tử Zalo
- **MoMo**: Ví điện tử MoMo
- **PayPal**: Thanh toán quốc tế
- **Chuyển khoản ngân hàng**: Thông tin tài khoản

## Cấu trúc thư mục

```
app/
├── (customer)/
│   └── payment/
│       ├── page.tsx                 # Trang chọn phương thức thanh toán
│       ├── success/
│       │   └── page.tsx            # Trang thanh toán thành công
│       └── failure/
│           └── page.tsx            # Trang thanh toán thất bại
└── api/
    └── payment/
        ├── vnpay/
        │   ├── route.ts            # API tạo giao dịch VNPay
        │   └── callback/
        │       └── route.ts        # Callback xử lý kết quả VNPay
        ├── zalopay/
        │   └── route.ts            # API tạo giao dịch ZaloPay
        ├── momo/
        │   └── route.ts            # API tạo giao dịch MoMo
        └── paypal/
            └── route.ts            # API tạo giao dịch PayPal
```

## Cài đặt và cấu hình

### 1. Cài đặt dependencies
```bash
npm install crypto
```

### 2. Cấu hình environment variables
Sao chép file `.env.example` thành `.env.local` và điền thông tin:

```bash
cp .env.example .env.local
```

### 3. Đăng ký tài khoản với các nhà cung cấp

#### VNPay
1. Truy cập https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản developer
3. Lấy Terminal Code và Hash Secret

#### ZaloPay
1. Truy cập https://developers.zalopay.vn/
2. Tạo ứng dụng mới
3. Lấy App ID và Key1

#### MoMo
1. Truy cập https://developers.momo.vn/
2. Đăng ký tài khoản merchant
3. Lấy Partner Code, Access Key, Secret Key

#### PayPal
1. Truy cập https://developer.paypal.com/
2. Tạo sandbox application
3. Lấy Client ID và Client Secret

## Luồng thanh toán

### 1. Trang Payment (/customer/payment)
- Hiển thị danh sách phương thức thanh toán
- Thông tin đơn hàng và tổng tiền
- Form chọn phương thức

### 2. Xử lý thanh toán
- Gọi API tương ứng với phương thức đã chọn
- Chuyển hướng đến cổng thanh toán
- Xử lý callback từ nhà cung cấp

### 3. Kết quả thanh toán
- **Thành công**: Chuyển đến `/customer/payment/success`
- **Thất bại**: Chuyển đến `/customer/payment/failure`

## API Endpoints

### POST /api/payment/vnpay
Tạo giao dịch VNPay
```json
{
  "orderId": "ORD123456",
  "amount": 248000,
  "orderDescription": "Thanh toán đơn hàng",
  "bankCode": ""
}
```

### POST /api/payment/zalopay
Tạo giao dịch ZaloPay
```json
{
  "orderId": "ORD123456", 
  "amount": 248000,
  "description": "Thanh toán đơn hàng"
}
```

### POST /api/payment/momo
Tạo giao dịch MoMo
```json
{
  "orderId": "ORD123456",
  "amount": 248000,
  "description": "Thanh toán đơn hàng"
}
```

### POST /api/payment/paypal
Tạo giao dịch PayPal
```json
{
  "orderId": "ORD123456",
  "amount": 248000,
  "description": "Thanh toán đơn hàng",
  "currency": "VND"
}
```

## Xử lý lỗi

Hệ thống xử lý các loại lỗi phổ biến:
- `insufficient_funds`: Số dư không đủ
- `invalid_card`: Thẻ không hợp lệ
- `network_error`: Lỗi kết nối
- `timeout`: Hết thời gian chờ
- `cancelled`: Người dùng hủy giao dịch

## Bảo mật

### Các biện pháp bảo mật được áp dụng:
1. **SSL/TLS**: Mã hóa dữ liệu truyền tải
2. **Signature verification**: Xác thực chữ ký từ nhà cung cấp
3. **Environment variables**: Bảo vệ API keys
4. **Input validation**: Kiểm tra dữ liệu đầu vào
5. **Error handling**: Không lộ thông tin nhạy cảm

## Testing

### Test với sandbox environment:
1. Sử dụng thông tin test của từng nhà cung cấp
2. Kiểm tra các flow thanh toán thành công/thất bại
3. Verify callback handling
4. Test error scenarios

### Test cases cần thực hiện:
- [x] Thanh toán thành công với mỗi phương thức
- [x] Xử lý thanh toán thất bại
- [x] Callback verification
- [x] Error handling
- [x] UI/UX flow

## Production Deployment

### Checklist trước khi deploy:
- [ ] Thay đổi endpoint thành production
- [ ] Cập nhật credentials thật
- [ ] Kiểm tra SSL certificate
- [ ] Test thoroughly trong môi trường production
- [ ] Monitor payment transactions
- [ ] Setup logging và alerting

## Hỗ trợ

Nếu gặp vấn đề, liên hệ:
- Technical support: support@restaurant.com
- Payment issues: payment@restaurant.com
- Documentation: docs@restaurant.com
