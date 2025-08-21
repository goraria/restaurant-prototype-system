import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appGlobal } from "@/constants/constants"
import { SignedOut } from "@clerk/nextjs"
import { ArrowLeft, Heart, Target, Users } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Đam mê ẩm thực",
      description: "Chúng tôi tin rằng ẩm thực là nghệ thuật và mỗi bữa ăn đều đáng được trân trọng"
    },
    {
      icon: Users,
      title: "Hỗ trợ khách hàng",
      description: "Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giúp đỡ nhà hàng của bạn thành công"
    },
    {
      icon: Target,
      title: "Tập trung kết quả",
      description: "Chúng tôi tối ưu hóa từng tính năng để mang lại hiệu quả kinh doanh tối đa"
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
            Về {appGlobal.name}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Chúng tôi là đội ngũ đam mê công nghệ và ẩm thực, tạo ra những giải pháp 
            quản lý nhà hàng tiên tiến nhất
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Được thành lập vào năm 2020, {appGlobal.name} ra đời từ nhận thức về 
                    những thách thức mà các nhà hàng phải đối mặt trong việc quản lý 
                    hoạt động hàng ngày.
                  </p>
                  <p>
                    Chúng tôi bắt đầu với một ý tưởng đơn giản: tạo ra một hệ thống 
                    quản lý nhà hàng thực sự dễ sử dụng và hiệu quả, giúp các chủ nhà hàng 
                    tập trung vào điều họ làm tốt nhất - tạo ra những trải nghiệm ẩm thực tuyệt vời.
                  </p>
                  <p>
                    Ngày nay, hàng nghìn nhà hàng trên toàn quốc đang tin tưởng và sử dụng 
                    hệ thống của chúng tôi để tối ưu hóa hoạt động kinh doanh.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/logos/logo.png"
                  alt="About us"
                  width={300}
                  height={300}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những nguyên tắc định hướng cách chúng tôi xây dựng sản phẩm và phục vụ khách hàng
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              &ldquo;Trao quyền cho mọi nhà hàng với công nghệ tiên tiến, 
              giúp họ tập trung vào việc tạo ra những trải nghiệm ẩm thực đáng nhớ&rdquo;
            </p>
            <SignedOut>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/sign-up">Tham gia cùng chúng tôi</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Nhà hàng tin tưởng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Đơn hàng xử lý</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Thời gian hoạt động</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
