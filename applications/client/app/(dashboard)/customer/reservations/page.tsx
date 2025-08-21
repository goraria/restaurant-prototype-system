"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Users, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function ReservationsPage() {
  const timeSlots = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ]

  const popularTimes = ["12:00", "13:00", "18:00", "19:00", "20:00"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Đặt bàn</h2>
          <p className="text-muted-foreground">
            Đặt trước bàn để đảm bảo có chỗ ngồi thoải mái
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/customer/reservations/history">Lịch sử đặt bàn</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reservation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt bàn</CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin để đặt bàn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Chọn ngày</Label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    className="rounded-md border-0"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              {/* Time & Party Size */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Thời gian</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{time}</span>
                            {popularTimes.includes(time) && (
                              <Badge variant="secondary" className="text-xs">
                                Phổ biến
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Số lượng khách</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn số người" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{num} người</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên khách hàng</Label>
                  <Input id="name" placeholder="Nhập tên của bạn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Số điện thoại liên hệ" />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="requests">Yêu cầu đặc biệt</Label>
                <Textarea 
                  id="requests" 
                  placeholder="Vị trí ngồi, dị ứng thực phẩm, kỷ niệm đặc biệt..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <Label>Tuỳ chọn thêm</Label>
                <div className="grid gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Bàn gần cửa sổ</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Khu vực yên tĩnh</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Ghế cao cho trẻ em</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Nhắc nhở trước 30 phút</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservation Summary & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhà hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Waddles Restaurant</p>
                  <p className="text-muted-foreground">123 Main St, Hai Bà Trưng, Hà Nội</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">+84 123 456 789</p>
                  <p className="text-muted-foreground">Hỗ trợ 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Giờ hoạt động</p>
                  <p className="text-muted-foreground">10:00 - 22:00 hàng ngày</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đặt bàn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày:</span>
                  <span>Chưa chọn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span>Chưa chọn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số người:</span>
                  <span>Chưa chọn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên:</span>
                  <span>Chưa nhập</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Phí đặt bàn:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <Button className="w-full" disabled>
                Xác nhận đặt bàn
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Bằng việc đặt bàn, bạn đồng ý với{" "}
                <Link href="/terms-of-service" className="underline">
                  Điều khoản dịch vụ
                </Link>{" "}
                của chúng tôi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lưu ý quan trọng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Vui lòng đến đúng giờ đã đặt</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Bàn sẽ được giữ trong 15 phút</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Có thể huỷ miễn phí trước 2 tiếng</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Liên hệ hotline nếu có thay đổi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
