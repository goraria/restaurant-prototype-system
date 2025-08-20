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
  MessageSquare,
  Star,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SupportTicket {
  id: number
  ticketNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  subject: string
  message: string
  category: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  rating?: number
  assignedTo?: string
  avatar?: string
}

export default function SupportPage() {
  const tickets: SupportTicket[] = [
    {
      id: 1,
      ticketNumber: "SUP-2024-001",
      customerName: "Nguyễn Thị Hoa",
      customerEmail: "hoa.nguyen@email.com",
      customerPhone: "0123456789",
      subject: "Đồ ăn bị lạnh",
      message: "Phở bò của tôi được phục vụ ở nhiệt độ không đủ nóng...",
      category: "Chất lượng món ăn",
      priority: "high",
      status: "in_progress",
      createdAt: "2024-12-20 14:30",
      updatedAt: "2024-12-20 14:45",
      assignedTo: "Trần Văn Nam",
      avatar: "/avatars/customer1.jpg"
    },
    {
      id: 2,
      ticketNumber: "SUP-2024-002",
      customerName: "Lê Minh Tuấn",
      customerEmail: "tuan.le@email.com",
      customerPhone: "0987654321",
      subject: "Thời gian chờ quá lâu",
      message: "Tôi đã đợi món ăn hơn 45 phút...",
      category: "Thời gian phục vụ",
      priority: "medium",
      status: "resolved",
      createdAt: "2024-12-20 13:15",
      updatedAt: "2024-12-20 14:00",
      rating: 4,
      assignedTo: "Phạm Thị Lan",
      avatar: "/avatars/customer2.jpg"
    },
    {
      id: 3,
      ticketNumber: "SUP-2024-003",
      customerName: "Trần Văn Nam",
      customerEmail: "nam.tran@email.com",
      customerPhone: "0369852147",
      subject: "Nhân viên không thân thiện",
      message: "Nhân viên phục vụ có thái độ không tốt khi tôi yêu cầu...",
      category: "Thái độ phục vụ",
      priority: "high",
      status: "new",
      createdAt: "2024-12-20 15:00",
      updatedAt: "2024-12-20 15:00",
      avatar: "/avatars/customer3.jpg"
    },
    {
      id: 4,
      ticketNumber: "SUP-2024-004",
      customerName: "Phạm Thị Dung",
      customerEmail: "dung.pham@email.com",
      customerPhone: "0741258963",
      subject: "Tính tiền sai",
      message: "Hóa đơn của tôi có vẻ không chính xác...",
      category: "Thanh toán",
      priority: "low",
      status: "closed",
      createdAt: "2024-12-19 19:30",
      updatedAt: "2024-12-20 09:00",
      rating: 5,
      assignedTo: "Nguyễn Văn An",
      avatar: "/avatars/customer4.jpg"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Mới</Badge>
      case "in_progress":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
      case "resolved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đã giải quyết</Badge>
      case "closed":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Đã đóng</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "low":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Thấp</Badge>
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'fill-current text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Hỗ trợ khách hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý phản hồi và hỗ trợ khách hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat trực tiếp
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo ticket mới
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm ticket..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc theo trạng thái
        </Button>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Hôm nay
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket hôm nay</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 so với hôm qua
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Cần theo dõi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3</div>
            <p className="text-xs text-muted-foreground">
              Trên thang điểm 5
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ giải quyết</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Trong ngày
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ticket hỗ trợ</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các yêu cầu hỗ trợ từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={ticket.avatar} alt={ticket.customerName} />
                    <AvatarFallback>{ticket.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{ticket.ticketNumber}</h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      {ticket.rating && renderStars(ticket.rating)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Từ: {ticket.customerName} • {ticket.category}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Tạo: {ticket.createdAt}</span>
                      <span>Cập nhật: {ticket.updatedAt}</span>
                      {ticket.assignedTo && (
                        <span>Phụ trách: {ticket.assignedTo}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="text-xs">{ticket.customerPhone}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Mail className="h-3 w-3 mr-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {ticket.status === "new" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tiếp nhận
                      </Button>
                    )}
                    {ticket.status === "in_progress" && (
                      <Button size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Giải quyết
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat
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
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Gửi tin nhắn
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Đóng ticket
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
