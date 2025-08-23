// "use client"

// import React, { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { 
//   Plus,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   Package2,
//   AlertTriangle,
//   TrendingDown,
//   TrendingUp,
//   Truck,
//   Calendar,
//   Download,
//   Upload,
//   BarChart3,
//   Clock,
//   CheckCircle,
//   XCircle
// } from "lucide-react"

// interface InventoryItem {
//   id: string
//   name: string
//   category: 'ingredient' | 'beverage' | 'packaging' | 'equipment' | 'cleaning'
//   currentStock: number
//   unit: string
//   minThreshold: number
//   maxThreshold: number
//   unitCost: number
//   totalValue: number
//   supplier: string
//   lastOrdered: string
//   expiryDate?: string
//   location: string
//   status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired'
// }

// interface PurchaseOrder {
//   id: string
//   orderNumber: string
//   supplier: string
//   orderDate: string
//   expectedDelivery: string
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
//   totalAmount: number
//   items: { name: string, quantity: number, unitCost: number }[]
// }

// "use client"

// import React, { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { 
//   Plus,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   Package2,
//   AlertTriangle,
//   TrendingDown,
//   TrendingUp,
//   Truck,
//   Calendar,
//   Download,
//   Upload,
//   BarChart3,
//   Clock,
//   CheckCircle,
//   XCircle
// } from "lucide-react"

// interface InventoryItem {
//   id: string
//   name: string
//   category: 'ingredient' | 'beverage' | 'packaging' | 'equipment' | 'cleaning'
//   currentStock: number
//   unit: string
//   minThreshold: number
//   maxThreshold: number
//   unitCost: number
//   totalValue: number
//   supplier: string
//   lastOrdered: string
//   expiryDate?: string
//   location: string
//   status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired'
// }

// interface PurchaseOrder {
//   id: string
//   orderNumber: string
//   supplier: string
//   orderDate: string
//   expectedDelivery: string
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
//   totalAmount: number
//   items: { name: string, quantity: number, unitCost: number }[]
// }

// export default function InventoryPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [selectedStatus, setSelectedStatus] = useState<string>("all")
//   const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

//   const inventoryItems: InventoryItem[] = [
//     {
//       id: "1",
//       name: "Thịt bò tươi",
//       category: "ingredient",
//       currentStock: 25,
//       unit: "kg",
//       minThreshold: 10,
//       maxThreshold: 50,
//       unitCost: 280000,
//       totalValue: 7000000,
//       supplier: "Công ty TNHH Thực phẩm sạch",
//       lastOrdered: "2025-01-18",
//       expiryDate: "2025-01-25",
//       location: "Kho lạnh A1",
//       status: "in-stock"
//     },
//     {
//       id: "2",
//       name: "Rau xà lách",
//       category: "ingredient", 
//       currentStock: 8,
//       unit: "kg",
//       minThreshold: 15,
//       maxThreshold: 30,
//       unitCost: 35000,
//       totalValue: 280000,
//       supplier: "Nông trại hữu cơ Đà Lạt",
//       lastOrdered: "2025-01-19",
//       expiryDate: "2025-01-22",
//       location: "Kho lạnh B2",
//       status: "low-stock"
//     },
//     {
//       id: "3",
//       name: "Nước suối",
//       category: "beverage",
//       currentStock: 120,
//       unit: "chai",
//       minThreshold: 50,
//       maxThreshold: 200,
//       unitCost: 8000,
//       totalValue: 960000,
//       supplier: "Lavie",
//       lastOrdered: "2025-01-17",
//       location: "Kho B1",
//       status: "in-stock"
//     },
//     {
//       id: "4",
//       name: "Gạo tẻ",
//       category: "ingredient",
//       currentStock: 0,
//       unit: "kg",
//       minThreshold: 20,
//       maxThreshold: 100,
//       unitCost: 25000,
//       totalValue: 0,
//       supplier: "Gạo sạch Mekong",
//       lastOrdered: "2025-01-15",
//       location: "Kho A2",
//       status: "out-of-stock"
//     },
//     {
//       id: "5",
//       name: "Hộp giấy đựng thức ăn",
//       category: "packaging",
//       currentStock: 500,
//       unit: "cái",
//       minThreshold: 200,
//       maxThreshold: 1000,
//       unitCost: 3500,
//       totalValue: 1750000,
//       supplier: "Bao bì An Khang",
//       lastOrdered: "2025-01-16",
//       location: "Kho C1",
//       status: "in-stock"
//     }
//   ]

//   const purchaseOrders: PurchaseOrder[] = [
//     {
//       id: "PO-2025-001",
//       orderNumber: "PO-2025-001",
//       supplier: "Nông trại hữu cơ Đà Lạt",
//       orderDate: "2025-01-20",
//       expectedDelivery: "2025-01-22",
//       status: "confirmed",
//       totalAmount: 2450000,
//       items: [
//         { name: "Rau xà lách", quantity: 30, unitCost: 35000 },
//         { name: "Cà chua", quantity: 25, unitCost: 28000 },
//         { name: "Hành tây", quantity: 15, unitCost: 22000 }
//       ]
//     },
//     {
//       id: "PO-2025-002", 
//       orderNumber: "PO-2025-002",
//       supplier: "Gạo sạch Mekong",
//       orderDate: "2025-01-21",
//       expectedDelivery: "2025-01-23",
//       status: "pending",
//       totalAmount: 3500000,
//       items: [
//         { name: "Gạo tẻ", quantity: 100, unitCost: 25000 },
//         { name: "Gạo nàng hương", quantity: 50, unitCost: 35000 }
//       ]
//     }
//   ]

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'in-stock': return 'bg-green-100 text-green-800 border-green-200'
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
//       case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200'
//       case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
//       default: return 'bg-gray-100 text-gray-800 border-gray-200'
//     }
//   }

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'in-stock': return 'Còn hàng'
//       case 'low-stock': return 'Sắp hết'
//       case 'out-of-stock': return 'Hết hàng'
//       case 'expired': return 'Đã hết hạn'
//       default: return status
//     }
//   }

//   const getCategoryLabel = (category: string) => {
//     switch (category) {
//       case 'ingredient': return 'Nguyên liệu'
//       case 'beverage': return 'Đồ uống'
//       case 'packaging': return 'Bao bì'
//       case 'equipment': return 'Thiết bị'
//       case 'cleaning': return 'Vệ sinh'
//       default: return category
//     }
//   }

//   const getOrderStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'confirmed': return 'bg-blue-100 text-blue-800'
//       case 'shipped': return 'bg-purple-100 text-purple-800'
//       case 'delivered': return 'bg-green-100 text-green-800'
//       case 'cancelled': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getOrderStatusLabel = (status: string) => {
//     switch (status) {
//       case 'pending': return 'Chờ xác nhận'
//       case 'confirmed': return 'Đã xác nhận'
//       case 'shipped': return 'Đang giao'
//       case 'delivered': return 'Đã giao'
//       case 'cancelled': return 'Đã hủy'
//       default: return status
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(amount)
//   }

//   const filteredItems = inventoryItems.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
//     const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
//     return matchesSearch && matchesCategory && matchesStatus
//   })

//   const inventoryStats = {
//     totalItems: inventoryItems.length,
//     lowStockItems: inventoryItems.filter(item => item.status === 'low-stock').length,
//     outOfStockItems: inventoryItems.filter(item => item.status === 'out-of-stock').length,
//     totalValue: inventoryItems.reduce((sum, item) => sum + item.totalValue, 0),
//     pendingOrders: purchaseOrders.filter(order => order.status === 'pending').length
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-3xl font-bold">Quản lý kho</h2>
//           <p className="text-muted-foreground">
//             Theo dõi tồn kho và đặt hàng nguyên vật liệu
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm">
//             <Upload className="h-4 w-4 mr-2" />
//             Import
//           </Button>
//           <Button variant="outline" size="sm">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
//             <DialogTrigger asChild>
//               <Button size="sm">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Thêm mặt hàng
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Thêm mặt hàng mới</DialogTitle>
//                 <DialogDescription>
//                   Nhập thông tin chi tiết về mặt hàng mới
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="itemName">Tên mặt hàng</Label>
//                     <Input id="itemName" placeholder="Nhập tên mặt hàng" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Danh mục</Label>
//                     <Select>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn danh mục" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ingredient">Nguyên liệu</SelectItem>
//                         <SelectItem value="beverage">Đồ uống</SelectItem>
//                         <SelectItem value="packaging">Bao bì</SelectItem>
//                         <SelectItem value="equipment">Thiết bị</SelectItem>
//                         <SelectItem value="cleaning">Vệ sinh</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="unit">Đơn vị</Label>
//                     <Input id="unit" placeholder="kg, lít, cái..." />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="minThreshold">Tồn kho tối thiểu</Label>
//                     <Input id="minThreshold" type="number" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="maxThreshold">Tồn kho tối đa</Label>
//                     <Input id="maxThreshold" type="number" />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="unitCost">Giá đơn vị</Label>
//                     <Input id="unitCost" type="number" placeholder="VND" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="supplier">Nhà cung cấp</Label>
//                     <Input id="supplier" placeholder="Tên nhà cung cấp" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
//                     Hủy
//                   </Button>
//                   <Button onClick={() => setIsAddItemModalOpen(false)}>
//                     Thêm mặt hàng
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-5">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Tổng mặt hàng</p>
//                 <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
//               </div>
//               <Package2 className="h-8 w-8 text-blue-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Sắp hết hàng</p>
//                 <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-yellow-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Hết hàng</p>
//                 <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
//               </div>
//               <XCircle className="h-8 w-8 text-red-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Giá trị tồn kho</p>
//                 <p className="text-2xl font-bold">{formatCurrency(inventoryStats.totalValue)}</p>
//               </div>
//               <BarChart3 className="h-8 w-8 text-green-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Đơn chờ xử lý</p>
//                 <p className="text-2xl font-bold text-orange-600">{inventoryStats.pendingOrders}</p>
//               </div>
//               <Clock className="h-8 w-8 text-orange-500" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="inventory" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
//           <TabsTrigger value="orders">Đơn đặt hàng</TabsTrigger>
//           <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
//           <TabsTrigger value="reports">Báo cáo</TabsTrigger>
//         </TabsList>

//         <TabsContent value="inventory" className="space-y-4">
//           {/* Filters */}
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex gap-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input 
//                     placeholder="Tìm kiếm mặt hàng..." 
//                     className="pl-10"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue placeholder="Danh mục" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Tất cả danh mục</SelectItem>
//                     <SelectItem value="ingredient">Nguyên liệu</SelectItem>
//                     <SelectItem value="beverage">Đồ uống</SelectItem>
//                     <SelectItem value="packaging">Bao bì</SelectItem>
//                     <SelectItem value="equipment">Thiết bị</SelectItem>
//                     <SelectItem value="cleaning">Vệ sinh</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue placeholder="Trạng thái" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Tất cả trạng thái</SelectItem>
//                     <SelectItem value="in-stock">Còn hàng</SelectItem>
//                     <SelectItem value="low-stock">Sắp hết</SelectItem>
//                     <SelectItem value="out-of-stock">Hết hàng</SelectItem>
//                     <SelectItem value="expired">Hết hạn</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button variant="outline">
//                   <Filter className="h-4 w-4 mr-2" />
//                   Lọc nâng cao
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Inventory List */}
//           <div className="space-y-4">
//             {filteredItems.map((item) => (
//               <Card key={item.id} className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4 flex-1">
//                       <div className="space-y-1 flex-1">
//                         <div className="flex items-center gap-3">
//                           <h4 className="font-medium text-lg">{item.name}</h4>
//                           <Badge variant="outline" className={getStatusColor(item.status)}>
//                             {getStatusLabel(item.status)}
//                           </Badge>
//                           <Badge variant="secondary">
//                             {getCategoryLabel(item.category)}
//                           </Badge>
//                         </div>
                        
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
//                           <div>
//                             <span className="font-medium">Tồn kho:</span> {item.currentStock} {item.unit}
//                           </div>
//                           <div>
//                             <span className="font-medium">Giá trị:</span> {formatCurrency(item.totalValue)}
//                           </div>
//                           <div>
//                             <span className="font-medium">Nhà cung cấp:</span> {item.supplier}
//                           </div>
//                           <div>
//                             <span className="font-medium">Vị trí:</span> {item.location}
//                           </div>
//                         </div>

//                         {/* Stock Level Progress */}
//                         <div className="mt-3">
//                           <div className="flex justify-between text-xs text-muted-foreground mb-1">
//                             <span>Mức tồn kho</span>
//                             <span>{item.currentStock}/{item.maxThreshold} {item.unit}</span>
//                           </div>
//                           <Progress 
//                             value={(item.currentStock / item.maxThreshold) * 100} 
//                             className="h-2"
//                           />
//                           <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                             <span>Tối thiểu: {item.minThreshold}</span>
//                             <span>Tối đa: {item.maxThreshold}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm">
//                         <Eye className="h-4 w-4 mr-2" />
//                         Chi tiết
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         <Edit className="h-4 w-4 mr-2" />
//                         Sửa
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         <Package2 className="h-4 w-4 mr-2" />
//                         Đặt hàng
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="orders" className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium">Đơn đặt hàng</h3>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Tạo đơn đặt hàng
//             </Button>
//           </div>

//           <div className="space-y-4">
//             {purchaseOrders.map((order) => (
//               <Card key={order.id} className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-3 flex-1">
//                       <div className="flex items-center gap-3">
//                         <h4 className="font-medium text-lg">{order.orderNumber}</h4>
//                         <Badge className={getOrderStatusColor(order.status)}>
//                           {getOrderStatusLabel(order.status)}
//                         </Badge>
//                       </div>
                      
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                           <span className="text-muted-foreground">Nhà cung cấp:</span>
//                           <p className="font-medium">{order.supplier}</p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">Ngày đặt:</span>
//                           <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">Giao dự kiến:</span>
//                           <p className="font-medium">{new Date(order.expectedDelivery).toLocaleDateString('vi-VN')}</p>
//                         </div>
//                         <div>
//                           <span className="text-muted-foreground">Tổng tiền:</span>
//                           <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
//                         </div>
//                       </div>

//                       <div>
//                         <span className="text-sm text-muted-foreground">Danh sách mặt hàng:</span>
//                         <p className="text-sm">{order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm">
//                         <Eye className="h-4 w-4 mr-2" />
//                         Xem
//                       </Button>
//                       {order.status === 'pending' && (
//                         <Button size="sm">
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Xác nhận
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="suppliers" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Nhà cung cấp</CardTitle>
//               <CardDescription>Quản lý thông tin nhà cung cấp</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center py-8">
//                 <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                 <p className="text-muted-foreground">Tính năng quản lý nhà cung cấp</p>
//                 <p className="text-sm text-muted-foreground">Đang phát triển</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="reports" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Báo cáo tồn kho</CardTitle>
//                 <CardDescription>Thống kê chi tiết về tình hình kho</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Tỷ lệ mặt hàng còn đủ</span>
//                     <span className="font-medium">78%</span>
//                   </div>
//                   <Progress value={78} className="h-2" />
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Tỷ lệ sắp hết hàng</span>
//                     <span className="font-medium">15%</span>
//                   </div>
//                   <Progress value={15} className="h-2" />
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Tỷ lệ hết hàng</span>
//                     <span className="font-medium">7%</span>
//                   </div>
//                   <Progress value={7} className="h-2" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Xu hướng nhập hàng</CardTitle>
//                 <CardDescription>Phân tích mua sắm theo thời gian</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-48 flex items-center justify-center bg-muted/10 rounded-lg">
//                   <div className="text-center">
//                     <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                     <p className="text-muted-foreground">Biểu đồ xu hướng</p>
//                     <p className="text-sm text-muted-foreground">Chart.js integration</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
//       unitPrice: 280000,
//       supplier: "Công ty TNHH Thịt sạch ABC",
//       lastUpdated: "2024-12-20",
//       status: "in_stock",
//       expiryDate: "2024-12-25"
//     },
//     {
//       id: 2,
//       name: "Gạo tẻ",
//       category: "Ngũ cốc",
//       unit: "kg",
//       currentStock: 8,
//       minStock: 15,
//       maxStock: 100,
//       unitPrice: 25000,
//       supplier: "Cửa hàng gạo Minh Phát",
//       lastUpdated: "2024-12-18",
//       status: "low_stock",
//       expiryDate: "2025-06-20"
//     },
//     {
//       id: 3,
//       name: "Rau cải xanh",
//       category: "Rau củ",
//       unit: "kg",
//       currentStock: 5,
//       minStock: 8,
//       maxStock: 20,
//       unitPrice: 15000,
//       supplier: "Nông trại sạch XYZ",
//       lastUpdated: "2024-12-19",
//       status: "low_stock",
//       expiryDate: "2024-12-22"
//     },
//     {
//       id: 4,
//       name: "Cà phê hạt",
//       category: "Đồ uống",
//       unit: "kg",
//       currentStock: 0,
//       minStock: 5,
//       maxStock: 25,
//       unitPrice: 180000,
//       supplier: "Cà phê Trung Nguyên",
//       lastUpdated: "2024-12-15",
//       status: "out_of_stock",
//       expiryDate: "2025-12-15"
//     }
//   ]

//   const getStatusBadge = (item: InventoryItem) => {
//     if (item.currentStock === 0) {
//       return <Badge variant="secondary" className="bg-red-100 text-red-800">Hết hàng</Badge>
//     }
//     if (item.currentStock <= item.minStock) {
//       return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>
//     }
//     if (item.currentStock >= item.maxStock * 0.8) {
//       return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đầy kho</Badge>
//     }
//     return <Badge variant="secondary" className="bg-green-100 text-green-800">Bình thường</Badge>
//   }

//   const getStockLevel = (item: InventoryItem) => {
//     const percentage = (item.currentStock / item.maxStock) * 100
//     return Math.min(percentage, 100)
//   }

//   const getExpiryStatus = (expiryDate: string) => {
//     const today = new Date()
//     const expiry = new Date(expiryDate)
//     const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
//     if (daysUntilExpiry <= 3) {
//       return <Badge variant="secondary" className="bg-red-100 text-red-800">Sắp hết hạn</Badge>
//     }
//     if (daysUntilExpiry <= 7) {
//       return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>
//     }
//     return <Badge variant="secondary" className="bg-green-100 text-green-800">Còn hạn</Badge>
//   }

//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
//             <Package2 className="h-8 w-8" />
//             Quản lý kho
//           </h1>
//           <p className="text-muted-foreground">
//             Theo dõi tồn kho và quản lý nhập xuất hàng hóa
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">
//             <Truck className="mr-2 h-4 w-4" />
//             Nhập hàng
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Thêm mặt hàng
//           </Button>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Tìm kiếm mặt hàng..." className="pl-8" />
//         </div>
//         <Button variant="outline">
//           <Filter className="mr-2 h-4 w-4" />
//           Lọc theo danh mục
//         </Button>
//         <Button variant="outline">
//           <AlertTriangle className="mr-2 h-4 w-4" />
//           Hàng sắp hết
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Tổng mặt hàng</CardTitle>
//             <Package2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">156</div>
//             <p className="text-xs text-muted-foreground">
//               +12 mặt hàng mới tháng này
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">8</div>
//             <p className="text-xs text-muted-foreground">
//               Cần nhập hàng gấp
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
//             <TrendingDown className="h-4 w-4 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-600">15</div>
//             <p className="text-xs text-muted-foreground">
//               Trong vòng 7 ngày
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Giá trị kho</CardTitle>
//             <TrendingUp className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">45.2M</div>
//             <p className="text-xs text-muted-foreground">
//               VNĐ tổng giá trị tồn kho
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Inventory List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Danh sách tồn kho</CardTitle>
//           <CardDescription>
//             Theo dõi số lượng và trạng thái từng mặt hàng
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {inventory.map((item) => (
//               <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
//                     <Package2 className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-muted-foreground">{item.supplier}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <Badge variant="outline">{item.category}</Badge>
//                       {getStatusBadge(item)}
//                       {getExpiryStatus(item.expiryDate)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-6">
//                   <div className="text-center">
//                     <p className="text-sm text-muted-foreground">Tồn kho</p>
//                     <p className="font-medium">
//                       {item.currentStock} {item.unit}
//                     </p>
//                     <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
//                       <div 
//                         className={`h-2 rounded-full ${
//                           getStockLevel(item) <= 20 ? 'bg-red-500' :
//                           getStockLevel(item) <= 50 ? 'bg-yellow-500' : 'bg-green-500'
//                         }`}
//                         style={{ width: `${getStockLevel(item)}%` }}
//                       />
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm text-muted-foreground">Giá đơn vị</p>
//                     <p className="font-medium">{item.unitPrice.toLocaleString('vi-VN')}đ</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm text-muted-foreground">Hết hạn</p>
//                     <p className="font-medium text-sm">{item.expiryDate}</p>
//                   </div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         Xem chi tiết
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Edit className="mr-2 h-4 w-4" />
//                         Chỉnh sửa
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Truck className="mr-2 h-4 w-4" />
//                         Nhập hàng
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Package2 className="mr-2 h-4 w-4" />
//                         Xuất hàng
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="text-red-600">
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Xóa
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
