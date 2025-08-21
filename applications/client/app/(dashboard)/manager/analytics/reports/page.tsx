"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  ShoppingCart,
  Star
} from "lucide-react"
import { useAnimatedNumber } from "@/hooks/use-counter-animation"

export default function ReportsPage() {
  // Animation hooks for report statistics
  const totalReports = useAnimatedNumber(847, 0)
  const completedReports = useAnimatedNumber(823, 200)
  const pendingReports = useAnimatedNumber(18, 400)
  const automatedReports = useAnimatedNumber(156, 600)
  const reportTemplates = [
    {
      id: 1,
      name: "Báo cáo doanh thu hàng ngày",
      description: "Tổng hợp doanh thu theo ngày với biểu đồ chi tiết",
      category: "Doanh thu",
      frequency: "Hàng ngày",
      lastGenerated: "22/08/2024 09:00",
      status: "completed",
      format: "PDF"
    },
    {
      id: 2,
      name: "Báo cáo hiệu suất nhân viên",
      description: "Đánh giá hiệu suất làm việc của từng nhân viên",
      category: "Nhân sự",
      frequency: "Hàng tuần",
      lastGenerated: "20/08/2024 16:30",
      status: "completed",
      format: "Excel"
    },
    {
      id: 3,
      name: "Báo cáo tồn kho",
      description: "Tình trạng tồn kho và dự báo nhu cầu nhập hàng",
      category: "Kho hàng",
      frequency: "Hàng ngày",
      lastGenerated: "22/08/2024 08:00",
      status: "processing",
      format: "PDF"
    },
    {
      id: 4,
      name: "Báo cáo khách hàng thân thiết",
      description: "Phân tích hành vi và giá trị khách hàng VIP",
      category: "Khách hàng",
      frequency: "Hàng tháng",
      lastGenerated: "01/08/2024 10:00",
      status: "scheduled",
      format: "PDF"
    },
    {
      id: 5,
      name: "Báo cáo món ăn bán chạy",
      description: "Top món ăn được yêu thích nhất theo thời gian",
      category: "Thực đơn",
      frequency: "Hàng tuần",
      lastGenerated: "19/08/2024 14:00",
      status: "completed",
      format: "Excel"
    },
    {
      id: 6,
      name: "Báo cáo chi phí hoạt động",
      description: "Phân tích chi phí vận hành và lợi nhuận",
      category: "Tài chính",
      frequency: "Hàng tháng",
      lastGenerated: "01/08/2024 11:30",
      status: "failed",
      format: "PDF"
    }
  ]

  const quickStats = [
    {
      title: "Báo cáo đã tạo",
      value: totalReports,
      change: "+12 tháng này",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Báo cáo tự động",
      value: automatedReports,
      change: "8 đang chạy",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Báo cáo thành công",
      value: "94.2%",
      change: "+2.1% tháng trước",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Thời gian tạo TB",
      value: "3.2 phút",
      change: "-0.5 phút",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-green-600 border-green-600">Hoàn thành</Badge>
      case "processing":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Đang xử lý</Badge>
      case "scheduled":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Đã lên lịch</Badge>
      case "failed":
        return <Badge variant="outline" className="text-red-600 border-red-600">Thất bại</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Doanh thu":
        return "bg-green-100 text-green-800"
      case "Nhân sự":
        return "bg-blue-100 text-blue-800"
      case "Kho hàng":
        return "bg-yellow-100 text-yellow-800"
      case "Khách hàng":
        return "bg-purple-100 text-purple-800"
      case "Thực đơn":
        return "bg-orange-100 text-orange-800"
      case "Tài chính":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Báo cáo</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Tạo báo cáo mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all-reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-reports">Tất cả báo cáo</TabsTrigger>
          <TabsTrigger value="automated">Báo cáo tự động</TabsTrigger>
          <TabsTrigger value="custom">Báo cáo tùy chỉnh</TabsTrigger>
          <TabsTrigger value="templates">Mẫu báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports" className="space-y-4">
          <div className="grid gap-4">
            {reportTemplates.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge className={getCategoryColor(report.category)}>
                          {report.category}
                        </Badge>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Tần suất: {report.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Lần cuối: {report.lastGenerated}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>Định dạng: {report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        Xem
                      </Button>
                      <Button size="sm">
                        Tạo lại
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automated" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo tự động đang chạy</CardTitle>
                <CardDescription>
                  Các báo cáo được tạo tự động theo lịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTemplates.filter(r => r.frequency !== "Theo yêu cầu").map((report) => (
                    <div key={report.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.frequency}</p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch trình báo cáo</CardTitle>
                <CardDescription>
                  Báo cáo sẽ được tạo trong tuần này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Báo cáo doanh thu hàng ngày", time: "Hôm nay 09:00", status: "scheduled" },
                    { name: "Báo cáo hiệu suất nhân viên", time: "Thứ 2 16:00", status: "scheduled" },
                    { name: "Báo cáo món ăn bán chạy", time: "Thứ 3 14:00", status: "scheduled" },
                    { name: "Báo cáo tồn kho", time: "Thứ 4 08:00", status: "scheduled" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tạo báo cáo tùy chỉnh</CardTitle>
              <CardDescription>
                Thiết kế báo cáo theo nhu cầu cụ thể của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Báo cáo doanh thu",
                    description: "Phân tích doanh thu theo nhiều tiêu chí",
                    icon: DollarSign,
                    color: "text-green-600"
                  },
                  {
                    title: "Báo cáo khách hàng",
                    description: "Thống kê và phân tích khách hàng",
                    icon: Users,
                    color: "text-blue-600"
                  },
                  {
                    title: "Báo cáo đơn hàng",
                    description: "Tình trạng và xu hướng đơn hàng",
                    icon: ShoppingCart,
                    color: "text-purple-600"
                  },
                  {
                    title: "Báo cáo đánh giá",
                    description: "Feedback và rating từ khách hàng",
                    icon: Star,
                    color: "text-yellow-600"
                  },
                  {
                    title: "Báo cáo hiệu suất",
                    description: "Hiệu suất hoạt động tổng thể",
                    icon: TrendingUp,
                    color: "text-red-600"
                  },
                  {
                    title: "Báo cáo tùy chỉnh",
                    description: "Tạo báo cáo với các tiêu chí riêng",
                    icon: PieChart,
                    color: "text-indigo-600"
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <template.icon className={`h-12 w-12 mx-auto ${template.color}`} />
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <Button size="sm" className="w-full">
                          Tạo báo cáo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thư viện mẫu báo cáo</CardTitle>
              <CardDescription>
                Các mẫu báo cáo có sẵn cho ngành nhà hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: "Báo cáo doanh thu chi tiết",
                    description: "Phân tích doanh thu theo món ăn, thời gian, khu vực",
                    category: "Doanh thu",
                    features: ["Biểu đồ tương tác", "Xuất PDF/Excel", "Lịch trình tự động"]
                  },
                  {
                    name: "Báo cáo quản lý kho",
                    description: "Theo dõi tồn kho, nhập xuất, dự báo nhu cầu",
                    category: "Kho hàng",
                    features: ["Cảnh báo tồn kho", "Dự báo AI", "Tích hợp nhà cung cấp"]
                  },
                  {
                    name: "Báo cáo hiệu suất nhân viên",
                    description: "Đánh giá KPI, năng suất, chấm công nhân viên",
                    category: "Nhân sự",
                    features: ["Dashboard cá nhân", "So sánh team", "Báo cáo lương"]
                  },
                  {
                    name: "Báo cáo trải nghiệm khách hàng",
                    description: "Phân tích feedback, đánh giá, hành vi khách hàng",
                    category: "Khách hàng",
                    features: ["Sentiment analysis", "NPS score", "Customer journey"]
                  }
                ].map((template, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Tính năng nổi bật:</p>
                          <ul className="text-xs space-y-1">
                            {template.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">Sử dụng mẫu</Button>
                          <Button size="sm" variant="outline">Xem trước</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
