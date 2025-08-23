"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Users, MapPin, Phone, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface TableOption {
  id: string
  name: string
  capacity: number
  location: string
  pricePerHour: number
  features: string[]
  isAvailable: boolean
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [selectedTable, setSelectedTable] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [bookingData, setBookingData] = useState({
    customerName: "",
    phone: "",
    email: "",
    specialRequests: ""
  })

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30"
  ]

  const tableOptions: TableOption[] = [
    {
      id: "table-1",
      name: "Bàn VIP 1",
      capacity: 8,
      location: "Tầng 2 - Khu riêng tư",
      pricePerHour: 100000,
      features: ["Điều hòa riêng", "View thành phố", "Âm thanh riêng", "Karaoke"],
      isAvailable: true
    },
    {
      id: "table-2", 
      name: "Bàn gia đình",
      capacity: 6,
      location: "Tầng 1 - Khu gia đình",
      pricePerHour: 50000,
      features: ["Ghế trẻ em", "Gần khu vui chơi", "Menu trẻ em"],
      isAvailable: true
    },
    {
      id: "table-3",
      name: "Bàn công ty",
      capacity: 12,
      location: "Tầng 2 - Phòng họp",
      pricePerHour: 150000,
      features: ["Projector", "Whiteboard", "WiFi tốc độ cao", "Máy lạnh"],
      isAvailable: false
    },
    {
      id: "table-4",
      name: "Bàn đôi lãng mạn",
      capacity: 2,
      location: "Tầng 3 - Sân thượng",
      pricePerHour: 80000,
      features: ["View sông", "Ánh sáng ấm", "Trang trí hoa", "Nhạc nhẹ"],
      isAvailable: true
    },
    {
      id: "table-5",
      name: "Bàn nhóm bạn",
      capacity: 4,
      location: "Tầng 1 - Khu chính",
      pricePerHour: 30000,
      features: ["Gần bar", "Âm nhạc sống động", "Game bàn"],
      isAvailable: true
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const filteredTables = tableOptions.filter(table => {
    if (!guestCount) return true
    return table.capacity >= parseInt(guestCount)
  })

  const availableTables = filteredTables.filter(table => table.isAvailable)

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Đặt Bàn Thành Công!</h1>
            <p className="text-xl opacity-90">
              Cảm ơn bạn đã đặt bàn. Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Thông tin đặt bàn</CardTitle>
              <CardDescription>
                Mã đặt bàn: <span className="font-mono font-bold">#BK{Date.now().toString().slice(-6)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tên khách hàng</Label>
                  <p className="text-lg">{bookingData.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Số điện thoại</Label>
                  <p className="text-lg">{bookingData.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày & giờ</Label>
                  <p className="text-lg">
                    {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: vi })} - {selectedTime}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Số người</Label>
                  <p className="text-lg">{guestCount} người</p>
                </div>
              </div>
              
              {selectedTable && (
                <div>
                  <Label className="text-sm font-medium">Bàn đã chọn</Label>
                  <p className="text-lg">
                    {tableOptions.find(t => t.id === selectedTable)?.name}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex gap-4">
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Đặt bàn mới
                  </Button>
                  <Button>
                    Xem lịch sử đặt bàn
                  </Button>
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
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Đặt Bàn</h1>
          <p className="text-xl opacity-90">
            Đặt bàn trước để đảm bảo có chỗ ngồi tốt nhất
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt bàn</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin để đặt bàn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email (tùy chọn)"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày đặt bàn *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              "Chọn ngày"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Giờ đặt bàn *</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Số người *</Label>
                      <Select value={guestCount} onValueChange={setGuestCount} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số người" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10,12,15,20].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} người
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Table Selection */}
                  {guestCount && (
                    <div className="space-y-4">
                      <Label>Chọn bàn (tùy chọn)</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {availableTables.map((table) => (
                          <Card 
                            key={table.id} 
                            className={`cursor-pointer transition-colors ${
                              selectedTable === table.id ? 'ring-2 ring-orange-500' : ''
                            }`}
                            onClick={() => setSelectedTable(selectedTable === table.id ? "" : table.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{table.name}</h4>
                                <Badge variant="outline">
                                  <Users className="h-3 w-3 mr-1" />
                                  {table.capacity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {table.location}
                              </p>
                              <p className="font-medium text-orange-600 mb-2">
                                {formatPrice(table.pricePerHour)}/giờ
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {table.features.slice(0, 2).map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {table.features.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{table.features.length - 2} khác
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {availableTables.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Không có bàn phù hợp với số người đã chọn
                        </p>
                      )}
                    </div>
                  )}

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="requests">Yêu cầu đặc biệt</Label>
                    <Textarea
                      id="requests"
                      placeholder="Ví dụ: Sinh nhật, kỷ niệm, dị ứng thực phẩm..."
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Xác nhận đặt bàn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Hotline đặt bàn</p>
                    <p className="text-sm text-muted-foreground">(028) 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Giờ hoạt động</p>
                    <p className="text-sm text-muted-foreground">6:00 - 22:00 hàng ngày</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Chính sách đặt bàn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Đặt bàn trước ít nhất 2 giờ</p>
                <p>• Giữ bàn tối đa 15 phút sau giờ đặt</p>
                <p>• Hủy bàn miễn phí trước 1 giờ</p>
                <p>• Bàn VIP yêu cầu đặt cọc 50%</p>
                <p>• Nhóm trên 10 người liên hệ trực tiếp</p>
              </CardContent>
            </Card>

            {/* Popular Tables */}
            <Card>
              <CardHeader>
                <CardTitle>Bàn được ưa chuộng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Bàn đôi lãng mạn</p>
                      <p className="text-xs text-muted-foreground">View sông, trang trí hoa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Bàn gia đình</p>
                      <p className="text-xs text-muted-foreground">Ghế trẻ em, menu trẻ em</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
