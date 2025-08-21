import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Users, Shield, DollarSign, BookOpen, HeadphonesIcon } from "lucide-react"

export default function PagesPage() {
  const pages = [
    {
      icon: FileText,
      title: "Tính năng",
      description: "Khám phá các tính năng mạnh mẽ của hệ thống quản lý nhà hàng",
      href: "/features",
      badge: "Mới"
    },
    {
      icon: DollarSign,
      title: "Bảng giá",
      description: "Xem các gói dịch vụ và chọn phương án phù hợp với nhà hàng của bạn",
      href: "/pricing",
      badge: null
    },
    {
      icon: HeadphonesIcon,
      title: "Trợ giúp",
      description: "Trung tâm hỗ trợ với hướng dẫn chi tiết và câu hỏi thường gặp",
      href: "/help",
      badge: null
    },
    {
      icon: BookOpen,
      title: "Blog",
      description: "Bài viết về xu hướng ngành F&B và tips quản lý nhà hàng hiệu quả",
      href: "/blog",
      badge: null
    },
    {
      icon: Shield,
      title: "Chính sách bảo mật",
      description: "Tìm hiểu về cách chúng tôi bảo vệ dữ liệu và quyền riêng tư của bạn",
      href: "/privacy",
      badge: null
    },
    {
      icon: FileText,
      title: "Điều khoản sử dụng",
      description: "Các điều khoản và điều kiện sử dụng dịch vụ của chúng tôi",
      href: "/terms",
      badge: null
    },
    {
      icon: Users,
      title: "Tin tức",
      description: "Cập nhật tin tức mới nhất về sản phẩm và ngành công nghiệp",
      href: "/news",
      badge: "Hot"
    },
    {
      icon: FileText,
      title: "Tài liệu API",
      description: "Hướng dẫn tích hợp API cho các nhà phát triển",
      href: "/api-docs",
      badge: "Dev"
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
            Tất cả trang
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Khám phá tất cả các trang và tài nguyên có sẵn để tìm hiểu thêm 
            về hệ thống quản lý nhà hàng của chúng tôi.
          </p>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pages.map((page, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-200">
              {page.badge && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    page.badge === 'Mới' ? 'bg-green-100 text-green-800' :
                    page.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {page.badge}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                  <page.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{page.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  {page.description}
                </CardDescription>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={page.href}>
                    Xem thêm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Liên kết nhanh</h2>
              <p className="text-muted-foreground">
                Các trang thường được truy cập nhất
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-6 flex-col">
                <Link href="/features">
                  <FileText className="h-6 w-6 mb-2" />
                  Tính năng
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-6 flex-col">
                <Link href="/pricing">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Bảng giá
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-6 flex-col">
                <Link href="/help">
                  <HeadphonesIcon className="h-6 w-6 mb-2" />
                  Trợ giúp
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-6 flex-col">
                <Link href="/contact">
                  <Users className="h-6 w-6 mb-2" />
                  Liên hệ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Không tìm thấy thông tin bạn cần?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Hãy liên hệ với chúng tôi để được hỗ trợ trực tiếp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Liên hệ hỗ trợ</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/help">Trung tâm trợ giúp</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
