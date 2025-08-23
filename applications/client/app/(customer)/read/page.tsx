"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Facebook, Instagram, Youtube } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Logic gửi form
    console.log("Contact form submitted:", formData)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: [
        "123 Đường ABC, Phường 1",
        "Quận 1, TP. Hồ Chí Minh",
        "Việt Nam"
      ]
    },
    {
      icon: Phone,
      title: "Điện thoại",
      details: [
        "Hotline: (028) 1234 5678",
        "Đặt bàn: (028) 1234 5679",
        "Zalo: 0901 234 567"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@restaurant.com",
        "booking@restaurant.com",
        "support@restaurant.com"
      ]
    },
    {
      icon: Clock,
      title: "Giờ hoạt động",
      details: [
        "Thứ 2 - Chủ nhật: 6:00 - 22:00",
        "Ngày lễ: 7:00 - 21:00",
        "Phục vụ liên tục"
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#", followers: "10K" },
    { icon: Instagram, name: "Instagram", url: "#", followers: "8K" },
    { icon: Youtube, name: "YouTube", url: "#", followers: "5K" }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Cảm ơn bạn đã liên hệ!</h1>
            <p className="text-xl opacity-90">
              Chúng tôi sẽ phản hồi trong vòng 24 giờ
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Thông tin đã gửi</CardTitle>
              <CardDescription>
                Mã liên hệ: <span className="font-mono font-bold">#CT{Date.now().toString().slice(-6)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Họ tên</Label>
                  <p className="text-lg">{formData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-lg">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Điện thoại</Label>
                  <p className="text-lg">{formData.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loại yêu cầu</Label>
                  <p className="text-lg">{formData.type}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tiêu đề</Label>
                <p className="text-lg">{formData.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Nội dung</Label>
                <p className="text-lg">{formData.message}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-4">
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Gửi tin nhắn mới
                  </Button>
                  <Button>
                    Về trang chủ
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Liên Hệ</h1>
          <p className="text-xl opacity-90">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                <CardDescription>
                  Điền thông tin và chúng tôi sẽ phản hồi sớm nhất có thể
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Loại yêu cầu *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại yêu cầu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Đặt bàn</SelectItem>
                          <SelectItem value="menu">Thắc mắc thực đơn</SelectItem>
                          <SelectItem value="event">Tổ chức sự kiện</SelectItem>
                          <SelectItem value="complaint">Khiếu nại</SelectItem>
                          <SelectItem value="suggestion">Góp ý</SelectItem>
                          <SelectItem value="partnership">Hợp tác</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input
                      id="subject"
                      placeholder="Nhập tiêu đề tin nhắn"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập nội dung chi tiết..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Kết nối với chúng tôi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{social.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{social.followers}</p>
                        <p className="text-xs text-muted-foreground">followers</p>
                      </div>
                    </div>
                  )
                })}
                <Button className="w-full" variant="outline">
                  Theo dõi chúng tôi
                </Button>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Vị trí trên bản đồ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <p>Google Maps</p>
                    <p className="text-sm">123 Đường ABC, Quận 1</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Mở bản đồ
                </Button>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi ngay: (028) 1234 5678
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Zalo
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Nhà hàng có phục vụ delivery không?</p>
                  <p className="text-muted-foreground">Có, chúng tôi giao hàng trong bán kính 5km.</p>
                </div>
                <div>
                  <p className="font-medium">Có bãi đậu xe không?</p>
                  <p className="text-muted-foreground">Có bãi đậu xe miễn phí cho khách hàng.</p>
                </div>
                <div>
                  <p className="font-medium">Nhận tổ chức tiệc không?</p>
                  <p className="text-muted-foreground">Có, hỗ trợ tổ chức các sự kiện từ 20 người trở lên.</p>
                </div>
                <Button variant="ghost" className="w-full text-sm">
                  Xem thêm câu hỏi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
