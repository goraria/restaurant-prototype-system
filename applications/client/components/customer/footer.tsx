"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  Twitter,
  Utensils,
  Calendar,
  MessageCircle,
  Camera,
  Star,
  Heart,
  Award
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Khám phá",
      links: [
        { name: "Trang chủ", href: "/customer" },
        { name: "Thực đơn", href: "/customer/menu" },
        { name: "Đặt bàn", href: "/customer/booking" },
        { name: "Thư viện ảnh", href: "/customer/gallery" },
        { name: "Blog ẩm thực", href: "/customer/blog" }
      ]
    },
    {
      title: "Dịch vụ",
      links: [
        { name: "Đặt bàn online", href: "/customer/booking" },
        { name: "Giao hàng tận nơi", href: "#" },
        { name: "Tổ chức tiệc", href: "#" },
        { name: "Buffet cuối tuần", href: "#" },
        { name: "Menu doanh nghiệp", href: "#" }
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Liên hệ", href: "/customer/contact" },
        { name: "Câu hỏi thường gặp", href: "#" },
        { name: "Chính sách đặt bàn", href: "#" },
        { name: "Đánh giá của bạn", href: "/customer/reviews" },
        { name: "Góp ý & Khiếu nại", href: "/customer/contact" }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Youtube, href: "#", name: "YouTube" },
    { icon: Twitter, href: "#", name: "Twitter" }
  ]

  const achievements = [
    { icon: Award, text: "Top 10 nhà hàng Việt Nam 2024" },
    { icon: Star, text: "4.8/5 sao đánh giá khách hàng" },
    { icon: Heart, text: "10,000+ khách hàng hài lòng" }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-orange-500 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Đăng ký nhận thông tin từ chúng tôi
            </h3>
            <p className="mb-6 opacity-90">
              Nhận những ưu đãi đặc biệt, món ăn mới và sự kiện thú vị từ nhà hàng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Nhập email của bạn"
                className="flex-1 bg-white text-black"
              />
              <Button variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/customer" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl">Restaurant</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Nhà hàng ẩm thực Việt Nam truyền thống với hơn 10 năm kinh nghiệm. 
              Chúng tôi tự hào mang đến những món ăn ngon nhất từ khắp ba miền 
              Bắc - Trung - Nam trong không gian ấm cúng và thân thiện.
            </p>

            {/* Achievements */}
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-orange-400" />
                    <span className="text-sm text-gray-300">{achievement.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Contact & Social */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Thông tin liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Đường ABC, Phường 1</p>
                  <p className="text-gray-300">Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-gray-300">Hotline: (028) 1234 5678</p>
                  <p className="text-gray-300">Đặt bàn: (028) 1234 5679</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <p className="text-gray-300">info@restaurant.com</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-400" />
                <p className="text-gray-300">6:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kết nối với chúng tôi</h4>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">Đặt bàn trước 24h để có ưu đãi</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">Chat với chúng tôi qua Zalo</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 text-sm">Tag @restaurant để được repost</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-300 text-sm">
            © {currentYear} Restaurant. Tất cả quyền được bảo lưu.
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
              Chính sách cookie
            </Link>
            <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
