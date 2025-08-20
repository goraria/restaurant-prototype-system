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
import { MoreHorizontal, Plus, Edit, Trash2, Phone, Mail, MapPin, Building2, Star, TrendingUp, Package, Users, Search, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  category: string
  status: "active" | "inactive" | "suspended"
  rating: number
  totalOrders: number
  totalValue: number
  lastOrderDate: string
  paymentTerms: string
  notes: string
  website?: string
  taxCode?: string
  bankAccount?: string
  products: string[]
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Fresh Meat Co.",
    contactPerson: "Nguyễn Văn Thịnh",
    email: "thinh@freshmeat.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1",
    city: "TP. Hồ Chí Minh",
    category: "Thịt tươi",
    status: "active",
    rating: 4.8,
    totalOrders: 156,
    totalValue: 2850000000,
    lastOrderDate: "2024-01-20",
    paymentTerms: "30 ngày",
    notes: "Nhà cung cấp uy tín, chất lượng ổn định",
    website: "https://freshmeat.com",
    taxCode: "0123456789",
    bankAccount: "123456789 - Vietcombank",
    products: ["Thịt bò Úc", "Thịt heo", "Thịt gà", "Thịt cừu"]
  },
  {
    id: "2",
    name: "Green Farm",
    contactPerson: "Trần Thị Xanh",
    email: "xanh@greenfarm.vn",
    phone: "0987654321",
    address: "456 Đường XYZ, Huyện Củ Chi",
    city: "TP. Hồ Chí Minh",
    category: "Rau củ",
    status: "active",
    rating: 4.5,
    totalOrders: 89,
    totalValue: 456000000,
    lastOrderDate: "2024-01-19",
    paymentTerms: "15 ngày",
    notes: "Rau sạch, organic, giao hàng đúng giờ",
    website: "https://greenfarm.vn",
    taxCode: "0987654321",
    products: ["Cà chua", "Rau xà lách", "Cà rót", "Ớt chuông"]
  },
  {
    id: "3",
    name: "Ocean Fresh",
    contactPerson: "Lê Văn Biển",
    email: "bien@oceanfresh.com",
    phone: "0369852147",
    address: "789 Cảng Cá, Quận 4",
    city: "TP. Hồ Chí Minh",
    category: "Hải sản",
    status: "active",
    rating: 4.7,
    totalOrders: 67,
    totalValue: 1890000000,
    lastOrderDate: "2024-01-18",
    paymentTerms: "COD",
    notes: "Hải sản tươi sống, phục vụ nhanh",
    website: "https://oceanfresh.com",
    taxCode: "0369852147",
    products: ["Tôm hùm", "Cua biển", "Cá hồi", "Cá ngừ"]
  },
  {
    id: "4",
    name: "Rice Wholesale",
    contactPerson: "Phạm Thị Gạo",
    email: "gao@ricewholesale.vn",
    phone: "0258741963",
    address: "321 Khu Chợ Lớn, Quận 5",
    city: "TP. Hồ Chí Minh",
    category: "Ngũ cốc",
    status: "inactive",
    rating: 4.2,
    totalOrders: 34,
    totalValue: 235000000,
    lastOrderDate: "2024-01-10",
    paymentTerms: "Trả trước",
    notes: "Tạm ngưng hợp tác do chất lượng",
    products: ["Gạo Japonica", "Gạo ST25", "Gạo Jasmine"]
  },
  {
    id: "5",
    name: "Dairy Co.",
    contactPerson: "Hoàng Văn Sữa",
    email: "sua@dairyco.vn",
    phone: "0741852963",
    address: "654 Khu Công Nghiệp, Bình Dương",
    city: "Bình Dương",
    category: "Sản phẩm sữa",
    status: "active",
    rating: 4.6,
    totalOrders: 78,
    totalValue: 567000000,
    lastOrderDate: "2024-01-20",
    paymentTerms: "20 ngày",
    notes: "Sản phẩm chất lượng cao, đóng gói tốt",
    website: "https://dairyco.vn",
    taxCode: "0741852963",
    products: ["Sữa tươi", "Phô mai", "Bơ", "Yogurt"]
  }
]

// Status configuration
const statusConfig = {
  active: { label: "Hoạt động", color: "bg-green-500" },
  inactive: { label: "Ngưng hoạt động", color: "bg-gray-500" },
  suspended: { label: "Tạm dừng", color: "bg-red-500" }
}

// Category options
const categoryOptions = [
  "Tất cả",
  "Thịt tươi",
  "Rau củ", 
  "Hải sản",
  "Ngũ cốc",
  "Sản phẩm sữa",
  "Gia vị",
  "Đồ uống",
  "Khác"
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Tất cả")
  const [statusFilter, setStatusFilter] = useState("all")

  // Calculations
  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter(s => s.status === "active").length
  const totalValue = suppliers.reduce((sum, supplier) => sum + supplier.totalValue, 0)
  const avgRating = suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           supplier.phone.includes(searchQuery)
      const matchesCategory = categoryFilter === "Tất cả" || supplier.category === categoryFilter
      const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [suppliers, searchQuery, categoryFilter, statusFilter])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    category: "",
    paymentTerms: "",
    notes: "",
    website: "",
    taxCode: "",
    bankAccount: ""
  })

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      category: "",
      paymentTerms: "",
      notes: "",
      website: "",
      taxCode: "",
      bankAccount: ""
    })
  }

  const handleSubmit = () => {
    const newSupplier: Supplier = {
      id: editingSupplier ? editingSupplier.id : Date.now().toString(),
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      category: formData.category,
      status: "active",
      rating: editingSupplier ? editingSupplier.rating : 0,
      totalOrders: editingSupplier ? editingSupplier.totalOrders : 0,
      totalValue: editingSupplier ? editingSupplier.totalValue : 0,
      lastOrderDate: editingSupplier ? editingSupplier.lastOrderDate : "",
      paymentTerms: formData.paymentTerms,
      notes: formData.notes,
      website: formData.website,
      taxCode: formData.taxCode,
      bankAccount: formData.bankAccount,
      products: editingSupplier ? editingSupplier.products : []
    }

    if (editingSupplier) {
      setSuppliers(suppliers.map(supplier => supplier.id === editingSupplier.id ? newSupplier : supplier))
    } else {
      setSuppliers([...suppliers, newSupplier])
    }

    setIsDialogOpen(false)
    setEditingSupplier(null)
    resetForm()
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      category: supplier.category,
      paymentTerms: supplier.paymentTerms,
      notes: supplier.notes,
      website: supplier.website || "",
      taxCode: supplier.taxCode || "",
      bankAccount: supplier.bankAccount || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id))
  }

  const handleStatusChange = (id: string, status: Supplier["status"]) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, status } : supplier
    ))
  }

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

  const columns: ColumnDef<Supplier>[] = [
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
      accessorKey: "name",
      header: "Nhà cung cấp",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {supplier.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{supplier.name}</div>
              <div className="text-sm text-muted-foreground">{supplier.contactPerson}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("category")}</Badge>
      ),
    },
    {
      accessorKey: "phone",
      header: "Liên hệ",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-3 w-3" />
              {supplier.phone}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-3 w-3" />
              {supplier.email}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="flex items-start space-x-2 max-w-[200px]">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="text-sm">
              <div>{supplier.address}</div>
              <div className="text-muted-foreground">{supplier.city}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: "Đánh giá",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              {renderStars(supplier.rating)}
            </div>
            <div className="text-sm text-muted-foreground">
              {supplier.rating.toFixed(1)}/5.0
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "totalOrders",
      header: "Đơn hàng",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="text-center">
            <div className="font-medium">{supplier.totalOrders}</div>
            <div className="text-xs text-muted-foreground">
              {supplier.lastOrderDate && new Date(supplier.lastOrderDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "totalValue",
      header: "Tổng giá trị",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact'
          }).format(row.getValue("totalValue"))}
        </div>
      ),
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
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              {supplier.status === "active" ? (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange(supplier.id, "inactive")}
                  className="text-yellow-600"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Ngưng hợp tác
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange(supplier.id, "active")}
                  className="text-green-600"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Kích hoạt
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => handleDelete(supplier.id)}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhà cung cấp</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin nhà cung cấp và đối tác
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất danh sách
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingSupplier(null)
                resetForm()
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhà cung cấp
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingSupplier ? "Cập nhật thông tin nhà cung cấp" : "Thêm thông tin nhà cung cấp mới"}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="additional">Thông tin bổ sung</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên nhà cung cấp</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Fresh Meat Co."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Người liên hệ</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@supplier.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục sản phẩm</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.filter(cat => cat !== "Tất cả").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="123 Đường ABC, Quận 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="TP. Hồ Chí Minh"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://supplier.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxCode">Mã số thuế</Label>
                      <Input
                        id="taxCode"
                        value={formData.taxCode}
                        onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Tài khoản ngân hàng</Label>
                    <Input
                      id="bankAccount"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                      placeholder="123456789 - Vietcombank"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Điều kiện thanh toán</Label>
                    <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({...formData, paymentTerms: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điều kiện thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COD">Thanh toán khi giao hàng (COD)</SelectItem>
                        <SelectItem value="Trả trước">Trả trước 100%</SelectItem>
                        <SelectItem value="15 ngày">Thanh toán trong 15 ngày</SelectItem>
                        <SelectItem value="30 ngày">Thanh toán trong 30 ngày</SelectItem>
                        <SelectItem value="45 ngày">Thanh toán trong 45 ngày</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Ghi chú về nhà cung cấp..."
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
                  {editingSupplier ? "Cập nhật" : "Thêm nhà cung cấp"}
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
            <CardTitle className="text-sm font-medium">Tổng nhà cung cấp</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Đối tác trong hệ thống
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Nhà cung cấp hoạt động
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
              Tổng giá trị giao dịch
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
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
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhà cung cấp</CardTitle>
          <CardDescription>
            Hiển thị {filteredSuppliers.length} nhà cung cấp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredSuppliers}
            searchKey="name"
          />
        </CardContent>
      </Card>
    </div>
  )
}
