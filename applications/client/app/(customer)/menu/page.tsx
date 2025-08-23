"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Search, Heart, ShoppingCart, Filter, Utensils, Coffee, Cake, Soup } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'soup' | 'salad'
  image: string
  rating: number
  reviewCount: number
  isVegetarian: boolean
  isSpicy: boolean
  cookingTime: number
  ingredients: string[]
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  reviews: {
    id: string
    customerName: string
    rating: number
    comment: string
    date: string
  }[]
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Phở Bò Đặc Biệt",
      description: "Phở bò truyền thống với thịt bò tái, chín, gầu, nước dùng trong suốt được ninh từ xương bò trong 24 giờ",
      price: 89000,
      category: "main",
      image: "/images/dishes/pho-bo.jpg",
      rating: 4.8,
      reviewCount: 324,
      isVegetarian: false,
      isSpicy: false,
      cookingTime: 15,
      ingredients: ["Thịt bò", "Bánh phở", "Hành tây", "Ngò gai", "Giá đỗ", "Chanh", "Ớt"],
      nutritionInfo: {
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12
      },
      reviews: [
        {
          id: "r1",
          customerName: "Nguyễn Văn A",
          rating: 5,
          comment: "Phở ngon nhất Sài Gòn! Nước dùng rất đậm đà, thịt bò tươi ngon.",
          date: "2025-08-20"
        },
        {
          id: "r2", 
          customerName: "Trần Thị B",
          rating: 4,
          comment: "Phở ngon, giá hợp lý. Sẽ quay lại.",
          date: "2025-08-18"
        }
      ]
    },
    {
      id: "2",
      name: "Gỏi Cuốn Tôm Thịt",
      description: "Gỏi cuốn tươi mát với tôm luộc, thịt heo luộc, bún tươi, rau thơm, cuốn trong bánh tráng mỏng",
      price: 45000,
      category: "appetizer",
      image: "/images/dishes/goi-cuon.jpg",
      rating: 4.7,
      reviewCount: 189,
      isVegetarian: false,
      isSpicy: false,
      cookingTime: 10,
      ingredients: ["Tôm", "Thịt heo", "Bánh tráng", "Bún tươi", "Rau thơm", "Chấm leo"],
      nutritionInfo: {
        calories: 180,
        protein: 15,
        carbs: 20,
        fat: 5
      },
      reviews: [
        {
          id: "r3",
          customerName: "Lê Minh C", 
          rating: 5,
          comment: "Tươi ngon, sạch sẽ. Nước chấm rất đặc biệt.",
          date: "2025-08-19"
        }
      ]
    },
    {
      id: "3",
      name: "Cà Phê Sữa Đá",
      description: "Cà phê phin truyền thống pha với sữa đặc ngọt, uống kèm đá lạnh",
      price: 25000,
      category: "beverage",
      image: "/images/dishes/ca-phe.jpg",
      rating: 4.9,
      reviewCount: 567,
      isVegetarian: true,
      isSpicy: false,
      cookingTime: 5,
      ingredients: ["Cà phê robusta", "Sữa đặc", "Đá"],
      nutritionInfo: {
        calories: 120,
        protein: 3,
        carbs: 18,
        fat: 4
      },
      reviews: [
        {
          id: "r4",
          customerName: "Phạm Văn D",
          rating: 5,
          comment: "Cà phê đậm đà, thơm ngon. Đúng chuẩn Việt Nam!",
          date: "2025-08-21"
        }
      ]
    },
    {
      id: "4",
      name: "Bánh Flan Caramel",
      description: "Bánh flan mềm mịn với lớp caramel đắng ngọt hòa quyện",
      price: 35000,
      category: "dessert",
      image: "/images/dishes/banh-flan.jpg",
      rating: 4.6,
      reviewCount: 128,
      isVegetarian: true,
      isSpicy: false,
      cookingTime: 3,
      ingredients: ["Trứng", "Sữa tươi", "Đường", "Vanilla"],
      nutritionInfo: {
        calories: 250,
        protein: 6,
        carbs: 30,
        fat: 12
      },
      reviews: [
        {
          id: "r5",
          customerName: "Hoàng Thị E",
          rating: 4,
          comment: "Bánh flan ngon, không quá ngọt. Phù hợp làm tráng miệng.",
          date: "2025-08-17"
        }
      ]
    },
    {
      id: "5",
      name: "Canh Chua Cá Lóc",
      description: "Canh chua truyền thống với cá lóc tươi, cà chua, dứa, đậu bắp",
      price: 65000,
      category: "soup",
      image: "/images/dishes/canh-chua.jpg",
      rating: 4.5,
      reviewCount: 94,
      isVegetarian: false,
      isSpicy: true,
      cookingTime: 20,
      ingredients: ["Cá lóc", "Cà chua", "Dứa", "Đậu bắp", "Ngó sen", "Rau muống"],
      nutritionInfo: {
        calories: 200,
        protein: 25,
        carbs: 15,
        fat: 6
      },
      reviews: [
        {
          id: "r6",
          customerName: "Võ Văn F",
          rating: 5,
          comment: "Canh chua chuẩn vị miền Tây, cá tươi ngon!",
          date: "2025-08-16"
        }
      ]
    }
  ]

  const categories = [
    { id: "all", name: "Tất cả", icon: Utensils },
    { id: "appetizer", name: "Khai vị", icon: Utensils },
    { id: "main", name: "Món chính", icon: Utensils },
    { id: "soup", name: "Canh/Súp", icon: Soup },
    { id: "dessert", name: "Tráng miệng", icon: Cake },
    { id: "beverage", name: "Đồ uống", icon: Coffee }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.rating - a.rating
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Thực Đơn</h1>
          <p className="text-xl opacity-90">
            Khám phá những món ăn ngon nhất từ ẩm thực Việt Nam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    <Icon className="h-4 w-4 mr-1" />
                    {category.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-[4/3] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Utensils className="h-16 w-16" />
                </div>
                <div className="absolute top-4 left-4 space-y-2">
                  {item.isVegetarian && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Chay
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Cay
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="outline" className="bg-white/90">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({item.reviewCount} đánh giá)
                  </span>
                </div>

                {/* Name & Description */}
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>⏱️ {item.cookingTime} phút</span>
                  <span>🔥 {item.nutritionInfo.calories} kcal</span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(item.price)}
                  </span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{item.name}</DialogTitle>
                          <DialogDescription>
                            Thông tin chi tiết về món ăn
                          </DialogDescription>
                        </DialogHeader>
                        {selectedItem && (
                          <div className="space-y-6">
                            {/* Image */}
                            <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                              <Utensils className="h-16 w-16 text-muted-foreground" />
                            </div>

                            {/* Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2">Mô tả</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {selectedItem.description}
                                </p>

                                <h4 className="font-semibold mb-2">Nguyên liệu</h4>
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {selectedItem.ingredients.map((ingredient, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  <span>⏱️ {selectedItem.cookingTime} phút</span>
                                  {selectedItem.isVegetarian && <span>🌱 Chay</span>}
                                  {selectedItem.isSpicy && <span>🌶️ Cay</span>}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Dinh dưỡng</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Calories:</span>
                                    <span>{selectedItem.nutritionInfo.calories} kcal</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Protein:</span>
                                    <span>{selectedItem.nutritionInfo.protein}g</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Carbs:</span>
                                    <span>{selectedItem.nutritionInfo.carbs}g</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Fat:</span>
                                    <span>{selectedItem.nutritionInfo.fat}g</span>
                                  </div>
                                </div>

                                <div className="mt-6">
                                  <h4 className="font-semibold mb-2">Giá</h4>
                                  <span className="text-2xl font-bold text-orange-600">
                                    {formatPrice(selectedItem.price)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Reviews */}
                            <div>
                              <h4 className="font-semibold mb-4">Đánh giá khách hàng</h4>
                              <div className="space-y-4">
                                {selectedItem.reviews.slice(0, 3).map((review) => (
                                  <div key={review.id} className="border-l-2 border-orange-200 pl-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                          />
                                        ))}
                                      </div>
                                      <span className="font-medium text-sm">{review.customerName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(review.date).toLocaleDateString('vi-VN')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action */}
                            <div className="flex gap-2">
                              <Button className="flex-1">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Thêm vào giỏ
                              </Button>
                              <Button variant="outline">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Đặt món
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedItems.length === 0 && (
          <div className="text-center py-16">
            <Utensils className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy món ăn</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {sortedItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline">Xem thêm món ăn</Button>
          </div>
        )}
      </div>
    </div>
  )
}
