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
  Clock,
  Calendar,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Coffee,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Smartphone,
  Camera,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface Attendance {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_position: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  total_hours: number;
  overtime_hours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'half_day';
  location_check_in?: string;
  location_check_out?: string;
  notes?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

// Mock data cho chấm công
const mockAttendance: Attendance[] = [
  {
    id: '1',
    staff_id: 'EMP001',
    staff_name: 'Nguyễn Văn An',
    staff_position: 'Đầu bếp trưởng',
    date: '2024-01-26',
    check_in_time: '05:45',
    check_out_time: '14:30',
    break_start_time: '12:00',
    break_end_time: '13:00',
    total_hours: 7.75,
    overtime_hours: 0.75,
    status: 'present',
    location_check_in: 'Nhà hàng chính',
    location_check_out: 'Nhà hàng chính',
    notes: 'Đến sớm để chuẩn bị menu đặc biệt',
    approved_by: 'Quản lý',
    created_at: '2024-01-26T05:45:00Z',
    updated_at: '2024-01-26T14:30:00Z'
  },
  {
    id: '2',
    staff_id: 'EMP002',
    staff_name: 'Trần Thị Mai',
    staff_position: 'Quản lý ca',
    date: '2024-01-26',
    check_in_time: '13:55',
    check_out_time: '22:15',
    break_start_time: '18:30',
    break_end_time: '19:15',
    total_hours: 7.5,
    overtime_hours: 0.25,
    status: 'late',
    location_check_in: 'Nhà hàng chính',
    location_check_out: 'Nhà hàng chính',
    notes: 'Muộn 5 phút do kẹt xe',
    created_at: '2024-01-26T13:55:00Z',
    updated_at: '2024-01-26T22:15:00Z'
  },
  {
    id: '3',
    staff_id: 'EMP003',
    staff_name: 'Lê Hoàng Nam',
    staff_position: 'Thu ngân',
    date: '2024-01-26',
    check_in_time: '08:00',
    check_out_time: '17:30',
    break_start_time: '12:30',
    break_end_time: '14:00',
    total_hours: 8.0,
    overtime_hours: 0,
    status: 'early_leave',
    location_check_in: 'Nhà hàng chính',
    location_check_out: 'Nhà hàng chính',
    notes: 'Nghỉ sớm 30 phút do việc gia đình',
    approved_by: 'Quản lý ca',
    created_at: '2024-01-26T08:00:00Z',
    updated_at: '2024-01-26T17:30:00Z'
  },
  {
    id: '4',
    staff_id: 'EMP004',
    staff_name: 'Phạm Minh Tuấn',
    staff_position: 'Bồi bàn',
    date: '2024-01-26',
    total_hours: 0,
    overtime_hours: 0,
    status: 'absent',
    notes: 'Nghỉ ốm có giấy bác sĩ',
    approved_by: 'Quản lý',
    created_at: '2024-01-26T08:00:00Z',
    updated_at: '2024-01-26T08:00:00Z'
  },
  {
    id: '5',
    staff_id: 'EMP005',
    staff_name: 'Vũ Thành Long',
    staff_position: 'Bảo vệ',
    date: '2024-01-26',
    check_in_time: '22:00',
    check_out_time: '06:00',
    break_start_time: '02:00',
    break_end_time: '03:00',
    total_hours: 7.0,
    overtime_hours: 0,
    status: 'present',
    location_check_in: 'Nhà hàng chính',
    location_check_out: 'Nhà hàng chính',
    notes: 'Ca đêm bình thường',
    created_at: '2024-01-26T22:00:00Z',
    updated_at: '2024-01-27T06:00:00Z'
  },
  {
    id: '6',
    staff_id: 'EMP006',
    staff_name: 'Hoàng Thị Linh',
    staff_position: 'Kế toán',
    date: '2024-01-26',
    check_in_time: '09:00',
    check_out_time: '13:00',
    total_hours: 4.0,
    overtime_hours: 0,
    status: 'half_day',
    location_check_in: 'Nhà hàng chính',
    location_check_out: 'Nhà hàng chính',
    notes: 'Chỉ làm nửa ngày theo yêu cầu',
    approved_by: 'Quản lý',
    created_at: '2024-01-26T09:00:00Z',
    updated_at: '2024-01-26T13:00:00Z'
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

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  
  const [formData, setFormData] = useState({
    staff_id: '',
    date: '',
    check_in_time: '',
    check_out_time: '',
    break_start_time: '',
    break_end_time: '',
    status: 'present' as const,
    location_check_in: '',
    location_check_out: '',
    notes: ''
  });

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.staff_position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getAttendanceStats = () => {
    const todayRecords = attendance.filter(r => r.date === selectedDate);
    const totalStaff = todayRecords.length;
    const presentCount = todayRecords.filter(r => ['present', 'late', 'early_leave', 'half_day'].includes(r.status)).length;
    const absentCount = todayRecords.filter(r => r.status === 'absent').length;
    const lateCount = todayRecords.filter(r => r.status === 'late').length;
    const totalHours = todayRecords.reduce((sum, r) => sum + r.total_hours, 0);
    const overtimeHours = todayRecords.reduce((sum, r) => sum + r.overtime_hours, 0);
    
    return { totalStaff, presentCount, absentCount, lateCount, totalHours, overtimeHours };
  };

  const getStatusBadge = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Có mặt</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Vắng mặt</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Muộn</Badge>;
      case 'early_leave':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" />Về sớm</Badge>;
      case 'half_day':
        return <Badge variant="secondary"><Timer className="w-3 h-3 mr-1" />Nửa ngày</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    return time.substring(0, 5); // HH:MM format
  };

  const calculateTotalHours = (checkIn?: string, checkOut?: string, breakStart?: string, breakEnd?: string) => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(`2024-01-01T${checkIn}`);
    const end = new Date(`2024-01-01T${checkOut}`);
    if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts
    
    let totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    // Subtract break time
    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`2024-01-01T${breakStart}`);
      const breakEndTime = new Date(`2024-01-01T${breakEnd}`);
      const breakMinutes = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60);
      totalMinutes -= breakMinutes;
    }
    
    return totalMinutes / 60;
  };

  const handleCreate = () => {
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    
    if (!staff) {
      toast.error('Vui lòng chọn nhân viên!');
      return;
    }

    const totalHours = calculateTotalHours(
      formData.check_in_time,
      formData.check_out_time,
      formData.break_start_time,
      formData.break_end_time
    );

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      staff_name: staff.name,
      staff_position: staff.position,
      total_hours: totalHours,
      overtime_hours: Math.max(0, totalHours - 8),
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setAttendance([...attendance, newAttendance]);
    toast.success('Bản ghi chấm công đã được thêm!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingAttendance) return;
    
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    
    if (!staff) {
      toast.error('Vui lòng chọn nhân viên!');
      return;
    }

    const totalHours = calculateTotalHours(
      formData.check_in_time,
      formData.check_out_time,
      formData.break_start_time,
      formData.break_end_time
    );
    
    setAttendance(attendance.map(record => 
      record.id === editingAttendance.id 
        ? { 
            ...record, 
            ...formData,
            staff_name: staff.name,
            staff_position: staff.position,
            total_hours: totalHours,
            overtime_hours: Math.max(0, totalHours - 8),
            updated_at: new Date().toISOString() 
          }
        : record
    ));
    toast.success('Bản ghi chấm công đã được cập nhật!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAttendance(attendance.filter(record => record.id !== id));
    toast.success('Bản ghi chấm công đã được xóa!');
  };

  const handleQuickCheckIn = (staffId: string) => {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff) return;

    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5);
    
    const newAttendance: Attendance = {
      id: Date.now().toString(),
      staff_id: staffId,
      staff_name: staff.name,
      staff_position: staff.position,
      date: selectedDate,
      check_in_time: timeString,
      total_hours: 0,
      overtime_hours: 0,
      status: 'present',
      location_check_in: 'Nhà hàng chính',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setAttendance([...attendance, newAttendance]);
    toast.success(`${staff.name} đã check-in thành công!`);
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
      check_in_time: '',
      check_out_time: '',
      break_start_time: '',
      break_end_time: '',
      status: 'present',
      location_check_in: '',
      location_check_out: '',
      notes: ''
    });
    setEditingAttendance(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, date: selectedDate }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: Attendance) => {
    setEditingAttendance(record);
    setFormData({
      staff_id: record.staff_id,
      date: record.date,
      check_in_time: record.check_in_time || '',
      check_out_time: record.check_out_time || '',
      break_start_time: record.break_start_time || '',
      break_end_time: record.break_end_time || '',
      status: record.status,
      location_check_in: record.location_check_in || '',
      location_check_out: record.location_check_out || '',
      notes: record.notes || ''
    });
    setIsDialogOpen(true);
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chấm công</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý thời gian làm việc của nhân viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Check-in nhanh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm chấm công
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAttendance ? 'Chỉnh sửa chấm công' : 'Thêm bản ghi chấm công'}
                </DialogTitle>
                <DialogDescription>
                  {editingAttendance 
                    ? 'Cập nhật thông tin chấm công'
                    : 'Tạo bản ghi chấm công mới cho nhân viên'
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
                      Ngày
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="check_in_time" className="text-right">
                      Giờ vào
                    </Label>
                    <Input
                      id="check_in_time"
                      type="time"
                      value={formData.check_in_time}
                      onChange={(e) => setFormData({...formData, check_in_time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="check_out_time" className="text-right">
                      Giờ ra
                    </Label>
                    <Input
                      id="check_out_time"
                      type="time"
                      value={formData.check_out_time}
                      onChange={(e) => setFormData({...formData, check_out_time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="break_start_time" className="text-right">
                      Bắt đầu nghỉ
                    </Label>
                    <Input
                      id="break_start_time"
                      type="time"
                      value={formData.break_start_time}
                      onChange={(e) => setFormData({...formData, break_start_time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="break_end_time" className="text-right">
                      Kết thúc nghỉ
                    </Label>
                    <Input
                      id="break_end_time"
                      type="time"
                      value={formData.break_end_time}
                      onChange={(e) => setFormData({...formData, break_end_time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Trạng thái
                    </Label>
                    <Select value={formData.status} onValueChange={(value: Attendance['status']) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Có mặt</SelectItem>
                        <SelectItem value="absent">Vắng mặt</SelectItem>
                        <SelectItem value="late">Muộn</SelectItem>
                        <SelectItem value="early_leave">Về sớm</SelectItem>
                        <SelectItem value="half_day">Nửa ngày</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location_check_in" className="text-right">
                      Vị trí check-in
                    </Label>
                    <Input
                      id="location_check_in"
                      value={formData.location_check_in}
                      onChange={(e) => setFormData({...formData, location_check_in: e.target.value})}
                      className="col-span-3"
                      placeholder="VD: Nhà hàng chính"
                    />
                  </div>
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
                    placeholder="Ghi chú về chấm công..."
                  />
                </div>

                {formData.check_in_time && formData.check_out_time && (
                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      <strong>Tổng giờ làm:</strong> {calculateTotalHours(
                        formData.check_in_time,
                        formData.check_out_time,
                        formData.break_start_time,
                        formData.break_end_time
                      ).toFixed(1)} giờ
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={editingAttendance ? handleUpdate : handleCreate}>
                  {editingAttendance ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nhân viên
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Hôm nay ({new Date(selectedDate).toLocaleDateString('vi-VN')})
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Có mặt
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStaff > 0 ? ((stats.presentCount / stats.totalStaff) * 100).toFixed(1) : 0}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vắng mặt / Muộn
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absentCount + stats.lateCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.absentCount} vắng, {stats.lateCount} muộn
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
              {stats.overtimeHours.toFixed(1)}h tăng ca
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Bảng chấm công
          </CardTitle>
          <CardDescription>
            Theo dõi thời gian làm việc và chấm công của nhân viên
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
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="present">Có mặt</SelectItem>
                <SelectItem value="absent">Vắng mặt</SelectItem>
                <SelectItem value="late">Muộn</SelectItem>
                <SelectItem value="early_leave">Về sớm</SelectItem>
                <SelectItem value="half_day">Nửa ngày</SelectItem>
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
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Nghỉ giữa ca</TableHead>
                <TableHead>Tổng giờ</TableHead>
                <TableHead>Tăng ca</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {record.staff_name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{record.staff_name}</div>
                        <div className="text-sm text-muted-foreground">{record.staff_position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{formatTime(record.check_in_time)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="font-medium">{formatTime(record.check_out_time)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.break_start_time && record.break_end_time ? (
                      <div className="flex items-center gap-1">
                        <Coffee className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatTime(record.break_start_time)} - {formatTime(record.break_end_time)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{record.total_hours.toFixed(1)}h</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.overtime_hours > 0 ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-600">
                          +{record.overtime_hours.toFixed(1)}h
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {record.location_check_in || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-32 truncate">
                      {record.notes || '-'}
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
                        <DropdownMenuItem onClick={() => openEditDialog(record)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Báo cáo giờ làm
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Smartphone className="mr-2 h-4 w-4" />
                          Gửi thông báo
                        </DropdownMenuItem>
                        {!record.check_in_time && (
                          <DropdownMenuItem 
                            onClick={() => handleQuickCheckIn(record.staff_id)}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Check-in nhanh
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(record.id)}
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
