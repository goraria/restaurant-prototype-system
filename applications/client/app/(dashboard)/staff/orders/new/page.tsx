import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Clock, User } from "lucide-react"
import Link from "next/link"

export default function NewOrderPage() {
  const menuItems = [
    { id: 1, name: "Phở bò", category: "Món chính", price: 65000, available: true },
    { id: 2, name: "Bánh mì thịt", category: "Món nhẹ", price: 35000, available: true },
    { id: 3, name: "Cơm tấm", category: "Món chính", price: 45000, available: true },
    { id: 4, name: "Bún bò Huế", category: "Món chính", price: 55000, available: false },
    { id: 5, name: "Cà phê sữa", category: "Đồ uống", price: 25000, available: true },
    { id: 6, name: "Trà sữa", category: "Đồ uống", price: 30000, available: true },
    { id: 7, name: "Nước ngọt", category: "Đồ uống", price: 15000, available: true },
    { id: 8, name: "Chè ba màu", category: "Tráng miệng", price: 20000, available: true },
  ]

  const tables = [
    { number: "01", status: "available", capacity: 2 },
    { number: "02", status: "occupied", capacity: 4 },
    { number: "03", status: "available", capacity: 4 },
    { number: "04", status: "reserved", capacity: 6 },
    { number: "05", status: "available", capacity: 2 },
    { number: "06", status: "occupied", capacity: 4 },
    { number: "07", status: "available", capacity: 8 },
    { number: "08", status: "available", capacity: 2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Tạo đơn hàng mới</h2>
          <p className="text-muted-foreground">
            Nhận và tạo đơn hàng cho khách hàng
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/staff/orders">Quay lại</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Table Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng & bàn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">Tên khách hàng</Label>
                  <Input id="customer" placeholder="Nhập tên khách hàng" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Số điện thoại (tùy chọn)" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Chọn bàn</Label>
                <div className="grid grid-cols-4 gap-2">
                  {tables.map((table) => (
                    <Button
                      key={table.number}
                      variant={table.status === 'available' ? 'outline' : 'secondary'}
                      disabled={table.status !== 'available'}
                      className="h-16 flex flex-col"
                    >
                      <span className="font-bold">Bàn {table.number}</span>
                      <span className="text-xs">
                        {table.status === 'available' ? 'Trống' :
                         table.status === 'occupied' ? 'Có khách' : 'Đã đặt'}
                      </span>
                      <span className="text-xs">{table.capacity} chỗ</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea id="note" placeholder="Ghi chú đặc biệt..." />
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn món</CardTitle>
              <CardDescription>
                Chọn các món ăn và đồ uống cho đơn hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Tìm kiếm món ăn..." className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Phân loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="main">Món chính</SelectItem>
                      <SelectItem value="snack">Món nhẹ</SelectItem>
                      <SelectItem value="drink">Đồ uống</SelectItem>
                      <SelectItem value="dessert">Tráng miệng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        !item.available ? 'opacity-50 bg-muted' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {!item.available && (
                            <Badge variant="destructive" className="text-xs">
                              Hết món
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      
                      {item.available && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">0</span>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>Chưa chọn khách hàng</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Món đã chọn:</p>
                <div className="text-center text-muted-foreground py-8">
                  Chưa có món nào được chọn
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>0₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế (10%):</span>
                  <span>0₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span>0₫</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full" disabled>
                  Tạo đơn hàng
                </Button>
                <Button variant="outline" className="w-full">
                  Lưu nháp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Combo phở + cà phê
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Set cơm tấm
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Đồ uống phổ biến
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
