"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Phone, Mail, Utensils, Coffee, Users, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CustomerHomePage() {
  const featuredDishes = [
    {
      id: 1,
      name: "Phở Bò Đặc Biệt",
      description: "Phở bò truyền thống với thịt bò tươi ngon, nước dùng trong suốt",
      price: "89,000",
      image: "/images/dishes/pho-bo.jpg",
      rating: 4.8,
      category: "Món chính"
    },
    {
      id: 2,
      name: "Gỏi Cuốn Tôm Thịt",
      description: "Gỏi cuốn tươi mát với tôm, thịt heo và rau thơm",
      price: "45,000",
      image: "/images/dishes/goi-cuon.jpg",
      rating: 4.7,
      category: "Khai vị"
    },
    {
      id: 3,
      name: "Cà Phê Sữa Đá",
      description: "Cà phê phin truyền thống với sữa đặc đá mát lạnh",
      price: "25,000",
      image: "/images/dishes/ca-phe.jpg",
      rating: 4.9,
      category: "Đồ uống"
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      comment: "Món ăn rất ngon, phục vụ tốt. Sẽ quay lại lần sau!",
      date: "2025-08-20"
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 5,
      comment: "Không gian ấm cúng, thức ăn tươi ngon. Highly recommended!",
      date: "2025-08-18"
    },
    {
      id: 3,
      name: "Lê Minh C",
      rating: 4,
      comment: "Giá cả hợp lý, chất lượng tốt. Nhân viên thân thiện.",
      date: "2025-08-15"
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Khám Phá Hương Vị
              <br />
              <span className="text-yellow-300">Ẩm Thực Việt</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Trải nghiệm những món ăn truyền thống Việt Nam được chế biến 
              từ nguyên liệu tươi ngon nhất, phục vụ trong không gian ấm cúng.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="/customer/menu">Xem Thực Đơn</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                <Link href="/customer/booking">Đặt Bàn Ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-2xl font-bold">150+</h3>
              <p className="text-muted-foreground">Món ăn đa dạng</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-bold">10,000+</h3>
              <p className="text-muted-foreground">Khách hàng hài lòng</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-muted-foreground">Phục vụ liên tục</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-2xl font-bold">4.8★</h3>
              <p className="text-muted-foreground">Đánh giá trung bình</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Món Ăn Nổi Bật</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá những món ăn được yêu thích nhất tại nhà hàng của chúng tôi
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Utensils className="h-16 w-16" />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{dish.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{dish.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{dish.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">{dish.price}₫</span>
                  <Button size="sm">Đặt món</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/customer/menu">Xem Toàn Bộ Thực Đơn</Link>
          </Button>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khách Hàng Nói Gì</h2>
            <p className="text-muted-foreground">
              Những đánh giá thật từ khách hàng của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{review.comment}"</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{review.name}</span>
                    <span className="text-muted-foreground">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/customer/reviews">Xem Thêm Đánh Giá</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Liên Hệ & Địa Chỉ</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>(028) 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span>contact@restaurant.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Mở cửa 6:00 - 22:00 hàng ngày</span>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/customer/contact">Liên Hệ Ngay</Link>
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-16 w-16 mx-auto mb-4" />
              <p>Google Maps Integration</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
