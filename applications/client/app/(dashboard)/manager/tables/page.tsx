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
  QrCode,
  Users,
  Calendar,
  CheckCircle,
  MapPin,
  Clock
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Table {
  id: number
  number: string
  capacity: number
  status: string
  currentOrder?: string
  qrCode: string
  location: string
  lastCleaned: string
  reservedBy?: string
  reservedTime?: string
}

export default function TablesPage() {
  const tables: Table[] = [
    {
      id: 1,
      number: "Bàn 01",
      capacity: 4,
      status: "occupied",
      currentOrder: "ORD-2024-001",
      qrCode: "QR001",
      location: "Tầng 1 - Khu A",
      lastCleaned: "14:30",
      reservedBy: "Nguyễn Văn A",
      reservedTime: "15:00"
    },
    {
      id: 2,
      number: "Bàn 02",
      capacity: 2,
      status: "available",
      qrCode: "QR002",
      location: "Tầng 1 - Khu A",
      lastCleaned: "14:00"
    },
    {
      id: 3,
      number: "Bàn 03",
      capacity: 6,
      status: "reserved",
      qrCode: "QR003",
      location: "Tầng 1 - Khu B",
      lastCleaned: "13:45",
      reservedBy: "Trần Thị B",
      reservedTime: "16:00"
    },
    {
      id: 4,
      number: "Bàn 04",
      capacity: 4,
      status: "cleaning",
      qrCode: "QR004",
      location: "Tầng 2 - Khu A",
      lastCleaned: "14:45"
    },
    {
      id: 5,
      number: "Bàn 05",
      capacity: 8,
      status: "occupied",
      currentOrder: "ORD-2024-003",
      qrCode: "QR005",
      location: "Tầng 2 - VIP",
      lastCleaned: "13:30"
    },
    {
      id: 6,
      number: "Bàn 06",
      capacity: 2,
      status: "maintenance",
      qrCode: "QR006",
      location: "Tầng 1 - Khu B",
      lastCleaned: "12:00"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Có sẵn</Badge>
      case "occupied":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Có khách</Badge>
      case "reserved":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đã đặt</Badge>
      case "cleaning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang dọn</Badge>
      case "maintenance":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Bảo trì</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "reserved":
        return "bg-blue-500"
      case "cleaning":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-gray-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <QrCode className="h-8 w-8" />
            Quản lý bàn ăn
          </h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái bàn và quản lý QR code đặt món
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Xem đặt bàn
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bàn mới
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm bàn..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo trạng thái
        </Button>
        <Button variant="outline">
          <MapPin className="mr-2 h-4 w-4" />
          Sơ đồ bàn
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bàn</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Tổng cộng trong nhà hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bàn có khách</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              33% đang phục vụ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bàn trống</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              50% sẵn sàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đặt trước</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Hôm nay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{table.number}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`} />
                  {getStatusBadge(table.status)}
                </div>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {table.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sức chứa:</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{table.capacity} người</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">QR Code:</span>
                  <div className="flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    <span className="font-medium">{table.qrCode}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dọn lần cuối:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{table.lastCleaned}</span>
                  </div>
                </div>

                {table.currentOrder && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Đơn hàng:</span>
                    <Badge variant="outline">{table.currentOrder}</Badge>
                  </div>
                )}

                {table.reservedBy && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Đặt bởi:</span>
                      <span className="font-medium text-sm">{table.reservedBy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Thời gian:</span>
                      <span className="font-medium text-sm">{table.reservedTime}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <QrCode className="h-3 w-3 mr-1" />
                    QR
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Sửa
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Đặt bàn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Đánh dấu dọn xong
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa bàn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
