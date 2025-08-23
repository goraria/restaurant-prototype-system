"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin,
  Download,
  Share
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || `ORD${Date.now()}`
  const amount = searchParams.get('amount') || '248000'
  const method = searchParams.get('method') || 'VNPay'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const orderDetails = {
    orderId,
    customerInfo: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "customer@example.com"
    },
    deliveryAddress: "123 Đường ABC, Quận 1, TP.HCM",
    paymentMethod: method,
    amount: parseInt(amount),
    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    status: "Đã xác nhận"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Thanh Toán Thành Công!</h1>
          <p className="text-xl opacity-90">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được chuẩn bị
          </p>
          <Badge variant="secondary" className="mt-4 bg-white text-green-600 text-lg px-4 py-2">
            Mã đơn hàng: {orderDetails.orderId}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Chi tiết đơn hàng
                </CardTitle>
                <CardDescription>
                  Thông tin chi tiết về đơn hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                    <p className="font-mono font-bold">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      {orderDetails.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{orderDetails.customerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{orderDetails.customerInfo.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-medium flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {orderDetails.deliveryAddress}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                  <p className="font-medium">{orderDetails.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(orderDetails.amount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Thông tin giao hàng
                </CardTitle>
                <CardDescription>
                  Thời gian và hướng dẫn giao hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Thời gian giao hàng dự kiến:</strong><br />
                    {orderDetails.estimatedDelivery.toLocaleString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Đơn hàng đã được xác nhận</p>
                      <p className="text-xs text-muted-foreground">Vừa xong</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-orange-50">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Đang chuẩn bị món ăn</p>
                      <p className="text-xs text-muted-foreground">Dự kiến 25-30 phút</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">Shipper đang giao hàng</p>
                      <p className="text-xs text-muted-foreground">Sắp diễn ra</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">Giao hàng thành công</p>
                      <p className="text-xs text-muted-foreground">Hoàn thành</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Phone className="h-4 w-4" />
                  <AlertDescription>
                    Shipper sẽ gọi cho bạn trước khi giao hàng 5-10 phút. 
                    Vui lòng để máy ở chế độ sẵn sàng nghe máy.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <Button asChild variant="default" className="w-full">
              <Link href="/customer">
                Về trang chủ
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/customer/menu">
                Đặt thêm món
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Tải hóa đơn
            </Button>
            
            <Button variant="outline" className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>

          {/* Contact Support */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Cần hỗ trợ?</CardTitle>
              <CardDescription>
                Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Hotline</p>
                  <p className="text-sm text-muted-foreground">1900 1234</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Theo dõi đơn hàng</p>
                  <p className="text-sm text-muted-foreground">Real-time</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">Đánh giá</p>
                  <p className="text-sm text-muted-foreground">Sau khi nhận hàng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
