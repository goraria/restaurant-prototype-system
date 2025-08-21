"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  TrendingUp, 
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import { useAnimatedCurrency, useAnimatedNumber, useAnimatedPercentage, useAnimatedRating } from "@/hooks/use-counter-animation"

export default function TrendsPage() {
  // Trend metrics animations
  const currentRevenue = useAnimatedCurrency(2543000, 0)
  const currentOrders = useAnimatedNumber(127, 200)
  const currentCustomers = useAnimatedNumber(23, 400)
  const currentAOV = useAnimatedCurrency(200236, 600)
  const currentRating = useAnimatedRating(4.2, 800)
  const waitTime = useAnimatedNumber(18, 1000)

  // Trend changes
  const revenueChange = useAnimatedPercentage(0.166, 1, 1200)
  const ordersChange = useAnimatedPercentage(0.076, 1, 1400)
  const customersChange = useAnimatedPercentage(-0.258, 1, 1600)
  const aovChange = useAnimatedPercentage(0.084, 1, 1800)
  const ratingChange = useAnimatedPercentage(0.024, 1, 2000)
  const waitTimeChange = useAnimatedPercentage(-0.182, 1, 2200)
  const trendData = [
    {
      metric: "Doanh thu",
      current: currentRevenue,
      previous: "2,180,000₫",
      change: 16.6,
      trend: "up",
      prediction: "Dự kiến tăng 12% tuần tới",
      category: "revenue",
      changeText: revenueChange
    },
    {
      metric: "Số đơn hàng",
      current: currentOrders,
      previous: "118",
      change: 7.6,
      trend: "up", 
      prediction: "Xu hướng tăng ổn định",
      category: "orders",
      changeText: ordersChange
    },
    {
      metric: "Khách hàng mới",
      current: currentCustomers,
      previous: "31",
      change: -25.8,
      trend: "down",
      prediction: "Cần chiến lược marketing mới",
      category: "customers",
      changeText: customersChange
    },
    {
      metric: "Giá trị TB/đơn hàng",
      current: currentAOV,
      previous: "184,750₫",
      change: 8.4,
      trend: "up",
      prediction: "Khách hàng chi tiêu nhiều hơn",
      category: "aov",
      changeText: aovChange
    },
    {
      metric: "Đánh giá TB",
      current: currentRating,
      previous: "4.1",
      change: 2.4,
      trend: "up",
      prediction: "Chất lượng dịch vụ được cải thiện",
      category: "rating",
      changeText: ratingChange
    },
    {
      metric: "Thời gian chờ TB",
      current: waitTime + " phút",
      previous: "22 phút",
      change: -18.2,
      trend: "up",
      prediction: "Hiệu quả phục vụ tăng",
      category: "service",
      changeText: waitTimeChange
    }
  ]

  const popularDishes = [
    {
      name: "Phở Bò Tái",
      orders: 45,
      trend: 12.5,
      revenue: "1,350,000₫",
      rank: 1,
      previousRank: 1
    },
    {
      name: "Bún Chả",
      orders: 32,
      trend: 8.3,
      revenue: "960,000₫",
      rank: 2,
      previousRank: 3
    },
    {
      name: "Bánh Mì Thịt",
      orders: 28,
      trend: -5.2,
      revenue: "420,000₫",
      rank: 3,
      previousRank: 2
    },
    {
      name: "Chả Cá Lă Vọng",
      orders: 19,
      trend: 25.0,
      revenue: "950,000₫",
      rank: 4,
      previousRank: 6
    },
    {
      name: "Gỏi Cuốn",
      orders: 15,
      trend: -12.8,
      revenue: "225,000₫",
      rank: 5,
      previousRank: 4
    }
  ]

  const timeBasedTrends = [
    {
      period: "6:00 - 9:00",
      label: "Sáng",
      orders: 15,
      revenue: "450,000₫",
      trend: 8.2,
      popular: ["Phở", "Bánh mì", "Cà phê"]
    },
    {
      period: "11:00 - 14:00", 
      label: "Trưa",
      orders: 68,
      revenue: "1,360,000₫",
      trend: 12.1,
      popular: ["Cơm tấm", "Bún chả", "Phở"]
    },
    {
      period: "17:00 - 21:00",
      label: "Tối",
      orders: 44,
      revenue: "1,100,000₫",
      trend: 6.8,
      popular: ["Lẩu", "Nướng", "Bia"]
    }
  ]

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return <ArrowUp className="h-3 w-3 text-green-600" />
    } else if (trend === "down" || change < 0) {
      return <ArrowDown className="h-3 w-3 text-red-600" />
    } else {
      return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) return { icon: ArrowUp, color: "text-green-600", text: `+${previous - current}` }
    if (current > previous) return { icon: ArrowDown, color: "text-red-600", text: `-${current - previous}` }
    return { icon: Minus, color: "text-gray-600", text: "=" }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Xu hướng</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất phân tích
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="dishes">Món ăn</TabsTrigger>
          <TabsTrigger value="time-based">Theo thời gian</TabsTrigger>
          <TabsTrigger value="predictions">Dự báo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(item.trend, item.change)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.current}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`text-xs flex items-center space-x-1 ${getTrendColor(item.change)}`}>
                      <span>{item.change > 0 ? '+' : ''}{item.changeText}</span>
                      <span className="text-muted-foreground">vs tuần trước</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{item.prediction}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng doanh thu 30 ngày</CardTitle>
                <CardDescription>
                  Biểu đồ xu hướng doanh thu theo ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Biểu đồ xu hướng doanh thu
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xu hướng đơn hàng 30 ngày</CardTitle>
                <CardDescription>
                  Số lượng đơn hàng theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Biểu đồ xu hướng đơn hàng
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin xu hướng chính</CardTitle>
              <CardDescription>
                Các xu hướng đáng chú ý trong tuần qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "positive",
                    title: "Doanh thu tăng mạnh vào cuối tuần",
                    description: "Doanh thu thứ 7 và chủ nhật tăng 23% so với các ngày trong tuần",
                    icon: CheckCircle2
                  },
                  {
                    type: "warning", 
                    title: "Giảm khách hàng mới",
                    description: "Số khách hàng đăng ký mới giảm 26% - cần tăng cường marketing",
                    icon: AlertTriangle
                  },
                  {
                    type: "positive",
                    title: "Món chay ngày càng phổ biến",
                    description: "Đơn hàng món chay tăng 45% trong tháng, chiếm 15% tổng đơn hàng",
                    icon: TrendingUp
                  },
                  {
                    type: "neutral",
                    title: "Thời gian phục vụ ổn định",
                    description: "Thời gian chờ trung bình duy trì ở mức 18 phút, đạt mục tiêu KPI",
                    icon: Clock
                  }
                ].map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <insight.icon className={`h-5 w-5 mt-1 ${
                      insight.type === 'positive' ? 'text-green-600' : 
                      insight.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dishes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng món ăn phổ biến</CardTitle>
              <CardDescription>
                Thứ hạng và xu hướng của các món ăn bán chạy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDishes.map((dish, index) => {
                  const rankChange = getRankChange(dish.rank, dish.previousRank)
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">#{dish.rank}</div>
                          <div className="flex items-center space-x-1">
                            <rankChange.icon className={`h-3 w-3 ${rankChange.color}`} />
                            <span className={`text-xs ${rankChange.color}`}>{rankChange.text}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{dish.name}</h4>
                          <p className="text-sm text-muted-foreground">{dish.orders} đơn hàng</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{dish.revenue}</div>
                        <div className={`text-sm flex items-center space-x-1 ${getTrendColor(dish.trend)}`}>
                          {getTrendIcon("", dish.trend)}
                          <span>{dish.trend > 0 ? '+' : ''}{dish.trend.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xu hướng theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { category: "Món chính", trend: 12.5, orders: 89, revenue: "2,670,000₫" },
                  { category: "Món phụ", trend: -3.2, orders: 45, revenue: "675,000₫" },
                  { category: "Đồ uống", trend: 8.7, orders: 67, revenue: "1,005,000₫" },
                  { category: "Tráng miệng", trend: 18.9, orders: 23, revenue: "460,000₫" },
                  { category: "Món chay", trend: 45.2, orders: 12, revenue: "360,000₫" },
                  { category: "Combo", trend: 6.1, orders: 34, revenue: "1,020,000₫" }
                ].map((category, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <h4 className="font-medium">{category.category}</h4>
                        <div className="text-lg font-bold">{category.revenue}</div>
                        <div className={`text-sm flex items-center justify-center space-x-1 ${getTrendColor(category.trend)}`}>
                          {getTrendIcon("", category.trend)}
                          <span>{category.trend > 0 ? '+' : ''}{category.trend.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{category.orders} đơn hàng</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-based" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {timeBasedTrends.map((period, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{period.label}</span>
                    <Badge variant="outline">{period.period}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Đơn hàng:</span>
                      <span className="font-medium">{period.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Doanh thu:</span>
                      <span className="font-medium">{period.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Xu hướng:</span>
                      <div className={`text-sm flex items-center space-x-1 ${getTrendColor(period.trend)}`}>
                        {getTrendIcon("", period.trend)}
                        <span>+{period.trend}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Món phổ biến:</p>
                      <div className="flex flex-wrap gap-1">
                        {period.popular.map((dish, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Xu hướng theo ngày trong tuần</CardTitle>
              <CardDescription>
                So sánh hoạt động kinh doanh các ngày trong tuần
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Biểu đồ xu hướng theo ngày trong tuần
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dự báo tuần tới</CardTitle>
                <CardDescription>
                  AI prediction cho các chỉ số chính
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: "Doanh thu dự kiến", value: "18,500,000₫", confidence: 85, trend: "up" },
                    { metric: "Số đơn hàng", value: "890", confidence: 92, trend: "up" },
                    { metric: "Khách hàng mới", value: "165", confidence: 78, trend: "up" },
                    { metric: "Đánh giá trung bình", value: "4.3", confidence: 88, trend: "up" }
                  ].map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">{prediction.metric}</p>
                        <p className="text-lg font-bold">{prediction.value}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-600">{prediction.confidence}%</span>
                        </div>
                        {getTrendIcon(prediction.trend, 1)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Khuyến nghị</CardTitle>
                <CardDescription>
                  Gợi ý dựa trên phân tích xu hướng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      priority: "Cao",
                      title: "Tăng cường marketing cuối tuần",
                      description: "Doanh thu cuối tuần tăng mạnh, nên đầu tư thêm vào marketing"
                    },
                    {
                      priority: "Trung bình",
                      title: "Mở rộng menu món chay",
                      description: "Xu hướng món chay tăng 45%, cơ hội mở rộng thị trường"
                    },
                    {
                      priority: "Thấp",
                      title: "Tối ưu thời gian phục vụ buổi trưa",
                      description: "Buổi trưa có lượng đơn hàng cao nhất, cần tối ưu quy trình"
                    }
                  ].map((rec, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded">
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          rec.priority === "Cao" ? "destructive" : 
                          rec.priority === "Trung bình" ? "default" : "secondary"
                        }>
                          {rec.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
