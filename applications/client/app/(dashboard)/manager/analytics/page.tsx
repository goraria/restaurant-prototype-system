"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "../components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, Activity, Users, ShoppingCart, DollarSign } from "lucide-react"
import { useAnimatedCurrency, useAnimatedNumber, useAnimatedPercentage } from "@/hooks/use-counter-animation"

export default function AnalyticsPage() {
  // Sử dụng animation hooks với delay khác nhau
  const todayRevenue = useAnimatedCurrency(2543000, 0)
  const todayOrders = useAnimatedNumber(127, 200)
  const newCustomers = useAnimatedNumber(23, 400)
  const avgOrderValue = useAnimatedCurrency(200236, 600)
  
  const revenueChange = useAnimatedPercentage(0.125, 1, 800)
  const ordersChange = useAnimatedPercentage(0.082, 1, 1000)
  const customersChange = useAnimatedPercentage(-0.021, 1, 1200)
  const aovChange = useAnimatedPercentage(0.154, 1, 1400)

  // Top dishes animation
  const topDishes = [
    { name: "Phở Bò Tái", orders: useAnimatedNumber(45, 1600), revenue: useAnimatedCurrency(1350000, 1600) },
    { name: "Bún Chả", orders: useAnimatedNumber(32, 1800), revenue: useAnimatedCurrency(960000, 1800) },
    { name: "Bánh Mì Thịt", orders: useAnimatedNumber(28, 2000), revenue: useAnimatedCurrency(420000, 2000) },
    { name: "Chả Cá Lă Vọng", orders: useAnimatedNumber(19, 2200), revenue: useAnimatedCurrency(950000, 2200) },
    { name: "Gỏi Cuốn", orders: useAnimatedNumber(15, 2400), revenue: useAnimatedCurrency(225000, 2400) },
  ]

  // Revenue tab animations
  const monthlyRevenue = useAnimatedCurrency(45231000, 0)
  const weeklyRevenue = useAnimatedCurrency(12543000, 200)
  const dailyAverage = useAnimatedCurrency(1508000, 400)
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu hôm nay</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayRevenue}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +{revenueChange} so với hôm qua
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng hôm nay</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayOrders}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +{ordersChange} so với hôm qua
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newCustomers}</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {customersChange} so với hôm qua
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giá trị trung bình đơn hàng</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOrderValue}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +{aovChange} so với hôm qua
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Doanh thu theo giờ</CardTitle>
                <CardDescription>
                  Phân bổ doanh thu trong ngày hôm nay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Biểu đồ doanh thu theo giờ
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Món ăn bán chạy</CardTitle>
                <CardDescription>Top 5 món ăn được đặt nhiều nhất hôm nay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDishes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.orders} đơn hàng</p>
                      </div>
                      <div className="text-sm font-medium">{item.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyRevenue}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% từ tháng trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu tuần này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyRevenue}</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% từ tuần trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayRevenue}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% từ hôm qua
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tổng khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">
                  +180 khách hàng mới tháng này
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng thân thiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456</div>
                <p className="text-xs text-muted-foreground">
                  19.4% tổng số khách hàng
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ quay lại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% từ tháng trước
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% từ tháng trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11,842</div>
                <p className="text-xs text-muted-foreground">
                  96.8% tỷ lệ hoàn thành
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng hủy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">392</div>
                <p className="text-xs text-muted-foreground">
                  3.2% tỷ lệ hủy
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Thời gian xử lý TB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 phút</div>
                <p className="text-xs text-muted-foreground">
                  -2 phút so với tháng trước
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}