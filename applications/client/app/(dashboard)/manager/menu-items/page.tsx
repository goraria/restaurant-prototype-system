"use client"

import React, { useState, useEffect } from "react"
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
  Utensils,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'

// Import form components and services
import { MenuItemForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { useAppDispatch } from '@/state/redux';
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuServices';

interface MenuItem {
  id: string
  restaurant_id: string
  menu_id: string
  category_id?: string
  name: string
  description?: string
  price: number
  image_url?: string
  preparation_time?: number
  calories?: number
  allergens?: string[]
  dietary_info?: string[]
  is_vegetarian: boolean
  is_vegan: boolean
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
  menu?: {
    id: string
    name: string
  }
  category?: {
    id: string
    name: string
  }
}

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMenu, setSelectedMenu] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [deletingMenuItem, setDeletingMenuItem] = useState<MenuItem | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useAppDispatch();

  const loadMenuItems = async () => {
    try {
      setIsLoading(true)
      const data = await fetchMenuItems(dispatch, {})
      setMenuItems(data || [])
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách món ăn!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMenuItems()
  }, [])

  const filteredMenuItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMenu = selectedMenu === "all" || item.menu_id === selectedMenu
    const matchesCategory = selectedCategory === "all" || item.category_id === selectedCategory
    const matchesAvailability = selectedAvailability === "all" || 
                               (selectedAvailability === "available" && item.is_available) ||
                               (selectedAvailability === "unavailable" && !item.is_available)
    
    return matchesSearch && matchesMenu && matchesCategory && matchesAvailability
  })

  const getMenuItemStats = () => {
    const totalItems = menuItems.length
    const availableItems = menuItems.filter((item: MenuItem) => item.is_available).length
    const unavailableItems = menuItems.filter((item: MenuItem) => !item.is_available).length
    const vegetarianItems = menuItems.filter((item: MenuItem) => item.is_vegetarian).length
    const veganItems = menuItems.filter((item: MenuItem) => item.is_vegan).length
    const totalValue = menuItems.reduce((sum: number, item: MenuItem) => sum + item.price, 0)

    return { totalItems, availableItems, unavailableItems, vegetarianItems, veganItems, totalValue }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    loadMenuItems()
    toast.success('Món ăn đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingMenuItem(null)
    loadMenuItems()
    toast.success('Thông tin món ăn đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingMenuItem(null)
    loadMenuItems()
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số món
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả món trong menu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Có sẵn
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableItems}</div>
            <p className="text-xs text-muted-foreground">
              Đang bán
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
            <div className="text-2xl font-bold text-red-600">{stats.unavailableItems}</div>
            <p className="text-xs text-muted-foreground">
              Tạm dừng bán
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món chay
            </CardTitle>
            <Utensils className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.vegetarianItems}</div>
            <p className="text-xs text-muted-foreground">
              Phù hợp người ăn chay
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món thuần chay
            </CardTitle>
            <Utensils className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.veganItems}</div>
            <p className="text-xs text-muted-foreground">
              Không có thành phần động vật
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giá trị
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Tổng giá tất cả món
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
            <Button variant="outline" size="sm" onClick={loadMenuItems}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMenuItems.map((item: MenuItem) => (
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
                      <span className="font-medium">{formatCurrency(item.price)}</span>
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
                    <div className="flex gap-1 mt-2">
                      {item.is_vegetarian && (
                        <Badge variant="outline" className="text-xs">Chay</Badge>
                      )}
                      {item.is_vegan && (
                        <Badge variant="outline" className="text-xs">Thuần chay</Badge>
                      )}
                    </div>
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
                          <Utensils className="mr-2 h-4 w-4" />
                          Xem công thức
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Lịch sử thay đổi
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
            ))}
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
              initialValues={editingMenuItem}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        trigger={<div style={{ display: 'none' }} />}
        title="Xóa món"
        description={`Bạn có chắc chắn muốn xóa "${deletingMenuItem?.name}"?`}
        onConfirm={async () => {
          if (deletingMenuItem) {
            try {
              await deleteMenuItem(dispatch, deletingMenuItem.id)
              handleDeleteSuccess()
            } catch (error) {
              toast.error('Có lỗi xảy ra khi xóa món!')
            }
          }
        }}
      />
    </div>
  )
}
