"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Search, CreditCard, DollarSign, Clock, CheckCircle, AlertTriangle, RefreshCw, Receipt, FileText, Download, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Types
interface PaymentRecord {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  orderType: "delivery" | "takeaway" | "dine_in"
  orderTime: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentMethod: "cash" | "card" | "momo" | "zalopay" | "banking" | "split"
  paymentStatus: "pending" | "partial" | "paid" | "refunded" | "failed"
  transactionId?: string
  receiptNumber?: string
  cashierName?: string
  paymentTime?: string
  refundAmount?: number
  refundReason?: string
  refundTime?: string
  discountAmount?: number
  taxAmount?: number
  serviceCharge?: number
  notes?: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
    discount?: number
  }>
  splitPayments?: Array<{
    method: string
    amount: number
    status: string
    transactionId?: string
  }>
}

// Mock data
const mockPaymentData: PaymentRecord[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Nguyễn Văn Nam",
    customerPhone: "0123456789",
    orderType: "dine_in",
    orderTime: "2024-01-20T19:30:00Z",
    totalAmount: 580000,
    paidAmount: 580000,
    remainingAmount: 0,
    paymentMethod: "card",
    paymentStatus: "paid",
    transactionId: "TXN-2024-001",
    receiptNumber: "RC-2024-001",
    cashierName: "Lê Thị Hoa",
    paymentTime: "2024-01-20T20:15:00Z",
    discountAmount: 50000,
    taxAmount: 52000,
    serviceCharge: 30000,
    items: [
      { name: "Lẩu Thái hải sản", quantity: 1, unitPrice: 450000, totalPrice: 450000 },
      { name: "Cơm trắng", quantity: 2, unitPrice: 15000, totalPrice: 30000 },
      { name: "Trà đá", quantity: 2, unitPrice: 10000, totalPrice: 20000 },
      { name: "Bánh flan", quantity: 2, unitPrice: 25000, totalPrice: 50000, discount: 10000 }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Trần Thị Lan",
    customerPhone: "0987654321",
    orderType: "delivery",
    orderTime: "2024-01-20T18:45:00Z",
    totalAmount: 420000,
    paidAmount: 200000,
    remainingAmount: 220000,
    paymentMethod: "split",
    paymentStatus: "partial",
    receiptNumber: "RC-2024-002",
    cashierName: "Phạm Văn Tài",
    discountAmount: 30000,
    taxAmount: 35000,
    notes: "Khách đặt cọc trước, thanh toán phần còn lại khi giao hàng",
    items: [
      { name: "Phở bò đặc biệt", quantity: 2, unitPrice: 85000, totalPrice: 170000 },
      { name: "Chả cá Lả Vọng", quantity: 1, unitPrice: 120000, totalPrice: 120000 },
      { name: "Nước cam", quantity: 2, unitPrice: 25000, totalPrice: 50000 },
      { name: "Bánh canh cua", quantity: 1, unitPrice: 75000, totalPrice: 75000 }
    ],
    splitPayments: [
      { method: "momo", amount: 200000, status: "paid", transactionId: "MM-2024-002" },
      { method: "cash", amount: 220000, status: "pending" }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Lê Văn Hùng",
    customerPhone: "0369852147",
    orderType: "takeaway",
    orderTime: "2024-01-20T17:20:00Z",
    totalAmount: 280000,
    paidAmount: 0,
    remainingAmount: 280000,
    paymentMethod: "cash",
    paymentStatus: "pending",
    cashierName: "Nguyễn Thị Mai",
    taxAmount: 25000,
    notes: "Khách hàng sẽ thanh toán khi đến lấy hàng",
    items: [
      { name: "Cơm tấm sườn bì", quantity: 2, unitPrice: 65000, totalPrice: 130000 },
      { name: "Bánh mì thịt nướng", quantity: 1, unitPrice: 45000, totalPrice: 45000 },
      { name: "Chè ba màu", quantity: 2, unitPrice: 20000, totalPrice: 40000 },
      { name: "Trà sữa", quantity: 1, unitPrice: 35000, totalPrice: 35000 }
    ]
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Hoàng Thị Mai",
    customerPhone: "0258741963",
    orderType: "delivery",
    orderTime: "2024-01-20T16:30:00Z",
    totalAmount: 650000,
    paidAmount: 520000,
    remainingAmount: 0,
    paymentMethod: "banking",
    paymentStatus: "refunded",
    transactionId: "BANK-2024-004",
    receiptNumber: "RC-2024-004",
    cashierName: "Trần Văn Minh",
    paymentTime: "2024-01-20T16:35:00Z",
    refundAmount: 130000,
    refundReason: "Khách hàng không hài lòng về chất lượng món ăn",
    refundTime: "2024-01-20T18:45:00Z",
    discountAmount: 80000,
    taxAmount: 52000,
    serviceCharge: 25000,
    items: [
      { name: "Set lẩu 4 người", quantity: 1, unitPrice: 500000, totalPrice: 500000 },
      { name: "Rau củ lẩu", quantity: 1, unitPrice: 50000, totalPrice: 50000 },
      { name: "Nước ngọt", quantity: 4, unitPrice: 15000, totalPrice: 60000 },
      { name: "Kem tráng miệng", quantity: 2, unitPrice: 30000, totalPrice: 60000 }
    ]
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerName: "Vũ Thị Ngọc",
    customerPhone: "0147852369",
    orderType: "dine_in",
    orderTime: "2024-01-20T20:00:00Z",
    totalAmount: 750000,
    paidAmount: 0,
    remainingAmount: 750000,
    paymentMethod: "cash",
    paymentStatus: "failed",
    receiptNumber: "RC-2024-005",
    cashierName: "Lê Thị Hoa",
    taxAmount: 68000,
    serviceCharge: 45000,
    notes: "Khách hàng không đủ tiền mặt, đang chờ chuyển khoản",
    items: [
      { name: "Hải sản nướng", quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { name: "Canh chua cá", quantity: 1, unitPrice: 120000, totalPrice: 120000 },
      { name: "Cơm chiên dương châu", quantity: 1, unitPrice: 85000, totalPrice: 85000 },
      { name: "Bia", quantity: 4, unitPrice: 25000, totalPrice: 100000 },
      { name: "Trái cây", quantity: 1, unitPrice: 80000, totalPrice: 80000 }
    ]
  }
]

// Status configurations
const paymentStatusConfig = {
  pending: { label: "Chờ thanh toán", color: "bg-yellow-500", icon: Clock },
  partial: { label: "Thanh toán một phần", color: "bg-orange-500", icon: AlertTriangle },
  paid: { label: "Đã thanh toán", color: "bg-green-500", icon: CheckCircle },
  refunded: { label: "Đã hoàn tiền", color: "bg-blue-500", icon: RefreshCw },
  failed: { label: "Thanh toán thất bại", color: "bg-red-500", icon: AlertTriangle }
}

const paymentMethodConfig = {
  cash: { label: "Tiền mặt", icon: DollarSign },
  card: { label: "Thẻ", icon: CreditCard },
  momo: { label: "MoMo", icon: CreditCard },
  zalopay: { label: "ZaloPay", icon: CreditCard },
  banking: { label: "Chuyển khoản", icon: CreditCard },
  split: { label: "Thanh toán kết hợp", icon: CreditCard }
}

const orderTypeConfig = {
  delivery: { label: "Giao hàng", color: "bg-purple-500" },
  takeaway: { label: "Mang về", color: "bg-green-500" },
  dine_in: { label: "Tại chỗ", color: "bg-blue-500" }
}

export default function OrderPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPaymentData)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [orderTypeFilter, setOrderTypeFilter] = useState("all")
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showProcessDialog, setShowProcessDialog] = useState(false)
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Calculations
  const totalPayments = payments.length
  const totalRevenue = payments.filter(p => p.paymentStatus === "paid").reduce((sum, p) => sum + p.paidAmount, 0)
  const pendingAmount = payments.filter(p => p.paymentStatus === "pending" || p.paymentStatus === "partial").reduce((sum, p) => sum + p.remainingAmount, 0)
  const refundedAmount = payments.filter(p => p.paymentStatus === "refunded").reduce((sum, p) => sum + (p.refundAmount || 0), 0)

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = payment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           payment.customerPhone.includes(searchQuery) ||
                           payment.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || payment.paymentStatus === statusFilter
      const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter
      const matchesOrderType = orderTypeFilter === "all" || payment.orderType === orderTypeFilter
      
      return matchesSearch && matchesStatus && matchesMethod && matchesOrderType
    })
  }, [payments, searchQuery, statusFilter, methodFilter, orderTypeFilter])

  const handleProcessPayment = () => {
    if (!selectedPayment || !paymentAmount || !selectedPaymentMethod) return

    const amount = parseFloat(paymentAmount)
    const updatedPayments = payments.map(payment => {
      if (payment.id === selectedPayment.id) {
        const newPaidAmount = payment.paidAmount + amount
        const newRemainingAmount = Math.max(0, payment.totalAmount - newPaidAmount)
        return {
          ...payment,
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          paymentStatus: newRemainingAmount === 0 ? "paid" : "partial" as any,
          paymentMethod: selectedPaymentMethod as any,
          paymentTime: new Date().toISOString(),
          transactionId: transactionId || `TXN-${Date.now()}`
        }
      }
      return payment
    })

    setPayments(updatedPayments)
    setShowProcessDialog(false)
    setSelectedPayment(null)
    setPaymentAmount("")
    setSelectedPaymentMethod("")
    setTransactionId("")
  }

  const handleRefund = () => {
    if (!selectedPayment || !refundAmount || !refundReason) return

    const amount = parseFloat(refundAmount)
    const updatedPayments = payments.map(payment => {
      if (payment.id === selectedPayment.id) {
        return {
          ...payment,
          paymentStatus: "refunded" as any,
          refundAmount: amount,
          refundReason: refundReason,
          refundTime: new Date().toISOString()
        }
      }
      return payment
    })

    setPayments(updatedPayments)
    setShowRefundDialog(false)
    setSelectedPayment(null)
    setRefundAmount("")
    setRefundReason("")
  }

  const columns: ColumnDef<PaymentRecord>[] = [
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
        const payment = row.original
        return (
          <div>
            <div className="font-medium">{payment.orderNumber}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(payment.orderTime).toLocaleString('vi-VN')}
            </div>
            {payment.receiptNumber && (
              <div className="text-xs text-blue-600">
                HĐ: {payment.receiptNumber}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium">{payment.customerName}</div>
            <div className="text-sm text-muted-foreground">{payment.customerPhone}</div>
            <Badge className={orderTypeConfig[payment.orderType].color + " text-white text-xs"}>
              {orderTypeConfig[payment.orderType].label}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <div className="text-right space-y-1">
            <div className="font-medium">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(payment.totalAmount)}
            </div>
            {payment.discountAmount && payment.discountAmount > 0 && (
              <div className="text-xs text-green-600">
                Giảm: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(payment.discountAmount)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <div className="text-right space-y-1">
            <div className="font-medium text-green-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(payment.paidAmount)}
            </div>
            {payment.remainingAmount > 0 && (
              <div className="text-xs text-orange-600">
                Còn: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(payment.remainingAmount)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Phương thức",
      cell: ({ row }) => {
        const payment = row.original
        const method = paymentMethodConfig[payment.paymentMethod]
        const Icon = method.icon
        return (
          <div className="space-y-1">
            <div className="flex items-center">
              <Icon className="mr-1 h-4 w-4" />
              <span className="text-sm">{method.label}</span>
            </div>
            {payment.transactionId && (
              <div className="text-xs text-muted-foreground">
                ID: {payment.transactionId}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        const payment = row.original
        const status = paymentStatusConfig[payment.paymentStatus]
        const Icon = status.icon
        return (
          <div className="space-y-1">
            <Badge className={status.color + " text-white"}>
              <Icon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
            {payment.paymentTime && (
              <div className="text-xs text-muted-foreground">
                {new Date(payment.paymentTime).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "cashierName",
      header: "Thu ngân",
      cell: ({ row }) => {
        const payment = row.original
        return payment.cashierName ? (
          <div className="text-sm">{payment.cashierName}</div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {(payment.paymentStatus === "pending" || payment.paymentStatus === "partial") && (
                <DropdownMenuItem onClick={() => {
                  setSelectedPayment(payment)
                  setShowProcessDialog(true)
                }}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Xử lý thanh toán
                </DropdownMenuItem>
              )}
              {payment.paymentStatus === "paid" && (
                <DropdownMenuItem onClick={() => {
                  setSelectedPayment(payment)
                  setShowRefundDialog(true)
                }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Hoàn tiền
                </DropdownMenuItem>
              )}
              {payment.receiptNumber && (
                <DropdownMenuItem>
                  <Receipt className="mr-2 h-4 w-4" />
                  In hóa đơn
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF
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
          <h1 className="text-3xl font-bold tracking-tight">Thanh toán đơn hàng</h1>
          <p className="text-muted-foreground">
            Quản lý thanh toán và hoàn tiền
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Báo cáo
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
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
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng cần xử lý
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Đã thu được
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần thanh toán
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn tiền</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(refundedAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Đã hoàn trả
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
                  placeholder="Tìm kiếm theo số đơn, khách hàng, hóa đơn, giao dịch..."
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
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="partial">Thanh toán một phần</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="card">Thẻ</SelectItem>
                <SelectItem value="momo">MoMo</SelectItem>
                <SelectItem value="zalopay">ZaloPay</SelectItem>
                <SelectItem value="banking">Chuyển khoản</SelectItem>
                <SelectItem value="split">Kết hợp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="dine_in">Tại chỗ</SelectItem>
                <SelectItem value="takeaway">Mang về</SelectItem>
                <SelectItem value="delivery">Giao hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thanh toán</CardTitle>
          <CardDescription>
            Hiển thị {filteredPayments.length} giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredPayments}
            searchKey="orderNumber"
          />
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment && !showRefundDialog && !showProcessDialog} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thanh toán - {selectedPayment?.orderNumber}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về giao dịch thanh toán
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="items">Món ăn</TabsTrigger>
                <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Customer & Order Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Thông tin khách hàng</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Tên:</strong> {selectedPayment.customerName}</div>
                      <div><strong>Số điện thoại:</strong> {selectedPayment.customerPhone}</div>
                      <div><strong>Loại đơn:</strong> {orderTypeConfig[selectedPayment.orderType].label}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Thông tin đơn hàng</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Số đơn:</strong> {selectedPayment.orderNumber}</div>
                      <div><strong>Thời gian:</strong> {new Date(selectedPayment.orderTime).toLocaleString('vi-VN')}</div>
                      <div><strong>Thu ngân:</strong> {selectedPayment.cashierName || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold mb-3">Tóm tắt thanh toán</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between py-1">
                        <span>Tổng tiền hàng:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          selectedPayment.items.reduce((sum, item) => sum + item.totalPrice, 0)
                        )}</span>
                      </div>
                      {selectedPayment.discountAmount && selectedPayment.discountAmount > 0 && (
                        <div className="flex justify-between py-1 text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.discountAmount)}</span>
                        </div>
                      )}
                      {selectedPayment.taxAmount && selectedPayment.taxAmount > 0 && (
                        <div className="flex justify-between py-1">
                          <span>Thuế VAT:</span>
                          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.taxAmount)}</span>
                        </div>
                      )}
                      {selectedPayment.serviceCharge && selectedPayment.serviceCharge > 0 && (
                        <div className="flex justify-between py-1">
                          <span>Phí dịch vụ:</span>
                          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.serviceCharge)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between py-1 font-semibold text-base border-t">
                        <span>Tổng cộng:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-green-600">
                        <span>Đã thanh toán:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.paidAmount)}</span>
                      </div>
                      {selectedPayment.remainingAmount > 0 && (
                        <div className="flex justify-between py-1 text-orange-600">
                          <span>Còn lại:</span>
                          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.remainingAmount)}</span>
                        </div>
                      )}
                      {selectedPayment.refundAmount && selectedPayment.refundAmount > 0 && (
                        <div className="flex justify-between py-1 text-blue-600">
                          <span>Đã hoàn:</span>
                          <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.refundAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(selectedPayment.notes || selectedPayment.refundReason) && (
                  <div className="space-y-3">
                    {selectedPayment.notes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-1">Ghi chú:</h5>
                        <p className="text-sm text-blue-700">{selectedPayment.notes}</p>
                      </div>
                    )}
                    {selectedPayment.refundReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-medium text-red-800 mb-1">Lý do hoàn tiền:</h5>
                        <p className="text-sm text-red-700">{selectedPayment.refundReason}</p>
                        <p className="text-xs text-red-600 mt-1">
                          Hoàn lúc: {selectedPayment.refundTime && new Date(selectedPayment.refundTime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <div className="space-y-3">
                  {selectedPayment.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)} x {item.quantity}
                        </div>
                        {item.discount && item.discount > 0 && (
                          <div className="text-sm text-green-600">
                            Giảm: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.discount)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                {selectedPayment.splitPayments ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Thanh toán kết hợp</h4>
                    {selectedPayment.splitPayments.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{paymentMethodConfig[payment.method as keyof typeof paymentMethodConfig]?.label}</div>
                          {payment.transactionId && (
                            <div className="text-sm text-muted-foreground">ID: {payment.transactionId}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                          </div>
                          <Badge className={payment.status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                            {payment.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{paymentMethodConfig[selectedPayment.paymentMethod].label}</div>
                        {selectedPayment.transactionId && (
                          <div className="text-sm text-muted-foreground">ID: {selectedPayment.transactionId}</div>
                        )}
                        {selectedPayment.paymentTime && (
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedPayment.paymentTime).toLocaleString('vi-VN')}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.paidAmount)}
                        </div>
                        <Badge className={paymentStatusConfig[selectedPayment.paymentStatus].color}>
                          {paymentStatusConfig[selectedPayment.paymentStatus].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPayment(null)}>
              Đóng
            </Button>
            {selectedPayment?.receiptNumber && (
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                In hóa đơn
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xử lý thanh toán</DialogTitle>
            <DialogDescription>
              Xử lý thanh toán cho đơn hàng {selectedPayment?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-sm space-y-1">
                  <div>Tổng tiền: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.totalAmount)}</strong></div>
                  <div>Đã thanh toán: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.paidAmount)}</strong></div>
                  <div>Còn lại: <strong className="text-orange-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.remainingAmount)}</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-amount">Số tiền thanh toán</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="Nhập số tiền"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Phương thức thanh toán</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="card">Thẻ</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="zalopay">ZaloPay</SelectItem>
                    <SelectItem value="banking">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-id">Mã giao dịch (tùy chọn)</Label>
                <Input
                  id="transaction-id"
                  placeholder="Nhập mã giao dịch"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleProcessPayment}>
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hoàn tiền</DialogTitle>
            <DialogDescription>
              Hoàn tiền cho đơn hàng {selectedPayment?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-sm space-y-1">
                  <div>Đã thanh toán: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.paidAmount)}</strong></div>
                  <div>Có thể hoàn: <strong className="text-green-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPayment.paidAmount)}</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund-amount">Số tiền hoàn</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  placeholder="Nhập số tiền hoàn"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund-reason">Lý do hoàn tiền</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="Nhập lý do hoàn tiền"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleRefund} variant="destructive">
              Xác nhận hoàn tiền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
