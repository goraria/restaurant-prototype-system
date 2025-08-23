"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  XCircle, 
  RefreshCcw, 
  ArrowLeft,
  Phone,
  CreditCard,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'unknown'
  const orderId = searchParams.get('orderId') || `ORD${Date.now()}`
  const amount = searchParams.get('amount') || '248000'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getErrorInfo = (errorCode: string) => {
    const errorMap = {
      'insufficient_funds': {
        title: 'Số dư không đủ',
        description: 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch này.',
        icon: CreditCard,
        color: 'text-red-600'
      },
      'invalid_card': {
        title: 'Thẻ không hợp lệ',
        description: 'Thông tin thẻ không chính xác hoặc thẻ đã hết hạn.',
        icon: CreditCard,
        color: 'text-red-600'
      },
      'network_error': {
        title: 'Lỗi kết nối',
        description: 'Không thể kết nối với ngân hàng. Vui lòng thử lại sau.',
        icon: RefreshCcw,
        color: 'text-orange-600'
      },
      'timeout': {
        title: 'Giao dịch hết thời gian',
        description: 'Giao dịch mất quá nhiều thời gian và đã bị hủy.',
        icon: AlertTriangle,
        color: 'text-yellow-600'
      },
      'cancelled': {
        title: 'Giao dịch bị hủy',
        description: 'Bạn đã hủy giao dịch hoặc đóng cửa sổ thanh toán.',
        icon: XCircle,
        color: 'text-gray-600'
      },
      'unknown': {
        title: 'Lỗi không xác định',
        description: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.',
        icon: AlertTriangle,
        color: 'text-red-600'
      }
    }
    
    return errorMap[errorCode as keyof typeof errorMap] || errorMap.unknown
  }

  const errorInfo = getErrorInfo(error)
  const IconComponent = errorInfo.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Error Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Thanh Toán Thất Bại</h1>
          <p className="text-xl opacity-90">
            Đã xảy ra lỗi trong quá trình thanh toán
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Error Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className={`h-5 w-5 ${errorInfo.color}`} />
                {errorInfo.title}
              </CardTitle>
              <CardDescription>
                Thông tin chi tiết về lỗi xảy ra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {errorInfo.description}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                  <p className="font-mono font-bold">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số tiền</p>
                  <p className="font-bold">{formatCurrency(parseInt(amount))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cách khắc phục</CardTitle>
              <CardDescription>
                Hãy thử một trong những cách sau để hoàn thành thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error === 'insufficient_funds' && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Nạp thêm tiền vào tài khoản</p>
                      <p className="text-sm text-muted-foreground">
                        Kiểm tra số dư và nạp thêm tiền vào ví điện tử hoặc tài khoản ngân hàng
                      </p>
                    </div>
                  </div>
                )}

                {error === 'invalid_card' && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Kiểm tra thông tin thẻ</p>
                      <p className="text-sm text-muted-foreground">
                        Đảm bảo số thẻ, ngày hết hạn và mã CVV đều chính xác
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Thử phương thức thanh toán khác</p>
                    <p className="text-sm text-muted-foreground">
                      Chọn VNPay, ZaloPay, MoMo hoặc chuyển khoản ngân hàng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Liên hệ hỗ trợ</p>
                    <p className="text-sm text-muted-foreground">
                      Gọi hotline 1900 1234 để được hỗ trợ trực tiếp
                    </p>
                  </div>
                </div>

                {(error === 'network_error' || error === 'timeout') && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Thử lại sau</p>
                      <p className="text-sm text-muted-foreground">
                        Đợi vài phút và thử thanh toán lại
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button asChild className="w-full">
              <Link href="/customer/payment">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Thử lại
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/customer/menu">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại menu
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/customer">
                Về trang chủ
              </Link>
            </Button>
          </div>

          {/* Support Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Cần hỗ trợ?
              </CardTitle>
              <CardDescription>
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Phone className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Hotline 24/7</p>
                    <p className="text-lg font-bold text-blue-600">1900 1234</p>
                    <p className="text-sm text-muted-foreground">Miễn phí từ điện thoại cố định</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Hỗ trợ thanh toán</p>
                    <p className="text-sm text-muted-foreground">
                      Hướng dẫn chi tiết các phương thức thanh toán
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lưu ý:</strong> Đơn hàng của bạn sẽ được giữ trong 15 phút. 
                  Sau thời gian này, bạn cần đặt lại từ đầu.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
