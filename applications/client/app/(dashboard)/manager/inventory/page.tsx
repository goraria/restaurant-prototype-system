"use client"

import React, { useEffect, useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/elements/badge"
// import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/elements/pill-tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  RefreshCw,
  MoreHorizontal,
  Package,
  DollarSign,
  Scale,
  TrendingUp,
  Warehouse,
  ShoppingCart,
  Copy
} from "lucide-react"
import { toast } from 'sonner'

import { InventoryItemForm, DeleteConfirmDialog } from '@/components/forms';
import { DataTable, DataTableColumnHeader, DataTableSortButton } from "@/components/elements/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/utils/format-utils";
import { IngredientDataColumn, StatsBoxProps } from "@/constants/interfaces";
import { StatsBox } from "@/components/elements/stats-box";
import { useGetAllInventoryItemsQuery } from "@/state/api"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all")
  const [editingIngredient, setEditingIngredient] = useState<IngredientDataColumn | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<IngredientDataColumn | null>(null)
  const [selectedRows, setSelectedRows] = useState<IngredientDataColumn[]>([])
  const [isBulkOperationLoading, setIsBulkOperationLoading] = useState(false)

  const {
    data: ingredients = [],
    isLoading,
    error,
    refetch: refetchIngredients,
  } = useGetAllInventoryItemsQuery()

  const columns: ColumnDef<IngredientDataColumn, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="w-[18px] h-[18px] ml-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="w-[18px] h-[18px] ml-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableSortButton column={column} title="Nguyên liệu" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate">
                {row.original.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {row.original.description || 'Không có mô tả'}
              </div>
            </div>
          </div>
        )
      },
      size: 300,
    },
    {
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đơn vị" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Badge variant="outline">
              {row.original.unit}
            </Badge>
          </div>
        )
      },
      size: 120,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">Số lượng</div>,
      cell: ({ row }) => {
        const quantity = typeof row.original.quantity === 'string'
          ? parseFloat(row.original.quantity)
          : row.original.quantity || 0;
        return (
          <div className="text-center font-medium">
            {quantity.toLocaleString()} {row.original.unit}
          </div>
        )
      },
      size: 120,
    },
    {
      accessorKey: "unit_cost",
      header: () => <div className="text-center">Đơn giá</div>,
      cell: ({ row }) => {
        const unitCost = typeof row.original.unit_cost === 'string'
          ? parseFloat(row.original.unit_cost)
          : row.original.unit_cost || 0;
        const formatted = formatCurrency({
          value: unitCost,
          currency: "VND"
        })
        return <div className="text-right font-medium">{formatted}</div>
      },
      size: 120,
    },
    {
      accessorKey: "supplier",
      header: "Nhà cung cấp",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.original.supplier || "Chưa có"}
          </div>
        )
      },
      size: 150,
    },
    {
      accessorKey: "expiry_date",
      header: "Hạn sử dụng",
      cell: ({ row }) => {
        const expiryDate = row.original.expiry_date;
        if (!expiryDate) {
          return (
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground">Không có</span>
            </div>
          )
        }

        const expiry = new Date(expiryDate);
        const now = new Date();
        const isExpired = expiry < now;
        const isNearExpiry = expiry < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

        return (
          <div className="flex items-center justify-center">
            <Badge
              variant={isExpired ? "destructive" : isNearExpiry ? "secondary" : "outline"}
            >
              {expiry.toLocaleDateString('vi-VN')}
            </Badge>
          </div>
        )
      },
      size: 120,
    },
    {
      id: "actions",
      enableResizing: false,
      size: 64,
      cell: ({ row }) => {
        const ingredient = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(ingredient.id)}
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                // onClick={() => openEditDialog(ingredient)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Kiểm tra tồn kho
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrendingUp className="mr-2 h-4 w-4" />
                Lịch sử giá
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                // onClick={() => openDeleteDialog(ingredient)}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  useEffect(() => {

  }, []);

  const filteredItems = inventoryItems.filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = useMemo(() => {
    const totalItems = ingredients.length
    const lowStockItems = ingredients.filter((item: IngredientDataColumn) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity || 0
      const minQuantity = typeof item.min_quantity === 'string' ? parseFloat(item.min_quantity) : item.min_quantity || 0
      return quantity <= minQuantity && quantity > 0
    }).length
    const outOfStockItems = ingredients.filter((item: IngredientDataColumn) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity || 0
      return quantity === 0
    }).length
    const totalValue = ingredients.reduce((sum: number, item: IngredientDataColumn) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity || 0
      const unitCost = typeof item.unit_cost === 'string' ? parseFloat(item.unit_cost) : item.unit_cost || 0
      return sum + (quantity * unitCost)
    }, 0)
    const expiringItems = ingredients.filter((item: IngredientDataColumn) => {
      if (!item.expiry_date) return false
      const expiryDate = new Date(item.expiry_date)
      const today = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays > 0
    }).length

    return { totalItems, lowStockItems, outOfStockItems, totalValue, expiringItems }
  }, [ingredients])

  const statsBoxes: StatsBoxProps[] = useMemo(() => [
    {
      title: "Tổng mục kho",
      stats: stats.totalItems,
      description: "Tất cả danh mục",
      icon: Package2,
    },
    {
      title: "Sắp hết hàng",
      stats: stats.lowStockItems,
      description: "Cần đặt hàng",
      color: "professional-yellow",
      icon: AlertTriangle,
    },
    {
      title: "Hết hàng",
      stats: stats.outOfStockItems,
      description: "Cần bổ sung gấp",
      color: "professional-red",
      icon: XCircle,
    },
    {
      title: "Sắp hết hạn",
      stats: stats.expiringItems,
      description: "Trong 7 ngày tới",
      color: "professional-orange",
      icon: Clock,
    },
    {
      title: "Tổng giá trị",
      stats: formatCurrency({ value: stats.totalValue, currency: "VND" }),
      description: "Hàng tồn kho",
      color: "professional-blue",
      icon: BarChart3,
    },
  ], [stats])

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

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
  //         <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      {!isLoading ? (
        <>
          <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
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
            </div> */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {statsBoxes.map((stat, index) => (
                <StatsBox key={index} {...stat} />
              ))}
            </div>

            <Tabs defaultValue="inventory" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inventory">Hàng tồn kho</TabsTrigger>
                <TabsTrigger value="orders">Đơn đặt hàng</TabsTrigger>
                <TabsTrigger value="reports">Báo cáo</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-4">
                <DataTable
                  columns={columns}
                  data={ingredients}
                  search={{
                    column: "name",
                    placeholder: "Tìm kiếm tên nguyên liệu..."
                  }}
                  max="name"
                  filter={[
                    {
                      column: "unit",
                      title: "Đơn vị",
                      options: [
                        {
                          label: "Gram",
                          value: "gram",
                        },
                        {
                          label: "Kilogram",
                          value: "kg",
                        },
                        {
                          label: "Liter",
                          value: "liter",
                        },
                      ]
                    },
                    {
                      column: "supplier",
                      title: "Nhà cung cấp",
                      options: [
                        {
                          label: "Có nhà cung cấp",
                          value: true,
                        },
                        {
                          label: "Chưa có",
                          value: false,
                        },
                      ]
                    }
                  ]}
                />
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
                                <div className="text-sm font-medium">{formatCurrency({ value: item.unitCost, currency: "VND" })}</div>
                                <div className="text-xs text-muted-foreground">Đơn giá</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">{formatCurrency({ value: item.totalValue, currency: "VND" })}</div>
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
              title="Xóa mục kho"
              description={`Bạn có chắc chắn muốn xóa "${deletingItem?.name}"?`}
              onConfirm={async () => {
                if (deletingItem) {
                  // deleteInventoryItem(deletingItem.id)
                  //   .unwrap()
                  //   .then(handleDeleteSuccess)
                  //   .catch(() => toast.error('Có lỗi xảy ra khi xóa mục kho!'));
                  setIsDeleteDialogOpen(false)
                  setDeletingItem(null)
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
            </div>
            <div className="grid grid-cols-12 gap-1">
              <Skeleton className="h-9 rounded-md" />
              <Skeleton className="h-9 rounded-md" />
              <Skeleton className="h-9 rounded-md" />
            </div>
            <Skeleton className="h-screen w-full rounded-xl" />
          </div>
        </>
      )}
    </>
  )
}
