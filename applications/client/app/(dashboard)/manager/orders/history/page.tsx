"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Download, Search, Calendar, TrendingUp, TrendingDown, DollarSign, Package, Star, Printer, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

// Types
interface OrderHistoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
}

interface OrderHistory {
  id: string
  orderNumber: string
  customerName?: string
  customerPhone?: string
  tableNumber?: string
  orderType: "dine_in" | "takeaway" | "delivery" | "online"
  status: "completed" | "cancelled" | "refunded"
  orderDate: string
  completedDate?: string
  totalItems: number
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: "paid" | "refunded" | "partial_refund"
  notes: string
  rating?: number
  feedback?: string
  items: OrderHistoryItem[]
  assignedStaff?: string
  refundAmount?: number
  refundReason?: string
}

// Mock data
const mockOrderHistory: OrderHistory[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Nguyễn Văn Nam",
    customerPhone: "0123456789",
    tableNumber: "A01",
    orderType: "dine_in",
    status: "completed",
    orderDate: "2024-01-20T17:30:00Z",
    completedDate: "2024-01-20T18:45:00Z",
    totalItems: 3,
    subtotal: 485000,
    discount: 0,
    tax: 48500,
    total: 533500,
    paymentMethod: "Tiền mặt",
    paymentStatus: "paid",
    notes: "Khách hàng hài lòng",
    rating: 5,
    feedback: "Món ăn ngon, phục vụ tốt",
    assignedStaff: "Nguyễn Văn A",
    items: [
      {
        id: "1",
        name: "Bò bít tết",
        category: "Món chính",
        quantity: 1,
        unitPrice: 280000,
        totalPrice: 280000,
        notes: "Tái"
      },
      {
        id: "2", 
        name: "Salad Caesar",
        category: "Khai vị",
        quantity: 1,
        unitPrice: 120000,
        totalPrice: 120000
      },
      {
        id: "3",
        name: "Nước cam",
        category: "Đồ uống",
        quantity: 2,
        unitPrice: 42500,
        totalPrice: 85000
      }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Trần Thị Lan",
    customerPhone: "0987654321",
    orderType: "takeaway",
    status: "completed",
    orderDate: "2024-01-20T18:15:00Z",
    completedDate: "2024-01-20T18:30:00Z",
    totalItems: 2,
    subtotal: 340000,
    discount: 34000,
    tax: 30600,
    total: 336600,
    paymentMethod: "Thẻ tín dụng",
    paymentStatus: "paid",
    notes: "Khách VIP - giảm 10%",
    rating: 4,
    feedback: "Nhanh gọn, tiện lợi",
    assignedStaff: "Trần Thị B",
    items: [
      {
        id: "4",
        name: "Phở bò đặc biệt",
        category: "Món chính",
        quantity: 2,
        unitPrice: 85000,
        totalPrice: 170000
      },
      {
        id: "5",
        name: "Chả cá Lả Vọng",
        category: "Món chính", 
        quantity: 1,
        unitPrice: 170000,
        totalPrice: 170000
      }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Lê Văn Hùng",
    customerPhone: "0369852147",
    orderType: "delivery",
    status: "completed",
    orderDate: "2024-01-19T19:45:00Z",
    completedDate: "2024-01-19T21:15:00Z",
    totalItems: 4,
    subtotal: 680000,
    discount: 0,
    tax: 68000,
    total: 748000,
    paymentMethod: "Momo",
    paymentStatus: "paid",
    notes: "Giao đến 123 Đường ABC, Quận 1",
    rating: 4,
    feedback: "Đồ ăn còn nóng khi giao",
    assignedStaff: "Lê Văn C",
    items: [
      {
        id: "6",
        name: "Lẩu Thái hải sản",
        category: "Lẩu",
        quantity: 1,
        unitPrice: 450000,
        totalPrice: 450000
      },
      {
        id: "7",
        name: "Bánh tráng nướng",
        category: "Khai vị",
        quantity: 2,
        unitPrice: 65000,
        totalPrice: 130000
      },
      {
        id: "8",
        name: "Trà đá",
        category: "Đồ uống",
        quantity: 4,
        unitPrice: 25000,
        totalPrice: 100000
      }
    ]
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Hoàng Thị Mai",
    customerPhone: "0258741963",
    tableNumber: "B05",
    orderType: "dine_in",
    status: "cancelled",
    orderDate: "2024-01-19T16:20:00Z",
    totalItems: 2,
    subtotal: 350000,
    discount: 0,
    tax: 35000,
    total: 385000,
    paymentMethod: "Chưa thanh toán",
    paymentStatus: "refunded",
    notes: "Khách hủy do chờ quá lâu",
    assignedStaff: "Phạm Thị D",
    items: [
      {
        id: "9",
        name: "Cơm niêu Singapore",
        category: "Cơm",
        quantity: 1,
        unitPrice: 180000,
        totalPrice: 180000
      },
      {
        id: "10",
        name: "Canh chua cá basa",
        category: "Canh",
        quantity: 1,
        unitPrice: 120000,
        totalPrice: 120000
      }
    ]
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerName: "Đinh Văn Quốc",
    customerPhone: "0741852963",
    orderType: "online",
    status: "refunded",
    orderDate: "2024-01-18T20:30:00Z",
    totalItems: 3,
    subtotal: 560000,
    discount: 50000,
    tax: 51000,
    total: 561000,
    paymentMethod: "ZaloPay",
    paymentStatus: "refunded",
    refundAmount: 561000,
    refundReason: "Món ăn không đúng yêu cầu",
    notes: "Khách yêu cầu hoàn tiền",
    rating: 2,
    feedback: "Không hài lòng về chất lượng",
    assignedStaff: "Vũ Thị E",
    items: [
      {
        id: "11",
        name: "Pizza hải sản",
        category: "Pizza",
        quantity: 1,
        unitPrice: 320000,
        totalPrice: 320000
      },
      {
        id: "12",
        name: "Gà rán giòn",
        category: "Món chính",
        quantity: 1,
        unitPrice: 150000,
        totalPrice: 150000
      },
      {
        id: "13",
        name: "Coca Cola",
        category: "Đồ uống",
        quantity: 2,
        unitPrice: 45000,
        totalPrice: 90000
      }
    ]
  }
]

// Status configuration
const statusConfig = {
  completed: { label: "Hoàn thành", color: "bg-green-500" },
  cancelled: { label: "Đã hủy", color: "bg-red-500" },
  refunded: { label: "Đã hoàn tiền", color: "bg-orange-500" }
}

const orderTypeConfig = {
  dine_in: { label: "Tại chỗ", color: "bg-blue-500" },
  takeaway: { label: "Mang về", color: "bg-green-500" },
  delivery: { label: "Giao hàng", color: "bg-purple-500" },
  online: { label: "Online", color: "bg-orange-500" }
}

const paymentStatusConfig = {
  paid: { label: "Đã thanh toán", color: "bg-green-500" },
  refunded: { label: "Đã hoàn tiền", color: "bg-red-500" },
  partial_refund: { label: "Hoàn tiền một phần", color: "bg-yellow-500" }
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistory[]>(mockOrderHistory)
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderTypeFilter, setOrderTypeFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date()
  })

  // Calculations
  const totalOrders = orders.length
  const completedOrders = orders.filter(order => order.status === "completed").length
  const totalRevenue = orders.filter(order => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0)
  const avgRating = orders.filter(order => order.rating)
    .reduce((sum, order) => sum + (order.rating || 0), 0) / 
    Math.max(orders.filter(order => order.rating).length, 1)

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerPhone?.includes(searchQuery) ||
                           order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesOrderType = orderTypeFilter === "all" || order.orderType === orderTypeFilter
      const matchesPaymentMethod = paymentMethodFilter === "all" || order.paymentMethod === paymentMethodFilter
      
      let matchesDate = true
      if (dateRange?.from && dateRange?.to) {
        const orderDate = new Date(order.orderDate)
        matchesDate = orderDate >= dateRange.from && orderDate <= dateRange.to
      }
      
      return matchesSearch && matchesStatus && matchesOrderType && matchesPaymentMethod && matchesDate
    })
  }, [orders, searchQuery, statusFilter, orderTypeFilter, paymentMethodFilter, dateRange])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  const exportToCSV = () => {
    const csvData = filteredOrders.map(order => ({
      "Số đơn hàng": order.orderNumber,
      "Khách hàng": order.customerName || "Khách vãng lai",
      "Loại đơn": orderTypeConfig[order.orderType].label,
      "Trạng thái": statusConfig[order.status].label,
      "Ngày đặt": new Date(order.orderDate).toLocaleDateString('vi-VN'),
      "Tổng tiền": order.total,
      "Phương thức thanh toán": order.paymentMethod,
      "Đánh giá": order.rating || "Chưa đánh giá"
    }))
    
    // Simplified CSV export (in real app, use proper CSV library)
    console.log("Xuất CSV:", csvData)
  }

  const columns: ColumnDef<OrderHistory>[] = [
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
              {order.tableNumber ? `Bàn ${order.tableNumber}` : orderTypeConfig[order.orderType].label}
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
          <div>
            <div className="font-medium">{order.customerName || "Khách vãng lai"}</div>
            {order.customerPhone && (
              <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
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
      accessorKey: "orderDate",
      header: "Ngày đặt",
      cell: ({ row }) => {
        const orderDate = new Date(row.getValue("orderDate"))
        return (
          <div className="text-sm">
            <div>{orderDate.toLocaleDateString('vi-VN')}</div>
            <div className="text-muted-foreground">
              {orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusConfig
        const config = statusConfig[status]
        return (
          <Badge className={`${config.color} text-white`}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "total",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium text-right">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(order.total)}
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
      accessorKey: "paymentMethod",
      header: "Thanh toán",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("paymentMethod")}</div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Đánh giá",
      cell: ({ row }) => {
        const order = row.original
        if (!order.rating) {
          return <span className="text-muted-foreground text-sm">Chưa đánh giá</span>
        }
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              {renderStars(order.rating)}
            </div>
            <div className="text-sm text-muted-foreground">
              {order.rating.toFixed(1)}/5.0
            </div>
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
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                In hóa đơn
              </DropdownMenuItem>
              {order.status === "completed" && order.paymentStatus === "paid" && (
                <DropdownMenuItem className="text-red-600">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Hoàn tiền
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const itemColumns: ColumnDef<OrderHistoryItem>[] = [
    {
      accessorKey: "name",
      header: "Món ăn",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.category}</div>
            {item.notes && (
              <div className="text-xs text-orange-600 mt-1">Ghi chú: {item.notes}</div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "SL",
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("quantity")}</div>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: "Đơn giá",
      cell: ({ row }) => (
        <div className="text-right">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(row.getValue("unitPrice"))}
        </div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Thành tiền",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(row.getValue("totalPrice"))}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">
            Xem lại lịch sử và thống kê đơn hàng
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng trong khoảng thời gian
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ: {((completedOrders / totalOrders) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu thực tế
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Điểm đánh giá / 5.0
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
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo số đơn, khách hàng, bàn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="dine_in">Tại chỗ</SelectItem>
                  <SelectItem value="takeaway">Mang về</SelectItem>
                  <SelectItem value="delivery">Giao hàng</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phương thức</SelectItem>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                  <SelectItem value="Momo">Momo</SelectItem>
                  <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đơn hàng</CardTitle>
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

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết đơn hàng đã hoàn thành
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Khách hàng:</strong> {selectedOrder.customerName || "Khách vãng lai"}
                </div>
                <div>
                  <strong>Loại đơn:</strong> {orderTypeConfig[selectedOrder.orderType].label}
                </div>
                <div>
                  <strong>Ngày đặt:</strong> {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}
                </div>
                <div>
                  <strong>Phụ trách:</strong> {selectedOrder.assignedStaff || "Không có"}
                </div>
              </div>

              {/* Rating & Feedback */}
              {selectedOrder.rating && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <strong>Đánh giá khách hàng:</strong>
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedOrder.rating)}
                      <span className="ml-2 font-medium">{selectedOrder.rating}/5</span>
                    </div>
                  </div>
                  {selectedOrder.feedback && (
                    <p className="text-sm italic">"{selectedOrder.feedback}"</p>
                  )}
                </div>
              )}

              {/* Refund Info */}
              {selectedOrder.status === "refunded" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <strong>Thông tin hoàn tiền:</strong>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>Số tiền hoàn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.refundAmount || selectedOrder.total)}</div>
                    <div>Lý do: {selectedOrder.refundReason}</div>
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <strong>Ghi chú:</strong> {selectedOrder.notes}
                </div>
              )}
              
              {/* Items Table */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Chi tiết món ăn</h3>
                <DataTable
                  columns={itemColumns}
                  data={selectedOrder.items}
                  searchKey="name"
                />
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Giảm giá:</span>
                        <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Thuế:</span>
                      <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Thanh toán:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Đóng
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
