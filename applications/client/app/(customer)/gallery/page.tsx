"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Heart, Share2, Download, Eye, Camera, Utensils, Users, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  description: string
  category: 'food' | 'restaurant' | 'events' | 'behind-scenes' | 'customers'
  image: string
  photographer: string
  date: string
  likes: number
  views: number
  tags: string[]
  featured: boolean
}

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      title: "Phở Bò Đặc Biệt",
      description: "Tô phở bò đậm đà với thịt bò tươi ngon, nước dùng trong suốt được ninh từ xương bò",
      category: "food",
      image: "/images/gallery/pho-bo.jpg",
      photographer: "Chef Nguyễn Văn A",
      date: "2025-08-20",
      likes: 156,
      views: 2340,
      tags: ["Phở", "Món chính", "Truyền thống"],
      featured: true
    },
    {
      id: "2",
      title: "Không gian nhà hàng",
      description: "Không gian ấm cúng với thiết kế truyền thống Việt Nam, tạo cảm giác thân thiện cho thực khách",
      category: "restaurant",
      image: "/images/gallery/restaurant-interior.jpg",
      photographer: "Photographer B",
      date: "2025-08-18",
      likes: 89,
      views: 1567,
      tags: ["Không gian", "Thiết kế", "Truyền thống"],
      featured: true
    },
    {
      id: "3",
      title: "Gỏi cuốn tôm thịt",
      description: "Gỏi cuốn tươi mát với tôm luộc, thịt heo và rau thơm, cuốn trong bánh tráng mỏng",
      category: "food",
      image: "/images/gallery/goi-cuon.jpg",
      photographer: "Chef Trần Thị C",
      date: "2025-08-17",
      likes: 123,
      views: 1890,
      tags: ["Gỏi cuốn", "Khai vị", "Tươi ngon"],
      featured: false
    },
    {
      id: "4",
      title: "Tiệc sinh nhật",
      description: "Khoảnh khắc vui vẻ trong bữa tiệc sinh nhật được tổ chức tại nhà hàng",
      category: "events",
      image: "/images/gallery/birthday-party.jpg",
      photographer: "Event Team",
      date: "2025-08-15",
      likes: 78,
      views: 1234,
      tags: ["Sinh nhật", "Tiệc", "Gia đình"],
      featured: false
    },
    {
      id: "5",
      title: "Bếp trưởng chuẩn bị món ăn",
      description: "Bếp trưởng đang tỉ mỉ chuẩn bị từng món ăn với tâm huyết và kỹ thuật chuyên nghiệp",
      category: "behind-scenes",
      image: "/images/gallery/chef-cooking.jpg",
      photographer: "Staff Reporter",
      date: "2025-08-14",
      likes: 234,
      views: 3456,
      tags: ["Bếp trưởng", "Nấu ăn", "Chuyên nghiệp"],
      featured: true
    },
    {
      id: "6",
      title: "Gia đình vui vẻ",
      description: "Gia đình ba thế hệ cùng thưởng thức bữa cơm sum vầy tại nhà hàng",
      category: "customers",
      image: "/images/gallery/family-dining.jpg",
      photographer: "Customer Service",
      date: "2025-08-12",
      likes: 167,
      views: 2876,
      tags: ["Gia đình", "Sum vầy", "Hạnh phúc"],
      featured: false
    },
    {
      id: "7",
      title: "Cà phê sữa đá",
      description: "Ly cà phê sữa đá đậm đà, thơm ngon theo cách pha truyền thống Việt Nam",
      category: "food",
      image: "/images/gallery/ca-phe.jpg",
      photographer: "Barista D",
      date: "2025-08-10",
      likes: 98,
      views: 1654,
      tags: ["Cà phê", "Đồ uống", "Truyền thống"],
      featured: false
    },
    {
      id: "8",
      title: "Khu vực VIP",
      description: "Khu vực VIP sang trọng với view thành phố, phù hợp cho các cuộc họp quan trọng",
      category: "restaurant",
      image: "/images/gallery/vip-area.jpg",
      photographer: "Interior Designer",
      date: "2025-08-08",
      likes: 145,
      views: 2134,
      tags: ["VIP", "Sang trọng", "View đẹp"],
      featured: false
    },
    {
      id: "9",
      title: "Team building công ty",
      description: "Sự kiện team building của công ty ABC với menu buffet phong phú",
      category: "events",
      image: "/images/gallery/team-building.jpg",
      photographer: "Event Manager",
      date: "2025-08-06",
      likes: 187,
      views: 2987,
      tags: ["Team building", "Công ty", "Buffet"],
      featured: false
    },
    {
      id: "10",
      title: "Nguyên liệu tươi ngon",
      description: "Những nguyên liệu tươi ngon được chọn lọc kỹ càng mỗi ngày cho nhà bếp",
      category: "behind-scenes",
      image: "/images/gallery/fresh-ingredients.jpg",
      photographer: "Kitchen Staff",
      date: "2025-08-04",
      likes: 76,
      views: 1456,
      tags: ["Nguyên liệu", "Tươi ngon", "Chất lượng"],
      featured: false
    }
  ]

  const categories = [
    { id: "all", name: "Tất cả", icon: Camera },
    { id: "food", name: "Món ăn", icon: Utensils },
    { id: "restaurant", name: "Nhà hàng", icon: MapPin },
    { id: "events", name: "Sự kiện", icon: Users },
    { id: "behind-scenes", name: "Hậu trường", icon: Camera },
    { id: "customers", name: "Khách hàng", icon: Users }
  ]

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredItems = galleryItems.filter(item => item.featured)

  const handleImageClick = (item: GalleryItem) => {
    setSelectedImage(item)
    const index = filteredItems.findIndex(i => i.id === item.id)
    setCurrentImageIndex(index)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredItems.length - 1
      setCurrentImageIndex(newIndex)
      setSelectedImage(filteredItems[newIndex])
    } else {
      const newIndex = currentImageIndex < filteredItems.length - 1 ? currentImageIndex + 1 : 0
      setCurrentImageIndex(newIndex)
      setSelectedImage(filteredItems[newIndex])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Thư Viện Ảnh</h1>
          <p className="text-xl opacity-90">
            Khám phá những khoảnh khắc đẹp tại nhà hàng của chúng tôi
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Ảnh nổi bật</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredItems.slice(0, 3).map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="aspect-[4/3] bg-muted relative" onClick={() => handleImageClick(item)}>
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Camera className="h-16 w-16" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-orange-500">
                      Nổi bật
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {categories.find(cat => cat.id === item.category)?.name}
                    </Badge>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-square bg-muted relative" onClick={() => handleImageClick(item)}>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Camera className="h-12 w-12" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                {item.featured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-xs">
                    Nổi bật
                  </Badge>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-white/90">
                    <Heart className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-white/90">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {categories.find(cat => cat.id === item.category)?.name}
                </Badge>
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy ảnh</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline">Xem thêm ảnh</Button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-0">
          {selectedImage && (
            <div className="flex h-full">
              {/* Image */}
              <div className="flex-1 relative bg-black">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Camera className="h-24 w-24" />
                </div>
                
                {/* Navigation */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Close */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Info Panel */}
              <div className="w-80 p-6 bg-background border-l overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {categories.find(cat => cat.id === selectedImage.category)?.name}
                    </Badge>
                    <h2 className="text-xl font-bold mb-2">{selectedImage.title}</h2>
                    <p className="text-muted-foreground">{selectedImage.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Photographer:</span>
                      <span>{selectedImage.photographer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày chụp:</span>
                      <span>{new Date(selectedImage.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lượt xem:</span>
                      <span>{selectedImage.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lượt thích:</span>
                      <span>{selectedImage.likes}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Thích
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {currentImageIndex + 1} / {filteredItems.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
