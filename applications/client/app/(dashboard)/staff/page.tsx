import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, QrCode, CreditCard, User, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function StaffDashboard() {
  const stats = [
    { title: "Đơn hàng hôm nay", value: "23", icon: ClipboardList, change: "+12%" },
    { title: "Bàn đang phục vụ", value: "8", icon: QrCode, change: "+2" },
    { title: "Doanh thu ca", value: "2,450,000₫", icon: CreditCard, change: "+8%" },
    { title: "Giờ làm việc", value: "6.5h", icon: Clock, change: "1.5h còn lại" },
  ]

  const recentOrders = [
    { id: "ORD-001", table: "Bàn 05", items: "Phở bò, Cà phê", status: "preparing", time: "10 phút" },
    { id: "ORD-002", table: "Bàn 12", items: "Bánh mì, Trà sữa", status: "ready", time: "2 phút" },
    { id: "ORD-003", table: "Bàn 08", items: "Cơm tấm, Nước ngọt", status: "served", time: "15 phút" },
  ]

  const tasks = [
    { task: "Dọn bàn số 15", priority: "high", time: "5 phút trước" },
    { task: "Kiểm tra kho đồ uống", priority: "medium", time: "30 phút trước" },
    { task: "Chuẩn bị ca tiếp theo", priority: "low", time: "1 giờ trước" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Dashboard Nhân viên</h2>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan ca làm việc của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              Các đơn hàng bạn đang xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.table}</span>
                      <span className="text-sm text-muted-foreground">{order.items}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      order.status === 'ready' ? 'default' :
                      order.status === 'preparing' ? 'secondary' : 'outline'
                    }>
                      {order.status === 'ready' ? 'Sẵn sàng' :
                       order.status === 'preparing' ? 'Đang chuẩn bị' : 'Đã phục vụ'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href="/staff/orders">Xem tất cả đơn hàng</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Công việc cần làm</CardTitle>
            <CardDescription>
              Danh sách nhiệm vụ được giao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {task.priority === 'high' ? 
                      <AlertCircle className="h-4 w-4 text-red-500" /> :
                      task.priority === 'medium' ?
                      <Clock className="h-4 w-4 text-yellow-500" /> :
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    }
                    <span className="font-medium">{task.task}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/staff/tasks">Xem tất cả công việc</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các chức năng thường sử dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild className="h-auto flex-col py-6">
              <Link href="/staff/orders/new">
                <ClipboardList className="h-8 w-8 mb-2" />
                Nhận đơn mới
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/staff/tables">
                <QrCode className="h-8 w-8 mb-2" />
                Quản lý bàn
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/staff/pos">
                <CreditCard className="h-8 w-8 mb-2" />
                Thu ngân
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/staff/profile">
                <User className="h-8 w-8 mb-2" />
                Hồ sơ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
