"use client"

import React, { useState, useEffect } from "react"
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
  QrCode,
  Users,
  Calendar,
  CheckCircle,
  MapPin,
  Clock,
  AlertTriangle,
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

// Import form components and services
import { TableForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { useAppDispatch } from '@/state/redux';
import { fetchTables, createTable, updateTable, deleteTable } from '@/services/tableServices';

interface Table {
  id: string
  table_number: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'out_of_order'
  location?: string | null
  qr_code?: string | null
  restaurant_id: string
  created_at: string
  updated_at: string
}

export default function TablesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [deletingTable, setDeletingTable] = useState<Table | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useAppDispatch();

  const loadTables = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTables(dispatch, {})
      setTables(data || [])
    } catch (error) {
      console.error('Error loading tables:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách bàn!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTables()
  }, [])

  const filteredTables = tables.filter((table: Table) => {
    const matchesSearch = table.table_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (table.location && table.location.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || table.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getTableStats = () => {
    const totalTables = tables.length
    const availableTables = tables.filter((t: Table) => t.status === 'available').length
    const occupiedTables = tables.filter((t: Table) => t.status === 'occupied').length
    const reservedTables = tables.filter((t: Table) => t.status === 'reserved').length
    const maintenanceTables = tables.filter((t: Table) => t.status === 'maintenance').length
    const outOfOrderTables = tables.filter((t: Table) => t.status === 'out_of_order').length

    return { totalTables, availableTables, occupiedTables, reservedTables, maintenanceTables, outOfOrderTables }
  }

  const getStatusBadge = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Trống</Badge>
      case 'occupied':
        return <Badge className="bg-red-100 text-red-800"><Users className="w-3 h-3 mr-1" />Có khách</Badge>
      case 'reserved':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Đã đặt</Badge>
      case 'maintenance':
        return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="w-3 h-3 mr-1" />Bảo trì</Badge>
      case 'out_of_order':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Hỏng</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    loadTables()
    toast.success('Bàn đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingTable(null)
    loadTables()
    toast.success('Thông tin bàn đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingTable(null)
    loadTables()
    toast.success('Bàn đã được xóa!')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (table: Table) => {
    setEditingTable(table)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (table: Table) => {
    setDeletingTable(table)
    setIsDeleteDialogOpen(true)
  }

  const stats = getTableStats()

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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bàn</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi trạng thái các bàn trong nhà hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            Tạo QR Code
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bàn
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số bàn
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTables}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả bàn trong nhà hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bàn trống
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableTables}</div>
            <p className="text-xs text-muted-foreground">
              Sẵn sàng phục vụ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Có khách
            </CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.occupiedTables}</div>
            <p className="text-xs text-muted-foreground">
              Đang phục vụ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã đặt
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reservedTables}</div>
            <p className="text-xs text-muted-foreground">
              Có đặt trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hỏng
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfOrderTables}</div>
            <p className="text-xs text-muted-foreground">
              Không sử dụng được
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bảo trì
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.maintenanceTables}</div>
            <p className="text-xs text-muted-foreground">
              Đang bảo trì
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Danh sách bàn
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái tất cả các bàn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo số bàn hoặc vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={loadTables}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTables.map((table: Table) => (
              <Card key={table.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{table.table_number}</h3>
                      <p className="text-sm text-muted-foreground">{table.location || 'Chưa có vị trí'}</p>
                    </div>
                    {getStatusBadge(table.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sức chứa:</span>
                      <span className="font-medium">{table.capacity} người</span>
                    </div>
                    {table.qr_code && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QR Code:</span>
                        <span className="font-mono text-xs">{table.qr_code}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span className="text-xs">{new Date(table.created_at).toLocaleDateString('vi-VN')}</span>
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
                        <DropdownMenuItem onClick={() => openEditDialog(table)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="mr-2 h-4 w-4" />
                          Xem QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Lịch đặt bàn
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(table)}
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

      {/* Create Table Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm bàn mới</DialogTitle>
            <DialogDescription>
              Thêm mới bàn vào nhà hàng
            </DialogDescription>
          </DialogHeader>
          <TableForm
            mode="create"
            restaurantId="5dc89877-8c0b-482d-a71d-609d6e14cb9e"
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bàn</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bàn
            </DialogDescription>
          </DialogHeader>
          {editingTable && (
            <TableForm
              mode="update"
              initialValues={editingTable}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        trigger={<div style={{ display: 'none' }} />}
        title="Xóa bàn"
        description={`Bạn có chắc chắn muốn xóa "${deletingTable?.table_number}"?`}
        onConfirm={async () => {
          if (deletingTable) {
            try {
              await deleteTable(dispatch, deletingTable.id)
              handleDeleteSuccess()
            } catch (error) {
              toast.error('Có lỗi xảy ra khi xóa bàn!')
            }
          }
        }}
      />
    </div>
  )
}
