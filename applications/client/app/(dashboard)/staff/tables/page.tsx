import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, QrCode, CheckCircle, AlertCircle, Utensils } from "lucide-react"

export default function StaffTablesPage() {
  const tables = [
    {
      number: "01",
      capacity: 2,
      status: "available",
      customer: null,
      orderTime: null,
      totalAmount: 0,
      waitTime: null,
      section: "A"
    },
    {
      number: "02", 
      capacity: 4,
      status: "occupied",
      customer: "Nguyễn Văn A",
      orderTime: "14:30",
      totalAmount: 350000,
      waitTime: "45 phút",
      section: "A"
    },
    {
      number: "03",
      capacity: 4,
      status: "reserved",
      customer: "Trần Thị B",
      orderTime: "15:00",
      totalAmount: 0,
      waitTime: null,
      section: "A"
    },
    {
      number: "04",
      capacity: 6,
      status: "cleaning",
      customer: null,
      orderTime: null,
      totalAmount: 0,
      waitTime: "5 phút",
      section: "A"
    },
    {
      number: "05",
      capacity: 2,
      status: "occupied",
      customer: "Lê Văn C",
      orderTime: "14:15",
      totalAmount: 180000,
      waitTime: "1 giờ",
      section: "B"
    },
    {
      number: "06",
      capacity: 4,
      status: "available",
      customer: null,
      orderTime: null,
      totalAmount: 0,
      waitTime: null,
      section: "B"
    },
    {
      number: "07",
      capacity: 8,
      status: "reserved",
      customer: "Phạm Thị D",
      orderTime: "16:30",
      totalAmount: 0,
      waitTime: null,
      section: "B"
    },
    {
      number: "08",
      capacity: 2,
      status: "occupied",
      customer: "Hoàng Văn E",
      orderTime: "14:45",
      totalAmount: 120000,
      waitTime: "30 phút",
      section: "B"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'outline'
      case 'occupied': return 'destructive'
      case 'reserved': return 'secondary'
      case 'cleaning': return 'default'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Trống'
      case 'occupied': return 'Có khách'
      case 'reserved': return 'Đã đặt'
      case 'cleaning': return 'Đang dọn'
      default: return status
    }
  }

  const sectionA = tables.filter(table => table.section === "A")
  const sectionB = tables.filter(table => table.section === "B")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Quản lý bàn</h2>
          <p className="text-muted-foreground">
            Xem tình trạng và quản lý các bàn trong nhà hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Khu vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="A">Khu vực A</SelectItem>
              <SelectItem value="B">Khu vực B</SelectItem>
            </SelectContent>
          </Select>
          <Button>Làm mới</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Bàn trống</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Có khách</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Đã đặt</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'reserved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Đang dọn</p>
                <p className="text-2xl font-bold">
                  {tables.filter(t => t.status === 'cleaning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section A */}
      <Card>
        <CardHeader>
          <CardTitle>Khu vực A - Tầng trệt</CardTitle>
          <CardDescription>
            Khu vực chính với {sectionA.length} bàn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {sectionA.map((table) => {
              return (
                <Card key={table.number} className={`${table.status === 'occupied' ? 'border-red-200 bg-red-50/50' : table.status === 'reserved' ? 'border-yellow-200 bg-yellow-50/50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Bàn {table.number}</CardTitle>
                      <Badge variant={getStatusColor(table.status)}>
                        {getStatusText(table.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{table.capacity} chỗ ngồi</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {table.status === 'occupied' && (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium">{table.customer}</p>
                          <p className="text-muted-foreground">
                            Từ {table.orderTime} ({table.waitTime})
                          </p>
                          <p className="font-medium text-green-600">
                            {table.totalAmount.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Utensils className="h-4 w-4 mr-1" />
                            Gọi món
                          </Button>
                          <Button size="sm" className="flex-1">
                            Thanh toán
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {table.status === 'reserved' && (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium">{table.customer}</p>
                          <p className="text-muted-foreground">
                            Đặt lúc {table.orderTime}
                          </p>
                        </div>
                        <Button size="sm" className="w-full">
                          Check-in khách
                        </Button>
                      </div>
                    )}
                    
                    {table.status === 'cleaning' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Đang dọn dẹp, còn khoảng {table.waitTime}
                        </p>
                        <Button size="sm" className="w-full">
                          Hoàn thành dọn bàn
                        </Button>
                      </div>
                    )}
                    
                    {table.status === 'available' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Sẵn sàng phục vụ khách
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                          <Button size="sm" className="flex-1">
                            Nhận khách
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section B */}
      <Card>
        <CardHeader>
          <CardTitle>Khu vực B - Tầng 2</CardTitle>
          <CardDescription>
            Khu vực VIP với {sectionB.length} bàn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {sectionB.map((table) => {
              return (
                <Card key={table.number} className={`${table.status === 'occupied' ? 'border-red-200 bg-red-50/50' : table.status === 'reserved' ? 'border-yellow-200 bg-yellow-50/50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Bàn {table.number}</CardTitle>
                      <Badge variant={getStatusColor(table.status)}>
                        {getStatusText(table.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{table.capacity} chỗ ngồi</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {table.status === 'occupied' && (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium">{table.customer}</p>
                          <p className="text-muted-foreground">
                            Từ {table.orderTime} ({table.waitTime})
                          </p>
                          <p className="font-medium text-green-600">
                            {table.totalAmount.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Utensils className="h-4 w-4 mr-1" />
                            Gọi món
                          </Button>
                          <Button size="sm" className="flex-1">
                            Thanh toán
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {table.status === 'reserved' && (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium">{table.customer}</p>
                          <p className="text-muted-foreground">
                            Đặt lúc {table.orderTime}
                          </p>
                        </div>
                        <Button size="sm" className="w-full">
                          Check-in khách
                        </Button>
                      </div>
                    )}
                    
                    {table.status === 'available' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Sẵn sàng phục vụ khách
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                          <Button size="sm" className="flex-1">
                            Nhận khách
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
