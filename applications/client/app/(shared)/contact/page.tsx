import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@restaurant-manager.com",
      description: "Gửi email cho chúng tôi bất cứ lúc nào"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "+84 (0)28 1234 5678",
      description: "Hotline hỗ trợ 24/7"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      description: "Văn phòng chính tại Việt Nam"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "T2 - T6: 8:00 - 18:00",
      description: "Hỗ trợ trực tuyến 24/7"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ để được tư vấn miễn phí
            về giải pháp quản lý nhà hàng phù hợp nhất.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{info.content}</p>
                  <CardDescription>{info.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Gửi tin nhắn cho chúng tôi</h2>
              <p className="text-muted-foreground">
                Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24 giờ
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Biểu mẫu liên hệ</CardTitle>
                <CardDescription>
                  Vui lòng cung cấp thông tin chi tiết để chúng tôi hỗ trợ bạn tốt nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ *</Label>
                      <Input id="firstName" placeholder="Nhập họ của bạn" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên *</Label>
                      <Input id="lastName" placeholder="Nhập tên của bạn" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+84 901 234 567" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Tên nhà hàng/Công ty</Label>
                    <Input 
                      id="company" 
                      placeholder="Nhà hàng ABC" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề *</Label>
                    <Input 
                      id="subject" 
                      placeholder="Tôi muốn tìm hiểu về..." 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Vui lòng mô tả chi tiết nhu cầu của bạn..."
                      rows={5}
                      required 
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
              <p className="text-muted-foreground">
                Một số câu hỏi phổ biến từ khách hàng
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hệ thống có khó sử dụng không?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Không, hệ thống được thiết kế với giao diện thân thiện và trực quan. 
                    Chúng tôi cũng cung cấp đào tạo miễn phí cho đội ngũ của bạn.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chi phí sử dụng như thế nào?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chúng tôi có nhiều gói dịch vụ phù hợp với mọi quy mô nhà hàng. 
                    Liên hệ để được tư vấn gói phù hợp nhất.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Có hỗ trợ kỹ thuật không?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Có, chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua nhiều kênh: 
                    điện thoại, email, chat trực tuyến.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Có thể dùng thử miễn phí không?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Có, chúng tôi cung cấp bản dùng thử 30 ngày miễn phí 
                    với đầy đủ tính năng để bạn trải nghiệm.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
