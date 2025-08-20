'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Clock,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Copy,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for menu schedules
const mockSchedules = [
  {
    id: '1',
    menu_id: '1',
    menu_name: 'Thực đơn sáng',
    day_of_week: 'monday',
    start_time: '06:00',
    end_time: '10:30',
    is_active: true,
    priority: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    menu_id: '2',
    menu_name: 'Thực đơn trưa',
    day_of_week: 'monday',
    start_time: '11:00',
    end_time: '14:00',
    is_active: true,
    priority: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    menu_id: '3',
    menu_name: 'Thực đơn tối',
    day_of_week: 'monday',
    start_time: '17:00',
    end_time: '22:00',
    is_active: true,
    priority: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    menu_id: '1',
    menu_name: 'Thực đơn sáng',
    day_of_week: 'saturday',
    start_time: '07:00',
    end_time: '11:00',
    is_active: true,
    priority: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    menu_id: '4',
    menu_name: 'Thực đơn cuối tuần',
    day_of_week: 'saturday',
    start_time: '11:30',
    end_time: '23:00',
    is_active: true,
    priority: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '6',
    menu_id: '5',
    menu_name: 'Thực đơn đặc biệt chủ nhật',
    day_of_week: 'sunday',
    start_time: '10:00',
    end_time: '21:30',
    is_active: false,
    priority: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

const daysOfWeek = [
  { value: 'monday', label: 'Thứ Hai' },
  { value: 'tuesday', label: 'Thứ Ba' },
  { value: 'wednesday', label: 'Thứ Tư' },
  { value: 'thursday', label: 'Thứ Năm' },
  { value: 'friday', label: 'Thứ Sáu' },
  { value: 'saturday', label: 'Thứ Bảy' },
  { value: 'sunday', label: 'Chủ Nhật' }
];

const availableMenus = [
  { id: '1', name: 'Thực đơn sáng' },
  { id: '2', name: 'Thực đơn trưa' },
  { id: '3', name: 'Thực đơn tối' },
  { id: '4', name: 'Thực đơn cuối tuần' },
  { id: '5', name: 'Thực đơn đặc biệt chủ nhật' }
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    menu_id: '',
    day_of_week: 'monday',
    start_time: '',
    end_time: '',
    is_active: true,
    priority: 1
  });

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.menu_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'all' || schedule.day_of_week === selectedDay;
    return matchesSearch && matchesDay;
  });

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 11) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (hour >= 11 && hour < 17) return <Sun className="w-4 h-4 text-orange-500" />;
    if (hour >= 17 && hour < 22) return <Sunset className="w-4 h-4 text-orange-600" />;
    return <Moon className="w-4 h-4 text-blue-500" />;
  };

  const getScheduleStats = () => {
    const active = schedules.filter(s => s.is_active).length;
    const inactive = schedules.filter(s => !s.is_active).length;
    const totalHours = schedules.reduce((sum, s) => {
      if (!s.is_active) return sum;
      const start = new Date(`2024-01-01T${s.start_time}:00`);
      const end = new Date(`2024-01-01T${s.end_time}:00`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    
    return { active, inactive, totalHours };
  };

  const handleCreate = () => {
    // TODO: Implement API call to create schedule
    const newSchedule = {
      id: Date.now().toString(),
      ...formData,
      menu_name: availableMenus.find(m => m.id === formData.menu_id)?.name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSchedules([...schedules, newSchedule]);
    toast.success('Lịch trình đã được tạo thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    // TODO: Implement API call to update schedule
    setSchedules(schedules.map(schedule => 
      schedule.id === editingSchedule.id 
        ? { 
            ...schedule, 
            ...formData, 
            menu_name: availableMenus.find(m => m.id === formData.menu_id)?.name || schedule.menu_name,
            updated_at: new Date().toISOString() 
          }
        : schedule
    ));
    toast.success('Lịch trình đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement API call to delete schedule
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success('Lịch trình đã được xóa thành công!');
  };

  const handleToggleActive = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, is_active: !schedule.is_active, updated_at: new Date().toISOString() }
        : schedule
    ));
    toast.success('Trạng thái lịch trình đã được cập nhật!');
  };

  const handleDuplicate = (schedule: any) => {
    const duplicatedSchedule = {
      ...schedule,
      id: Date.now().toString(),
      day_of_week: schedule.day_of_week === 'sunday' ? 'monday' : 
                   daysOfWeek[daysOfWeek.findIndex(d => d.value === schedule.day_of_week) + 1]?.value || 'monday',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSchedules([...schedules, duplicatedSchedule]);
    toast.success('Lịch trình đã được sao chép thành công!');
  };

  const resetForm = () => {
    setFormData({
      menu_id: '',
      day_of_week: 'monday',
      start_time: '',
      end_time: '',
      is_active: true,
      priority: 1
    });
    setEditingSchedule(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      menu_id: schedule.menu_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_active: schedule.is_active,
      priority: schedule.priority
    });
    setIsDialogOpen(true);
  };

  const getDayLabel = (day: string) => {
    return daysOfWeek.find(d => d.value === day)?.label || day;
  };

  const stats = getScheduleStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch trình thực đơn</h1>
          <p className="text-muted-foreground">
            Quản lý thời gian phục vụ thực đơn theo ngày trong tuần
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm lịch trình
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule 
                  ? 'Cập nhật thời gian phục vụ thực đơn'
                  : 'Thiết lập thời gian phục vụ thực đơn mới'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="menu_id" className="text-right">
                  Thực đơn
                </Label>
                <Select value={formData.menu_id} onValueChange={(value) => setFormData({...formData, menu_id: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn thực đơn" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMenus.map(menu => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day_of_week" className="text-right">
                  Ngày trong tuần
                </Label>
                <Select value={formData.day_of_week} onValueChange={(value) => setFormData({...formData, day_of_week: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_time" className="text-right">
                  Giờ bắt đầu
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_time" className="text-right">
                  Giờ kết thúc
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Ưu tiên
                </Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Kích hoạt
                </Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingSchedule ? handleUpdate : handleCreate}>
                {editingSchedule ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lịch trình
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Lịch trình trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / schedules.length) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tạm dừng
            </CardTitle>
            <Pause className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Lịch trình không hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giờ phục vụ
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Giờ phục vụ hàng ngày
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch trình phục vụ
          </CardTitle>
          <CardDescription>
            Quản lý thời gian phục vụ các thực đơn theo ngày trong tuần
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên thực đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngày</SelectItem>
                {daysOfWeek.map(day => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thực đơn</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian phục vụ</TableHead>
                <TableHead className="text-center">Ưu tiên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{schedule.menu_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {schedule.menu_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDayLabel(schedule.day_of_week)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTimeIcon(schedule.start_time)}
                      <span className="font-mono text-sm">
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const start = new Date(`2024-01-01T${schedule.start_time}:00`);
                        const end = new Date(`2024-01-01T${schedule.end_time}:00`);
                        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        return `${hours.toFixed(1)} giờ`;
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={schedule.priority <= 3 ? 'default' : 'secondary'}>
                      {schedule.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                        {schedule.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(schedule.id)}
                        className="h-6 w-6 p-0"
                      >
                        {schedule.is_active ? 
                          <Pause className="h-3 w-3" /> : 
                          <Play className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(schedule.updated_at).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(schedule)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(schedule)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(schedule.id)}>
                          {schedule.is_active ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Tạm dừng
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(schedule.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
