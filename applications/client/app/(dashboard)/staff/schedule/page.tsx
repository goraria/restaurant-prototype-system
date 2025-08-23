import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Plus, Filter, Download } from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'shift' | 'meeting' | 'training' | 'break'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  location?: string
  participants?: string[]
}

export default function StaffSchedulePage() {

  const currentWeekSchedule: ScheduleEvent[] = [
    {
      id: "1",
      title: "Ca sáng - Phục vụ",
      date: "2025-01-20",
      startTime: "06:00",
      endTime: "14:00",
      type: "shift",
      status: "scheduled",
      location: "Khu vực A"
    },
    {
      id: "2", 
      title: "Họp nhóm tuần",
      date: "2025-01-20",
      startTime: "15:00",
      endTime: "16:00",
      type: "meeting",
      status: "confirmed",
      location: "Phòng họp",
      participants: ["Quản lý", "Nhóm phục vụ"]
    },
    {
      id: "3",
      title: "Ca sáng - Phục vụ",
      date: "2025-01-21",
      startTime: "06:00",
      endTime: "14:00", 
      type: "shift",
      status: "scheduled",
      location: "Khu vực B"
    },
    {
      id: "4",
      title: "Đào tạo dịch vụ khách hàng",
      date: "2025-01-22",
      startTime: "09:00",
      endTime: "11:00",
      type: "training",
      status: "scheduled",
      location: "Phòng đào tạo"
    },
    {
      id: "5",
      title: "Ca chiều - Phục vụ",
      date: "2025-01-23",
      startTime: "14:00",
      endTime: "22:00",
      type: "shift",
      status: "scheduled",
      location: "Khu vực A"
    }
  ]

  const upcomingShifts = currentWeekSchedule.filter(event => 
    event.type === 'shift' && new Date(event.date) >= new Date()
  )

  const totalHoursThisWeek = currentWeekSchedule
    .filter(event => event.type === 'shift')
    .reduce((total, shift) => {
      const start = new Date(`2000-01-01 ${shift.startTime}`)
      const end = new Date(`2000-01-01 ${shift.endTime}`)
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'shift': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200'
      case 'training': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge variant="outline">Đã lên lịch</Badge>
      case 'confirmed': return <Badge variant="default">Đã xác nhận</Badge>
      case 'completed': return <Badge variant="secondary">Hoàn thành</Badge>
      case 'cancelled': return <Badge variant="destructive">Đã hủy</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const getWeekDates = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Lịch làm việc</h2>
          <p className="text-muted-foreground">
            Quản lý ca làm việc và sự kiện
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất lịch
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Yêu cầu nghỉ phép
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tổng giờ tuần này</p>
                <p className="text-2xl font-bold">{totalHoursThisWeek}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Ca sắp tới</p>
                <p className="text-2xl font-bold">{upcomingShifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Cuộc họp</p>
                <p className="text-2xl font-bold">
                  {currentWeekSchedule.filter(e => e.type === 'meeting').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Đào tạo</p>
                <p className="text-2xl font-bold">
                  {currentWeekSchedule.filter(e => e.type === 'training').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week" className="space-y-4">
        <TabsList>
          <TabsTrigger value="week">Tuần</TabsTrigger>
          <TabsTrigger value="month">Tháng</TabsTrigger>
          <TabsTrigger value="list">Danh sách</TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Lịch tuần này</CardTitle>
              <CardDescription>
                {getWeekDates()[0].toLocaleDateString('vi-VN')} - {getWeekDates()[6].toLocaleDateString('vi-VN')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {getWeekDates().map((date, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-center">
                      <p className="text-sm font-medium">{weekDays[index]}</p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                    </div>
                    <div className="space-y-1">
                      {currentWeekSchedule
                        .filter(event => event.date === date.toISOString().split('T')[0])
                        .map(event => (
                          <div
                            key={event.id}
                            className={`p-2 rounded-md text-xs border ${getEventTypeColor(event.type)}`}
                          >
                            <p className="font-medium">{event.startTime}</p>
                            <p className="truncate">{event.title}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle>Lịch tháng</CardTitle>
              <CardDescription>
                Xem tổng quan lịch làm việc cả tháng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Chế độ xem tháng đang được phát triển</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sự kiện</CardTitle>
              <CardDescription>
                Tất cả lịch trình và sự kiện sắp tới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWeekSchedule.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-md ${getEventTypeColor(event.type)}`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('vi-VN')} • {event.startTime} - {event.endTime}
                        </p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
