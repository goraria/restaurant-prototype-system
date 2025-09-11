"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
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
  Utensils,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download
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
  DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger,
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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from 'sonner'

// Import form components and services
import { MenuItemForm } from '@/components/forms';
import {
  useGetAllMenuItemsQuery,
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useBulkUpdateMenuItemsMutation,
  useBulkToggleMenuItemsAvailabilityMutation
} from '@/state/api';
import { DataTable, DataTableColumnHeader, DataTableSortButton } from "@/components/elements/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { formatCurrency } from "@/utils/format-utils";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/constants/interfaces";

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [deletingMenuItem, setDeletingMenuItem] = useState<MenuItem | null>(null)
  const [selectedRows, setSelectedRows] = useState<MenuItem[]>([])
  const [isBulkOperationLoading, setIsBulkOperationLoading] = useState(false)

  const {
    data: menuItems = [],
    error,
    isLoading,
    refetch: refetchMenuItems
  } = useGetAllMenuItemsQuery();

  // Sử dụng mutation hooks
  const [createMenuItemMutation] = useCreateMenuItemMutation();
  const [updateMenuItemMutation] = useUpdateMenuItemMutation();
  const [deleteMenuItemMutation] = useDeleteMenuItemMutation();
  const [bulkUpdateMenuItemsMutation] = useBulkUpdateMenuItemsMutation();
  const [bulkToggleAvailabilityMutation] = useBulkToggleMenuItemsAvailabilityMutation();

  const columns: ColumnDef<MenuItem, unknown>[] = [
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
      // enableResizing: false,
      size: 50, // Width cho checkbox column
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        // <DataTableColumnHeader column={column} title="Món ăn" />
        <DataTableSortButton column={column} title="Món ăn" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {row.original.image_url ? (
                <Image
                  className="h-9 w-9 rounded-md object-cover"
                  src={row.original.image_url}
                  alt="avatar"
                  width={36}
                  height={36}
                />
              ) : (
                <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    FD
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate">
                {row.original.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {row.original.description}
              </div>
            </div>
          </div>
        )
      },
      size: 300, // Width cho Profile column
    },
    // {
    //   accessorKey: "email",
    //   // header: "Email",
    //   header: ({ column }) => (
    //     <DataTableSortButton column={column} title="Email" />
    //   )
    // },
    {
      accessorKey: "categories",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phân loại" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            {row.original.categories?.name || "Không có danh mục"}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 140, // Width cho User column
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Switch/>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 90, // Width cho Status column
    },
    {
      accessorKey: "counter",
      header: () => <div className="text-right">Lượt order</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.original.display_order}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 90,
    },
    {
      accessorKey: "amount",
      // header: "Amount",
      header: () => <div className="text-right">Giá order</div>,
      cell: ({ row }) => {
        // const amount = parseFloat(row.getValue("amount"))
        // const formatted = new Intl.NumberFormat("vi-VN", {
        //   style: "currency",
        //   currency: "VND",
        // }).format(amount)
        const formatted = formatCurrency({
          value: row.original.price,
          // value: row.getValue("amount"),
          currency: "VND"
        })

        return <div className="text-right font-medium">{formatted}</div>
      },
      size: 90, // Width cho Amount column
    },
    {
      id: "actions",
      // accessorKey: "actions",
      // header: () => <div className="text-right">Actions</div>,
      enableResizing: false,
      size: 64, // Width cho Actions column
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0" // h-8 w-8
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openEditDialog(payment)}
              >
                <Edit className="mr-2 h-4 w-4"/>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleAvailability(payment)}
              >
                {payment.is_available ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4"/>
                    Tắt trạng thái
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4"/>
                    Bật trạng thái
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Utensils className="mr-2 h-4 w-4"/>
                Xem công thức
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4"/>
                Lịch sử thay đổi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDeleteDialog(payment)}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4"/>
                Xóa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Confirmed</DropdownMenuItem>
                    <DropdownMenuItem>Preparing</DropdownMenuItem>
                    <DropdownMenuItem>Ready</DropdownMenuItem>
                    <DropdownMenuItem>Served</DropdownMenuItem>
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Cancelled</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Xử lý lỗi từ RTK Query
  useEffect(() => {
    if (error) {
      console.log('Lỗi khi tải menu items:', error);
      let errorMessage = 'Có lỗi xảy ra khi tải danh sách món ăn!';

      if ('status' in error) {
        if (error.status === 'FETCH_ERROR') {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra server backend có đang chạy không!';
        } else if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
        } else if (error.status === 404) {
          errorMessage = 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình backend!';
        } else if (error.status === 500) {
          errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau!';
        }
      }

      toast.error(errorMessage);
    }
  }, [error]);

  const filteredMenuItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesAvailability = selectedAvailability === "all" ||
      (selectedAvailability === "available" && item.is_available) ||
      (selectedAvailability === "unavailable" && !item.is_available)

    return matchesSearch && matchesAvailability
  })

  const getMenuItemStats = () => {
    const totalItems = menuItems.length
    const availableItems = menuItems.filter((item: MenuItem) => item.is_available).length
    const unavailableItems = menuItems.filter((item: MenuItem) => !item.is_available).length
    // const vegetarianItems = menuItems.filter((item: MenuItem) => item.is_vegetarian || false).length
    // const veganItems = menuItems.filter((item: MenuItem) => item.is_vegan || false).length
    const totalValue = menuItems.reduce((sum: number, item: MenuItem) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      return sum + (price || 0)
    }, 0)

    return { totalItems, availableItems, unavailableItems, totalValue } // , vegetarianItems, veganItems
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    refetchMenuItems()
    toast.success('Món ăn đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingMenuItem(null)
    refetchMenuItems()
    toast.success('Thông tin món ăn đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingMenuItem(null)
    refetchMenuItems()
    toast.success('Món ăn đã được xóa!')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (menuItem: MenuItem) => {
    setDeletingMenuItem(menuItem)
    setIsDeleteDialogOpen(true)
  }

  // CRUD Operations
  // const handleCreateMenuItem = async (data: any) => {
  //   try {
  //     await createMenuItemMutation(data).unwrap()
  //     handleCreateSuccess()
  //   } catch (error) {
  //     console.error('Lỗi khi tạo món ăn:', error)
  //     toast.error('Có lỗi xảy ra khi tạo món ăn!')
  //   }
  // }
  //
  // const handleUpdateMenuItem = async (data: any) => {
  //   if (!editingMenuItem) return
  //
  //   try {
  //     await updateMenuItemMutation({
  //       id: editingMenuItem.id,
  //       data
  //     }).unwrap()
  //     handleUpdateSuccess()
  //   } catch (error) {
  //     console.error('Lỗi khi cập nhật món ăn:', error)
  //     toast.error('Có lỗi xảy ra khi cập nhật món ăn!')
  //   }
  // }

  const handleDeleteMenuItem = async () => {
    if (!deletingMenuItem) return
    
    try {
      await deleteMenuItemMutation(deletingMenuItem.id).unwrap()
      handleDeleteSuccess()
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error)
      toast.error('Có lỗi xảy ra khi xóa món ăn!')
    }
  }

  // Bulk Operations
  // const handleBulkUpdate = async (updates: any) => {
  //   if (selectedRows.length === 0) {
  //     toast.error('Vui lòng chọn ít nhất một món ăn!')
  //     return
  //   }
  //
  //   setIsBulkOperationLoading(true)
  //   try {
  //     const bulkData = {
  //       ids: selectedRows.map(item => item.id),
  //       updates
  //     }
  //     await bulkUpdateMenuItemsMutation(bulkData).unwrap()
  //     setSelectedRows([])
  //     refetchMenuItems()
  //     toast.success(`Đã cập nhật ${selectedRows.length} món ăn!`)
  //   } catch (error) {
  //     console.error('Lỗi khi cập nhật hàng loạt:', error)
  //     toast.error('Có lỗi xảy ra khi cập nhật hàng loạt!')
  //   } finally {
  //     setIsBulkOperationLoading(false)
  //   }
  // }

  const handleBulkToggleAvailability = async (isAvailable: boolean) => {
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một món ăn!')
      return
    }

    setIsBulkOperationLoading(true)
    try {
      const bulkData = {
        ids: selectedRows.map(item => item.id),
        is_available: isAvailable
      }
      await bulkToggleAvailabilityMutation(bulkData).unwrap()
      setSelectedRows([])
      refetchMenuItems()
      toast.success(`Đã ${isAvailable ? 'bật' : 'tắt'} ${selectedRows.length} món ăn!`)
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái hàng loạt:', error)
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái!')
    } finally {
      setIsBulkOperationLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một món ăn!')
      return
    }

    setIsBulkOperationLoading(true)
    try {
      // Delete items one by one (since there's no bulk delete endpoint)
      const deletePromises = selectedRows.map(item => 
        deleteMenuItemMutation(item.id).unwrap()
      )
      await Promise.all(deletePromises)
      setSelectedRows([])
      refetchMenuItems()
      toast.success(`Đã xóa ${selectedRows.length} món ăn!`)
    } catch (error) {
      console.error('Lỗi khi xóa hàng loạt:', error)
      toast.error('Có lỗi xảy ra khi xóa hàng loạt!')
    } finally {
      setIsBulkOperationLoading(false)
    }
  }

  // Toggle availability for single item
  const handleToggleAvailability = async (menuItem: MenuItem) => {
    try {
      await updateMenuItemMutation({
        id: menuItem.id,
        data: { is_available: !menuItem.is_available }
      }).unwrap()
      refetchMenuItems()
      toast.success(`Đã ${!menuItem.is_available ? 'bật' : 'tắt'} món ăn!`)
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái:', error)
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái!')
    }
  }

  const stats = getMenuItemStats()

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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý món ăn</h1>
          <p className="text-muted-foreground">
            Quản lý và cấu hình các món ăn trong menu
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm món
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="flex">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="">
              <span className="truncate">{/* text-sm font-medium */}
                Tổng số món
              </span>
              <p className="truncate text-xs text-muted-foreground">
                Tất cả món trong menu
              </p>
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
          <CardFooter>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="">
              <span className="truncate">{/* text-sm font-medium */}
                Có sẵn
              </span>
              <p className="truncate text-xs text-muted-foreground">
                Đang bán
              </p>
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-professional-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-professional-green">{stats.availableItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="">
              <span className="truncate">{/* text-sm font-medium */}
                Hết hàng
              </span>
              <p className="truncate text-xs text-muted-foreground">
                Tạm dừng bán
              </p>
            </CardTitle>
            <XCircle className="h-4 w-4 text-professional-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-professional-red">{stats.unavailableItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="">
              <span className="truncate">{/* text-sm font-medium */}
                Món chay
              </span>
              <p className="truncate text-xs text-muted-foreground">
                Phù hợp người ăn chay
              </p>
            </CardTitle>
            <Utensils className="h-4 w-4 text-professional-orange" />
          </CardHeader>
          {/*<CardContent>*/}
          {/*  <div className="text-2xl font-bold text-professional-orange">{stats.vegetarianItems}</div>*/}
          {/*</CardContent>*/}
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="">
              <span className="truncate">{/* text-sm font-medium */}
                Tổng đã bán
              </span>
              <p className="truncate text-xs text-muted-foreground">
                Tổng thu nhập
              </p>
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency({ value: stats.totalValue, currency: "VND" })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations */}
      {selectedRows.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  Đã chọn {selectedRows.length} món ăn
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
        data={menuItems}
        // order={["select", "menu-item"]}
        search={{
          column: "name",
          placeholder: "Tìm kiếm tên món ăn..."
        }}
        max="name"
        filter={[
          {
            column: "categories",
            title: "Danh mục",
            options: [
              {
                label: "Món Chính",
                value: "main",
              },
              {
                label: "Đồ Uống",
                value: "drink",
              },
            ]
          },
          {
            column: "status",
            title: "Trạng thái",
            options: [
              {
                label: "Có sẵn",
                value: true,
              },
              {
                label: "Hết hàng",
                value: false,
              },
            ]
          }
        ]}
      />

      <Card className="m-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Danh sách món ăn
          </CardTitle>
          <CardDescription>
            Quản lý và cấu hình các món ăn trong menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên món hoặc mô tả..."
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
            <Button variant="outline" size="sm" onClick={() => refetchMenuItems()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMenuItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Chưa có món ăn nào
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {menuItems.length === 0
                    ? "Chưa có món ăn nào trong hệ thống. Hãy thêm món đầu tiên!"
                    : "Không tìm thấy món ăn nào phù hợp với bộ lọc."
                  }
                </p>
                {menuItems.length === 0 && (
                  <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm món đầu tiên
                  </Button>
                )}
              </div>
            ) : (
              filteredMenuItems.map((item: MenuItem) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description || 'Không có mô tả'}
                        </p>
                      </div>
                      <Badge variant={item.is_available ? "default" : "secondary"}>
                        {item.is_available ? (
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
                        <span className="text-muted-foreground">Giá:</span>
                        <span className="font-medium">
                          {formatCurrency({ value: item.price, currency: "VND" })}
                        </span>
                      </div>
                      {item.preparation_time && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời gian chế biến:</span>
                          <span className="font-medium">{item.preparation_time} phút</span>
                        </div>
                      )}
                      {item.calories && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Calories:</span>
                          <span className="font-medium">{item.calories} kcal</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thứ tự:</span>
                        <span className="font-medium">{item.display_order}</span>
                      </div>
                      {/*<div className="flex gap-1 mt-2">*/}
                      {/*  {(item.is_vegetarian || false) && (*/}
                      {/*    <Badge variant="outline" className="text-xs">Chay</Badge>*/}
                      {/*  )}*/}
                      {/*  {(item.is_vegan || false) && (*/}
                      {/*    <Badge variant="outline" className="text-xs">Thuần chay</Badge>*/}
                      {/*  )}*/}
                      {/*</div>*/}
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
                            <Edit className="mr-2 h-4 w-4"/>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Utensils className="mr-2 h-4 w-4"/>
                            Xem công thức
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4"/>
                            Lịch sử thay đổi
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4"/>
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

      {/* Create MenuItem Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm món mới</DialogTitle>
            <DialogDescription>
              Thêm mới món ăn vào menu
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm
            mode="create"
            restaurantId="5dc89877-8c0b-482d-a71d-609d6e14cb9e"
            menuId="e904d033-3a03-4905-bc39-4cb0c7f29196"
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit MenuItem Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa món</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin món ăn
            </DialogDescription>
          </DialogHeader>
          {editingMenuItem && (
            <MenuItemForm
              mode="update"
              // initialValues={{
              //   ...editingMenuItem,
              //   price: typeof editingMenuItem.price === 'string' ? parseFloat(editingMenuItem.price) : editingMenuItem.price
              // }}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa món</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{deletingMenuItem?.name}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteMenuItem}
              >
                Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
