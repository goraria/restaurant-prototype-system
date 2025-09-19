"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Edit, Trash2, Truck, CheckCircle, Clock, XCircle, Search, Filter, Download, Upload, Package, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useGetAllInventoryItemsQuery } from "@/state/api"

// Types
interface ReceivingRecord {
  id: string
  receiptNumber: string
  supplier: string
  supplierContact: string
  orderDate: string
  expectedDate: string
  receivedDate?: string
  status: "pending" | "in_transit" | "received" | "partially_received" | "cancelled"
  totalItems: number
  totalValue: number
  notes: string
  createdBy: string
  items: ReceivingItem[]
}

interface ReceivingItem {
  id: string
  productName: string
  sku: string
  category: string
  orderedQuantity: number
  receivedQuantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  expiryDate?: string
  batchNumber?: string
  quality: "good" | "damaged" | "expired" | "poor"
  notes?: string
}

// Mock data
const mockReceivingRecords: ReceivingRecord[] = [
  {
    id: "1",
    receiptNumber: "REC-2024-001",
    supplier: "Fresh Meat Co.",
    supplierContact: "0123456789",
    orderDate: "2024-01-18",
    expectedDate: "2024-01-20",
    receivedDate: "2024-01-20",
    status: "received",
    totalItems: 3,
    totalValue: 12500000,
    notes: "Hàng đầy đủ, chất lượng tốt",
    createdBy: "Nguyễn Văn A",
    items: [
      {
        id: "1",
        productName: "Thịt bò Úc",
        sku: "BEEF-AUS-001",
        category: "Thịt tươi",
        orderedQuantity: 50,
        receivedQuantity: 50,
        unit: "kg",
        unitPrice: 350000,
        totalPrice: 17500000,
        expiryDate: "2024-01-25",
        batchNumber: "BF240120",
        quality: "good"
      },
      {
        id: "2",
        productName: "Thịt heo",
        sku: "PORK-VN-002",
        category: "Thịt tươi",
        orderedQuantity: 30,
        receivedQuantity: 30,
        unit: "kg",
        unitPrice: 180000,
        totalPrice: 5400000,
        expiryDate: "2024-01-23",
        batchNumber: "PK240120",
        quality: "good"
      }
    ]
  },
  {
    id: "2",
    receiptNumber: "REC-2024-002",
    supplier: "Green Farm",
    supplierContact: "0987654321",
    orderDate: "2024-01-19",
    expectedDate: "2024-01-21",
    status: "in_transit",
    totalItems: 5,
    totalValue: 2850000,
    notes: "Đang vận chuyển",
    createdBy: "Trần Thị B",
    items: [
      {
        id: "3",
        productName: "Cà chua cherry",
        sku: "VEG-TOM-002",
        category: "Rau củ",
        orderedQuantity: 20,
        receivedQuantity: 0,
        unit: "kg",
        unitPrice: 45000,
        totalPrice: 900000,
        expiryDate: "2024-01-24",
        batchNumber: "VG240119",
        quality: "good"
      },
      {
        id: "4",
        productName: "Rau xà lách",
        sku: "VEG-LET-003",
        category: "Rau củ",
        orderedQuantity: 15,
        receivedQuantity: 0,
        unit: "kg",
        unitPrice: 35000,
        totalPrice: 525000,
        expiryDate: "2024-01-22",
        batchNumber: "VG240119",
        quality: "good"
      }
    ]
  },
  {
    id: "3",
    receiptNumber: "REC-2024-003",
    supplier: "Ocean Fresh",
    supplierContact: "0369852147",
    orderDate: "2024-01-17",
    expectedDate: "2024-01-19",
    receivedDate: "2024-01-19",
    status: "partially_received",
    totalItems: 2,
    totalValue: 18750000,
    notes: "Thiếu 5kg tôm hùm",
    createdBy: "Lê Văn C",
    items: [
      {
        id: "5",
        productName: "Tôm hùm",
        sku: "SEA-LOB-003",
        category: "Hải sản",
        orderedQuantity: 25,
        receivedQuantity: 20,
        unit: "kg",
        unitPrice: 850000,
        totalPrice: 21250000,
        expiryDate: "2024-01-21",
        batchNumber: "SF240118",
        quality: "good"
      }
    ]
  }
]

// Status configuration
const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-gray-500", icon: Clock },
  in_transit: { label: "Đang vận chuyển", color: "bg-blue-500", icon: Truck },
  received: { label: "Đã nhận", color: "bg-green-500", icon: CheckCircle },
  partially_received: { label: "Nhận một phần", color: "bg-yellow-500", icon: Package },
  cancelled: { label: "Đã hủy", color: "bg-red-500", icon: XCircle }
}

const qualityConfig = {
  good: { label: "Tốt", color: "bg-green-500" },
  damaged: { label: "Hư hỏng", color: "bg-red-500" },
  expired: { label: "Hết hạn", color: "bg-red-600" },
  poor: { label: "Kém chất lượng", color: "bg-orange-500" }
}

export default function InventoryReceivingPage() {
  // Dữ liệu nguyên liệu để chọn vào bảng nhập kho
  const { data: ingredients = [] } = useGetAllInventoryItemsQuery()

  type ReceivingRow = {
    id: string
    inventory_item_id: string | null
    unit: string
    quantity: number
    unit_cost: number
    supplier: string | null
    expiry_date: Date | null
  }

  const [receivingRows, setReceivingRows] = useState<ReceivingRow[]>([
    {
      id: crypto.randomUUID(),
      inventory_item_id: null,
      unit: "",
      quantity: 0,
      unit_cost: 0,
      supplier: null,
      expiry_date: null,
    },
  ])

  const supplierOptions = useMemo(() => {
    const s = new Set<string>()
    for (const it of ingredients as any[]) {
      if (it?.supplier) s.add(it.supplier)
    }
    return Array.from(s)
  }, [ingredients])

  const addReceivingRow = () => setReceivingRows(prev => ([
    ...prev,
    {
      id: crypto.randomUUID(),
      inventory_item_id: null,
      unit: "",
      quantity: 0,
      unit_cost: 0,
      supplier: null,
      expiry_date: null,
    }
  ]))

  const removeReceivingRow = (rowId: string) => setReceivingRows(prev => prev.filter(r => r.id !== rowId))

  const onSelectItem = (rowId: string, itemId: string) => {
    const item = (ingredients as any[]).find((i) => i.id === itemId)
    setReceivingRows(prev => prev.map(r => r.id === rowId ? {
      ...r,
      inventory_item_id: itemId,
      unit: item?.unit ?? "",
      unit_cost: typeof item?.unit_cost === 'string' ? parseFloat(item.unit_cost) : (item?.unit_cost ?? 0),
      supplier: item?.supplier ?? r.supplier,
    } : r))
  }

  const onChangeQty = (rowId: string, qty: number) => {
    setReceivingRows(prev => prev.map(r => r.id === rowId ? { ...r, quantity: qty } : r))
  }

  const onChangeSupplier = (rowId: string, sup: string) => {
    setReceivingRows(prev => prev.map(r => r.id === rowId ? { ...r, supplier: sup } : r))
  }

  const onChangeExpiry = (rowId: string, date?: Date) => {
    setReceivingRows(prev => prev.map(r => r.id === rowId ? { ...r, expiry_date: date ?? null } : r))
  }

  const totalReceivingAmount = receivingRows.reduce((sum, r) => sum + (r.quantity * r.unit_cost), 0)
  const [records, setRecords] = useState<ReceivingRecord[]>(mockReceivingRecords)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ReceivingRecord | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<ReceivingRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })

  // Calculations
  const totalRecords = records.length
  const totalValue = records.reduce((sum, record) => sum + record.totalValue, 0)
  const pendingRecords = records.filter(record => record.status === "pending").length
  const inTransitRecords = records.filter(record => record.status === "in_transit").length

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      
      let matchesDate = true
      if (dateRange.from && dateRange.to) {
        const recordDate = new Date(record.orderDate)
        matchesDate = recordDate >= dateRange.from && recordDate <= dateRange.to
      }
      
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [records, searchQuery, statusFilter, dateRange])

  // Form state
  const [formData, setFormData] = useState({
    receiptNumber: "",
    supplier: "",
    supplierContact: "",
    orderDate: "",
    expectedDate: "",
    notes: "",
    items: [] as ReceivingItem[]
  })

  const resetForm = () => {
    setFormData({
      receiptNumber: "",
      supplier: "",
      supplierContact: "",
      orderDate: "",
      expectedDate: "",
      notes: "",
      items: []
    })
  }

  const handleSubmit = () => {
    const newRecord: ReceivingRecord = {
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      receiptNumber: formData.receiptNumber,
      supplier: formData.supplier,
      supplierContact: formData.supplierContact,
      orderDate: formData.orderDate,
      expectedDate: formData.expectedDate,
      status: "pending",
      totalItems: formData.items.length,
      totalValue: formData.items.reduce((sum, item) => sum + item.totalPrice, 0),
      notes: formData.notes,
      createdBy: "Người dùng hiện tại",
      items: formData.items
    }

    if (editingRecord) {
      setRecords(records.map(record => record.id === editingRecord.id ? newRecord : record))
    } else {
      setRecords([...records, newRecord])
    }

    setIsDialogOpen(false)
    setEditingRecord(null)
    resetForm()
  }

  const handleEdit = (record: ReceivingRecord) => {
    setEditingRecord(record)
    setFormData({
      receiptNumber: record.receiptNumber,
      supplier: record.supplier,
      supplierContact: record.supplierContact,
      orderDate: record.orderDate,
      expectedDate: record.expectedDate,
      notes: record.notes,
      items: record.items
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id))
  }

  const handleReceive = (record: ReceivingRecord) => {
    setSelectedRecord(record)
    setIsItemDialogOpen(true)
  }

  const updateItemQuantity = (itemId: string, receivedQuantity: number, quality: string) => {
    if (!selectedRecord) return
    
    const updatedItems = selectedRecord.items.map(item =>
      item.id === itemId ? { ...item, receivedQuantity, quality: quality as ReceivingItem["quality"] } : item
    )
    
    const updatedRecord = { ...selectedRecord, items: updatedItems }
    const allReceived = updatedItems.every(item => item.receivedQuantity >= item.orderedQuantity)
    const partiallyReceived = updatedItems.some(item => item.receivedQuantity > 0 && item.receivedQuantity < item.orderedQuantity)
    
    if (allReceived) {
      updatedRecord.status = "received"
      updatedRecord.receivedDate = new Date().toISOString().split('T')[0]
    } else if (partiallyReceived || updatedItems.some(item => item.receivedQuantity > 0)) {
      updatedRecord.status = "partially_received"
      updatedRecord.receivedDate = new Date().toISOString().split('T')[0]
    }
    
    setRecords(records.map(r => r.id === selectedRecord.id ? updatedRecord : r))
    setSelectedRecord(updatedRecord)
  }

  const columns: ColumnDef<ReceivingRecord>[] = [
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
      accessorKey: "receiptNumber",
      header: "Số phiếu nhập",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("receiptNumber")}</div>
      ),
    },
    {
      accessorKey: "supplier",
      header: "Nhà cung cấp",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.supplier}</div>
          <div className="text-sm text-muted-foreground">{row.original.supplierContact}</div>
        </div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Ngày đặt hàng",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("orderDate")).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      accessorKey: "expectedDate",
      header: "Ngày dự kiến",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("expectedDate")).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusConfig
        const config = statusConfig[status]
        const Icon = config.icon
        return (
          <Badge className={`${config.color} text-white`}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "totalItems",
      header: "Số mặt hàng",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalItems")}</div>
      ),
    },
    {
      accessorKey: "totalValue",
      header: "Tổng giá trị",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(row.getValue("totalValue"))}
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Người tạo",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("createdBy")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(record.status === "pending" || record.status === "in_transit") && (
                <DropdownMenuItem onClick={() => handleReceive(record)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Nhận hàng
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleEdit(record)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(record.id)}
                className="text-red-600"
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

  const itemColumns: ColumnDef<ReceivingItem>[] = [
    {
      accessorKey: "productName",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.productName}</div>
          <div className="text-sm text-muted-foreground">{row.original.sku}</div>
        </div>
      ),
    },
    {
      accessorKey: "orderedQuantity",
      header: "Số lượng đặt",
      cell: ({ row }) => (
        <div>{row.original.orderedQuantity} {row.original.unit}</div>
      ),
    },
    {
      accessorKey: "receivedQuantity",
      header: "Số lượng nhận",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-2">
            <Input
              type="number"
              defaultValue={item.receivedQuantity}
              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value), item.quality)}
              className="w-20"
            />
            <div className="text-xs text-muted-foreground">{item.unit}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "quality",
      header: "Chất lượng",
      cell: ({ row }) => {
        const item = row.original
        return (
          <Select
            defaultValue={item.quality}
            onValueChange={(value) => updateItemQuantity(item.id, item.receivedQuantity, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(qualityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
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
      {/* Nhập kho nhanh */}
      <Card>
        <CardHeader>
          <CardTitle>Nhập kho mới</CardTitle>
          <CardDescription>Bảng thêm nhiều dòng, chọn nguyên liệu có sẵn, khóa đơn vị và đơn giá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Nguyên liệu</th>
                  <th className="py-2 pr-4">Đơn vị</th>
                  <th className="py-2 pr-4">Số lượng</th>
                  <th className="py-2 pr-4">Đơn giá</th>
                  <th className="py-2 pr-4">Nhà cung cấp</th>
                  <th className="py-2 pr-4">Hạn sử dụng</th>
                  <th className="py-2 pr-0 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {receivingRows.map((row) => {
                  const selected = (ingredients as any[]).find((i) => i.id === row.inventory_item_id)
                  return (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-4 min-w-[260px]">
                        <Select value={row.inventory_item_id ?? undefined} onValueChange={(v) => onSelectItem(row.id, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nguyên liệu" />
                          </SelectTrigger>
                          <SelectContent className="max-h-80">
                            {(ingredients as any[]).map((it) => (
                              <SelectItem key={it.id} value={it.id}>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center">
                                    <Package className="h-3 w-3 text-primary" />
                                  </div>
                                  <span className="truncate">{it.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 pr-4 min-w-[90px]">
                        <Badge variant="outline">{row.unit || selected?.unit || '-'}</Badge>
                      </td>
                      <td className="py-3 pr-4 min-w-[140px]">
                        <Input
                          type="number"
                          min={0}
                          value={Number.isFinite(row.quantity) ? row.quantity : 0}
                          onChange={(e) => onChangeQty(row.id, Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 pr-4 min-w-[140px]">
                        <div className="text-right font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.unit_cost)}
                        </div>
                      </td>
                      <td className="py-3 pr-4 min-w-[220px]">
                        <Select value={row.supplier ?? undefined} onValueChange={(v) => onChangeSupplier(row.id, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierOptions.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 pr-4 min-w-[220px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {row.expiry_date ? format(row.expiry_date, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={row.expiry_date ?? undefined}
                              onSelect={(d) => onChangeExpiry(row.id, d)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="py-3 pr-0 text-right">
                        <Button variant="outline" size="icon" onClick={() => removeReceivingRow(row.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="default" onClick={addReceivingRow}>
            <Plus className="h-4 w-4" /> Thêm dòng
          </Button>
          <div className="flex items-center justify-center h-9">
            <span className="text-muted-foreground">{"Tổng tiền: "}</span>
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalReceivingAmount)}
            </span>
          </div>
        </CardFooter>
      </Card>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhập kho</h1>
          <p className="text-muted-foreground">
            Quản lý việc nhận hàng và nhập kho từ nhà cung cấp
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingRecord(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo phiếu nhập
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? "Chỉnh sửa phiếu nhập" : "Tạo phiếu nhập mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingRecord ? "Cập nhật thông tin phiếu nhập kho" : "Tạo phiếu nhập kho mới từ nhà cung cấp"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Số phiếu nhập</Label>
                    <Input
                      id="receiptNumber"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                      placeholder="REC-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Nhà cung cấp</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      placeholder="Tên nhà cung cấp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierContact">Số điện thoại</Label>
                    <Input
                      id="supplierContact"
                      value={formData.supplierContact}
                      onChange={(e) => setFormData({...formData, supplierContact: e.target.value})}
                      placeholder="0123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Ngày đặt hàng</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedDate">Ngày dự kiến nhận</Label>
                  <Input
                    id="expectedDate"
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Ghi chú về đơn hàng..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRecord ? "Cập nhật" : "Tạo phiếu nhập"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng phiếu nhập</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số phiếu nhập
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact'
              }).format(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị nhập kho
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRecords}</div>
            <p className="text-xs text-muted-foreground">
              Phiếu chờ xử lý
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang vận chuyển</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inTransitRecords}</div>
            <p className="text-xs text-muted-foreground">
              Đang được vận chuyển
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
                  placeholder="Tìm kiếm theo số phiếu, nhà cung cấp..."
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
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_transit">Đang vận chuyển</SelectItem>
                <SelectItem value="received">Đã nhận</SelectItem>
                <SelectItem value="partially_received">Nhận một phần</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phiếu nhập</CardTitle>
          <CardDescription>
            Hiển thị {filteredRecords.length} phiếu nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRecords}
          />
        </CardContent>
      </Card>

      {/* Receive Items Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Nhận hàng - {selectedRecord?.receiptNumber}</DialogTitle>
            <DialogDescription>
              Cập nhật số lượng và chất lượng hàng nhận được
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nhà cung cấp:</strong> {selectedRecord.supplier}
                </div>
                <div>
                  <strong>Ngày dự kiến:</strong> {new Date(selectedRecord.expectedDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
              
              <DataTable
                columns={itemColumns}
                data={selectedRecord.items}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setIsItemDialogOpen(false)}>
              Hoàn thành nhận hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
