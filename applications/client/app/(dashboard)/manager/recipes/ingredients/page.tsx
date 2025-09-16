"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Scale,
  AlertTriangle,
  TrendingUp,
  Warehouse,
  ShoppingCart,
  Copy
} from "lucide-react"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Badge } from "@/components/elements/badge"
import { toast } from 'sonner'

// Import form components and services
import { DataTable, DataTableColumnHeader, DataTableSortButton } from "@/components/elements/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/utils/format-utils";
import { IngredientDataColumn, StatsBoxProps } from "@/constants/interfaces";
import { StatsBox } from "@/components/elements/stats-box";
import { useGetAllInventoryItemsQuery } from "@/state/api"

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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
      accessorKey: "recipe_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số công thức sử dụng" />
      ),
      cell: ({ row }) => {
        const count = (row.original as any)?._count?.recipe_ingredients ?? 0
        return (
          <div className="flex items-center justify-center">
            {count}
          </div>
        )
      },
      size: 200,
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
                onClick={() => openEditDialog(ingredient)}
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
                onClick={() => openDeleteDialog(ingredient)}
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

  const filteredIngredients = ingredients?.filter((item: IngredientDataColumn) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesAvailability = selectedAvailability === "all" ||
      (selectedAvailability === "available" && item.quantity && parseFloat(item.quantity.toString()) > 0) ||
      (selectedAvailability === "unavailable" && (!item.quantity || parseFloat(item.quantity.toString()) <= 0))

    return matchesSearch && matchesAvailability
  })

  // const stats = getIngredientStats()
  const stats = useMemo(() => {
    const totalItems = ingredients?.length
    const availableItems = ingredients?.filter((item: IngredientDataColumn) =>
      item.quantity && parseFloat(item.quantity.toString()) > 0
    ).length
    const unavailableItems = ingredients?.filter((item: IngredientDataColumn) =>
      !item.quantity || parseFloat(item.quantity.toString()) <= 0
    ).length

    const totalValue = ingredients?.reduce((sum: number, item: IngredientDataColumn) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity || 0
      const unitCost = typeof item.unit_cost === 'string' ? parseFloat(item.unit_cost) : item.unit_cost || 0
      return sum + (quantity * unitCost)
    }, 0)

    const nearExpiryItems = ingredients?.filter((item: IngredientDataColumn) => {
      if (!item.expiry_date) return false
      const expiry = new Date(item.expiry_date)
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return expiry <= sevenDaysFromNow && expiry >= now
    }).length

    return { totalItems, availableItems, unavailableItems, totalValue, nearExpiryItems }
  }, [ingredients])

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    toast.success('Nguyên liệu đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingIngredient(null)
    toast.success('Thông tin nguyên liệu đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingIngredient(null)
    toast.success('Nguyên liệu đã được xóa!')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (ingredient: IngredientDataColumn) => {
    setEditingIngredient(ingredient)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (ingredient: IngredientDataColumn) => {
    setDeletingIngredient(ingredient)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteIngredient = async () => {
    if (!deletingIngredient) return

    try {
      handleDeleteSuccess()
    } catch (error) {
      console.error('Lỗi khi xóa nguyên liệu:', error)
      toast.error('Có lỗi xảy ra khi xóa nguyên liệu!')
    }
  }

  const handleBulkToggleAvailability = async (isAvailable: boolean) => {
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nguyên liệu!')
      return
    }

    setIsBulkOperationLoading(true)
    try {
      setSelectedRows([])
      toast.success(`Đã ${isAvailable ? 'bật' : 'tắt'} ${selectedRows.length} nguyên liệu!`)
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái hàng loạt:', error)
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái!')
    } finally {
      setIsBulkOperationLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nguyên liệu!')
      return
    }

    setIsBulkOperationLoading(true)
    try {
      setSelectedRows([])
      toast.success(`Đã xóa ${selectedRows.length} nguyên liệu!`)
    } catch (error) {
      console.error('Lỗi khi xóa hàng loạt:', error)
      toast.error('Có lỗi xảy ra khi xóa hàng loạt!')
    } finally {
      setIsBulkOperationLoading(false)
    }
  }

  const statsBox: StatsBoxProps[] = [
    {
      title: "Tổng nguyên liệu",
      description: "Trong kho",
      icon: Package,
      stats: stats.totalItems
    },
    {
      title: "Có sẵn",
      description: "Còn tồn kho",
      icon: CheckCircle,
      color: "professional-green",
      stats: stats.availableItems
    },
    {
      title: "Hết hàng",
      description: "Không còn tồn kho",
      icon: XCircle,
      color: "professional-red",
      stats: stats.unavailableItems
    },
    {
      title: "Sắp hết hạn",
      description: "Trong 7 ngày tới",
      icon: AlertTriangle,
      color: "professional-orange",
      stats: stats.nearExpiryItems
    },
    {
      title: "Tổng giá trị",
      description: "Tồn kho",
      icon: DollarSign,
      color: "professional-blue",
      stats: formatCurrency({ value: stats.totalValue, currency: "VND" })
    },
  ]

  return (
    <>
      {!isLoading ? (
        <>
    <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {statsBox.map((box, index) => (
          <StatsBox
                  key={index}
            title={box.title}
            description={box.description}
            icon={box.icon}
            color={box.color}
            stats={box.stats}
          />
        ))}
      </div>

            {/* Bulk Operations */}
            {selectedRows.length > 0 && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        Đã chọn {selectedRows.length} nguyên liệu
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkToggleAvailability(true)}
                        disabled={isBulkOperationLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Bật tất cả
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkToggleAvailability(false)}
                        disabled={isBulkOperationLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Tắt tất cả
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isBulkOperationLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa tất cả
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRows([])}
                      >
                        Hủy chọn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            <Card className="m-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
                  Danh sách nguyên liệu
          </CardTitle>
          <CardDescription>
                  Quản lý và theo dõi nguyên liệu trong kho
          </CardDescription>
        </CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Quản lý nguyên liệu</h1>
                  <p className="text-muted-foreground">
                    Quản lý và theo dõi nguyên liệu trong kho
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm nguyên liệu
                  </Button>
                </div>
              </div>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                      placeholder="Tìm kiếm theo tên nguyên liệu hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="available">Có sẵn</SelectItem>
                      <SelectItem value="unavailable">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới
                  </Button>
          </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIngredients.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        Chưa có nguyên liệu nào
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {ingredients.length === 0
                          ? "Chưa có nguyên liệu nào trong hệ thống. Hãy thêm nguyên liệu đầu tiên!"
                          : "Không tìm thấy nguyên liệu nào phù hợp với bộ lọc."
                        }
                      </p>
                      {ingredients.length === 0 && (
                        <Button onClick={openCreateDialog}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm nguyên liệu đầu tiên
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredIngredients.map((item: IngredientDataColumn) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.description || 'Không có mô tả'}
                                </p>
                        </div>
                      </div>
                            <Badge variant={item.quantity && parseFloat(item.quantity.toString()) > 0 ? "default" : "secondary"}>
                              {item.quantity && parseFloat(item.quantity.toString()) > 0 ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Có sẵn
                          </>
                        ) : (
                          <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Hết hàng
                          </>
                        )}
                      </Badge>
                    </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Số lượng:</span>
                              <span className="font-medium">
                                {typeof item.quantity === 'string'
                                  ? parseFloat(item.quantity).toLocaleString()
                                  : (item.quantity || 0).toLocaleString()} {item.unit}
                              </span>
                        </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Đơn giá:</span>
                              <span className="font-medium">
                                {formatCurrency({
                                  value: typeof item.unit_cost === 'string'
                                    ? parseFloat(item.unit_cost)
                                    : item.unit_cost || 0,
                                  currency: "VND"
                                })}
                              </span>
                    </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Nhà cung cấp:</span>
                              <span className="font-medium">{item.supplier || "Chưa có"}</span>
                    </div>
                            {item.expiry_date && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Hạn sử dụng:</span>
                                <span className="font-medium">
                                  {new Date(item.expiry_date).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(item)}>
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
                        <DropdownMenuItem 
                                  onClick={() => openDeleteDialog(item)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                          </div>
        </CardContent>
      </Card>
                    )))}
    </div>
              </CardContent>
            </Card>

            {/* Create Ingredient Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Thêm nguyên liệu mới</DialogTitle>
                  <DialogDescription>
                    Thêm mới nguyên liệu vào kho
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground">Form thêm nguyên liệu sẽ được thêm vào đây</p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Ingredient Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin nguyên liệu
                  </DialogDescription>
                </DialogHeader>
                {editingIngredient && (
                  <div className="py-4">
                    <p className="text-muted-foreground">Form chỉnh sửa nguyên liệu sẽ được thêm vào đây</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa nguyên liệu</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa &quot;{deletingIngredient?.name}&quot;? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteIngredient}
                    >
                      Xóa
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

            <Skeleton className="h-screen w-full rounded-xl" />
          </div>
        </>
      )}
    </>
  )
}