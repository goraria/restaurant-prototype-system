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
  Package2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Truck
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InventoryItem {
  id: number
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  lastUpdated: string
  status: string
  expiryDate: string
}

export default function InventoryPage() {
  const inventory: InventoryItem[] = [
    {
      id: 1,
      name: "Thịt bò tươi",
      category: "Thịt",
      unit: "kg",
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unitPrice: 280000,
      supplier: "Công ty TNHH Thịt sạch ABC",
      lastUpdated: "2024-12-20",
      status: "in_stock",
      expiryDate: "2024-12-25"
    },
    {
      id: 2,
      name: "Gạo tẻ",
      category: "Ngũ cốc",
      unit: "kg",
      currentStock: 8,
      minStock: 15,
      maxStock: 100,
      unitPrice: 25000,
      supplier: "Cửa hàng gạo Minh Phát",
      lastUpdated: "2024-12-18",
      status: "low_stock",
      expiryDate: "2025-06-20"
    },
    {
      id: 3,
      name: "Rau cải xanh",
      category: "Rau củ",
      unit: "kg",
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unitPrice: 15000,
      supplier: "Nông trại sạch XYZ",
      lastUpdated: "2024-12-19",
      status: "low_stock",
      expiryDate: "2024-12-22"
    },
    {
      id: 4,
      name: "Cà phê hạt",
      category: "Đồ uống",
      unit: "kg",
      currentStock: 0,
      minStock: 5,
      maxStock: 25,
      unitPrice: 180000,
      supplier: "Cà phê Trung Nguyên",
      lastUpdated: "2024-12-15",
      status: "out_of_stock",
      expiryDate: "2025-12-15"
    }
  ]

  const getStatusBadge = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Hết hàng</Badge>
    }
    if (item.currentStock <= item.minStock) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>
    }
    if (item.currentStock >= item.maxStock * 0.8) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đầy kho</Badge>
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Bình thường</Badge>
  }

  const getStockLevel = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    return Math.min(percentage, 100)
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (daysUntilExpiry <= 3) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Sắp hết hạn</Badge>
    }
    if (daysUntilExpiry <= 7) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Còn hạn</Badge>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package2 className="h-8 w-8" />
            Quản lý kho
          </h1>
          <p className="text-muted-foreground">
            Theo dõi tồn kho và quản lý nhập xuất hàng hóa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Nhập hàng
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mặt hàng
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm mặt hàng..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo danh mục
        </Button>
        <Button variant="outline">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Hàng sắp hết
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng mặt hàng</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 mặt hàng mới tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">
              Cần nhập hàng gấp
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">15</div>
            <p className="text-xs text-muted-foreground">
              Trong vòng 7 ngày
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2M</div>
            <p className="text-xs text-muted-foreground">
              VNĐ tổng giá trị tồn kho
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tồn kho</CardTitle>
          <CardDescription>
            Theo dõi số lượng và trạng thái từng mặt hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Package2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.supplier}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{item.category}</Badge>
                      {getStatusBadge(item)}
                      {getExpiryStatus(item.expiryDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tồn kho</p>
                    <p className="font-medium">
                      {item.currentStock} {item.unit}
                    </p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          getStockLevel(item) <= 20 ? 'bg-red-500' :
                          getStockLevel(item) <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${getStockLevel(item)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Giá đơn vị</p>
                    <p className="font-medium">{item.unitPrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Hết hạn</p>
                    <p className="font-medium text-sm">{item.expiryDate}</p>
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
                        <Truck className="mr-2 h-4 w-4" />
                        Nhập hàng
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package2 className="mr-2 h-4 w-4" />
                        Xuất hàng
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
