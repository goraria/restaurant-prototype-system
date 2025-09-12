import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Mail, Phone, MapPin, Camera, Star, TrendingUp } from "lucide-react"

export default function StaffProfilePage() {
  const staffInfo = {
    id: "EMP001",
    name: "Nguyễn Văn Nam",
    email: "nam.nguyen@waddles.com",
    phone: "+84 987 654 321",
    position: "Nhân viên phục vụ",
    department: "Dịch vụ khách hàng",
    joinDate: "2024-01-15",
    avatar: "/avatars/staff-nam.jpg",
    status: "active",
    shift: "morning"
  }

  const workSchedule = [
    { day: "Thứ 2", shift: "Sáng", time: "06:00 - 14:00", status: "scheduled" },
    { day: "Thứ 3", shift: "Sáng", time: "06:00 - 14:00", status: "scheduled" },
    { day: "Thứ 4", shift: "Nghỉ", time: "-", status: "off" },
    { day: "Thứ 5", shift: "Chiều", time: "14:00 - 22:00", status: "scheduled" },
    { day: "Thứ 6", shift: "Chiều", time: "14:00 - 22:00", status: "scheduled" },
    { day: "Thứ 7", shift: "Sáng", time: "06:00 - 14:00", status: "scheduled" },
    { day: "Chủ nhật", shift: "Nghỉ", time: "-", status: "off" },
  ]

  const performanceStats = [
    { label: "Đơn hàng phục vụ", value: "1,234", period: "Tháng này", trend: "+12%" },
    { label: "Đánh giá trung bình", value: "4.8", period: "5 sao", trend: "+0.2" },
    { label: "Giờ làm việc", value: "165h", period: "Tháng này", trend: "+8h" },
    { label: "Khách hàng hài lòng", value: "96%", period: "Tháng này", trend: "+2%" },
  ]

  const recentFeedback = [
    { date: "2025-08-20", customer: "Trần Thị A", rating: 5, comment: "Phục vụ rất tận tình và chu đáo" },
    { date: "2025-08-18", customer: "Lê Văn B", rating: 5, comment: "Nhân viên rất nhiệt tình" },
    { date: "2025-08-15", customer: "Nguyễn Thị C", rating: 4, comment: "Dịch vụ tốt, sẽ quay lại" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Hồ sơ nhân viên</h2>
          <p className="text-muted-foreground">
            Thông tin cá nhân và hiệu suất làm việc
          </p>
        </div>
        <Button variant="outline">
          <Camera className="h-4 w-4 mr-2" />
          Cập nhật ảnh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={staffInfo.avatar} alt={staffInfo.name} />
                <AvatarFallback className="text-2xl">
                  {staffInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-xl">{staffInfo.name}</CardTitle>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">{staffInfo.position}</Badge>
                  <Badge variant={staffInfo.status === 'active' ? 'default' : 'secondary'}>
                    {staffInfo.status === 'active' ? 'Đang làm việc' : 'Nghỉ phép'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>ID: {staffInfo.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{staffInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{staffInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{staffInfo.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Từ {new Date(staffInfo.joinDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất làm việc</CardTitle>
              <CardDescription>Thống kê tháng này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">{stat.trend}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.period}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
              <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin liên hệ và hồ sơ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input id="fullName" defaultValue={staffInfo.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={staffInfo.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" defaultValue={staffInfo.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Vị trí</Label>
                      <Input id="position" defaultValue={staffInfo.position} readOnly />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Hủy</Button>
                    <Button>Lưu thay đổi</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch làm việc tuần này</CardTitle>
                  <CardDescription>
                    Xem lịch trình và ca làm việc được phân công
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workSchedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{schedule.day}</p>
                            <p className="text-sm text-muted-foreground">{schedule.shift}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{schedule.time}</p>
                          <Badge variant={schedule.status === 'off' ? 'secondary' : 'outline'}>
                            {schedule.status === 'off' ? 'Nghỉ' : 'Làm việc'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá từ khách hàng</CardTitle>
                  <CardDescription>
                    Phản hồi và đánh giá gần đây
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFeedback.map((feedback, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{feedback.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(feedback.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý mật khẩu và tùy chọn thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Đổi mật khẩu</h4>
                      <div className="space-y-2">
                        <Input type="password" placeholder="Mật khẩu hiện tại" />
                        <Input type="password" placeholder="Mật khẩu mới" />
                        <Input type="password" placeholder="Xác nhận mật khẩu mới" />
                      </div>
                      <Button className="mt-2">Cập nhật mật khẩu</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Tùy chọn thông báo</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Thông báo ca làm việc mới</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Thông báo đánh giá từ khách hàng</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Thông báo qua email</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
