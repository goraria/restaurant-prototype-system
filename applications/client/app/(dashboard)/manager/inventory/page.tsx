"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Package2,
  AlertTriangle,
  Truck,
  Download,
  Upload,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: 'ingredient' | 'beverage' | 'packaging' | 'equipment' | 'cleaning'
  currentStock: number
  unit: string
  minThreshold: number
  maxThreshold: number
  unitCost: number
  totalValue: number
  supplier: string
  lastOrdered: string
  expiryDate?: string
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired'
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  orderDate: string
  expectedDelivery: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  items: { name: string, quantity: number, unitCost: number }[]
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

  const inventoryItems: InventoryItem[] = [
    {
      id: "1",
      name: "Thịt bò tươi",
      category: "ingredient",
      currentStock: 25,
      unit: "kg",
      minThreshold: 10,
      maxThreshold: 50,
      unitCost: 280000,
      totalValue: 7000000,
      supplier: "Công ty TNHH Thực phẩm sạch",
      lastOrdered: "2025-08-20",
      expiryDate: "2025-08-27",
      location: "Kho lạnh A1",
      status: "in-stock"
    },
    {
      id: "2",
      name: "Rau xà lách",
      category: "ingredient", 
      currentStock: 8,
      unit: "kg",
      minThreshold: 15,
      maxThreshold: 30,
      unitCost: 35000,
      totalValue: 280000,
      supplier: "Nông trại hữu cơ Đà Lạt",
      lastOrdered: "2025-08-21",
      expiryDate: "2025-08-24",
      location: "Kho lạnh B2",
      status: "low-stock"
    },
    {
      id: "3",
      name: "Nước suối",
      category: "beverage",
      currentStock: 120,
      unit: "chai",
      minThreshold: 50,
      maxThreshold: 200,
      unitCost: 8000,
      totalValue: 960000,
      supplier: "Lavie",
      lastOrdered: "2025-08-19",
      location: "Kho B1",
      status: "in-stock"
    },
    {
      id: "4",
      name: "Gạo tẻ",
      category: "ingredient",
      currentStock: 0,
      unit: "kg",
      minThreshold: 20,
      maxThreshold: 100,
      unitCost: 25000,
      totalValue: 0,
      supplier: "Gạo sạch Mekong",
      lastOrdered: "2025-08-17",
      location: "Kho A2",
      status: "out-of-stock"
    },
    {
      id: "5",
      name: "Hộp giấy đựng thức ăn",
      category: "packaging",
      currentStock: 500,
      unit: "cái",
      minThreshold: 200,
      maxThreshold: 1000,
      unitCost: 3500,
      totalValue: 1750000,
      supplier: "Bao bì An Khang",
      lastOrdered: "2025-08-18",
      location: "Kho C1",
      status: "in-stock"
    }
  ]

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-2025-001",
      orderNumber: "PO-2025-001",
      supplier: "Nông trại hữu cơ Đà Lạt",
      orderDate: "2025-08-22",
      expectedDelivery: "2025-08-24",
      status: "confirmed",
      totalAmount: 2450000,
      items: [
        { name: "Rau xà lách", quantity: 30, unitCost: 35000 },
        { name: "Cà chua", quantity: 25, unitCost: 28000 },
        { name: "Hành tây", quantity: 15, unitCost: 22000 }
      ]
    },
    {
      id: "PO-2025-002", 
      orderNumber: "PO-2025-002",
      supplier: "Gạo sạch Mekong",
      orderDate: "2025-08-23",
      expectedDelivery: "2025-08-25",
      status: "pending",
      totalAmount: 3500000,
      items: [
        { name: "Gạo tẻ", quantity: 100, unitCost: 25000 },
        { name: "Gạo nàng hương", quantity: 50, unitCost: 35000 }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock': return 'Còn hàng'
      case 'low-stock': return 'Sắp hết'
      case 'out-of-stock': return 'Hết hàng'
      case 'expired': return 'Đã hết hạn'
      default: return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ingredient': return 'Nguyên liệu'
      case 'beverage': return 'Đồ uống'
      case 'packaging': return 'Bao bì'
      case 'equipment': return 'Thiết bị'
      case 'cleaning': return 'Vệ sinh'
      default: return category
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'shipped': return 'Đang giao'
      case 'delivered': return 'Đã giao'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const inventoryStats = {
    totalItems: inventoryItems.length,
    lowStockItems: inventoryItems.filter(item => item.status === 'low-stock').length,
    outOfStockItems: inventoryItems.filter(item => item.status === 'out-of-stock').length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.totalValue, 0),
    pendingOrders: purchaseOrders.filter(order => order.status === 'pending').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Quản lý kho</h2>
          <p className="text-muted-foreground">
            Theo dõi tồn kho và đặt hàng nguyên vật liệu
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm mặt hàng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm mặt hàng mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết về mặt hàng mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Tên mặt hàng</Label>
                    <Input id="itemName" placeholder="Nhập tên mặt hàng" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingredient">Nguyên liệu</SelectItem>
                        <SelectItem value="beverage">Đồ uống</SelectItem>
                        <SelectItem value="packaging">Bao bì</SelectItem>
                        <SelectItem value="equipment">Thiết bị</SelectItem>
                        <SelectItem value="cleaning">Vệ sinh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Đơn vị</Label>
                    <Input id="unit" placeholder="kg, lít, cái..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minThreshold">Tồn kho tối thiểu</Label>
                    <Input id="minThreshold" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxThreshold">Tồn kho tối đa</Label>
                    <Input id="maxThreshold" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitCost">Giá đơn vị</Label>
                    <Input id="unitCost" type="number" placeholder="VND" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Nhà cung cấp</Label>
                    <Input id="supplier" placeholder="Tên nhà cung cấp" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => setIsAddItemModalOpen(false)}>
                    Thêm mặt hàng
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng mặt hàng</p>
                <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
              </div>
              <Package2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hết hàng</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giá trị tồn kho</p>
                <p className="text-2xl font-bold">{formatCurrency(inventoryStats.totalValue)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đơn chờ xử lý</p>
                <p className="text-2xl font-bold text-orange-600">{inventoryStats.pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="orders">Đơn đặt hàng</TabsTrigger>
          <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Tìm kiếm mặt hàng..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="ingredient">Nguyên liệu</SelectItem>
                    <SelectItem value="beverage">Đồ uống</SelectItem>
                    <SelectItem value="packaging">Bao bì</SelectItem>
                    <SelectItem value="equipment">Thiết bị</SelectItem>
                    <SelectItem value="cleaning">Vệ sinh</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="in-stock">Còn hàng</SelectItem>
                    <SelectItem value="low-stock">Sắp hết</SelectItem>
                    <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                    <SelectItem value="expired">Hết hạn</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc nâng cao
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-lg">{item.name}</h4>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                          <Badge variant="secondary">
                            {getCategoryLabel(item.category)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Tồn kho:</span> {item.currentStock} {item.unit}
                          </div>
                          <div>
                            <span className="font-medium">Giá trị:</span> {formatCurrency(item.totalValue)}
                          </div>
                          <div>
                            <span className="font-medium">Nhà cung cấp:</span> {item.supplier}
                          </div>
                          <div>
                            <span className="font-medium">Vị trí:</span> {item.location}
                          </div>
                        </div>

                        {/* Stock Level Progress */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Mức tồn kho</span>
                            <span>{item.currentStock}/{item.maxThreshold} {item.unit}</span>
                          </div>
                          <Progress 
                            value={(item.currentStock / item.maxThreshold) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Tối thiểu: {item.minThreshold}</span>
                            <span>Tối đa: {item.maxThreshold}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button variant="outline" size="sm">
                        <Package2 className="h-4 w-4 mr-2" />
                        Đặt hàng
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Đơn đặt hàng</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo đơn đặt hàng
            </Button>
          </div>

          <div className="space-y-4">
            {purchaseOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-lg">{order.orderNumber}</h4>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nhà cung cấp:</span>
                          <p className="font-medium">{order.supplier}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ngày đặt:</span>
                          <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Giao dự kiến:</span>
                          <p className="font-medium">{new Date(order.expectedDelivery).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tổng tiền:</span>
                          <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Danh sách mặt hàng:</span>
                        <p className="text-sm">{order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </Button>
                      {order.status === 'pending' && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhà cung cấp</CardTitle>
              <CardDescription>Quản lý thông tin nhà cung cấp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Tính năng quản lý nhà cung cấp</p>
                <p className="text-sm text-muted-foreground">Đang phát triển</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo tồn kho</CardTitle>
                <CardDescription>Thống kê chi tiết về tình hình kho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tỷ lệ mặt hàng còn đủ</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tỷ lệ sắp hết hàng</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tỷ lệ hết hàng</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xu hướng nhập hàng</CardTitle>
                <CardDescription>Phân tích mua sắm theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/10 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Biểu đồ xu hướng</p>
                    <p className="text-sm text-muted-foreground">Chart.js integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

