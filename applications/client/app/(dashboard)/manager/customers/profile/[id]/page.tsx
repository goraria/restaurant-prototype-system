"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award, Calendar, Check,
  CheckCircle, Clock,
  CreditCard,
  Crown, Grid2x2Plus, Grid2X2Plus, LayoutGrid, Link,
  Mail, MapPin,
  MessageSquare,
  Phone, Receipt,
  ShoppingBag,
  Star, TrendingUp,
  User, Users,
  UtensilsCrossed
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs";

export default function CustomerProfile() {
  const { user } = useUser();
  // const { sessionClaims } = auth()

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

  return (
    <>
      <div className="grid xl:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 gap-6">
        {/* Left Column - About User and Restaurant Activity */}
        <div className="xl:col-span-4 lg:col-span-5 md:col-span-5 space-y-6">
          <Card className="p-6 pt-12">
            <div className="flex flex-col gap-6">
              <div className="user-profile-center flex items-center justify-center flex-col gap-4">
                <div className="flex flex-col items-center gap-4 shrink-0">
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
                  <h5 className="font-medium text-lg">{user?.fullName}</h5>
                </div>
                <Badge variant="default">
                  Author
                </Badge>
              </div>
              <div className="flex items-center justify-around flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-professional-indigo/24 p-0 h-9 w-9">
                    <Check
                      className="h-4 w-4 text-professional-indigo"
                      style={{ width: 16, height: 16 }}
                    />
                  </Badge>
                  <div>
                    <h5 className="font-medium">1.23k</h5>
                    <p className="text-xs text-muted-foreground">Task Done</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-professional-indigo/24 p-0 h-9 w-9">
                    <Grid2x2Plus
                      className="h-4 w-4 text-professional-indigo"
                      style={{ width: 16, height: 16 }}
                    />
                  </Badge>
                  <div>
                    <h5 className="font-medium">568</h5>
                    <p className="text-xs text-muted-foreground">Project Done</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-2xl font-medium">Details</h5>
              <hr className="my-4" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Username:</span>
                  <span className="text-muted-foreground">@{user?.username}</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">{user?.emailAddresses[0].emailAddress}</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Trạng thái:</span>
                  <span className="text-green-600">active</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Loại tài khoản:</span>
                  <span className="text-muted-foreground">{}</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Tax ID:</span>
                  <span className="text-muted-foreground">Tax-8894</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Contact:</span>
                  <span className="text-muted-foreground">+1 (234) 464-0600</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Language:</span>
                  <span className="text-muted-foreground">English</span>
                </div>
                <div className="flex items-center flex-wrap text-sm gap-x-2">
                  <span className="font-medium">Country:</span>
                  <span className="text-muted-foreground">France</span>
                </div>
              </div>
            </div>
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