"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings2,
  Building,
  CreditCard,
  Bell,
  Shield,
  Save,
  Upload,
  Clock,
  Users
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ManagerSettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="h-8 w-8" />
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">
            Cấu hình các thiết lập cho nhà hàng
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Thông tin nhà hàng
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cơ bản về nhà hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Tên nhà hàng</Label>
              <Input id="restaurant-name" placeholder="Nhà hàng Waddles" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-description">Mô tả</Label>
              <Textarea id="restaurant-description" placeholder="Nhà hàng phục vụ các món ăn truyền thống Việt Nam..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-address">Địa chỉ</Label>
              <Input id="restaurant-address" placeholder="123 Đường ABC, Quận 1, TP.HCM" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-phone">Số điện thoại</Label>
                <Input id="restaurant-phone" placeholder="028 1234 5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-email">Email</Label>
                <Input id="restaurant-email" placeholder="info@restaurant.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-website">Website</Label>
              <Input id="restaurant-website" placeholder="https://restaurant.com" />
            </div>
            <div className="space-y-2">
              <Label>Logo nhà hàng</Label>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Tải lên logo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Giờ hoạt động
            </CardTitle>
            <CardDescription>
              Thiết lập giờ mở cửa và đóng cửa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { day: "Thứ 2", open: "09:00", close: "22:00" },
              { day: "Thứ 3", open: "09:00", close: "22:00" },
              { day: "Thứ 4", open: "09:00", close: "22:00" },
              { day: "Thứ 5", open: "09:00", close: "22:00" },
              { day: "Thứ 6", open: "09:00", close: "23:00" },
              { day: "Thứ 7", open: "08:00", close: "23:00" },
              { day: "Chủ nhật", open: "08:00", close: "22:00" }
            ].map((schedule) => (
              <div key={schedule.day} className="flex items-center justify-between">
                <div className="w-20">
                  <Label>{schedule.day}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    type="time" 
                    value={schedule.open}
                    className="w-24" 
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input 
                    type="time" 
                    value={schedule.close}
                    className="w-24" 
                  />
                  <Switch defaultChecked />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cài đặt thanh toán
            </CardTitle>
            <CardDescription>
              Cấu hình phương thức thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tiền mặt</Label>
                  <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thẻ tín dụng/ghi nợ</Label>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ví điện tử</Label>
                  <p className="text-sm text-muted-foreground">MoMo, ZaloPay, ShopeePay</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chuyển khoản</Label>
                  <p className="text-sm text-muted-foreground">Chuyển khoản ngân hàng</p>
                </div>
                <Switch />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Thuế VAT (%)</Label>
              <Input id="tax-rate" type="number" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-charge">Phí dịch vụ (%)</Label>
              <Input id="service-charge" type="number" placeholder="5" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Cài đặt thông báo
            </CardTitle>
            <CardDescription>
              Quản lý thông báo và cảnh báo hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Đơn hàng mới</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi có đơn hàng mới</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hết hàng</Label>
                  <p className="text-sm text-muted-foreground">Cảnh báo khi món ăn hết hàng</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Đặt bàn</Label>
                  <p className="text-sm text-muted-foreground">Thông báo đặt bàn mới</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Phản hồi khách hàng</Label>
                  <p className="text-sm text-muted-foreground">Thông báo phản hồi mới</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Báo cáo hàng ngày</Label>
                  <p className="text-sm text-muted-foreground">Gửi báo cáo cuối ngày</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="notification-email">Email nhận thông báo</Label>
              <Input id="notification-email" placeholder="manager@restaurant.com" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Cài đặt bảo mật
            </CardTitle>
            <CardDescription>
              Thiết lập bảo mật và quyền truy cập
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực 2 lớp</Label>
                  <p className="text-sm text-muted-foreground">Bảo mật tài khoản với OTP</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Đăng xuất tự động</Label>
                  <p className="text-sm text-muted-foreground">Đăng xuất sau thời gian không hoạt động</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ghi log hoạt động</Label>
                  <p className="text-sm text-muted-foreground">Lưu lại nhật ký hoạt động</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Thời gian đăng xuất tự động (phút)</Label>
              <Input id="session-timeout" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-policy">Chính sách mật khẩu</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label className="text-sm">Tối thiểu 8 ký tự</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label className="text-sm">Bao gồm chữ hoa và chữ thường</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label className="text-sm">Bao gồm số và ký tự đặc biệt</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quản lý nhân viên
            </CardTitle>
            <CardDescription>
              Cài đặt cho nhân viên và ca làm việc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chấm công tự động</Label>
                  <p className="text-sm text-muted-foreground">Tự động tính thời gian làm việc</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo ca làm việc</Label>
                  <p className="text-sm text-muted-foreground">Nhắc nhở lịch làm việc</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép đổi ca</Label>
                  <p className="text-sm text-muted-foreground">Nhân viên có thể đổi ca với nhau</p>
                </div>
                <Switch />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="break-time">Thời gian nghỉ (phút)</Label>
                <Input id="break-time" type="number" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtime-rate">Hệ số làm thêm giờ</Label>
                <Input id="overtime-rate" type="number" step="0.1" placeholder="1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
