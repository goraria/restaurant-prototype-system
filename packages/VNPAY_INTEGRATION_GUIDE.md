# VNPay Integration Guide

## Tổng quan
Đã tích hợp thành công VNPay payment gateway với 2 hàm chính:
- `vnpayPayment`: Tạo URL thanh toán
- `vnpayCallback`: Xử lý callback từ VNPay

## Cấu hình Environment Variables

Cập nhật file `.env` với thông tin VNPay của bạn:

```env
# VNPay Configuration  
VNPAY_TMN_CODE=YOUR_TMN_CODE                    # Mã website của merchant tại VNPay
VNPAY_HASH_SECRET=YOUR_HASH_SECRET              # Secret key từ VNPay
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html  # URL thanh toán (sandbox)
VNPAY_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
VNPAY_RETURN_URL=http://localhost:3000/vnpay-return           # URL redirect sau thanh toán
VNPAY_IPN_URL=https://your-ngrok-url.ngrok-free.app/payment/vnpay/callback  # URL callback
```

## API Endpoints

### 1. Tạo thanh toán VNPay
```http
POST /payment/vnpay
Content-Type: application/json

{
  "amount": 100000,           // Số tiền (VND)
  "orderInfo": "Thanh toan don hang",
  "bankCode": "NCB",          // Mã ngân hàng (optional)
  "orderType": "other",       // Loại đơn hàng
  "language": "vn"            // Ngôn ngữ (vn/en)
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "orderId": "26123456",
  "amount": 100000
}
```

### 2. Callback VNPay (Webhook)
```http
GET /payment/vnpay/callback?vnp_Amount=10000000&vnp_BankCode=NCB&...
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "orderId": "26123456",
    "amount": "10000000",
    "transactionNo": "14226739",
    "bankCode": "NCB",
    "cardType": "ATM"
  }
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Thanh toán thất bại",
  "responseCode": "24",
  "error": "Khách hàng hủy giao dịch"
}
```

## Cách sử dụng

### 1. Từ Frontend (React/Next.js)
```javascript
const createVNPayPayment = async () => {
  try {
    const response = await fetch('/payment/vnpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100000,
        orderInfo: 'Thanh toán đơn hàng #123',
        bankCode: 'NCB'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect user to VNPay payment page
      window.location.href = data.paymentUrl;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. Xử lý kết quả thanh toán
```javascript
// Trên trang return URL (vnpay-return)
const urlParams = new URLSearchParams(window.location.search);
const responseCode = urlParams.get('vnp_ResponseCode');

if (responseCode === '00') {
  // Thanh toán thành công
  alert('Thanh toán thành công!');
} else {
  // Thanh toán thất bại
  alert('Thanh toán thất bại!');
}
```

## VNPay Response Codes

| Code | Ý nghĩa |
|------|---------|
| 00   | Giao dịch thành công |
| 07   | Trừ tiền thành công. Giao dịch bị nghi ngờ |
| 09   | Thẻ/Tài khoản chưa đăng ký InternetBanking |
| 10   | Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| 11   | Đã hết hạn chờ thanh toán |
| 12   | Thẻ/Tài khoản bị khóa |
| 13   | Nhập sai mật khẩu OTP |
| 24   | Khách hàng hủy giao dịch |
| 51   | Tài khoản không đủ số dư |
| 65   | Vượt quá hạn mức giao dịch trong ngày |
| 75   | Ngân hàng đang bảo trì |
| 79   | Nhập sai mật khẩu thanh toán quá số lần quy định |
| 99   | Các lỗi khác |

## Security Notes

1. **Secret Key**: Không bao giờ expose VNPAY_HASH_SECRET ra frontend
2. **Checksum Validation**: Luôn verify checksum trong callback
3. **HTTPS**: Sử dụng HTTPS cho production
4. **IPN URL**: Cần public URL để VNPay có thể callback (dùng ngrok cho development)

## Testing

```bash
# Test tạo thanh toán
curl -X POST http://localhost:8080/payment/vnpay \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "orderInfo": "Test payment",
    "bankCode": "NCB"
  }'
```

## Production Deployment

1. Thay đổi URLs từ sandbox thành production:
   ```env
   VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
   VNPAY_API_URL=https://vnpayment.vn/merchant_webapi/api/transaction
   ```

2. Cập nhật Return URL và IPN URL thành domain thật

3. Sử dụng TMN_CODE và HASH_SECRET thật từ VNPay
