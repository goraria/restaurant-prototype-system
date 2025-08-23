"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  Search, 
  Phone, 
  Clock, 
  MapPin, 
  ShoppingCart, 
  User, 
  Heart,
  Utensils,
  Calendar,
  MessageCircle,
  Camera,
  Star,
  Mail
} from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      title: "Trang chủ",
      href: "/customer",
      icon: Utensils
    },
    {
      title: "Thực đơn",
      href: "/customer/menu",
      icon: Utensils,
      description: "Khám phá các món ăn ngon"
    },
    {
      title: "Đặt bàn",
      href: "/customer/booking",
      icon: Calendar,
      description: "Đặt bàn trước để có chỗ ngồi tốt nhất"
    },
    {
      title: "Khám phá",
      href: "#",
      icon: Camera,
      children: [
        {
          title: "Thư viện ảnh",
          href: "/customer/gallery",
          description: "Những khoảnh khắc đẹp tại nhà hàng"
        },
        {
          title: "Blog ẩm thực", 
          href: "/customer/blog",
          description: "Câu chuyện và kinh nghiệm ẩm thực"
        },
        {
          title: "Đánh giá",
          href: "/customer/reviews", 
          description: "Đánh giá từ khách hàng"
        }
      ]
    },
    {
      title: "Liên hệ",
      href: "/customer/contact",
      icon: Mail,
      description: "Thông tin liên hệ và hỗ trợ"
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-orange-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: (028) 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>6:00 - 22:00 hàng ngày</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/customer/booking" className="hover:underline">
                Đặt bàn ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/customer" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">Restaurant</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="text-base">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {child.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm món ăn..."
                className="w-64 pl-10"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/customer/reviews">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Yêu thích</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
                <span className="hidden sm:inline ml-2">Giỏ hàng</span>
              </Button>

              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Tài khoản</span>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm món ăn..."
                      className="pl-10"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <div key={item.title}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                        {item.children && (
                          <div className="ml-8 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                href={child.href}
                                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Mobile Contact Info */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3 px-4">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">(028) 1234 5678</span>
                    </div>
                    <div className="flex items-center gap-3 px-4">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">6:00 - 22:00</span>
                    </div>
                    <div className="flex items-center gap-3 px-4">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">123 Đường ABC, Q1</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="mx-4" asChild>
                    <Link href="/customer/booking">
                      <Calendar className="h-4 w-4 mr-2" />
                      Đặt bàn ngay
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
