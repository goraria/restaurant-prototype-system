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
  UtensilsCrossed
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MenuItemsPage() {
  const menuItems = [
    {
      id: 1,
      name: "Phở bò đặc biệt",
      category: "Món chính",
      price: 85000,
      status: "available",
      description: "Phở bò truyền thống với thịt bò tái, chín và gầu bò"
    },
    {
      id: 2,
      name: "Bánh mì thịt nướng",
      category: "Bánh mì",
      price: 25000,
      status: "available",
      description: "Bánh mì giòn với thịt nướng thơm ngon"
    },
    {
      id: 3,
      name: "Cà phê sữa đá",
      category: "Đồ uống",
      price: 20000,
      status: "out_of_stock",
      description: "Cà phê sữa đá truyền thống Việt Nam"
    },
    {
      id: 4,
      name: "Chả cá Lã Vọng",
      category: "Món chính",
      price: 120000,
      status: "available",
      description: "Chả cá truyền thống Hà Nội với bún và rau thơm"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Có sẵn</Badge>
      case "out_of_stock":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Hết hàng</Badge>
      case "discontinued":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ngừng bán</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8" />
            Quản lý món ăn
          </h1>
          <p className="text-muted-foreground">
            Quản lý tất cả món ăn và đồ uống trong nhà hàng
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm món mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm món ăn..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng món ăn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Món có sẵn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">
              79% tổng số món
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Cần bổ sung nguyên liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.000đ</div>
            <p className="text-xs text-muted-foreground">
              +5% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách món ăn</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết từng món ăn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{item.category}</Badge>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{item.price.toLocaleString('vi-VN')}đ</p>
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
