'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Timer,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Coffee,
  Moon,
  Sun,
  Sunset,
  Copy,
  RotateCcw,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Schedule {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_position: string;
  date: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day';
  start_time: string;
  end_time: string;
  break_duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'no_show' | 'absent';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Mock data cho lịch làm việc
const mockSchedules: Schedule[] = [
  {
    id: '1',
    staff_id: 'EMP001',
    staff_name: 'Nguyễn Văn An',
    staff_position: 'Đầu bếp trưởng',
    date: '2024-01-26',
    shift_type: 'morning',
    start_time: '06:00',
    end_time: '14:00',
    break_duration: 60,
    status: 'confirmed',
    notes: 'Ca sáng chính, phụ trách menu đặc biệt',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-25T08:00:00Z'
  },
  {
    id: '2',
    staff_id: 'EMP002',
    staff_name: 'Trần Thị Mai',
    staff_position: 'Quản lý ca',
    date: '2024-01-26',
    shift_type: 'afternoon',
    start_time: '14:00',
    end_time: '22:00',
    break_duration: 45,
    status: 'scheduled',
    notes: 'Quản lý ca chiều, kiểm tra chất lượng phục vụ',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    staff_id: 'EMP003',
    staff_name: 'Lê Hoàng Nam',
    staff_position: 'Thu ngân',
    date: '2024-01-26',
    shift_type: 'full_day',
    start_time: '08:00',
    end_time: '20:00',
    break_duration: 90,
    status: 'confirmed',
    notes: 'Ca trực ngày, nghỉ giữa ca 2 tiếng',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-24T15:00:00Z'
  },
  {
    id: '4',
    staff_id: 'EMP004',
    staff_name: 'Phạm Minh Tuấn',
    staff_position: 'Bồi bàn',
    date: '2024-01-26',
    shift_type: 'evening',
    start_time: '18:00',
    end_time: '02:00',
    break_duration: 30,
    status: 'absent',
    notes: 'Nghỉ ốm có giấy bác sĩ',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-26T08:00:00Z'
  },
  {
    id: '5',
    staff_id: 'EMP005',
    staff_name: 'Vũ Thành Long',
    staff_position: 'Bảo vệ',
    date: '2024-01-26',
    shift_type: 'night',
    start_time: '22:00',
    end_time: '06:00',
    break_duration: 60,
    status: 'scheduled',
    notes: 'Ca đêm bảo vệ, tuần tra định kỳ',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '6',
    staff_id: 'EMP001',
    staff_name: 'Nguyễn Văn An',
    staff_position: 'Đầu bếp trưởng',
    date: '2024-01-27',
    shift_type: 'morning',
    start_time: '06:00',
    end_time: '14:00',
    break_duration: 60,
    status: 'scheduled',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  }
];

const mockStaff = [
  { id: 'EMP001', name: 'Nguyễn Văn An', position: 'Đầu bếp trưởng' },
  { id: 'EMP002', name: 'Trần Thị Mai', position: 'Quản lý ca' },
  { id: 'EMP003', name: 'Lê Hoàng Nam', position: 'Thu ngân' },
  { id: 'EMP004', name: 'Phạm Minh Tuấn', position: 'Bồi bàn' },
  { id: 'EMP005', name: 'Vũ Thành Long', position: 'Bảo vệ' },
  { id: 'EMP006', name: 'Hoàng Thị Linh', position: 'Kế toán' }
];

const shiftTypes = [
  { value: 'morning', label: 'Ca sáng', icon: Sun, color: 'text-yellow-600' },
  { value: 'afternoon', label: 'Ca chiều', icon: Sunset, color: 'text-orange-600' },
  { value: 'evening', label: 'Ca tối', icon: Moon, color: 'text-blue-600' },
  { value: 'night', label: 'Ca đêm', icon: Moon, color: 'text-purple-600' },
  { value: 'full_day', label: 'Ca ngày', icon: Sun, color: 'text-green-600' }
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  const [formData, setFormData] = useState({
    staff_id: '',
    date: '',
    shift_type: 'morning' as const,
    start_time: '06:00',
    end_time: '14:00',
    break_duration: 60,
    status: 'scheduled' as const,
    notes: ''
  });

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.staff_position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = schedule.date === selectedDate;
    const matchesShift = selectedShift === 'all' || schedule.shift_type === selectedShift;
    const matchesStatus = selectedStatus === 'all' || schedule.status === selectedStatus;
    return matchesSearch && matchesDate && matchesShift && matchesStatus;
  });

  const getScheduleStats = () => {
    const todaySchedules = schedules.filter(s => s.date === selectedDate);
    const totalScheduled = todaySchedules.length;
    const confirmed = todaySchedules.filter(s => s.status === 'confirmed').length;
    const completed = todaySchedules.filter(s => s.status === 'completed').length;
    const absent = todaySchedules.filter(s => s.status === 'absent' || s.status === 'no_show').length;
    const totalHours = todaySchedules.reduce((sum, s) => {
      const start = new Date(`2024-01-01T${s.start_time}`);
      const end = new Date(`2024-01-01T${s.end_time}`);
      if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    
    return { totalScheduled, confirmed, completed, absent, totalHours };
  };

  const getShiftInfo = (shiftType: Schedule['shift_type']) => {
    return shiftTypes.find(s => s.value === shiftType) || shiftTypes[0];
  };

  const getStatusBadge = (status: Schedule['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Đã lên lịch</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Đã xác nhận</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'no_show':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Không đến</Badge>;
      case 'absent':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Vắng mặt</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // HH:MM format
  };

  const calculateWorkHours = (startTime: string, endTime: string, breakDuration: number) => {
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts
    
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60) - breakDuration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}p` : ''}`;
  };

  const handleCreate = () => {
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    
    if (!staff) {
      toast.error('Vui lòng chọn nhân viên!');
      return;
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      staff_name: staff.name,
      staff_position: staff.position,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSchedules([...schedules, newSchedule]);
    toast.success('Lịch làm việc đã được thêm thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingSchedule) return;
    
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    
    if (!staff) {
      toast.error('Vui lòng chọn nhân viên!');
      return;
    }
    
    setSchedules(schedules.map(schedule => 
      schedule.id === editingSchedule.id 
        ? { 
            ...schedule, 
            ...formData,
            staff_name: staff.name,
            staff_position: staff.position,
            updated_at: new Date().toISOString() 
          }
        : schedule
    ));
    toast.success('Lịch làm việc đã được cập nhật!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success('Lịch làm việc đã được xóa!');
  };

  const handleUpdateStatus = (id: string, status: Schedule['status']) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status, updated_at: new Date().toISOString() }
        : schedule
    ));
    toast.success(`Trạng thái đã được cập nhật!`);
  };

  const handleDuplicate = (schedule: Schedule) => {
    const newDate = new Date(schedule.date);
    newDate.setDate(newDate.getDate() + 1);
    
    const duplicatedSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
      date: newDate.toISOString().split('T')[0],
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSchedules([...schedules, duplicatedSchedule]);
    toast.success('Lịch làm việc đã được sao chép!');
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const resetForm = () => {
    setFormData({
      staff_id: '',
      date: '',
      shift_type: 'morning',
      start_time: '06:00',
      end_time: '14:00',
      break_duration: 60,
      status: 'scheduled',
      notes: ''
    });
    setEditingSchedule(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, date: selectedDate }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      staff_id: schedule.staff_id,
      date: schedule.date,
      shift_type: schedule.shift_type,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      break_duration: schedule.break_duration,
      status: schedule.status,
      notes: schedule.notes || ''
    });
    setIsDialogOpen(true);
  };

  const stats = getScheduleStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch làm việc</h1>
          <p className="text-muted-foreground">
            Quản lý lịch trình làm việc và phân ca cho nhân viên
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm lịch làm việc
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc mới'}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule 
                  ? 'Cập nhật thông tin ca làm việc'
                  : 'Tạo ca làm việc mới cho nhân viên'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff_id" className="text-right">
                    Nhân viên
                  </Label>
                  <Select value={formData.staff_id} onValueChange={(value) => setFormData({...formData, staff_id: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} - {staff.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Ngày làm việc
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift_type" className="text-right">
                  Loại ca
                </Label>
                <Select value={formData.shift_type} onValueChange={(value: Schedule['shift_type']) => setFormData({...formData, shift_type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftTypes.map(shift => (
                      <SelectItem key={shift.value} value={shift.value}>
                        <div className="flex items-center gap-2">
                          <shift.icon className={`w-4 h-4 ${shift.color}`} />
                          {shift.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="break_duration" className="text-right">
                    Nghỉ giữa ca (phút)
                  </Label>
                  <Input
                    id="break_duration"
                    type="number"
                    value={formData.break_duration}
                    onChange={(e) => setFormData({...formData, break_duration: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select value={formData.status} onValueChange={(value: Schedule['status']) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="no_show">Không đến</SelectItem>
                    <SelectItem value="absent">Vắng mặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="col-span-3"
                  rows={3}
                  placeholder="Ghi chú về ca làm việc..."
                />
              </div>

              {formData.start_time && formData.end_time && (
                <div className="border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    <strong>Thời gian làm việc:</strong> {calculateWorkHours(formData.start_time, formData.end_time, formData.break_duration)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingSchedule ? handleUpdate : handleCreate}>
                {editingSchedule ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ca làm việc hôm nay
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScheduled}</div>
            <p className="text-xs text-muted-foreground">
              {stats.confirmed} đã xác nhận
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalScheduled > 0 ? ((stats.completed / stats.totalScheduled) * 100).toFixed(1) : 0}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vắng mặt
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalScheduled > 0 ? ((stats.absent / stats.totalScheduled) * 100).toFixed(1) : 0}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giờ làm
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Tổng thời gian hôm nay
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Lịch làm việc
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi lịch trình làm việc của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Lọc theo ca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ca</SelectItem>
                {shiftTypes.map(shift => (
                  <SelectItem key={shift.value} value={shift.value}>
                    {shift.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="no_show">Không đến</SelectItem>
                <SelectItem value="absent">Vắng mặt</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Ca làm việc</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Nghỉ giữa ca</TableHead>
                <TableHead>Tổng giờ làm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => {
                const shiftInfo = getShiftInfo(schedule.shift_type);
                return (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {schedule.staff_name.split(' ').map(n => n.charAt(0)).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{schedule.staff_name}</div>
                          <div className="text-sm text-muted-foreground">{schedule.staff_position}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <shiftInfo.icon className={`w-4 h-4 ${shiftInfo.color}`} />
                        <Badge variant="outline" className={shiftInfo.color}>
                          {shiftInfo.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coffee className="w-4 h-4 text-muted-foreground" />
                        <span>{schedule.break_duration} phút</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {calculateWorkHours(schedule.start_time, schedule.end_time, schedule.break_duration)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(schedule.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-32 truncate">
                        {schedule.notes || '-'}
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
                            Sao chép sang ngày khác
                          </DropdownMenuItem>
                          {schedule.status === 'scheduled' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(schedule.id, 'confirmed')}
                              className="text-blue-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Xác nhận
                            </DropdownMenuItem>
                          )}
                          {schedule.status === 'confirmed' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(schedule.id, 'completed')}
                              className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Hoàn thành
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Báo cáo ca làm
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
