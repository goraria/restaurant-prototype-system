"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Palette,
  UserCheck,
  CalendarDays,
  User,
  CheckCircle,
  Crown,
  Flag,
  FileText,
  Phone,
  MessageSquare,
  Star,
  Users, 
  Mail, 
  LayoutGrid, 
  Link,
  UtensilsCrossed,
  Receipt,
  Calendar,
  Clock,
  CreditCard,
  Award,
  TrendingUp,
  ShoppingBag
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

  // Mock data cho thống kê khách hàng - thông tin nhà hàng
  const customerStats = {
    totalReservations: 24,
    completedOrders: 186,
    totalSpent: 12850000,
    favoriteRestaurant: "Waddles",
    memberSince: "2024",
    loyaltyPoints: 2450,
    lastVisit: "2024-08-20",
    averageOrderValue: 385000
  };

  const recentOrders = [
    { id: "ORD-001", date: "2024-08-20", restaurant: "Waddles", total: 450000, status: "Completed" },
    { id: "ORD-002", date: "2024-08-18", restaurant: "Waddles", total: 320000, status: "Completed" },
    { id: "ORD-003", date: "2024-08-15", restaurant: "Waddles", total: 680000, status: "Completed" }
  ];

  const joined = () => {
    if (user?.createdAt) {
      const timed = new Date(user.createdAt);
      // const monthNamess = [
      //   "January",
      //   "February",
      //   "March",
      //   "April",
      //   "May",
      //   "June",
      //   "July",
      //   "August",
      //   "September",
      //   "October",
      //   "November",
      //   "December"
      // ];
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
      ];
      const monthName = monthNames[timed.getMonth()];
      const year = timed.getFullYear();
      console.log("User joined at:", `${monthName} ${year}`);
      return `${monthName} ${year}`;
    }
  }

  joined();

	return (
    <>
      <Card className="overflow-hidden mb-6 py-0">
        <div className="">{/**user-profile-header-banner */}
          <img
            src="/backgrounds/profile-banner.png"
            alt="Banner image"
            className="rounded-top w-full"
          />
        </div>
        <div className="user-profile-header flex flex-column flex-lg-row text-sm-start text-center mb-6">
          <div className="shrink-0 ms-6 mt-1 sm:mx-0 mx-auto">{/*flex-shrink-0 mt-1 mx-sm-0 mx-auto*/}
            {/*block h-auto ms-0 ms-sm-6 rounded-3 user-profile-img*/}
            <Avatar className="user-profile-img block h-[138px] w-[138px] mx-auto sm:mx-0 sm:ms-6 rounded-2xl">
              {/*<Avatar className="user-profile-img block h-auto ms-0 sm:ms-6 rounded-2xl">*/}
              <AvatarImage
                src={user?.imageUrl}
                // src="/avatars/waddles.jpeg"
                alt="user image"
                width={128}
                height={128}
                className="object-cover h-32 w-32 aspect-square"
              />
              <AvatarFallback className="rounded-none text-2xl font-bold">SW</AvatarFallback>
            </Avatar>
            {/*<Image*/}
            {/*  src="/avatars/waddles.jpeg"*/}
            {/*  alt="user image"*/}
            {/*  width={128}*/}
            {/*  height={128}*/}
            {/*  objectFit="cover"*/}
            {/*  className="user-profile-img block h-auto ms-0 sm:ms-6 rounded-2xl"*/}
            {/*/>*/}
          </div>
          <div className="grow mt-3 lg:mt-5">{/*flex-grow-1 mt-3 mt-lg-5*/}
            {/*align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4*/}
            <div
              className="flex md:items-end sm:items-start items-center md:justify-between justify-start mx-5 md:flex-row flex-col gap-4">
              <div className="user-profile-info">
                <h4 className="mb-2 lg:mt-7 text-2xl font-semibold text-left">
                  {user?.fullName}
                </h4>
                {/*list-inline mb-0 flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 mt-4*/}
                <ul className="flex flex-wrap list-inline mb-0 items-center sm:justify-start justify-center gap-4 mt-4">
                  <li className="list-inline-item">
                    <Palette size={20} className="align-top me-2" />
                    <span className="font-medium">Khách hàng thân thiết</span>
                  </li>
                  <li className="list-inline-item">
                    <MapPin size={20} className="align-top me-2" />
                    <span className="font-medium">Hà Nội, Việt Nam</span>
                  </li>
                  <li className="list-inline-item">
                    <CalendarDays size={20} className="align-top me-2" />
                    <span className="font-medium"> Tham gia {joined()} </span>
                    {/* <span className="font-medium"> Joined April 2021</span> */}
                  </li>
                </ul>
              </div>
              <Button variant="default" className="mb-1 cursor-pointer">
                <UserCheck className="icon-base bx bx-user-check icon-sm me-" />
                Đã kết nối
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid xl:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 gap-6">
        <div className="xl:col-span-12 lg:col-span-12 md:col-span-12">
          <div className="nav-align-top">
            <ul className="flex flex-column flex-sm-row mb-6 gap-sm-0 gap-1">
              <li className="nav-item">
                <Button className="nav-link active cursor-pointer" variant="default">
                  <User />Profile
                </Button>
              </li>
              <li className="nav-item">
                <Button className="nav-link cursor-pointer" variant="ghost">
                  <Users />Teams
                </Button>
              </li>
              <li className="nav-item">
                <Button className="nav-link cursor-pointer" variant="ghost">
                  <LayoutGrid />Projects
                </Button>
              </li>
              <li className="nav-item">
                <Button className="nav-link cursor-pointer" variant="ghost">
                  <Link />Connections
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 gap-6">
        {/* Left Column - About User and Restaurant Activity */}
        <div className="xl:col-span-4 lg:col-span-5 md:col-span-5 space-y-6">
          <Card>
            <CardContent>
              <p className="text-xs uppercase text-muted-foreground">Giới thiệu</p>
              <ul className="mt-3 py-1 space-y-4">
                <li className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Họ và tên:</span>
                  <span>{user?.fullName}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Trạng thái:</span>
                  <span>Khách hàng VIP</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Hạng thành viên:</span>
                  <span>Gold Member</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium mx-2">Điểm tích lũy:</span>
                  <span>{customerStats.loyaltyPoints.toLocaleString()} điểm</span>
                </li>
              </ul>

              <p className="text-xs uppercase text-muted-foreground mt-6">Liên hệ</p>
              <ul className="mt-3 py-1 space-y-4">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Số điện thoại:</span>
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Tên người dùng:</span>
                  <span>{user?.username}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Email:</span>
                  <span>{user?.emailAddresses[0].emailAddress}</span>
                </li>
              </ul>

              <p className="text-xs uppercase text-muted-foreground mt-6">Hoạt động nhà hàng</p>
              <ul className="mt-3 py-1 space-y-4">
                <li className="flex items-center">
                  <UtensilsCrossed className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Số lần đặt bàn:</span>
                  <span>{customerStats.totalReservations} lần</span>
                </li>
                <li className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Đơn hàng hoàn thành:</span>
                  <span>{customerStats.completedOrders} đơn</span>
                </li>
                <li className="flex items-center">
                  <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium mx-2">Tổng chi tiêu:</span>
                  <span>{customerStats.totalSpent.toLocaleString('vi-VN')} VND</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Lần cuối ghé thăm:</span>
                  <span>{customerStats.lastVisit}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-xs uppercase text-muted-foreground">Thống kê chi tiêu</p>
              <ul className="mt-3 py-1 space-y-4">
                <li className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium mx-2">Giá trị đơn hàng TB:</span>
                  <span>{customerStats.averageOrderValue.toLocaleString('vi-VN')} VND</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium mx-2">Nhà hàng yêu thích:</span>
                  <span>{customerStats.favoriteRestaurant}</span>
                </li>
                <li className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium mx-2">Thành viên từ:</span>
                  <span>{customerStats.memberSince}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order History and Restaurant Activity */}
        <div className="xl:col-span-8 lg:col-span-7 md:col-span-7">
          <Card>
            <CardContent>
              <p className="text-xs uppercase text-muted-foreground mb-4">Lịch sử đơn hàng gần đây</p>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.restaurant}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {order.total.toLocaleString('vi-VN')} VND
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem tất cả lịch sử đơn hàng
                </Button>
              </div>

              <div className="mt-8">
                <p className="text-xs uppercase text-muted-foreground mb-4">Thao tác nhanh</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 flex flex-col">
                    <UtensilsCrossed className="h-6 w-6 mb-1" />
                    <span className="text-sm">Đặt bàn</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col">
                    <ShoppingBag className="h-6 w-6 mb-1" />
                    <span className="text-sm">Đặt món</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col">
                    <Star className="h-6 w-6 mb-1" />
                    <span className="text-sm">Đánh giá</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col">
                    <Award className="h-6 w-6 mb-1" />
                    <span className="text-sm">Ưu đãi</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
