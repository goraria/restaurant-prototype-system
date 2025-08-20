"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Search, MapPin, Truck, Clock, CheckCircle, Navigation, Phone, Timer, AlertTriangle, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface TrackingStep {
  id: string
  label: string
  timestamp?: string
  status: "completed" | "current" | "pending"
  location?: string
  notes?: string
}

interface DeliveryTracking {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  customerCoordinates?: { lat: number; lng: number }
  orderType: "delivery" | "takeaway" | "dine_in"
  status: "preparing" | "ready" | "out_for_delivery" | "delivered" | "failed"
  orderTime: string
  estimatedTime: string
  actualDeliveryTime?: string
  driverName?: string
  driverPhone?: string
  vehicleInfo?: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: "paid" | "pending" | "cash_on_delivery"
  specialInstructions?: string
  items: Array<{
    name: string
    quantity: number
    notes?: string
  }>
  trackingSteps: TrackingStep[]
  currentLocation?: { lat: number; lng: number; address: string }
  distanceRemaining?: number
  timeRemaining?: number
}

// Mock data
const mockTrackingData: DeliveryTracking[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Nguyễn Văn Nam",
    customerPhone: "0123456789",
    deliveryAddress: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    customerCoordinates: { lat: 10.7769, lng: 106.7009 },
    orderType: "delivery",
    status: "out_for_delivery",
    orderTime: "2024-01-20T18:30:00Z",
    estimatedTime: "45 phút",
    driverName: "Trần Văn Tài",
    driverPhone: "0987654321",
    vehicleInfo: "Honda Wave - 59F1-12345",
    totalAmount: 350000,
    paymentMethod: "Tiền mặt",
    paymentStatus: "cash_on_delivery",
    specialInstructions: "Gọi trước khi đến, cổng màu xanh",
    currentLocation: { lat: 10.7751, lng: 106.6957, address: "Đường Lê Lợi, Quận 1" },
    distanceRemaining: 1.2,
    timeRemaining: 8,
    items: [
      { name: "Phở bò đặc biệt", quantity: 2 },
      { name: "Chả cá Lả Vọng", quantity: 1 },
      { name: "Trà đá", quantity: 2 }
    ],
    trackingSteps: [
      {
        id: "1",
        label: "Đơn hàng được xác nhận",
        timestamp: "2024-01-20T18:30:00Z",
        status: "completed",
        location: "Nhà hàng"
      },
      {
        id: "2", 
        label: "Bắt đầu chuẩn bị",
        timestamp: "2024-01-20T18:35:00Z",
        status: "completed",
        location: "Bếp"
      },
      {
        id: "3",
        label: "Đóng gói hoàn tất",
        timestamp: "2024-01-20T19:00:00Z",
        status: "completed",
        location: "Khu vực đóng gói"
      },
      {
        id: "4",
        label: "Shipper đã nhận đơn",
        timestamp: "2024-01-20T19:05:00Z",
        status: "completed",
        location: "Nhà hàng",
        notes: "Trần Văn Tài - 0987654321"
      },
      {
        id: "5",
        label: "Đang giao hàng",
        timestamp: "2024-01-20T19:10:00Z",
        status: "current",
        location: "Trên đường"
      },
      {
        id: "6",
        label: "Giao hàng thành công",
        status: "pending"
      }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Trần Thị Lan",
    customerPhone: "0987654321",
    deliveryAddress: "456 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
    orderType: "delivery",
    status: "preparing",
    orderTime: "2024-01-20T19:15:00Z",
    estimatedTime: "50 phút",
    totalAmount: 480000,
    paymentMethod: "MoMo",
    paymentStatus: "paid",
    specialInstructions: "Tầng 3, căn hộ 301",
    items: [
      { name: "Bún bò Huế", quantity: 2 },
      { name: "Nem nướng", quantity: 1, notes: "Không rau sống" },
      { name: "Coca Cola", quantity: 2 }
    ],
    trackingSteps: [
      {
        id: "1",
        label: "Đơn hàng được xác nhận",
        timestamp: "2024-01-20T19:15:00Z",
        status: "completed",
        location: "Nhà hàng"
      },
      {
        id: "2",
        label: "Bắt đầu chuẩn bị",
        timestamp: "2024-01-20T19:20:00Z",
        status: "current",
        location: "Bếp"
      },
      {
        id: "3",
        label: "Đóng gói hoàn tất",
        status: "pending"
      },
      {
        id: "4",
        label: "Shipper nhận đơn",
        status: "pending"
      },
      {
        id: "5",
        label: "Đang giao hàng",
        status: "pending"
      },
      {
        id: "6",
        label: "Giao hàng thành công",
        status: "pending"
      }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Lê Văn Hùng",
    customerPhone: "0369852147",
    deliveryAddress: "789 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    orderType: "takeaway",
    status: "ready",
    orderTime: "2024-01-20T19:45:00Z",
    estimatedTime: "20 phút",
    totalAmount: 280000,
    paymentMethod: "ZaloPay",
    paymentStatus: "paid",
    items: [
      { name: "Cơm tấm sườn bì", quantity: 1 },
      { name: "Chè ba màu", quantity: 1 }
    ],
    trackingSteps: [
      {
        id: "1",
        label: "Đơn hàng được xác nhận",
        timestamp: "2024-01-20T19:45:00Z",
        status: "completed",
        location: "Nhà hàng"
      },
      {
        id: "2",
        label: "Bắt đầu chuẩn bị",
        timestamp: "2024-01-20T19:50:00Z",
        status: "completed",
        location: "Bếp"
      },
      {
        id: "3",
        label: "Sẵn sàng để lấy",
        timestamp: "2024-01-20T20:05:00Z",
        status: "current",
        location: "Quầy lấy hàng"
      }
    ]
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Hoàng Thị Mai",
    customerPhone: "0258741963",
    deliveryAddress: "321 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    orderType: "delivery",
    status: "delivered",
    orderTime: "2024-01-20T17:30:00Z",
    estimatedTime: "40 phút",
    actualDeliveryTime: "2024-01-20T18:05:00Z",
    driverName: "Phạm Văn Nhanh",
    driverPhone: "0741852963",
    vehicleInfo: "Yamaha Sirius - 59G1-67890",
    totalAmount: 520000,
    paymentMethod: "Tiền mặt",
    paymentStatus: "paid",
    items: [
      { name: "Lẩu Thái hải sản", quantity: 1 },
      { name: "Bánh tráng nướng", quantity: 2 }
    ],
    trackingSteps: [
      {
        id: "1",
        label: "Đơn hàng được xác nhận",
        timestamp: "2024-01-20T17:30:00Z",
        status: "completed",
        location: "Nhà hàng"
      },
      {
        id: "2",
        label: "Bắt đầu chuẩn bị",
        timestamp: "2024-01-20T17:35:00Z",
        status: "completed",
        location: "Bếp"
      },
      {
        id: "3",
        label: "Đóng gói hoàn tất",
        timestamp: "2024-01-20T17:55:00Z",
        status: "completed",
        location: "Khu vực đóng gói"
      },
      {
        id: "4",
        label: "Shipper đã nhận đơn",
        timestamp: "2024-01-20T18:00:00Z",
        status: "completed",
        location: "Nhà hàng"
      },
      {
        id: "5",
        label: "Đang giao hàng",
        timestamp: "2024-01-20T18:02:00Z",
        status: "completed",
        location: "Trên đường"
      },
      {
        id: "6",
        label: "Giao hàng thành công",
        timestamp: "2024-01-20T18:05:00Z",
        status: "completed",
        location: "Địa chỉ khách hàng",
        notes: "Khách hàng đã nhận và thanh toán"
      }
    ]
  }
]

// Status configuration
const statusConfig = {
  preparing: { label: "Đang chuẩn bị", color: "bg-yellow-500", icon: Clock },
  ready: { label: "Sẵn sàng", color: "bg-blue-500", icon: CheckCircle },
  out_for_delivery: { label: "Đang giao", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-500", icon: CheckCircle },
  failed: { label: "Giao thất bại", color: "bg-red-500", icon: AlertTriangle }
}

const orderTypeConfig = {
  delivery: { label: "Giao hàng", color: "bg-purple-500" },
  takeaway: { label: "Mang về", color: "bg-green-500" },
  dine_in: { label: "Tại chỗ", color: "bg-blue-500" }
}

const paymentStatusConfig = {
  paid: { label: "Đã thanh toán", color: "bg-green-500" },
  pending: { label: "Chờ thanh toán", color: "bg-yellow-500" },
  cash_on_delivery: { label: "COD", color: "bg-blue-500" }
}

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<DeliveryTracking[]>(mockTrackingData)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryTracking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderTypeFilter, setOrderTypeFilter] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // In real app, this would fetch fresh data from API
      console.log("Refreshing tracking data...")
    }, 30000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Calculations
  const totalOrders = orders.length
  const deliveringOrders = orders.filter(order => order.status === "out_for_delivery").length
  const preparingOrders = orders.filter(order => order.status === "preparing").length
  const avgDeliveryTime = orders.filter(order => order.actualDeliveryTime)
    .reduce((sum, order) => {
      const orderTime = new Date(order.orderTime)
      const deliveryTime = new Date(order.actualDeliveryTime!)
      return sum + (deliveryTime.getTime() - orderTime.getTime()) / (1000 * 60)
    }, 0) / Math.max(orders.filter(order => order.actualDeliveryTime).length, 1)

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerPhone.includes(searchQuery) ||
                           order.driverName?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesOrderType = orderTypeFilter === "all" || order.orderType === orderTypeFilter
      
      return matchesSearch && matchesStatus && matchesOrderType
    })
  }, [orders, searchQuery, statusFilter, orderTypeFilter])

  const getEstimatedTimeRemaining = (order: DeliveryTracking) => {
    if (order.status === "delivered") return null
    
    const orderTime = new Date(order.orderTime)
    const estimatedMinutes = parseInt(order.estimatedTime.replace(' phút', ''))
    const estimatedCompletion = new Date(orderTime.getTime() + estimatedMinutes * 60000)
    const now = new Date()
    
    const remainingMs = estimatedCompletion.getTime() - now.getTime()
    const remainingMinutes = Math.floor(remainingMs / 60000)
    
    return remainingMinutes
  }

  const getTrackingProgress = (order: DeliveryTracking) => {
    const completedSteps = order.trackingSteps.filter(step => step.status === "completed").length
    return (completedSteps / order.trackingSteps.length) * 100
  }

  const columns: ColumnDef<DeliveryTracking>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn hàng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: "Số đơn hàng",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            <div className="font-medium">{order.orderNumber}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(order.orderTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium">{order.customerName}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-1 h-3 w-3" />
              {order.customerPhone}
            </div>
            {order.orderType === "delivery" && (
              <div className="flex items-start text-xs text-muted-foreground max-w-[200px]">
                <MapPin className="mr-1 h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="truncate">{order.deliveryAddress}</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "orderType",
      header: "Loại đơn",
      cell: ({ row }) => {
        const orderType = row.getValue("orderType") as keyof typeof orderTypeConfig
        const config = orderTypeConfig[orderType]
        return (
          <Badge className={`${config.color} text-white`}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const order = row.original
        const status = order.status as keyof typeof statusConfig
        const config = statusConfig[status]
        const Icon = config.icon
        const progress = getTrackingProgress(order)
        const timeRemaining = getEstimatedTimeRemaining(order)
        
        return (
          <div className="space-y-2">
            <Badge className={`${config.color} text-white`}>
              <Icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
            {order.status !== "delivered" && (
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                {timeRemaining !== null && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Timer className="mr-1 h-3 w-3" />
                    {timeRemaining > 0 ? `${timeRemaining} phút` : "Quá giờ"}
                    {timeRemaining <= 0 && timeRemaining > -30 && (
                      <AlertTriangle className="ml-1 h-3 w-3 text-orange-500" />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "driverName",
      header: "Tài xế",
      cell: ({ row }) => {
        const order = row.original
        if (!order.driverName) {
          return <span className="text-muted-foreground text-sm">Chưa phân công</span>
        }
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{order.driverName}</div>
            <div className="text-xs text-muted-foreground">{order.driverPhone}</div>
            {order.vehicleInfo && (
              <div className="text-xs text-muted-foreground">{order.vehicleInfo}</div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium text-right">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(order.totalAmount)}
            </div>
            <Badge 
              variant="outline" 
              className={paymentStatusConfig[order.paymentStatus].color + " text-white"}
            >
              {paymentStatusConfig[order.paymentStatus].label}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "distanceRemaining",
      header: "Khoảng cách",
      cell: ({ row }) => {
        const order = row.original
        if (order.status !== "out_for_delivery" || !order.distanceRemaining) {
          return <span className="text-muted-foreground">—</span>
        }
        return (
          <div className="text-sm">
            <div className="font-medium">{order.distanceRemaining}km</div>
            {order.timeRemaining && (
              <div className="text-muted-foreground">
                ~{order.timeRemaining} phút
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                <Eye className="mr-2 h-4 w-4" />
                Theo dõi chi tiết
              </DropdownMenuItem>
              {order.orderType === "delivery" && order.currentLocation && (
                <DropdownMenuItem>
                  <Navigation className="mr-2 h-4 w-4" />
                  Xem bản đồ
                </DropdownMenuItem>
              )}
              {order.driverPhone && (
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi tài xế
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Gọi khách hàng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theo dõi đơn hàng</h1>
          <p className="text-muted-foreground">
            Theo dõi tình trạng giao hàng và mang về
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Tự động làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đang theo dõi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang giao</CardTitle>
            <Truck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{deliveringOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn đang trên đường
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chuẩn bị</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{preparingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn đang nấu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian TB</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Phút giao hàng TB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo số đơn, khách hàng, tài xế..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="ready">Sẵn sàng</SelectItem>
                <SelectItem value="out_for_delivery">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="failed">Giao thất bại</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="delivery">Giao hàng</SelectItem>
                <SelectItem value="takeaway">Mang về</SelectItem>
                <SelectItem value="dine_in">Tại chỗ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách theo dõi</CardTitle>
          <CardDescription>
            Hiển thị {filteredOrders.length} đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredOrders}
            searchKey="orderNumber"
          />
        </CardContent>
      </Card>

      {/* Order Tracking Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Theo dõi đơn hàng - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Chi tiết quá trình xử lý và giao hàng
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <Tabs defaultValue="tracking" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracking">Theo dõi</TabsTrigger>
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracking" className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Khách hàng:</strong> {selectedOrder.customerName}
                  </div>
                  <div>
                    <strong>Số điện thoại:</strong> {selectedOrder.customerPhone}
                  </div>
                  {selectedOrder.orderType === "delivery" && (
                    <div className="col-span-2">
                      <strong>Địa chỉ:</strong> {selectedOrder.deliveryAddress}
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                {selectedOrder.driverName && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Thông tin tài xế</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Tài xế:</strong> {selectedOrder.driverName}
                      </div>
                      <div>
                        <strong>Điện thoại:</strong> {selectedOrder.driverPhone}
                      </div>
                      {selectedOrder.vehicleInfo && (
                        <div className="col-span-2">
                          <strong>Phương tiện:</strong> {selectedOrder.vehicleInfo}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Current Location */}
                {selectedOrder.currentLocation && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Vị trí hiện tại</h4>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedOrder.currentLocation.address}
                    </div>
                    {selectedOrder.distanceRemaining && (
                      <div className="mt-2 text-sm">
                        <strong>Khoảng cách còn lại:</strong> {selectedOrder.distanceRemaining}km
                        {selectedOrder.timeRemaining && ` (~${selectedOrder.timeRemaining} phút)`}
                      </div>
                    )}
                  </div>
                )}

                {/* Tracking Steps */}
                <div>
                  <h4 className="font-semibold mb-4">Lịch trình giao hàng</h4>
                  <div className="space-y-4">
                    {selectedOrder.trackingSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            step.status === "completed" 
                              ? "bg-green-500 border-green-500" 
                              : step.status === "current"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-gray-200 border-gray-300"
                          }`} />
                          {index < selectedOrder.trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-8 ${
                              step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            step.status === "current" ? "text-blue-600" : ""
                          }`}>
                            {step.label}
                          </div>
                          {step.timestamp && (
                            <div className="text-sm text-muted-foreground">
                              {new Date(step.timestamp).toLocaleString('vi-VN')}
                            </div>
                          )}
                          {step.location && (
                            <div className="text-sm text-muted-foreground">
                              Tại: {step.location}
                            </div>
                          )}
                          {step.notes && (
                            <div className="text-sm text-blue-600">
                              {step.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Ghi chú đặc biệt</h4>
                    <p className="text-sm">{selectedOrder.specialInstructions}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Món ăn đã đặt</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.notes && (
                            <div className="text-sm text-orange-600">Ghi chú: {item.notes}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedOrder.totalAmount)}
                  </div>
                  <div>
                    <strong>Phương thức:</strong> {selectedOrder.paymentMethod}
                  </div>
                  <div>
                    <strong>Trạng thái:</strong> {paymentStatusConfig[selectedOrder.paymentStatus].label}
                  </div>
                  <div>
                    <strong>Thời gian đặt:</strong> {new Date(selectedOrder.orderTime).toLocaleString('vi-VN')}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Đóng
            </Button>
            {selectedOrder?.driverPhone && (
              <Button>
                <Phone className="mr-2 h-4 w-4" />
                Gọi tài xế
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
