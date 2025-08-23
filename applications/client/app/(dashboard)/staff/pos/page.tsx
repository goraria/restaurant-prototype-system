"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, Plus, Minus, Search, QrCode, Receipt, Calculator, Trash2 } from "lucide-react"
import { useState } from "react"

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  available: boolean
}

interface CartItem extends MenuItem {
  quantity: number
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedTable, setSelectedTable] = useState("")
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" })

  const menuCategories = [
    { id: "main", name: "Món chính", color: "bg-blue-100 text-blue-800" },
    { id: "drink", name: "Đồ uống", color: "bg-green-100 text-green-800" },
    { id: "dessert", name: "Tráng miệng", color: "bg-purple-100 text-purple-800" },
    { id: "appetizer", name: "Khai vị", color: "bg-orange-100 text-orange-800" }
  ]

  const menuItems = [
    { id: 1, name: "Phở bò", category: "main", price: 65000, available: true },
    { id: 2, name: "Bánh mì thịt", category: "main", price: 35000, available: true },
    { id: 3, name: "Cơm tấm", category: "main", price: 45000, available: true },
    { id: 4, name: "Bún bò Huế", category: "main", price: 55000, available: false },
    { id: 5, name: "Cà phê sữa", category: "drink", price: 25000, available: true },
    { id: 6, name: "Trà sữa", category: "drink", price: 30000, available: true },
    { id: 7, name: "Nước ngọt", category: "drink", price: 15000, available: true },
    { id: 8, name: "Chè ba màu", category: "dessert", price: 20000, available: true },
    { id: 9, name: "Bánh flan", category: "dessert", price: 25000, available: true },
    { id: 10, name: "Gỏi cuốn", category: "appetizer", price: 30000, available: true }
  ]

  const [selectedCategory, setSelectedCategory] = useState("main")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = menuItems.filter(item => 
    item.category === selectedCategory && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1 // 10% VAT
  const total = subtotal + tax

  const tables = Array.from({ length: 20 }, (_, i) => ({
    number: String(i + 1).padStart(2, '0'),
    status: Math.random() > 0.5 ? 'available' : 'occupied'
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Point of Sale (POS)</h2>
          <p className="text-muted-foreground">
            Giao diện bán hàng và thanh toán
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Quét QR
          </Button>
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            In hóa đơn
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Menu Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {menuCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="h-auto py-2"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Menu Items Grid */}
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !item.available ? 'opacity-50' : ''
                }`}
                onClick={() => item.available && addToCart(item)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        {item.price.toLocaleString('vi-VN')}₫
                      </span>
                      {!item.available && (
                        <Badge variant="destructive" className="text-xs">
                          Hết
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary and Checkout */}
        <div className="space-y-4">
          {/* Table Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn bàn:</label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bàn" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.filter(t => t.status === 'available').map((table) => (
                      <SelectItem key={table.number} value={table.number}>
                        Bàn {table.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Input
                  placeholder="Tên khách hàng (tùy chọn)"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
                <Input
                  placeholder="Số điện thoại (tùy chọn)"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Đơn hàng ({cart.length} món)</CardTitle>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Chưa có món nào được chọn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checkout */}
          {cart.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (10%):</span>
                    <span>{tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" disabled={!selectedTable}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thanh toán thẻ
                  </Button>
                  <Button variant="outline" className="w-full" disabled={!selectedTable}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Thanh toán tiền mặt
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {!selectedTable && "Vui lòng chọn bàn để tiếp tục"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
