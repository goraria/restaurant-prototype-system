"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChefHat,
  Clock,
  DollarSign,
  Users2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RecipesPage() {
  const recipes = [
    {
      id: 1,
      name: "Phở bò Hà Nội",
      category: "Món chính",
      difficulty: "medium",
      cookTime: "4 giờ",
      servings: 4,
      cost: 45000,
      status: "published",
      description: "Công thức phở bò truyền thống Hà Nội với nước dùng trong suốt",
      ingredients: 15
    },
    {
      id: 2,
      name: "Bánh cuốn",
      category: "Món sáng",
      difficulty: "hard",
      cookTime: "2 giờ",
      servings: 6,
      cost: 25000,
      status: "published",
      description: "Bánh cuốn tôm thịt với nước mắm pha chua ngọt",
      ingredients: 12
    },
    {
      id: 3,
      name: "Chả cá Lã Vọng",
      category: "Món chính",
      difficulty: "medium",
      cookTime: "1.5 giờ",
      servings: 4,
      cost: 80000,
      status: "draft",
      description: "Chả cá thơm lừng với tinh nghệ và thì là",
      ingredients: 10
    },
    {
      id: 4,
      name: "Cà phê sữa đá",
      category: "Đồ uống",
      difficulty: "easy",
      cookTime: "5 phút",
      servings: 1,
      cost: 8000,
      status: "published",
      description: "Cà phê sữa đá truyền thống Việt Nam",
      ingredients: 3
    }
  ]

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Dễ</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "hard":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Khó</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đã xuất bản</Badge>
      case "draft":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Bản nháp</Badge>
      case "archived":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Lưu trữ</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ChefHat className="h-8 w-8" />
            Quản lý công thức
          </h1>
          <p className="text-muted-foreground">
            Lưu trữ và quản lý công thức nấu ăn chi tiết
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm công thức mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm công thức..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo danh mục
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công thức</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">
              +8 công thức mới tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-muted-foreground">
              83% tổng số công thức
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi phí trung bình</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35.000đ</div>
            <p className="text-xs text-muted-foreground">
              Mỗi suất ăn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 phút</div>
            <p className="text-xs text-muted-foreground">
              Thời gian chế biến
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recipes List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách công thức</CardTitle>
          <CardDescription>
            Quản lý công thức nấu ăn và quy trình chế biến
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{recipe.category}</Badge>
                      {getDifficultyBadge(recipe.difficulty)}
                      {getStatusBadge(recipe.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.cookTime}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Phục vụ</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users2 className="h-3 w-3" />
                      {recipe.servings} người
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Chi phí</p>
                    <p className="font-medium">{recipe.cost.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem công thức
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Tính chi phí
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
