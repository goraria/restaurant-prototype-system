import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Heart, Clock, Gift, CreditCard, Calendar } from "lucide-react"
import Link from "next/link"

export default function CustomerDashboard() {
  const stats = [
    { title: "Điểm tích lũy", value: "2,450", icon: Gift, change: "+120 tuần này" },
    { title: "Đơn hàng", value: "47", icon: Clock, change: "3 đơn tháng này" },
    { title: "Tiết kiệm", value: "450,000₫", icon: CreditCard, change: "Từ ưu đãi" },
    { title: "Thành viên", value: "Gold", icon: Star, change: "Còn 550 điểm lên Platinum" },
  ]

  const recentOrders = [
    { id: "ORD-156", date: "Hôm nay", items: "Phở bò, Cà phê", total: 90000, status: "completed" },
    { id: "ORD-142", date: "Hôm qua", items: "Cơm tấm, Trà sữa", total: 75000, status: "completed" },
    { id: "ORD-128", date: "3 ngày trước", items: "Bánh mì, Nước ngọt", total: 50000, status: "completed" },
  ]

  const favoriteItems = [
    { name: "Phở bò", orders: 12, rating: 5 },
    { name: "Cà phê sữa", orders: 8, rating: 5 },
    { name: "Cơm tấm", orders: 6, rating: 4 },
  ]

  const offers = [
    { title: "Giảm 20% món phở", desc: "Áp dụng đến hết tháng", code: "PHO20", expires: "7 ngày" },
    { title: "Miễn phí giao hàng", desc: "Đơn từ 200k", code: "FREESHIP", expires: "14 ngày" },
    { title: "Tặng trà sữa", desc: "Khi mua combo", code: "COMBO01", expires: "3 ngày" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Xin chào! 👋</h2>
        <p className="text-muted-foreground">
          Chào mừng bạn trở lại. Hãy khám phá những ưu đãi mới nhất.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              Các đơn hàng của bạn trong thời gian qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.id}</span>
                    <span className="text-sm text-muted-foreground">{order.items}</span>
                    <span className="text-xs text-muted-foreground">{order.date}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{order.total.toLocaleString('vi-VN')}₫</span>
                    <Badge variant="outline" className="text-xs">
                      Hoàn thành
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href="/customer/orders">Xem tất cả đơn hàng</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Items */}
        <Card>
          <CardHeader>
            <CardTitle>Món yêu thích</CardTitle>
            <CardDescription>
              Những món bạn gọi nhiều nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Đã gọi {item.orders} lần
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/customer/favorites">Xem tất cả món yêu thích</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ thành viên</CardTitle>
          <CardDescription>
            Bạn đang ở cấp Gold, còn 550 điểm nữa để lên Platinum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Gold</span>
              <span>Platinum</span>
            </div>
            <Progress value={78} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2,450 điểm</span>
              <span>3,000 điểm</span>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href="/customer/loyalty">Xem ưu đãi thành viên</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Special Offers */}
      <Card>
        <CardHeader>
          <CardTitle>Ưu đãi đặc biệt</CardTitle>
          <CardDescription>
            Các mã giảm giá và ưu đãi dành riêng cho bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {offers.map((offer, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{offer.title}</h4>
                  <Gift className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-sm text-muted-foreground">{offer.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{offer.code}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Còn {offer.expires}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/customer/loyalty/offers">Xem tất cả ưu đãi</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các chức năng thường sử dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild className="h-auto flex-col py-6">
              <Link href="/customer/reservations">
                <Calendar className="h-8 w-8 mb-2" />
                Đặt bàn
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/customer/orders/reorder">
                <Clock className="h-8 w-8 mb-2" />
                Đặt lại món cũ
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/customer/wallet">
                <CreditCard className="h-8 w-8 mb-2" />
                Ví điện tử
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col py-6">
              <Link href="/customer/profile">
                <Star className="h-8 w-8 mb-2" />
                Hồ sơ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
