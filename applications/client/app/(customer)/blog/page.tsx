"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Eye, Heart, MessageCircle, Search, Tag } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: number
  views: number
  likes: number
  comments: number
  category: string
  tags: string[]
  image: string
  featured: boolean
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Bí quyết nấu phở bò đúng chuẩn Hà Nội",
      excerpt: "Khám phá những bí quyết truyền thống để có được tô phở bò thơm ngon, đậm đà như những quán phở nổi tiếng ở Hà Nội...",
      content: "Phở bò là món ăn đặc trưng của Việt Nam...",
      author: "Chef Nguyễn Văn A",
      publishDate: "2025-08-20",
      readTime: 8,
      views: 1245,
      likes: 89,
      comments: 23,
      category: "Công thức",
      tags: ["Phở", "Hà Nội", "Truyền thống", "Nước dùng"],
      image: "/images/blog/pho-recipe.jpg",
      featured: true
    },
    {
      id: "2", 
      title: "Top 10 món ăn Việt Nam nổi tiếng thế giới",
      excerpt: "Cùng tìm hiểu những món ăn Việt Nam đã chinh phục thế giới và trở thành biểu tượng ẩm thực của đất nước ta...",
      content: "Ẩm thực Việt Nam ngày càng được biết đến rộng rãi...",
      author: "Food Blogger Trần Thị B",
      publishDate: "2025-08-18",
      readTime: 12,
      views: 2156,
      likes: 156,
      comments: 45,
      category: "Khám phá",
      tags: ["Ẩm thực Việt", "Quốc tế", "Top 10"],
      image: "/images/blog/vietnamese-cuisine.jpg",
      featured: true
    },
    {
      id: "3",
      title: "Cách chọn nguyên liệu tươi ngon cho nhà hàng",
      excerpt: "Hướng dẫn chi tiết cách lựa chọn và bảo quản nguyên liệu tươi ngon để đảm bảo chất lượng món ăn tốt nhất...",
      content: "Nguyên liệu là yếu tố quan trọng nhất...",
      author: "Chef Lê Minh C",
      publishDate: "2025-08-15",
      readTime: 6,
      views: 892,
      likes: 67,
      comments: 18,
      category: "Kinh nghiệm",
      tags: ["Nguyên liệu", "Tươi ngon", "Bảo quản"],
      image: "/images/blog/fresh-ingredients.jpg",
      featured: false
    },
    {
      id: "4",
      title: "Lịch sử và văn hóa ẩm thực miền Nam",
      excerpt: "Tìm hiểu về sự phong phú và đặc sắc của ẩm thực miền Nam Việt Nam, từ nguyên liệu đến cách chế biến...",
      content: "Ẩm thực miền Nam mang đậm dấu ấn của vùng đất phù sa...",
      author: "Tiến sĩ Văn hóa Phạm Văn D",
      publishDate: "2025-08-12",
      readTime: 15,
      views: 756,
      likes: 45,
      comments: 12,
      category: "Văn hóa",
      tags: ["Miền Nam", "Văn hóa", "Lịch sử"],
      image: "/images/blog/southern-cuisine.jpg",
      featured: false
    },
    {
      id: "5",
      title: "Xu hướng ẩm thực healthy trong năm 2025",
      excerpt: "Những xu hướng ẩm thực lành mạnh đang được ưa chuộng và cách áp dụng vào thực đơn nhà hàng...",
      content: "Xu hướng ăn uống lành mạnh ngày càng phổ biến...",
      author: "Chuyên gia dinh dưỡng Hoàng Thị E",
      publishDate: "2025-08-10",
      readTime: 10,
      views: 1334,
      likes: 98,
      comments: 31,
      category: "xu hướng",
      tags: ["Healthy", "Xu hướng", "Dinh dưỡng"],
      image: "/images/blog/healthy-food.jpg",
      featured: false
    },
    {
      id: "6",
      title: "Cà phê Việt Nam - Hành trình từ hạt đến ly",
      excerpt: "Khám phá hành trình của hạt cà phê Việt Nam từ vùng đất cao nguyên đến ly cà phê thơm ngon...",
      content: "Cà phê Việt Nam nổi tiếng thế giới...",
      author: "Barista chuyên nghiệp Võ Văn F",
      publishDate: "2025-08-08",
      readTime: 9,
      views: 987,
      likes: 76,
      comments: 22,
      category: "Đồ uống",
      tags: ["Cà phê", "Việt Nam", "Barista"],
      image: "/images/blog/vietnamese-coffee.jpg",
      featured: false
    }
  ]

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Công thức", name: "Công thức nấu ăn" },
    { id: "Khám phá", name: "Khám phá ẩm thực" },
    { id: "Kinh nghiệm", name: "Kinh nghiệm" },
    { id: "Văn hóa", name: "Văn hóa ẩm thực" },
    { id: "Xu hướng", name: "Xu hướng" },
    { id: "Đồ uống", name: "Đồ uống" }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      case "popular":
        return b.views - a.views
      case "liked":
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const popularTags = [...new Set(blogPosts.flatMap(post => post.tags))].slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Ẩm Thực</h1>
          <p className="text-xl opacity-90">
            Khám phá thế giới ẩm thực qua những câu chuyện thú vị
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Bài viết nổi bật</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[16/9] bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <Calendar className="h-16 w-16" />
                        </div>
                        <Badge className="absolute top-4 left-4 bg-orange-500">
                          Nổi bật
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime} phút
                          </span>
                        </div>
                        
                        <Badge variant="secondary" className="mb-3">
                          {post.category}
                        </Badge>
                        
                        <h3 className="font-bold text-xl mb-3 line-clamp-2">
                          <Link href={`/customer/blog/${post.id}`} className="hover:text-orange-600">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/customer/blog/${post.id}`}>
                              Đọc tiếp
                            </Link>
                          </Button>
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
                    placeholder="Tìm kiếm bài viết..."
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mới nhất</SelectItem>
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="liked">Nhiều like nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 aspect-[4/3] md:aspect-auto bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <Calendar className="h-16 w-16" />
                      </div>
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime} phút
                        </span>
                      </div>
                      
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      
                      <h3 className="font-bold text-xl mb-3">
                        <Link href={`/customer/blog/${post.id}`} className="hover:text-orange-600">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/customer/blog/${post.id}`}>
                            Đọc tiếp
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {sortedPosts.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Không tìm thấy bài viết</h3>
                <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}

            {sortedPosts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline">Xem thêm bài viết</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Tìm kiếm</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nhập từ khóa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Tags phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-orange-100"
                      onClick={() => setSearchTerm(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {categories.filter(cat => cat.id !== "all").map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Bài viết mới nhất</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          <Link href={`/customer/blog/${post.id}`} className="hover:text-orange-600">
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Đăng ký nhận tin</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nhận những bài viết mới nhất về ẩm thực
                </p>
                <div className="space-y-2">
                  <Input placeholder="Email của bạn" />
                  <Button className="w-full">Đăng ký</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
