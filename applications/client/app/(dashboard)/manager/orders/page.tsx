"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ClipboardList,
  Clock,
  DollarSign,
  User,
  MapPin,
  CheckCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Order {
  id: number
  orderNumber: string
  customerName: string
  table: string
  items: string[]
  totalAmount: number
  status: string
  orderTime: string
  paymentMethod: string
  notes?: string
}

export default function OrdersPage() {
  const orders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customerName: "Nguyễn Thị Hoa",
      table: "Bàn 5",
      items: ["Phở bò", "Cà phê sữa đá", "Bánh mì"],
      totalAmount: 125000,
      status: "preparing",
      orderTime: "14:30",
      paymentMethod: "cash",
      notes: "Ít đường trong cà phê"
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customerName: "Trần Văn Nam",
      table: "Bàn 2",
      items: ["Cơm tấm", "Nước cam"],
      totalAmount: 85000,
      status: "ready",
      orderTime: "14:15",
      paymentMethod: "card"
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customerName: "Lê Minh Tuấn",
      table: "Takeaway",
      items: ["Bánh cuốn", "Trà đá"],
      totalAmount: 45000,
      status: "completed",
      orderTime: "13:45",
      paymentMethod: "cash"
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      customerName: "Phạm Thị Lan",
      table: "Bàn 8",
      items: ["Chả cá", "Cơm trắng", "Bia"],
      totalAmount: 180000,
      status: "pending",
      orderTime: "14:35",
      paymentMethod: "e_wallet",
      notes: "Không cay"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Chờ xác nhận</Badge>
      case "preparing":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang chế biến</Badge>
      case "ready":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Sẵn sàng</Badge>
      case "completed":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Hoàn thành</Badge>
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Tiền mặt</Badge>
      case "card":
        return <Badge variant="outline">Thẻ</Badge>
      case "e_wallet":
        return <Badge variant="outline">Ví điện tử</Badge>
      default:
        return <Badge variant="outline">Chưa xác định</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và xử lý các đơn hàng của khách hàng
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo đơn hàng mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm đơn hàng..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo trạng thái
        </Button>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Hôm nay
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng hôm nay</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +15% so với hôm qua
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chế biến</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Cần theo dõi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5M</div>
            <p className="text-xs text-muted-foreground">
              VNĐ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình/đơn</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127K</div>
            <p className="text-xs text-muted-foreground">
              VNĐ mỗi đơn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {order.customerName}
                      <MapPin className="h-3 w-3 ml-2" />
                      {order.table}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.items.join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(order.status)}
                      {getPaymentMethodBadge(order.paymentMethod)}
                      {order.notes && (
                        <Badge variant="outline" className="text-xs">
                          Có ghi chú
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {order.orderTime}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                    <p className="font-medium">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Xác nhận
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Hoàn thành
                      </Button>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Thanh toán
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hủy đơn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
