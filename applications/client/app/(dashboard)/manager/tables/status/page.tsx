"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { toast } from 'sonner'

// Import form components and services
import { TableForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { useAppDispatch } from '@/state/redux';
import { fetchTables, createTable, updateTable, deleteTable } from '@/services/tableServices';
import { TableDataColumn } from "@/constants/interfaces"
import { useGetAllTablesQuery } from '@/state/api'
import { StatsBox } from "@/components/elements/stats-box";
import { StatsBoxProps } from "@/constants/interfaces";
import { getTableStatus } from "@/utils/status-utils"

export default function TableStatusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableDataColumn | null>(null)
  const [deletingTable, setDeletingTable] = useState<TableDataColumn | null>(null)
  const {
    data: tablesData = [],
    error,
    isLoading,
    refetch
  } = useGetAllTablesQuery()

  const dispatch = useAppDispatch();

  const mockTables: TableDataColumn[] = [
    {
      "id": "cba6dd0b-b03e-4b02-bf0e-0d12385b621b",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T19",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:29.882Z",
      "updated_at": "2025-09-07T16:40:29.882Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "5239ede9-734c-4740-9c1a-beccc3ff350b",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T23",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:30.931Z",
      "updated_at": "2025-09-07T16:40:30.931Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "c03da8c1-12dc-4d17-b18e-96c540ad0ba0",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T24",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:31.193Z",
      "updated_at": "2025-09-07T16:40:31.193Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "7d067eeb-baba-4e94-8b46-df96e0d28089",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T6",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:26.450Z",
      "updated_at": "2025-09-07T16:40:26.450Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "5cfad2a1-5166-4203-bd27-87a32909eff5",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T2",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:25.357Z",
      "updated_at": "2025-09-07T16:40:25.357Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "9d25466d-bf75-46d1-be1a-3f9df1bbf680",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T10",
      "capacity": 8,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:27.517Z",
      "updated_at": "2025-09-07T16:40:27.517Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "6e942ffa-8e14-4964-8fa7-715071b5367c",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T18",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:29.617Z",
      "updated_at": "2025-09-07T16:40:29.617Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "5c8b0b5a-d29a-484f-ab1b-b8ee0616a6fd",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T7",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:26.711Z",
      "updated_at": "2025-09-07T16:40:26.711Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "91f35ac2-7957-40be-9ee5-fcbb823f1577",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T8",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:26.992Z",
      "updated_at": "2025-09-07T16:40:26.992Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "878382bd-083e-41b6-ad62-af89b0499c23",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T20",
      "capacity": 8,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:30.143Z",
      "updated_at": "2025-09-07T16:40:30.143Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
    {
      "id": "0b980e0b-cf90-4c55-95ce-d6428fb6e4f7",
      "restaurant_id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
      "table_number": "T1",
      "capacity": 4,
      "location": null,
      "status": "available",
      "qr_code": null,
      "created_at": "2025-09-07T16:40:25.081Z",
      "updated_at": "2025-09-07T16:40:25.081Z",
      "restaurants": {
        "id": "4ac60dce-ce60-4df4-a950-3585cbef426f",
        "name": "Waddles",
        "code": "WADDLES"
      },
      "_count": {
        "reservations": 0,
        "table_orders": 0
      }
    },
  ]

  const tables: TableDataColumn[] = (tablesData && tablesData.length > 0 ? tablesData : mockTables)

  const filteredTables = tables.filter((table: TableDataColumn) => {
    const matchesSearch = table.table_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.location && table.location.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || table.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getTableStats = () => {
    const totalTables = tables.length
    const availableTables = tables.filter((t: TableDataColumn) => t.status === 'available').length
    const occupiedTables = tables.filter((t: TableDataColumn) => t.status === 'occupied').length
    const reservedTables = tables.filter((t: TableDataColumn) => t.status === 'reserved').length
    const maintenanceTables = tables.filter((t: TableDataColumn) => t.status === 'maintenance').length
    const outOfOrderTables = tables.filter((t: TableDataColumn) => t.status === 'out_of_order').length

    return { totalTables, availableTables, occupiedTables, reservedTables, maintenanceTables, outOfOrderTables }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    refetch()
    toast.success('Bàn đã được tạo thành công!')
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingTable(null)
    refetch()
    toast.success('Thông tin bàn đã được cập nhật!')
  }

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false)
    setDeletingTable(null)
    refetch()
    toast.success('Bàn đã được xóa!')
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (table: TableDataColumn) => {
    setEditingTable(table)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (table: TableDataColumn) => {
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

  const statsBox: StatsBoxProps[] = [
    {
      title: "Tổng số bàn",
      description: "Bàn tất cả",
      icon: Users,
      stats: stats.totalTables
    },
    {
      title: "Bàn trống",
      description: "Sẵn sàng",
      icon: CheckCircle,
      color: "professional-green",
      stats: stats.availableTables
    },
    {
      title: "Có khách",
      description: "Đang phục vụ",
      icon: Users,
      color: "professional-red",
      stats: stats.occupiedTables
    },
    {
      title: "Đã đặt",
      description: "Có đặt trước",
      icon: Calendar,
      color: "professional-blue",
      stats: stats.reservedTables
    },
    {
      title: "Bảo trì",
      description: "Đang bảo trì",
      icon: AlertTriangle,
      color: "professional-gray",
      stats: stats.maintenanceTables
    },
    {
      title: "Hỏng",
      description: "Không sử dụng",
      icon: AlertTriangle,
      color: "professional-orange",
      stats: stats.outOfOrderTables
    },
  ]

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bàn</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi trạng thái các bàn trong nhà hàng
          </p>
        </div>
        <div className="flex gap-2">
        </div>
      </div> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
        {statsBox.map((box, idx) => (
          <StatsBox
            key={idx}
            title={box.title}
            description={box.description}
            icon={box.icon}
            color={box.color}
            stats={box.stats}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo số bàn hoặc vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refetch}
        >
          <RefreshCw className="h-4 w-4" />
          {/* Làm mới */}
        </Button>
        <Button
          variant="outline"
          size="icon"
        >
          <Download className="h-4 w-4" />
          {/* Xuất báo cáo */}
        </Button>
        <Button
          variant="outline"
          size="icon"
        >
          <QrCode className="h-4 w-4" />
          {/* Tạo QR Code */}
        </Button>
        <Button
          onClick={openCreateDialog}
          size="icon"
        >
          <Plus className="h-4 w-4" />
          {/* Thêm bàn */}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 m-0">
        {filteredTables.map((table: TableDataColumn) => (
          <TableCard
            key={table.id}
            table={table}
            openEditDialog={() => openEditDialog(table)}
            openDeleteDialog={() => openDeleteDialog(table)}
          />
        ))}
      </div>

      <Card className="hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Danh sách bàn
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái tất cả các bàn
          </CardDescription>
        </CardHeader>
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
              initialValues={{
                table_number: editingTable.table_number,
                capacity: editingTable.capacity ?? undefined,
                location: editingTable.location ?? null,
                status: (['available', 'occupied', 'reserved', 'maintenance', 'out_of_order'] as const).includes((editingTable.status as any))
                  ? (editingTable.status as any)
                  : 'available',
                qr_code: (editingTable.qr_code as any) ?? null,
              }}
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

function TableCard({
  table,
  openEditDialog,
  openDeleteDialog,
}: {
  table: TableDataColumn,
  openEditDialog: (table: TableDataColumn) => void,
  openDeleteDialog: (table: TableDataColumn) => void,
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{table.table_number}</h3>
          <p className="text-sm text-muted-foreground">{table.location || 'Chưa có vị trí'}</p>
        </div>
        {getTableStatus(table.status)}
      </CardHeader>
      <CardContent className="">
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
            <span className="text-xs">{table.created_at ? new Date(table.created_at as string | number).toLocaleDateString('vi-VN') : '—'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Chi tiết
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
