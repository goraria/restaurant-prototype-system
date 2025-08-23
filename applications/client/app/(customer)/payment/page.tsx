"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Clock,
  AlertCircle,
  Copy,
  QrCode
} from "lucide-react"
import Link from "next/link"

interface PaymentMethod {
  id: string
  name: string
  icon: string
  type: 'ewallet' | 'bank' | 'international'
  fee: number
  processingTime: string
  description: string
  isAvailable: boolean
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  note?: string
}

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [paymentStep, setPaymentStep] = useState(1) // 1: method selection, 2: payment details, 3: processing, 4: success
  const [orderData] = useState({
    orderId: `ORD${Date.now()}`,
    customerInfo: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "customer@example.com"
    },
    deliveryAddress: "123 Đường ABC, Quận 1, TP.HCM",
    note: "Giao hàng trước 12h"
  })

  const orderItems: OrderItem[] = [
    { id: "1", name: "Phở Bò Đặc Biệt", quantity: 2, price: 89000 },
    { id: "2", name: "Gỏi Cuốn Tôm Thịt", quantity: 1, price: 45000 },
    { id: "3", name: "Cà Phê Sữa Đá", quantity: 2, price: 25000 }
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: "/images/payment/vnpay.png",
      type: "ewallet",
      fee: 0,
      processingTime: "Tức thì",
      description: "Thanh toán qua VNPay QR Code hoặc ứng dụng",
      isAvailable: true
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: "/images/payment/zalopay.png", 
      type: "ewallet",
      fee: 0,
      processingTime: "Tức thì",
      description: "Thanh toán qua ví ZaloPay",
      isAvailable: true
    },
    {
      id: "momo",
      name: "MoMo",
      icon: "/images/payment/momo.png",
      type: "ewallet", 
      fee: 0,
      processingTime: "Tức thì",
      description: "Thanh toán qua ví MoMo",
      isAvailable: true
    },
    {
      id: "banking",
      name: "Chuyển khoản ngân hàng",
      icon: "/images/payment/bank.png",
      type: "bank",
      fee: 0,
      processingTime: "5-10 phút",
      description: "Chuyển khoản qua Internet Banking hoặc ATM",
      isAvailable: true
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "/images/payment/paypal.png",
      type: "international",
      fee: 3.9,
      processingTime: "Tức thì",
      description: "Thanh toán quốc tế qua PayPal",
      isAvailable: true
    },
    {
      id: "visa",
      name: "Visa/Mastercard",
      icon: "/images/payment/visa.png",
      type: "international",
      fee: 2.5,
      processingTime: "Tức thì", 
      description: "Thanh toán bằng thẻ tín dụng/ghi nợ quốc tế",
      isAvailable: false
    }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 15000
  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod)
  const paymentFee = selectedPaymentMethod ? (subtotal * selectedPaymentMethod.fee / 100) : 0
  const total = subtotal + deliveryFee + paymentFee

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    setPaymentStep(3)
    
    try {
      switch (selectedMethod) {
        case 'vnpay':
          const vnpayResponse = await fetch('/api/payment/vnpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              amount: total,
              orderDescription: `Thanh toán đơn hàng ${orderData.orderId}`,
              bankCode: ''
            })
          })
          const vnpayData = await vnpayResponse.json()
          if (vnpayData.success) {
            window.location.href = vnpayData.paymentUrl
            return
          }
          break

        case 'zalopay':
          const zalopayResponse = await fetch('/api/payment/zalopay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              amount: total,
              description: `Thanh toán đơn hàng ${orderData.orderId}`
            })
          })
          const zalopayData = await zalopayResponse.json()
          if (zalopayData.success) {
            window.location.href = zalopayData.paymentUrl
            return
          }
          break

        case 'momo':
          const momoResponse = await fetch('/api/payment/momo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              amount: total,
              description: `Thanh toán đơn hàng ${orderData.orderId}`
            })
          })
          const momoData = await momoResponse.json()
          if (momoData.success) {
            window.location.href = momoData.paymentUrl
            return
          }
          break

        case 'paypal':
          const paypalResponse = await fetch('/api/payment/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              amount: total,
              description: `Thanh toán đơn hàng ${orderData.orderId}`,
              currency: 'VND'
            })
          })
          const paypalData = await paypalResponse.json()
          if (paypalData.success) {
            window.location.href = paypalData.paymentUrl
            return
          }
          break

        case 'banking':
          // For bank transfer, simulate processing then show success
          setTimeout(() => {
            setPaymentStep(4)
          }, 3000)
          return
      }

      // If payment creation failed
      setTimeout(() => {
        window.location.href = `/customer/payment/failure?orderId=${orderData.orderId}&amount=${total}&error=payment_creation_failed`
      }, 1000)

    } catch (error) {
      console.error('Payment error:', error)
      setTimeout(() => {
        window.location.href = `/customer/payment/failure?orderId=${orderData.orderId}&amount=${total}&error=network_error`
      }, 1000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (paymentStep === 4) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Thanh Toán Thành Công!</h1>
            <p className="text-xl opacity-90">
              Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Chi tiết đơn hàng</CardTitle>
              <CardDescription>
                Mã đơn hàng: <span className="font-mono font-bold">{orderData.orderId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Khách hàng</Label>
                  <p className="text-lg">{orderData.customerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{orderData.customerInfo.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phương thức thanh toán</Label>
                  <p className="text-lg">{selectedPaymentMethod?.name}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Địa chỉ giao hàng</Label>
                <p className="text-lg">{orderData.deliveryAddress}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Tổng tiền</Label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(total)}</p>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Đơn hàng sẽ được giao trong vòng 30-45 phút. Chúng tôi sẽ gọi xác nhận trước khi giao.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/customer">Về trang chủ</Link>
                </Button>
                <Button variant="outline" className="flex-1">
                  Theo dõi đơn hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (paymentStep === 3) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Đang Xử Lý Thanh Toán</h1>
            <p className="text-xl opacity-90">
              Vui lòng đợi trong giây lát...
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-2">Đang xử lý thanh toán</h3>
              <p className="text-muted-foreground mb-6">
                Đang kết nối với {selectedPaymentMethod?.name}...
              </p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Xác thực thông tin thanh toán</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Xử lý giao dịch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                  <span>Xác nhận đơn hàng</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild className="border-white text-white hover:bg-white hover:text-orange-500">
              <Link href="/customer/menu">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-4">Thanh Toán</h1>
          <p className="text-xl opacity-90">
            Chọn phương thức thanh toán phù hợp với bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chọn phương thức thanh toán</CardTitle>
                <CardDescription>
                  Tất cả giao dịch đều được bảo mật với SSL 256-bit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  {/* E-wallets */}
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Ví điện tử
                    </h3>
                    <div className="grid gap-3">
                      {paymentMethods.filter(method => method.type === 'ewallet').map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={method.id} id={method.id} disabled={!method.isAvailable} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                              <div className="w-8 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">
                                {method.name.substring(0, 2)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={method.id} className="font-medium">
                                  {method.name}
                                </Label>
                                {method.fee === 0 && (
                                  <Badge variant="secondary" className="text-xs">Miễn phí</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {method.processingTime}
                                </span>
                                {method.fee > 0 && (
                                  <span>Phí: {method.fee}%</span>
                                )}
                              </div>
                            </div>
                            {!method.isAvailable && (
                              <Badge variant="outline" className="text-xs">
                                Tạm ngừng
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Bank Transfer */}
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Chuyển khoản ngân hàng
                    </h3>
                    <div className="grid gap-3">
                      {paymentMethods.filter(method => method.type === 'bank').map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={method.id} className="font-medium">
                                  {method.name}
                                </Label>
                                <Badge variant="secondary" className="text-xs">Miễn phí</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {method.processingTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* International */}
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Thanh toán quốc tế
                    </h3>
                    <div className="grid gap-3">
                      {paymentMethods.filter(method => method.type === 'international').map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={method.id} id={method.id} disabled={!method.isAvailable} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={method.id} className="font-medium">
                                  {method.name}
                                </Label>
                                {method.fee > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    Phí {method.fee}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {method.processingTime}
                                </span>
                              </div>
                            </div>
                            {!method.isAvailable && (
                              <Badge variant="outline" className="text-xs">
                                Sắp có
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </RadioGroup>

                {/* Payment Details for Bank Transfer */}
                {selectedMethod === 'banking' && (
                  <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Thông tin chuyển khoản
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Ngân hàng:</span>
                        <span className="font-medium">Vietcombank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">1234567890</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard('1234567890')}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Chủ tài khoản:</span>
                        <span className="font-medium">RESTAURANT COMPANY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Nội dung:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{orderData.orderId}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(orderData.orderId)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Số tiền:</span>
                        <span className="font-bold text-lg text-blue-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý tự động.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Bảo mật 100%</p>
                    <p className="text-green-700">Thông tin thanh toán được mã hóa SSL 256-bit</p>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={!selectedMethod}
                  onClick={handlePayment}
                >
                  {selectedMethod === 'banking' ? 'Xác nhận đã chuyển khoản' : 'Thanh toán ngay'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
                <CardDescription>Mã: {orderData.orderId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Phí thanh toán:</span>
                      <span>{formatCurrency(paymentFee)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>

                {/* Customer Info */}
                <Separator />
                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">Thông tin khách hàng</h4>
                  <p>{orderData.customerInfo.name}</p>
                  <p>{orderData.customerInfo.phone}</p>
                  <p className="text-muted-foreground">{orderData.deliveryAddress}</p>
                </div>

                {/* Estimated Time */}
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Thời gian giao hàng dự kiến</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">30 - 45 phút</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
