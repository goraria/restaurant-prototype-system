import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Eye, CheckCircle, AlertCircle, Search } from "lucide-react"
import Link from "next/link"

export default function StaffOrdersPage() {
  const orders = [
    {
      id: "ORD-001",
      table: "Bàn 05",
      customer: "Nguyễn Văn A",
      items: [
        { name: "Phở bò", quantity: 1, price: 65000 },
        { name: "Cà phê sữa", quantity: 2, price: 25000 }
      ],
      total: 115000,
      status: "preparing",
      time: "14:30",
      orderTime: "10 phút trước",
      priority: "normal"
    },
    {
      id: "ORD-002", 
      table: "Bàn 12",
      customer: "Trần Thị B",
      items: [
        { name: "Bánh mì thịt", quantity: 2, price: 35000 },
        { name: "Trà sữa", quantity: 1, price: 30000 }
      ],
      total: 100000,
      status: "ready",
      time: "14:25",
      orderTime: "15 phút trước",
      priority: "high"
    },
    {
      id: "ORD-003",
      table: "Bàn 08", 
      customer: "Lê Văn C",
      items: [
        { name: "Cơm tấm", quantity: 1, price: 45000 },
        { name: "Nước ngọt", quantity: 1, price: 15000 }
      ],
      total: 60000,
      status: "served",
      time: "14:15",
      orderTime: "25 phút trước",
      priority: "normal"
    },
    {
      id: "ORD-004",
      table: "Bàn 03",
      customer: "Phạm Thị D", 
      items: [
        { name: "Bún bò Huế", quantity: 1, price: 55000 },
        { name: "Chè ba màu", quantity: 1, price: 20000 }
      ],
      total: 75000,
      status: "pending",
      time: "14:35",
      orderTime: "5 phút trước",
      priority: "high"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'preparing': return 'secondary' 
      case 'ready': return 'default'
      case 'served': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'preparing': return 'Đang chuẩn bị'
      case 'ready': return 'Sẵn sàng'
      case 'served': return 'Đã phục vụ'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">
            Xem và xử lý các đơn hàng trong ca làm việc
          </p>
        </div>
        <Button asChild>
          <Link href="/staff/orders/new">Nhận đơn mới</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm theo mã đơn, bàn..." className="pl-8" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="ready">Sẵn sàng</SelectItem>
                <SelectItem value="served">Đã phục vụ</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className={`${order.priority === 'high' ? 'border-orange-200 bg-orange-50/50' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <CardDescription>{order.table} • {order.customer}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  {order.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      Ưu tiên cao
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Items */}
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{item.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng:</span>
                    <span>{order.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{order.orderTime}</span>
                  </div>
                  <span>Đặt lúc {order.time}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  {order.status === 'pending' && (
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Xác nhận
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" className="flex-1">
                      Phục vụ
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Chờ xử lý</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Đang chuẩn bị</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Sẵn sàng</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Đã phục vụ</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
