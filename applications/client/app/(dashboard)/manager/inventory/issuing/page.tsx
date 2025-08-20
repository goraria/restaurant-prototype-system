"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Edit, Trash2, Package, CheckCircle, Clock, XCircle, Search, Download, TrendingDown, ShoppingCart, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Types
interface IssuingRecord {
  id: string
  issueNumber: string
  requestedBy: string
  department: string
  requestDate: string
  issuedDate?: string
  status: "pending" | "approved" | "issued" | "cancelled"
  totalItems: number
  totalValue: number
  purpose: string
  notes: string
  approvedBy?: string
  items: IssuingItem[]
}

interface IssuingItem {
  id: string
  productName: string
  sku: string
  category: string
  requestedQuantity: number
  issuedQuantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  currentStock: number
  notes?: string
}

// Mock data
const mockIssuingRecords: IssuingRecord[] = [
  {
    id: "1",
    issueNumber: "ISS-2024-001",
    requestedBy: "Nguyễn Văn A",
    department: "Bếp chính",
    requestDate: "2024-01-20",
    issuedDate: "2024-01-20",
    status: "issued",
    totalItems: 3,
    totalValue: 1850000,
    purpose: "Chuẩn bị cho ca tối",
    notes: "Cần cấp gấp",
    approvedBy: "Quản lý kho",
    items: [
      {
        id: "1",
        productName: "Thịt bò Úc",
        sku: "BEEF-AUS-001",
        category: "Thịt tươi",
        requestedQuantity: 5,
        issuedQuantity: 5,
        unit: "kg",
        unitPrice: 350000,
        totalPrice: 1750000,
        currentStock: 45
      },
      {
        id: "2",
        productName: "Cà chua cherry",
        sku: "VEG-TOM-002",
        category: "Rau củ",
        requestedQuantity: 2,
        issuedQuantity: 2,
        unit: "kg",
        unitPrice: 45000,
        totalPrice: 90000,
        currentStock: 18
      }
    ]
  },
  {
    id: "2",
    issueNumber: "ISS-2024-002",
    requestedBy: "Trần Thị B",
    department: "Bếp bánh",
    requestDate: "2024-01-20",
    status: "pending",
    totalItems: 4,
    totalValue: 520000,
    purpose: "Làm bánh ngọt",
    notes: "Cần trong ngày mai",
    items: [
      {
        id: "3",
        productName: "Bột mì",
        sku: "FLOUR-001",
        category: "Nguyên liệu",
        requestedQuantity: 10,
        issuedQuantity: 0,
        unit: "kg",
        unitPrice: 25000,
        totalPrice: 250000,
        currentStock: 50
      },
      {
        id: "4",
        productName: "Đường trắng",
        sku: "SUGAR-001",
        category: "Nguyên liệu",
        requestedQuantity: 5,
        issuedQuantity: 0,
        unit: "kg",
        unitPrice: 18000,
        totalPrice: 90000,
        currentStock: 30
      }
    ]
  },
  {
    id: "3",
    issueNumber: "ISS-2024-003",
    requestedBy: "Lê Văn C",
    department: "Bar",
    requestDate: "2024-01-19",
    status: "approved",
    totalItems: 2,
    totalValue: 450000,
    purpose: "Pha chế đồ uống",
    notes: "Khách đặt tiệc",
    approvedBy: "Quản lý ca",
    items: [
      {
        id: "5",
        productName: "Rượu vang đỏ",
        sku: "WINE-RED-001",
        category: "Đồ uống",
        requestedQuantity: 3,
        issuedQuantity: 0,
        unit: "chai",
        unitPrice: 120000,
        totalPrice: 360000,
        currentStock: 15
      },
      {
        id: "6",
        productName: "Nước chanh",
        sku: "JUICE-LEM-001",
        category: "Đồ uống",
        requestedQuantity: 5,
        issuedQuantity: 0,
        unit: "chai",
        unitPrice: 18000,
        totalPrice: 90000,
        currentStock: 25
      }
    ]
  }
]

// Status configuration
const statusConfig = {
  pending: { label: "Chờ duyệt", color: "bg-gray-500", icon: Clock },
  approved: { label: "Đã duyệt", color: "bg-blue-500", icon: CheckCircle },
  issued: { label: "Đã xuất", color: "bg-green-500", icon: Package },
  cancelled: { label: "Đã hủy", color: "bg-red-500", icon: XCircle }
}

// Department options
const departmentOptions = [
  "Bếp chính",
  "Bếp bánh",
  "Bar",
  "Phục vụ",
  "Quản lý",
  "Khác"
]

export default function InventoryIssuingPage() {
  const [records, setRecords] = useState<IssuingRecord[]>(mockIssuingRecords)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<IssuingRecord | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<IssuingRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Calculations
  const totalRecords = records.length
  const totalValue = records.reduce((sum, record) => sum + record.totalValue, 0)
  const pendingRecords = records.filter(record => record.status === "pending").length
  const approvedRecords = records.filter(record => record.status === "approved").length

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter
      
      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [records, searchQuery, statusFilter, departmentFilter])

  // Form state
  const [formData, setFormData] = useState({
    issueNumber: "",
    requestedBy: "",
    department: "",
    purpose: "",
    notes: "",
    items: [] as IssuingItem[]
  })

  const resetForm = () => {
    setFormData({
      issueNumber: "",
      requestedBy: "",
      department: "",
      purpose: "",
      notes: "",
      items: []
    })
  }

  const handleSubmit = () => {
    const newRecord: IssuingRecord = {
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      issueNumber: formData.issueNumber,
      requestedBy: formData.requestedBy,
      department: formData.department,
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending",
      totalItems: formData.items.length,
      totalValue: formData.items.reduce((sum, item) => sum + item.totalPrice, 0),
      purpose: formData.purpose,
      notes: formData.notes,
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

  const handleEdit = (record: IssuingRecord) => {
    setEditingRecord(record)
    setFormData({
      issueNumber: record.issueNumber,
      requestedBy: record.requestedBy,
      department: record.department,
      purpose: record.purpose,
      notes: record.notes,
      items: record.items
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id))
  }

  const handleApprove = (id: string) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { ...record, status: "approved" as const, approvedBy: "Quản lý hiện tại" }
        : record
    ))
  }

  const handleIssue = (record: IssuingRecord) => {
    setSelectedRecord(record)
    setIsItemDialogOpen(true)
  }

  const handleCancel = (id: string) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { ...record, status: "cancelled" as const }
        : record
    ))
  }

  const updateIssuedQuantity = (itemId: string, issuedQuantity: number) => {
    if (!selectedRecord) return
    
    const updatedItems = selectedRecord.items.map(item =>
      item.id === itemId ? { ...item, issuedQuantity } : item
    )
    
    const updatedRecord = { 
      ...selectedRecord, 
      items: updatedItems,
      status: "issued" as const,
      issuedDate: new Date().toISOString().split('T')[0]
    }
    
    setRecords(records.map(r => r.id === selectedRecord.id ? updatedRecord : r))
    setSelectedRecord(updatedRecord)
  }

  const columns: ColumnDef<IssuingRecord>[] = [
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
      accessorKey: "issueNumber",
      header: "Số phiếu xuất",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("issueNumber")}</div>
      ),
    },
    {
      accessorKey: "requestedBy",
      header: "Người yêu cầu",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.requestedBy}</div>
          <div className="text-sm text-muted-foreground">{row.original.department}</div>
        </div>
      ),
    },
    {
      accessorKey: "requestDate",
      header: "Ngày yêu cầu",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("requestDate")).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      accessorKey: "purpose",
      header: "Mục đích",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm">
          {row.getValue("purpose")}
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
      accessorKey: "approvedBy",
      header: "Người duyệt",
      cell: ({ row }) => {
        const approvedBy = row.original.approvedBy
        return (
          <div className="text-sm">
            {approvedBy || "—"}
          </div>
        )
      },
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
              {record.status === "pending" && (
                <>
                  <DropdownMenuItem onClick={() => handleApprove(record.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Duyệt yêu cầu
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleCancel(record.id)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </DropdownMenuItem>
                </>
              )}
              {record.status === "approved" && (
                <DropdownMenuItem onClick={() => handleIssue(record)}>
                  <Package className="mr-2 h-4 w-4" />
                  Xuất kho
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

  const itemColumns: ColumnDef<IssuingItem>[] = [
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
      accessorKey: "requestedQuantity",
      header: "Số lượng yêu cầu",
      cell: ({ row }) => (
        <div>{row.original.requestedQuantity} {row.original.unit}</div>
      ),
    },
    {
      accessorKey: "currentStock",
      header: "Tồn kho",
      cell: ({ row }) => {
        const item = row.original
        const isLowStock = item.currentStock < item.requestedQuantity
        return (
          <div className={`${isLowStock ? 'text-red-500 font-medium' : ''}`}>
            {item.currentStock} {item.unit}
            {isLowStock && (
              <div className="text-xs">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Không đủ hàng
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "issuedQuantity",
      header: "Số lượng xuất",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-2">
            <Input
              type="number"
              defaultValue={item.issuedQuantity}
              max={Math.min(item.requestedQuantity, item.currentStock)}
              onChange={(e) => updateIssuedQuantity(item.id, parseInt(e.target.value) || 0)}
              className="w-20"
            />
            <div className="text-xs text-muted-foreground">{item.unit}</div>
          </div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xuất kho</h1>
          <p className="text-muted-foreground">
            Quản lý việc xuất hàng từ kho cho các bộ phận
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
                Tạo phiếu xuất
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? "Chỉnh sửa phiếu xuất" : "Tạo phiếu xuất mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingRecord ? "Cập nhật thông tin phiếu xuất kho" : "Tạo yêu cầu xuất kho mới"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueNumber">Số phiếu xuất</Label>
                    <Input
                      id="issueNumber"
                      value={formData.issueNumber}
                      onChange={(e) => setFormData({...formData, issueNumber: e.target.value})}
                      placeholder="ISS-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedBy">Người yêu cầu</Label>
                    <Input
                      id="requestedBy"
                      value={formData.requestedBy}
                      onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                      placeholder="Tên người yêu cầu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Bộ phận</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bộ phận" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Mục đích sử dụng</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    placeholder="Ví dụ: Chuẩn bị cho ca tối"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Ghi chú thêm..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRecord ? "Cập nhật" : "Tạo phiếu xuất"}
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
            <CardTitle className="text-sm font-medium">Tổng phiếu xuất</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số phiếu xuất
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
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
              Tổng giá trị xuất kho
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRecords}</div>
            <p className="text-xs text-muted-foreground">
              Phiếu chờ duyệt
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{approvedRecords}</div>
            <p className="text-xs text-muted-foreground">
              Sẵn sàng xuất kho
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
                  placeholder="Tìm kiếm theo số phiếu, người yêu cầu, mục đích..."
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
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="issued">Đã xuất</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bộ phận" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bộ phận</SelectItem>
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phiếu xuất</CardTitle>
          <CardDescription>
            Hiển thị {filteredRecords.length} phiếu xuất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRecords}
            searchKey="issueNumber"
          />
        </CardContent>
      </Card>

      {/* Issue Items Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Xuất kho - {selectedRecord?.issueNumber}</DialogTitle>
            <DialogDescription>
              Cập nhật số lượng xuất cho từng sản phẩm
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Người yêu cầu:</strong> {selectedRecord.requestedBy}
                </div>
                <div>
                  <strong>Bộ phận:</strong> {selectedRecord.department}
                </div>
                <div>
                  <strong>Mục đích:</strong> {selectedRecord.purpose}
                </div>
              </div>
              
              <DataTable
                columns={itemColumns}
                data={selectedRecord.items}
                searchKey="productName"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setIsItemDialogOpen(false)}>
              Hoàn thành xuất kho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
