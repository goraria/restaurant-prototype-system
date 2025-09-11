"use client";

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/elements/mode-toggle";
import { BoxIcon } from "@/components/elements/box-icon";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appGlobal } from "@/constants/constants"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { ChefHat, Users, BarChart3, Clock } from "lucide-react"
import { toast } from "sonner";
// import { useGetUsersQuery } from "@/state/api";

export default function HomePage() {
  const features = [
    {
      icon: ChefHat,
      title: "Quản lý thực đơn",
      description: "Dễ dàng quản lý món ăn, danh mục và giá cả"
    },
    {
      icon: Users,
      title: "Quản lý khách hàng",
      description: "Theo dõi thông tin khách hàng và lịch sử đơn hàng"
    },
    {
      icon: BarChart3,
      title: "Thống kê & Báo cáo",
      description: "Phân tích doanh thu và hiệu suất kinh doanh"
    },
    {
      icon: Clock,
      title: "Quản lý đơn hàng",
      description: "Xử lý đơn hàng nhanh chóng và hiệu quả"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/logos/logo.png"
              alt={appGlobal.name}
              width={120}
              height={120}
              className="rounded-2xl"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {appGlobal.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hệ thống quản lý nhà hàng toàn diện - Tối ưu hóa hoạt động kinh doanh của bạn
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/sign-up">Bắt đầu miễn phí</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="/sign-in">Đăng nhập</Link>
              </Button>
            </SignedOut>
            
            <SignedIn>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/manager">Vào Manager</Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/staff">Vào Staff</Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/customer">Vào Customer</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những công cụ mạnh mẽ giúp bạn quản lý nhà hàng một cách hiệu quả
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tham gia cùng hàng nghìn nhà hàng đang sử dụng hệ thống của chúng tôi
            </p>
            
            <SignedOut>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/sign-up">Đăng ký ngay</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logos/logo.png"
                  alt={appGlobal.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="font-bold text-lg">{appGlobal.name}</span>
              </div>
              <p className="text-muted-foreground">
                Hệ thống quản lý nhà hàng hiện đại và dễ sử dụng
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Tính năng</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Bảng giá</Link></li>
                <li><Link href="/help" className="hover:text-primary">Trợ giúp</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">Giới thiệu</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Liên hệ</Link></li>
                <li><Link href="/news" className="hover:text-primary">Tin tức</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">Trung tâm trợ giúp</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Chính sách bảo mật</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {appGlobal.name}. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


export function Home00() {
  // const { data: users } = useGetUsersQuery({});

  // console.log(users)

  return (
    <>
      <Button variant={"default"}>Japtor</Button>
      <BoxIcon
        type={"solid"}
        name={"heart"}
        size={"lg"}
      />
      <ModeToggle/>

      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Japtor Gorthenburg",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },

          })
        }
      >
        Show Toast
      </Button>
      users
    </>
  )
}

function Home0() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
