"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  Calendar,
  Star,
  Phone,
  Mail
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StaffPage() {
  const staff = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@restaurant.com",
      phone: "0123456789",
      position: "Bếp trưởng",
      department: "Bếp",
      status: "active",
      startDate: "2023-01-15",
      rating: 4.8,
      avatar: "/avatars/staff1.jpg",
      salary: 15000000,
      workHours: "6:00 - 14:00"
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@restaurant.com", 
      phone: "0987654321",
      position: "Thu ngân",
      department: "Phục vụ",
      status: "active",
      startDate: "2023-03-20",
      rating: 4.6,
      avatar: "/avatars/staff2.jpg",
      salary: 8000000,
      workHours: "9:00 - 17:00"
    },
    {
      id: 3,
      name: "Lê Minh Công",
      email: "cong.le@restaurant.com",
      phone: "0369852147",
      position: "Phục vụ chính",
      department: "Phục vụ",
      status: "active",
      startDate: "2023-06-10",
      rating: 4.5,
      avatar: "/avatars/staff3.jpg",
      salary: 7000000,
      workHours: "11:00 - 19:00"
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@restaurant.com",
      phone: "0741258963",
      position: "Phó bếp",
      department: "Bếp",
      status: "leave",
      startDate: "2022-11-05",
      rating: 4.7,
      avatar: "/avatars/staff4.jpg",
      salary: 10000000,
      workHours: "14:00 - 22:00"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đang làm việc</Badge>
      case "leave":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Nghỉ phép</Badge>
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Tạm nghỉ</Badge>
      case "terminated":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Đã nghỉ việc</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Bếp":
        return "bg-orange-100 text-orange-800"
      case "Phục vụ":
        return "bg-blue-100 text-blue-800"
      case "Quản lý":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Quản lý nhân viên
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin nhân viên và lịch làm việc
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhân viên mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm nhân viên..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo bộ phận
        </Button>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Xem lịch làm việc
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +2 nhân viên mới tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang làm việc</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              89% tổng số nhân viên
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              Trên thang điểm 5
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lương trung bình</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2M</div>
            <p className="text-xs text-muted-foreground">
              VNĐ mỗi tháng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết từng nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getDepartmentColor(employee.department)}>
                        {employee.department}
                      </Badge>
                      {getStatusBadge(employee.status)}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {employee.rating}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ca làm việc</p>
                    <p className="font-medium text-sm">{employee.workHours}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Lương</p>
                    <p className="font-medium">{(employee.salary / 1000000).toFixed(1)}M VNĐ</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="text-xs">{employee.phone}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Mail className="h-3 w-3 mr-1" />
                      <span className="text-xs">Email</span>
                    </Button>
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
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa thông tin
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Xem lịch làm việc
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        Chấm công
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
