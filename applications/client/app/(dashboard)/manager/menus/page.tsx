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
  MenuSquare,
  Clock,
  Users
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MenusPage() {
  const menus = [
    {
      id: 1,
      name: "Thực đơn chính",
      type: "main",
      status: "active",
      itemCount: 45,
      description: "Thực đơn chính của nhà hàng với các món ăn truyền thống",
      lastUpdated: "2024-12-20"
    },
    {
      id: 2,
      name: "Thực đơn bữa sáng",
      type: "breakfast",
      status: "active",
      itemCount: 15,
      description: "Thực đơn dành cho bữa sáng từ 6:00 - 10:00",
      lastUpdated: "2024-12-18"
    },
    {
      id: 3,
      name: "Thực đơn cuối tuần",
      type: "weekend",
      status: "scheduled",
      itemCount: 25,
      description: "Thực đơn đặc biệt cho cuối tuần với các món ăn cao cấp",
      lastUpdated: "2024-12-15"
    },
    {
      id: 4,
      name: "Thực đơn khuyến mãi",
      type: "promotion",
      status: "inactive",
      itemCount: 8,
      description: "Thực đơn khuyến mãi cho dịp lễ tết",
      lastUpdated: "2024-12-10"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đang hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Tạm dừng</Badge>
      case "scheduled":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đã lên lịch</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "main":
        return <MenuSquare className="h-4 w-4" />
      case "breakfast":
        return <Clock className="h-4 w-4" />
      case "weekend":
        return <Users className="h-4 w-4" />
      case "promotion":
        return <Badge className="h-4 w-4" />
      default:
        return <MenuSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MenuSquare className="h-8 w-8" />
            Quản lý thực đơn
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các thực đơn khác nhau cho nhà hàng
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo thực đơn mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm thực đơn..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo loại
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thực đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 thực đơn mới tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              67% tổng số thực đơn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng món ăn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              Trên tất cả thực đơn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cập nhật gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Trong tuần này
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menus List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thực đơn</CardTitle>
          <CardDescription>
            Quản lý và tổ chức các thực đơn của nhà hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menus.map((menu) => (
              <div key={menu.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    {getTypeIcon(menu.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{menu.name}</h3>
                    <p className="text-sm text-muted-foreground">{menu.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(menu.status)}
                      <Badge variant="outline">{menu.itemCount} món</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                    <p className="font-medium">{menu.lastUpdated}</p>
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
                        Xem thực đơn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MenuSquare className="mr-2 h-4 w-4" />
                        Thiết kế thực đơn
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
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
