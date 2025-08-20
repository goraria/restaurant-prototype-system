"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Calendar,
  Star,
  Phone,
  Mail,
  MapPin,
  Gift
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CustomersPage() {
  const customers = [
    {
      id: 1,
      name: "Nguyễn Thị Hoa",
      email: "hoa.nguyen@email.com",
      phone: "0123456789",
      level: "VIP",
      status: "active",
      joinDate: "2023-01-15",
      totalOrders: 45,
      totalSpent: 12500000,
      lastVisit: "2024-12-18",
      loyaltyPoints: 2500,
      avatar: "/avatars/customer1.jpg",
      address: "123 Đường ABC, Quận 1, TP.HCM"
    },
    {
      id: 2,
      name: "Trần Văn Nam",
      email: "nam.tran@email.com",
      phone: "0987654321",
      level: "Gold",
      status: "active",
      joinDate: "2023-03-20",
      totalOrders: 28,
      totalSpent: 8200000,
      lastVisit: "2024-12-20",
      loyaltyPoints: 1640,
      avatar: "/avatars/customer2.jpg",
      address: "456 Đường XYZ, Quận 3, TP.HCM"
    },
    {
      id: 3,
      name: "Lê Minh Tuấn",
      email: "tuan.le@email.com",
      phone: "0369852147",
      level: "Silver",
      status: "active",
      joinDate: "2023-06-10",
      totalOrders: 15,
      totalSpent: 4500000,
      lastVisit: "2024-12-15",
      loyaltyPoints: 900,
      avatar: "/avatars/customer3.jpg",
      address: "789 Đường DEF, Quận 7, TP.HCM"
    },
    {
      id: 4,
      name: "Phạm Thị Lan",
      email: "lan.pham@email.com",
      phone: "0741258963",
      level: "Bronze",
      status: "inactive",
      joinDate: "2024-02-05",
      totalOrders: 8,
      totalSpent: 1800000,
      lastVisit: "2024-11-20",
      loyaltyPoints: 360,
      avatar: "/avatars/customer4.jpg",
      address: "321 Đường GHI, Quận 5, TP.HCM"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
      case "blocked":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Bị chặn</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "VIP":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">VIP</Badge>
      case "Gold":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Gold</Badge>
      case "Silver":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Silver</Badge>
      case "Bronze":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Bronze</Badge>
      default:
        return <Badge variant="secondary">Thành viên</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Quản lý khách hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin khách hàng và chương trình khách hàng thân thiết
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm khách hàng..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo hạng
        </Button>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Xem đặt bàn
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +89 khách hàng mới tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              12.6% tổng số khách hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu/khách</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285K</div>
            <p className="text-xs text-muted-foreground">
              VNĐ trung bình mỗi khách
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ quay lại</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Khách hàng quay lại
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết từng khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {customer.address}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getLevelBadge(customer.level)}
                      {getStatusBadge(customer.status)}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Gift className="h-3 w-3" />
                        {customer.loyaltyPoints} điểm
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                    <p className="font-medium">{customer.totalOrders} đơn</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                    <p className="font-medium">{(customer.totalSpent / 1000000).toFixed(1)}M VNĐ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Lần cuối</p>
                    <p className="font-medium text-sm">{customer.lastVisit}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="text-xs">{customer.phone}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Mail className="h-3 w-3 mr-1" />
                      <span className="text-xs">Email</span>
                    </Button>
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
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa thông tin
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Xem đặt bàn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Gift className="mr-2 h-4 w-4" />
                        Tặng điểm thưởng
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa khách hàng
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
