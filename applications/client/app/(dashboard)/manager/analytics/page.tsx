"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "../components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Download, TrendingUp, TrendingDown, Activity, Users, ShoppingCart, DollarSign,
  Clock, Star, Target, BarChart3, PieChart, Calendar,
  ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { useAnimatedCurrency, useAnimatedNumber, useAnimatedPercentage } from "@/hooks/use-counter-animation"

interface SalesData {
  period: string
  revenue: number
  orders: number
  customers: number
  averageOrderValue: number
  growthRate: number
}

interface PopularItem {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  growth: number
}

interface PeakHour {
  hour: string
  orders: number
  revenue: number
  percentage: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week')
  
  // Sử dụng animation hooks với delay khác nhau
  const todayRevenue = useAnimatedCurrency(2543000, 0)
  const todayOrders = useAnimatedNumber(127, 200)
  const newCustomers = useAnimatedNumber(23, 400)
  const avgOrderValue = useAnimatedCurrency(200236, 600)
  
  const revenueChange = useAnimatedPercentage(0.125, 1, 800)
  const ordersChange = useAnimatedPercentage(0.082, 1, 1000)
  const customersChange = useAnimatedPercentage(-0.021, 1, 1200)

  const salesData: SalesData = {
    period: timeRange === 'today' ? 'Hôm nay' : timeRange === 'week' ? 'Tuần này' : timeRange === 'month' ? 'Tháng này' : 'Quý này',
    revenue: timeRange === 'today' ? 45800000 : timeRange === 'week' ? 285000000 : timeRange === 'month' ? 1250000000 : 3850000000,
    orders: timeRange === 'today' ? 156 : timeRange === 'week' ? 1247 : timeRange === 'month' ? 5680 : 18450,
    customers: timeRange === 'today' ? 134 : timeRange === 'week' ? 987 : timeRange === 'month' ? 4230 : 13450,
    averageOrderValue: timeRange === 'today' ? 293700 : timeRange === 'week' ? 228650 : timeRange === 'month' ? 220070 : 208650,
    growthRate: timeRange === 'today' ? 12.5 : timeRange === 'week' ? 8.3 : timeRange === 'month' ? 15.7 : 22.4
  }

  const popularItems: PopularItem[] = [
    { id: "1", name: "Phở Đặc Biệt", category: "Món chính", sales: 245, revenue: 36750000, growth: 15.2 },
    { id: "2", name: "Cơm Tấm Sườn", category: "Món chính", sales: 198, revenue: 23760000, growth: 8.7 },
    { id: "3", name: "Bún Bò Huế", category: "Món chính", sales: 167, revenue: 25050000, growth: -2.1 },
    { id: "4", name: "Trà Sữa Matcha", category: "Đồ uống", sales: 312, revenue: 18720000, growth: 25.6 },
    { id: "5", name: "Chè Đậu Đỏ", category: "Tráng miệng", sales: 89, revenue: 5340000, growth: 18.9 }
  ]

  const peakHours: PeakHour[] = [
    { hour: "11:00-12:00", orders: 45, revenue: 13200000, percentage: 18.5 },
    { hour: "12:00-13:00", orders: 52, revenue: 15600000, percentage: 21.3 },
    { hour: "18:00-19:00", orders: 38, revenue: 11400000, percentage: 15.6 },
    { hour: "19:00-20:00", orders: 41, revenue: 12300000, percentage: 16.8 },
    { hour: "20:00-21:00", orders: 32, revenue: 9600000, percentage: 13.2 }
  ]

  const customerSatisfaction = {
    averageRating: 4.7,
    totalReviews: 1247,
    ratingDistribution: [
      { stars: 5, count: 689, percentage: 55.3 },
      { stars: 4, count: 374, percentage: 30.0 },
      { stars: 3, count: 124, percentage: 9.9 },
      { stars: 2, count: 37, percentage: 3.0 },
      { stars: 1, count: 23, percentage: 1.8 }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }
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
        <h2 className="text-3xl font-bold tracking-tight">Phân tích kinh doanh</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: 'today' | 'week' | 'month' | 'quarter') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
            </SelectContent>
          </Select>
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
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="operations">Vận hành</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
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

        {/* Phase 2 Advanced Analytics */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sản phẩm bán chạy {salesData.period.toLowerCase()}
              </CardTitle>
              <CardDescription>
                Phân tích hiệu suất sản phẩm và xu hướng bán hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{item.category}</Badge>
                          <span>•</span>
                          <span>{formatNumber(item.sales)} lượt bán</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.revenue)}</p>
                      <div className="flex items-center justify-end gap-1">
                        {item.growth >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs ${item.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(item.growth)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích danh mục</CardTitle>
                <CardDescription>Doanh thu theo từng loại sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Món chính</span>
                    <span className="font-medium">65% • {formatCurrency(182000000)}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Đồ uống</span>
                    <span className="font-medium">20% • {formatCurrency(56000000)}</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tráng miệng</span>
                    <span className="font-medium">10% • {formatCurrency(28000000)}</span>
                  </div>
                  <Progress value={10} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Khai vị</span>
                    <span className="font-medium">5% • {formatCurrency(14000000)}</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margin phân tích</CardTitle>
                <CardDescription>Tỷ suất lợi nhuận theo sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">68.5%</p>
                    <p className="text-sm text-muted-foreground">Margin trung bình</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Đồ uống</span>
                      <span className="text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tráng miệng</span>
                      <span className="text-green-600">75%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Món chính</span>
                      <span className="text-yellow-600">55%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Khai vị</span>
                      <span className="text-red-600">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Giờ cao điểm
                </CardTitle>
                <CardDescription>Phân tích lưu lượng khách theo giờ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {peakHours.map((hour, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{hour.hour}</span>
                      <span>{hour.orders} đơn • {formatCurrency(hour.revenue)}</span>
                    </div>
                    <Progress value={hour.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  KPI vận hành
                </CardTitle>
                <CardDescription>Chỉ số hiệu suất chính</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tỷ lệ sử dụng bàn</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hiệu suất nhân viên</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Thời gian phục vụ trung bình</span>
                      <span className="font-medium">12 phút</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Độ hài lòng khách hàng</span>
                      <span className="font-medium">{customerSatisfaction.averageRating}/5.0</span>
                    </div>
                    <Progress value={(customerSatisfaction.averageRating / 5) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Đánh giá khách hàng chi tiết
              </CardTitle>
              <CardDescription>
                Phân tích mức độ hài lòng và phản hồi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-500">{customerSatisfaction.averageRating}</p>
                    <p className="text-muted-foreground">Điểm trung bình</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(customerSatisfaction.totalReviews)} đánh giá
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {customerSatisfaction.ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <span className="text-sm w-6">{rating.stars}★</span>
                      <Progress value={rating.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Xu hướng kinh doanh
                </CardTitle>
                <CardDescription>AI insights và dự đoán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Tích cực</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Doanh thu dự kiến tăng 15% trong tuần tới dựa trên xu hướng hiện tại
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Cảnh báo</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Thời gian chờ tăng 20% vào giờ cao điểm, cần tối ưu hóa quy trình
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Cơ hội</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Trà sữa Matcha có tăng trưởng 25%, nên mở rộng menu đồ uống
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Khuyến nghị tối ưu</CardTitle>
                <CardDescription>Gợi ý cải thiện hiệu suất</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Tăng nhân sự ca trưa</p>
                      <p className="text-xs text-muted-foreground">
                        Giảm thời gian chờ từ 15 phút xuống 10 phút
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Khuyến mãi combo</p>
                      <p className="text-xs text-muted-foreground">
                        Tăng AOV từ 220k lên 280k với combo deals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Training nhân viên</p>
                      <p className="text-xs text-muted-foreground">
                        Cải thiện satisfaction score từ 4.7 lên 4.9
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Tối ưu menu</p>
                      <p className="text-xs text-muted-foreground">
                        Loại bỏ 3 món ít bán, thêm 2 món mới trending
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forecast doanh thu</CardTitle>
              <CardDescription>Dự báo 30 ngày tới dựa trên ML</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Biểu đồ dự báo doanh thu</p>
                  <p className="text-sm text-muted-foreground">Tích hợp ML forecasting model</p>
                </div>
              </div>
            </CardContent>
          </Card>
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