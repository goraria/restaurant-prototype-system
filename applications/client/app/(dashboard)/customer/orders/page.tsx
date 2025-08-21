import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Clock, MapPin, RefreshCw, Eye } from "lucide-react"
import Link from "next/link"

export default function CustomerOrdersPage() {
  const orders = [
    {
      id: "ORD-156",
      date: "2025-08-22",
      time: "14:30",
      items: [
        { name: "Phở bò", quantity: 1, price: 65000 },
        { name: "Cà phê sữa", quantity: 1, price: 25000 }
      ],
      total: 90000,
      status: "completed",
      rating: 5,
      deliveryType: "dine-in",
      table: "Bàn 05",
      restaurant: "Waddles - Hai Bà Trưng"
    },
    {
      id: "ORD-142", 
      date: "2025-08-21",
      time: "12:15",
      items: [
        { name: "Cơm tấm", quantity: 1, price: 45000 },
        { name: "Trà sữa", quantity: 1, price: 30000 }
      ],
      total: 75000,
      status: "completed",
      rating: 4,
      deliveryType: "delivery",
      address: "123 Nguyễn Du, Hai Bà Trưng",
      restaurant: "Waddles - Hai Bà Trưng"
    },
    {
      id: "ORD-128",
      date: "2025-08-19", 
      time: "18:45",
      items: [
        { name: "Bánh mì thịt", quantity: 2, price: 35000 },
        { name: "Nước ngọt", quantity: 2, price: 15000 }
      ],
      total: 100000,
      status: "completed", 
      rating: 5,
      deliveryType: "takeaway",
      restaurant: "Waddles - Hai Bà Trưng"
    },
    {
      id: "ORD-115",
      date: "2025-08-18",
      time: "13:20",
      items: [
        { name: "Bún bò Huế", quantity: 1, price: 55000 },
        { name: "Chè ba màu", quantity: 1, price: 20000 }
      ],
      total: 75000,
      status: "cancelled",
      rating: null,
      deliveryType: "dine-in",
      table: "Bàn 12", 
      restaurant: "Waddles - Hai Bà Trưng"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'cancelled': return 'destructive' 
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      case 'pending': return 'Đang xử lý'
      default: return status
    }
  }

  const getDeliveryTypeText = (type: string) => {
    switch (type) {
      case 'dine-in': return 'Tại quán'
      case 'delivery': return 'Giao hàng'
      case 'takeaway': return 'Mang về'
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Lịch sử đơn hàng</h2>
          <p className="text-muted-foreground">
            Xem lại các đơn hàng đã đặt và đánh giá trải nghiệm
          </p>
        </div>
        <Button asChild>
          <Link href="/customer/orders/reorder">Đặt lại món cũ</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm theo mã đơn, món ăn..." className="pl-8" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="pending">Đang xử lý</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="dine-in">Tại quán</SelectItem>
                <SelectItem value="delivery">Giao hàng</SelectItem>
                <SelectItem value="takeaway">Mang về</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <CardDescription>
                    {new Date(order.date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })} • {order.time} • {getDeliveryTypeText(order.deliveryType)}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  {order.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Restaurant & Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{order.restaurant}</span>
                  {order.table && <span>• {order.table}</span>}
                  {order.address && <span>• {order.address}</span>}
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">Món đã gọi:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{item.price.toLocaleString('vi-VN')}₫</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span>{order.total.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  
                  {order.status === 'completed' && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Đặt lại
                      </Button>
                      {!order.rating && (
                        <Button size="sm" className="flex-1">
                          <Star className="h-4 w-4 mr-1" />
                          Đánh giá
                        </Button>
                      )}
                    </>
                  )}
                  
                  {order.status === 'pending' && (
                    <Button size="sm" variant="destructive" className="flex-1">
                      Hủy đơn
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Đánh giá trung bình</p>
                <p className="text-2xl font-bold">
                  {(orders.filter(o => o.rating).reduce((acc, o) => acc + o.rating!, 0) / 
                    orders.filter(o => o.rating).length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Tổng chi tiêu</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'completed')
                    .reduce((acc, o) => acc + o.total, 0)
                    .toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
