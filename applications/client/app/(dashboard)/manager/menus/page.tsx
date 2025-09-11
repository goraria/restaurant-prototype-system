"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Menu as MenuIcon,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download, Utensils, Clock
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
import { toast } from 'sonner'
import { ColumnDef } from "@tanstack/react-table";

// Import form components and services
import { MenuForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { DataTable, DataTableColumnHeader, DataTableSortButton } from "@/components/elements/data-table";
import { useAppDispatch } from '@/state/redux';
import { formatCurrency } from "@/utils/format-utils";
import { Menu } from "@/constants/interfaces";
import { useGetAllMenusQuery } from "@/state/api";

export default function MenusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [deletingMenu, setDeletingMenu] = useState<Menu | null>(null)
  // const [isLoading, setIsLoading] = useState(true)

  const {
    data: menus = [],
    error,
    isLoading,
    refetch: refetchMenuItems
  } = useGetAllMenusQuery();

  const data: Menu[] = [
    {
      "id": "e1f9375a-7de2-4c3b-9c8d-394f3d4ee292",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "name": "Ultimate Menu",
      "description": "Professtional menu for your restaurant",
      "is_active": true,
      "created_at": "2025-09-07T16:34:24.757Z",
      "updated_at": "2025-09-07T16:34:24.757Z",
      "display_order": 0,
      "image_url": null,
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "menu_items": 200
      }
    }
  ]

  const columns: ColumnDef<Menu, unknown>[] = [
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
        <DataTableSortButton column={column} title="Thực đơn" />
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
                    CY
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
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Switch checked={row.original.is_active}/>
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
      header: () => <div className="text-right">Số món ăn</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.original._count?.menu_items}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 90,
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
                // onClick={() => openEditDialog(menu)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MenuIcon className="mr-2 h-4 w-4" />
                Quản lý món
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Lịch sử thay đổi
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => openDeleteDialog(menu)}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
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

  const dispatch = useAppDispatch();

  useEffect(() => {

  }, [])

  const filteredMenus = menus.filter((menu: Menu) => {
    return menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const getMenuStats = () => {
    const totalMenus = menus.length
    const activeMenus = menus.filter((m: Menu) => m.is_active).length
    const inactiveMenus = menus.filter((m: Menu) => !m.is_active).length
    const totalMenuItems = menus.reduce((sum: number, menu: Menu) => sum + (menu._count?.menu_items || 0), 0)

    return { totalMenus, activeMenus, inactiveMenus, totalMenuItems }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    toast.success('Menu đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingMenu(null)
    toast.success('Thông tin menu đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingMenu(null)
    toast.success('Menu đã được xóa!')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (menu: Menu) => {
    setEditingMenu(menu)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (menu: Menu) => {
    setDeletingMenu(menu)
    setIsDeleteDialogOpen(true)
  }

  const stats = getMenuStats()

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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý menu</h1>
          <p className="text-muted-foreground">
            Quản lý các menu và danh mục món ăn trong nhà hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm menu
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số menu
            </CardTitle>
            <MenuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMenus}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả menu trong nhà hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menu đang hoạt động
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-professional-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-professional-green">{stats.activeMenus}</div>
            <p className="text-xs text-muted-foreground">
              Hiển thị cho khách hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menu tạm dừng
            </CardTitle>
            <XCircle className="h-4 w-4 text-professional-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-professional-red">{stats.inactiveMenus}</div>
            <p className="text-xs text-muted-foreground">
              Không hiển thị cho khách
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số món ăn
            </CardTitle>
            <MenuIcon className="h-4 w-4 text-professional-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-professional-blue">{stats.totalMenuItems}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả món trong các menu
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={data}
        search={{
          column: "name",
          placeholder: "Tìm kiếm thực đơn..."
        }}
        max="name"
        filter={[
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5" />
            Danh sách menu
          </CardTitle>
          <CardDescription>
            Quản lý và cấu hình các menu của nhà hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên menu hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={refetchMenuItems}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMenus.map((menu: Menu) => (
              <Card key={menu.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{menu.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {menu.description || 'Không có mô tả'}
                      </p>
                    </div>
                    <Badge variant={menu.is_active ? "default" : "secondary"}>
                      {menu.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Tạm dừng
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số món:</span>
                      <span className="font-medium">{menu._count?.menu_items || 0} món</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thứ tự:</span>
                      <span className="font-medium">{menu.display_order}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span className="text-xs">{new Date(menu.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem món
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(menu)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MenuIcon className="mr-2 h-4 w-4" />
                          Quản lý món
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Lịch sử thay đổi
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(menu)}
                          variant="destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Menu Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm menu mới</DialogTitle>
            <DialogDescription>
              Tạo mới menu cho nhà hàng
            </DialogDescription>
          </DialogHeader>
          <MenuForm
            mode="create"
            restaurantId="5dc89877-8c0b-482d-a71d-609d6e14cb9e"
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa menu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin menu
            </DialogDescription>
          </DialogHeader>
          {editingMenu && (
            <MenuForm
              mode="update"
              initialValues={editingMenu}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        trigger={<div style={{ display: 'none' }} />}
        title="Xóa menu"
        description={`Bạn có chắc chắn muốn xóa "${deletingMenu?.name}"?`}
        onConfirm={async () => {
          // if (deletingMenu) {
          //   try {
          //     await deleteMenu(dispatch, deletingMenu.id)
          //     handleDeleteSuccess()
          //   } catch (error) {
          //     toast.error('Có lỗi xảy ra khi xóa menu!')
          //   }
          // }
        }}
      />
    </div>
  )
}
