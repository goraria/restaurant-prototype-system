"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  XCircle,
  Trash2,
  RefreshCw
} from "lucide-react"
import { toast } from 'sonner'

// Import form components and API hooks
import { InventoryItemForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/services/inventoryServices";

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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)

  useEffect(() => {

  }, []);

  const filteredItems = inventoryItems.filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getInventoryStats = () => {
    const totalItems = inventoryItems.length
    const lowStockItems = inventoryItems.filter((item: InventoryItem) => item.status === 'low-stock').length
    const outOfStockItems = inventoryItems.filter((item: InventoryItem) => item.status === 'out-of-stock').length
    const totalValue = inventoryItems.reduce((sum: number, item: InventoryItem) => sum + item.totalValue, 0)
    const expiringItems = inventoryItems.filter((item: InventoryItem) => {
      if (!item.expiryDate) return false
      const expiryDate = new Date(item.expiryDate)
      const today = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays > 0
    }).length

    return { totalItems, lowStockItems, outOfStockItems, totalValue, expiringItems }
  }

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Còn hàng</Badge>
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Sắp hết</Badge>
      case 'out-of-stock':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Hết hàng</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><Clock className="w-3 h-3 mr-1" />Hết hạn</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getCategoryIcon = (category: InventoryItem['category']) => {
    switch (category) {
      case 'ingredient':
        return <Package2 className="w-4 h-4 text-blue-500" />
      case 'beverage':
        return <Package2 className="w-4 h-4 text-green-500" />
      case 'packaging':
        return <Package2 className="w-4 h-4 text-purple-500" />
      case 'equipment':
        return <Package2 className="w-4 h-4 text-orange-500" />
      case 'cleaning':
        return <Package2 className="w-4 h-4 text-red-500" />
      default:
        return <Package2 className="w-4 h-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (item: InventoryItem) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const stats = getInventoryStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý kho</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý hàng tồn kho
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mục kho
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng mục kho
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả danh mục
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sắp hết hàng
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Cần đặt hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hết hàng
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Cần bổ sung gấp
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sắp hết hạn
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              Trong 7 ngày tới
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giá trị
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Hàng tồn kho
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Hàng tồn kho</TabsTrigger>
          <TabsTrigger value="orders">Đơn đặt hàng</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hàng tồn kho</CardTitle>
              <CardDescription>
                Quản lý tất cả các mục trong kho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc nhà cung cấp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
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
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={() => refetch()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm mới
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredItems.map((item: InventoryItem) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.supplier}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{item.currentStock} {item.unit}</div>
                          <div className="text-xs text-muted-foreground">Hiện tại</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{formatCurrency(item.unitCost)}</div>
                          <div className="text-xs text-muted-foreground">Đơn giá</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{formatCurrency(item.totalValue)}</div>
                          <div className="text-xs text-muted-foreground">Tổng giá trị</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm">{item.location}</div>
                          <div className="text-xs text-muted-foreground">Vị trí</div>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mức tồn kho</span>
                        <span>{item.currentStock} / {item.maxThreshold} {item.unit}</span>
                      </div>
                      <Progress 
                        value={(item.currentStock / item.maxThreshold) * 100} 
                        className="h-2"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đơn đặt hàng</CardTitle>
              <CardDescription>
                Quản lý các đơn đặt hàng từ nhà cung cấp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có đơn đặt hàng</h3>
                <p className="text-muted-foreground mb-4">
                  Tạo đơn đặt hàng mới để bổ sung hàng tồn kho
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo đơn đặt hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo kho</CardTitle>
              <CardDescription>
                Thống kê và phân tích hàng tồn kho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Báo cáo đang phát triển</h3>
                <p className="text-muted-foreground">
                  Tính năng báo cáo chi tiết sẽ được cập nhật sớm
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Inventory Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm mục kho mới</DialogTitle>
            <DialogDescription>
              Thêm mới mục hàng vào kho
            </DialogDescription>
          </DialogHeader>
          <InventoryItemForm
            mode="create"
            // onSuccess={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Inventory Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mục kho</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin mục kho
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <InventoryItemForm
              mode="update"
              initialValues={editingItem}
              // onSuccess={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        // open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa mục kho"
        description={`Bạn có chắc chắn muốn xóa "${deletingItem?.name}"?`}
        // onConfirm={() => {
        //   if (deletingItem) {
        //     deleteInventoryItem(deletingItem.id)
        //       .unwrap()
        //       .then(handleDeleteSuccess)
        //       .catch(() => toast.error('Có lỗi xảy ra khi xóa mục kho!'));
        //   }
        // }}
      />
    </div>
  )
}
