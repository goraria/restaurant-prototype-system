"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, DollarSign, Receipt, Target } from "lucide-react"
import { useAnimatedCurrency, useAnimatedNumber, useAnimatedPercentage } from "@/hooks/use-counter-animation"

export default function RevenuePage() {
  // Revenue animation hooks
  const monthlyRevenue = useAnimatedCurrency(125430000, 0)
  const weeklyRevenue = useAnimatedCurrency(32120000, 200)
  const dailyRevenue = useAnimatedCurrency(4580000, 400)
  const avgDailyRevenue = useAnimatedCurrency(4175000, 600)

  const monthlyChange = useAnimatedPercentage(0.201, 1, 800)
  const weeklyChange = useAnimatedPercentage(0.153, 1, 1000)
  const dailyChange = useAnimatedPercentage(0.087, 1, 1200)
  const avgChange = useAnimatedPercentage(0.125, 1, 1400)
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Phân tích doanh thu</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{monthlyChange} so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tuần này</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyRevenue}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{weeklyChange} so với tuần trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,240,000₫</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% so với hôm qua
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mục tiêu tháng</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.6%</div>
            <p className="text-xs text-muted-foreground">
              Đạt 125.4M / 160M
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Theo ngày</TabsTrigger>
          <TabsTrigger value="weekly">Theo tuần</TabsTrigger>
          <TabsTrigger value="monthly">Theo tháng</TabsTrigger>
          <TabsTrigger value="quarterly">Theo quý</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Doanh thu theo giờ hôm nay</CardTitle>
                <CardDescription>
                  Phân bổ doanh thu trong ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Biểu đồ doanh thu theo giờ
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>So sánh 7 ngày gần nhất</CardTitle>
                <CardDescription>
                  Xu hướng doanh thu tuần qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: "Hôm nay", amount: "5,240,000₫", change: "+12.5%" },
                    { day: "Hôm qua", amount: "4,650,000₫", change: "+8.2%" },
                    { day: "2 ngày trước", amount: "4,200,000₫", change: "-3.1%" },
                    { day: "3 ngày trước", amount: "4,890,000₫", change: "+15.7%" },
                    { day: "4 ngày trước", amount: "3,960,000₫", change: "-5.2%" },
                    { day: "5 ngày trước", amount: "4,180,000₫", change: "+2.8%" },
                    { day: "6 ngày trước", amount: "3,750,000₫", change: "-8.9%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.day}</p>
                        <p className="text-lg font-bold">{item.amount}</p>
                      </div>
                      <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change.startsWith('+') ? (
                          <TrendingUp className="inline mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="inline mr-1 h-3 w-3" />
                        )}
                        {item.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tuần</CardTitle>
              <CardDescription>
                So sánh doanh thu các tuần trong tháng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Biểu đồ doanh thu theo tuần
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>
                Xu hướng doanh thu 12 tháng gần nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Biểu đồ doanh thu theo tháng
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo quý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { quarter: "Q3 2024 (Hiện tại)", amount: "380,450,000₫", progress: 78.6 },
                    { quarter: "Q2 2024", amount: "425,200,000₫", progress: 100 },
                    { quarter: "Q1 2024", amount: "398,100,000₫", progress: 100 },
                    { quarter: "Q4 2023", amount: "456,800,000₫", progress: 100 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.quarter}</span>
                        <span className="text-sm font-bold">{item.amount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân tích theo kênh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: "Tại chỗ", amount: "78,320,000₫", percentage: 62.4 },
                    { channel: "Giao hàng", amount: "31,210,000₫", percentage: 24.9 },
                    { channel: "Đặt bàn", amount: "15,900,000₫", percentage: 12.7 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.channel}</p>
                        <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                      </div>
                      <div className="text-sm font-bold">{item.amount}</div>
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
