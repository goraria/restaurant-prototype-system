'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  CalendarCheck,
  CalendarX,
  UserCheck,
  ChefHat,
  Utensils,
  Download,
  Filter,
  RefreshCw,
  Bell,
  Star,
  Gift,
  CreditCard,
  Cake,
  Heart,
  Timer,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';

interface Reservation {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  table_number: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
  special_requests: string;
  occasion: string;
  deposit_amount: number;
  deposit_paid: boolean;
  estimated_duration: number;
  actual_arrival_time?: string;
  actual_departure_time?: string;
  total_bill?: number;
  discount_applied?: number;
  staff_notes: string;
  created_at: string;
  updated_at: string;
}

// Mock data cho đặt bàn
const mockReservations: Reservation[] = [
  {
    id: '1',
    customer_id: 'CUST001',
    customer_name: 'Nguyễn Văn Minh',
    customer_phone: '0901234567',
    customer_email: 'nguyen.minh@email.com',
    reservation_date: '2024-03-30',
    reservation_time: '19:30',
    party_size: 4,
    table_number: 'B05',
    status: 'confirmed',
    special_requests: 'Bàn gần cửa sổ, không hút thuốc',
    occasion: 'Sinh nhật',
    deposit_amount: 500000,
    deposit_paid: true,
    estimated_duration: 120,
    staff_notes: 'Khách VIP, chuẩn bị bánh sinh nhật',
    created_at: '2024-03-25T10:30:00Z',
    updated_at: '2024-03-26T15:45:00Z'
  },
  {
    id: '2',
    customer_id: 'CUST002',
    customer_name: 'Trần Thị Hương',
    customer_phone: '0907654321',
    customer_email: 'tran.huong@company.vn',
    reservation_date: '2024-03-30',
    reservation_time: '12:00',
    party_size: 8,
    table_number: 'VIP01',
    status: 'checked_in',
    special_requests: 'Menu vegetarian, không cay',
    occasion: 'Họp mặt công ty',
    deposit_amount: 1000000,
    deposit_paid: true,
    estimated_duration: 150,
    actual_arrival_time: '2024-03-30T12:15:00Z',
    staff_notes: 'Công ty ABC - thanh toán chuyển khoản',
    created_at: '2024-03-20T14:20:00Z',
    updated_at: '2024-03-30T12:15:00Z'
  },
  {
    id: '3',
    customer_id: 'CUST003',
    customer_name: 'Lê Hoàng Phúc',
    customer_phone: '0912345678',
    customer_email: 'le.phuc@gmail.com',
    reservation_date: '2024-03-31',
    reservation_time: '18:00',
    party_size: 2,
    table_number: 'A03',
    status: 'pending',
    special_requests: 'Bàn riêng tư, romantic',
    occasion: 'Kỷ niệm',
    deposit_amount: 300000,
    deposit_paid: false,
    estimated_duration: 90,
    staff_notes: 'Cần xác nhận đặt cọc trong 2h',
    created_at: '2024-03-29T16:45:00Z',
    updated_at: '2024-03-29T16:45:00Z'
  },
  {
    id: '4',
    customer_id: 'CUST004',
    customer_name: 'Phạm Minh Tú',
    customer_phone: '0938765432',
    customer_email: 'pham.tu@outlook.com',
    reservation_date: '2024-03-29',
    reservation_time: '20:00',
    party_size: 6,
    table_number: 'B08',
    status: 'completed',
    special_requests: 'Không hành tỏi',
    occasion: 'Gia đình',
    deposit_amount: 0,
    deposit_paid: false,
    estimated_duration: 110,
    actual_arrival_time: '2024-03-29T20:10:00Z',
    actual_departure_time: '2024-03-29T22:05:00Z',
    total_bill: 2850000,
    discount_applied: 285000,
    staff_notes: 'Khách hài lòng, tip 200k',
    created_at: '2024-03-28T09:30:00Z',
    updated_at: '2024-03-29T22:05:00Z'
  },
  {
    id: '5',
    customer_id: 'CUST005',
    customer_name: 'Vũ Thành Đạt',
    customer_phone: '0945123789',
    customer_email: 'vu.dat@email.vn',
    reservation_date: '2024-03-28',
    reservation_time: '19:00',
    party_size: 3,
    table_number: 'A07',
    status: 'no_show',
    special_requests: 'Bàn yên tĩnh',
    occasion: 'Bạn bè',
    deposit_amount: 200000,
    deposit_paid: true,
    estimated_duration: 100,
    staff_notes: 'Không đến không báo, đã gọi nhiều lần',
    created_at: '2024-03-27T11:15:00Z',
    updated_at: '2024-03-28T19:30:00Z'
  }
];

const tables = [
  { id: 'A01', name: 'Bàn A01', capacity: 2, area: 'Khu A' },
  { id: 'A02', name: 'Bàn A02', capacity: 2, area: 'Khu A' },
  { id: 'A03', name: 'Bàn A03', capacity: 2, area: 'Khu A' },
  { id: 'A04', name: 'Bàn A04', capacity: 4, area: 'Khu A' },
  { id: 'A05', name: 'Bàn A05', capacity: 4, area: 'Khu A' },
  { id: 'A06', name: 'Bàn A06', capacity: 4, area: 'Khu A' },
  { id: 'A07', name: 'Bàn A07', capacity: 4, area: 'Khu A' },
  { id: 'B01', name: 'Bàn B01', capacity: 6, area: 'Khu B' },
  { id: 'B02', name: 'Bàn B02', capacity: 6, area: 'Khu B' },
  { id: 'B03', name: 'Bàn B03', capacity: 6, area: 'Khu B' },
  { id: 'B04', name: 'Bàn B04', capacity: 6, area: 'Khu B' },
  { id: 'B05', name: 'Bàn B05', capacity: 6, area: 'Khu B' },
  { id: 'B06', name: 'Bàn B06', capacity: 8, area: 'Khu B' },
  { id: 'B07', name: 'Bàn B07', capacity: 8, area: 'Khu B' },
  { id: 'B08', name: 'Bàn B08', capacity: 8, area: 'Khu B' },
  { id: 'VIP01', name: 'Phòng VIP 01', capacity: 10, area: 'VIP' },
  { id: 'VIP02', name: 'Phòng VIP 02', capacity: 12, area: 'VIP' },
  { id: 'VIP03', name: 'Phòng VIP 03', capacity: 15, area: 'VIP' }
];

const customers = [
  { id: 'CUST001', name: 'Nguyễn Văn Minh', phone: '0901234567', email: 'nguyen.minh@email.com' },
  { id: 'CUST002', name: 'Trần Thị Hương', phone: '0907654321', email: 'tran.huong@company.vn' },
  { id: 'CUST003', name: 'Lê Hoàng Phúc', phone: '0912345678', email: 'le.phuc@gmail.com' },
  { id: 'CUST004', name: 'Phạm Minh Tú', phone: '0938765432', email: 'pham.tu@outlook.com' },
  { id: 'CUST005', name: 'Vũ Thành Đạt', phone: '0945123789', email: 'vu.dat@email.vn' }
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTable, setSelectedTable] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    table_number: '',
    special_requests: '',
    occasion: '',
    deposit_amount: 0,
    deposit_paid: false,
    estimated_duration: 90,
    staff_notes: '',
    status: 'pending' as const
  });

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customer_phone.includes(searchTerm) ||
                         reservation.table_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    const matchesDate = selectedDate === '' || reservation.reservation_date === selectedDate;
    const matchesTable = selectedTable === 'all' || reservation.table_number === selectedTable;
    return matchesSearch && matchesStatus && matchesDate && matchesTable;
  });

  const getReservationStats = () => {
    const total = reservations.length;
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.reservation_date === today).length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const checkedIn = reservations.filter(r => r.status === 'checked_in').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const totalRevenue = reservations
      .filter(r => r.status === 'completed' && r.total_bill)
      .reduce((sum, r) => sum + (r.total_bill || 0), 0);
    
    return { total, todayReservations, confirmed, checkedIn, pending, totalRevenue };
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xác nhận</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800"><CalendarCheck className="w-3 h-3 mr-1" />Đã xác nhận</Badge>;
      case 'checked_in':
        return <Badge className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Đã checkin</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><CalendarX className="w-3 h-3 mr-1" />Đã hủy</Badge>;
      case 'no_show':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Không đến</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getOccasionIcon = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'sinh nhật':
        return <Cake className="w-4 h-4 text-pink-500" />;
      case 'kỷ niệm':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'họp mặt công ty':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'gia đình':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Star className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // HH:MM
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const calculateDuration = (arrivalTime: string, departureTime: string) => {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const diffMs = departure.getTime() - arrival.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  };

  const getAvailableTables = (partySize: number, date: string, time: string) => {
    const suitableTables = tables.filter(table => table.capacity >= partySize);
    // In a real app, you would check for conflicts with existing reservations
    return suitableTables;
  };

  const handleCreate = () => {
    if (!formData.customer_name || !formData.customer_phone || !formData.reservation_date || 
        !formData.reservation_time || !formData.table_number) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setReservations([...reservations, newReservation]);
    toast.success('Đặt bàn đã được tạo thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingReservation) return;
    
    if (!formData.customer_name || !formData.customer_phone || !formData.reservation_date || 
        !formData.reservation_time || !formData.table_number) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    setReservations(reservations.map(reservation => 
      reservation.id === editingReservation.id 
        ? { 
            ...reservation, 
            ...formData,
            updated_at: new Date().toISOString() 
          }
        : reservation
    ));
    toast.success('Thông tin đặt bàn đã được cập nhật!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
    toast.success('Đặt bàn đã được xóa!');
  };

  const handleUpdateStatus = (id: string, status: Reservation['status']) => {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    
    if (status === 'checked_in') {
      updateData.actual_arrival_time = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.actual_departure_time = new Date().toISOString();
    }
    
    setReservations(reservations.map(reservation => 
      reservation.id === id 
        ? { ...reservation, ...updateData }
        : reservation
    ));
    
    const statusText = {
      'confirmed': 'xác nhận',
      'checked_in': 'check-in', 
      'completed': 'hoàn thành',
      'cancelled': 'hủy',
      'no_show': 'không đến'
    }[status] || status;
    
    toast.success(`Đặt bàn đã được ${statusText}!`);
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      reservation_date: '',
      reservation_time: '',
      party_size: 2,
      table_number: '',
      special_requests: '',
      occasion: '',
      deposit_amount: 0,
      deposit_paid: false,
      estimated_duration: 90,
      staff_notes: '',
      status: 'pending'
    });
    setEditingReservation(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      customer_id: reservation.customer_id,
      customer_name: reservation.customer_name,
      customer_phone: reservation.customer_phone,
      customer_email: reservation.customer_email,
      reservation_date: reservation.reservation_date,
      reservation_time: reservation.reservation_time,
      party_size: reservation.party_size,
      table_number: reservation.table_number,
      special_requests: reservation.special_requests,
      occasion: reservation.occasion,
      deposit_amount: reservation.deposit_amount,
      deposit_paid: reservation.deposit_paid,
      estimated_duration: reservation.estimated_duration,
      staff_notes: reservation.staff_notes,
      status: reservation.status
    });
    setIsDialogOpen(true);
  };

  const stats = getReservationStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đặt bàn</h1>
          <p className="text-muted-foreground">
            Quản lý đặt chỗ và theo dõi tình trạng bàn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Đặt bàn mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>
                {editingReservation ? 'Chỉnh sửa đặt bàn' : 'Tạo đặt bàn mới'}
              </DialogTitle>
              <DialogDescription>
                {editingReservation 
                  ? 'Cập nhật thông tin đặt bàn'
                  : 'Tạo mới thông tin đặt bàn cho khách hàng'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer_name" className="text-right">
                    Tên khách hàng *
                  </Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="col-span-3"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer_phone" className="text-right">
                    Số điện thoại *
                  </Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    className="col-span-3"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer_email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    className="col-span-3"
                    placeholder="Nhập email (tùy chọn)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="party_size" className="text-right">
                    Số người
                  </Label>
                  <Input
                    id="party_size"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.party_size}
                    onChange={(e) => setFormData({...formData, party_size: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reservation_date" className="text-right">
                    Ngày đặt *
                  </Label>
                  <Input
                    id="reservation_date"
                    type="date"
                    value={formData.reservation_date}
                    onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reservation_time" className="text-right">
                    Giờ đặt *
                  </Label>
                  <Input
                    id="reservation_time"
                    type="time"
                    value={formData.reservation_time}
                    onChange={(e) => setFormData({...formData, reservation_time: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table_number" className="text-right">
                    Bàn *
                  </Label>
                  <Select value={formData.table_number} onValueChange={(value) => setFormData({...formData, table_number: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTables(formData.party_size, formData.reservation_date, formData.reservation_time).map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name} - {table.capacity} chỗ ({table.area})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estimated_duration" className="text-right">
                    Thời gian dự kiến (phút)
                  </Label>
                  <Input
                    id="estimated_duration"
                    type="number"
                    min="30"
                    max="300"
                    step="15"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({...formData, estimated_duration: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="occasion" className="text-right">
                    Dịp đặc biệt
                  </Label>
                  <Select value={formData.occasion} onValueChange={(value) => setFormData({...formData, occasion: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn dịp đặc biệt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Không có</SelectItem>
                      <SelectItem value="Sinh nhật">Sinh nhật</SelectItem>
                      <SelectItem value="Kỷ niệm">Kỷ niệm</SelectItem>
                      <SelectItem value="Họp mặt công ty">Họp mặt công ty</SelectItem>
                      <SelectItem value="Gia đình">Gia đình</SelectItem>
                      <SelectItem value="Bạn bè">Bạn bè</SelectItem>
                      <SelectItem value="Hẹn hò">Hẹn hò</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deposit_amount" className="text-right">
                    Đặt cọc (VND)
                  </Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    min="0"
                    step="10000"
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({...formData, deposit_amount: parseInt(e.target.value)})}
                    className="col-span-3"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="special_requests" className="text-right">
                  Yêu cầu đặc biệt
                </Label>
                <Textarea
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  className="col-span-3"
                  rows={3}
                  placeholder="Ghi chú yêu cầu đặc biệt của khách hàng..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="staff_notes" className="text-right">
                  Ghi chú nội bộ
                </Label>
                <Textarea
                  id="staff_notes"
                  value={formData.staff_notes}
                  onChange={(e) => setFormData({...formData, staff_notes: e.target.value})}
                  className="col-span-3"
                  rows={2}
                  placeholder="Ghi chú cho nhân viên..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select value={formData.status} onValueChange={(value: Reservation['status']) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="checked_in">Đã check-in</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="no_show">Không đến</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingReservation ? handleUpdate : handleCreate}>
                {editingReservation ? 'Cập nhật' : 'Tạo đặt bàn'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đặt bàn
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả thời gian
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hôm nay
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayReservations}</div>
            <p className="text-xs text-muted-foreground">
              Đặt bàn hôm nay
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ xác nhận
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã xác nhận
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              Chờ khách đến
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang phục vụ
            </CardTitle>
            <Utensils className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              Khách đang ăn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Từ đặt bàn hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách đặt bàn
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả đặt bàn của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, hoặc bàn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="checked_in">Đã check-in</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="no_show">Không đến</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Bàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bàn</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>{table.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày/Giờ</TableHead>
                <TableHead>Bàn/Số người</TableHead>
                <TableHead>Dịp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cọc</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {reservation.customer_name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{reservation.customer_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {reservation.customer_phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(reservation.reservation_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{formatTime(reservation.reservation_time)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium">{reservation.table_number}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{reservation.party_size} người</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reservation.occasion && (
                      <div className="flex items-center gap-2">
                        {getOccasionIcon(reservation.occasion)}
                        <span className="text-sm">{reservation.occasion}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell>
                    {reservation.deposit_amount > 0 ? (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{formatCurrency(reservation.deposit_amount)}</div>
                        <Badge variant={reservation.deposit_paid ? "default" : "destructive"} className="text-xs">
                          {reservation.deposit_paid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Không cọc</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3 text-muted-foreground" />
                        <span>Dự kiến: {reservation.estimated_duration}p</span>
                      </div>
                      {reservation.actual_arrival_time && reservation.actual_departure_time && (
                        <div className="text-green-600">
                          Thực tế: {calculateDuration(reservation.actual_arrival_time, reservation.actual_departure_time)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reservation.total_bill ? (
                      <div className="space-y-1">
                        <div className="font-semibold">{formatCurrency(reservation.total_bill)}</div>
                        {reservation.discount_applied && reservation.discount_applied > 0 && (
                          <div className="text-xs text-green-600">
                            Giảm: {formatCurrency(reservation.discount_applied)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(reservation)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {reservation.status === 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                            className="text-blue-600"
                          >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Xác nhận
                          </DropdownMenuItem>
                        )}
                        {reservation.status === 'confirmed' && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(reservation.id, 'checked_in')}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Check-in
                          </DropdownMenuItem>
                        )}
                        {reservation.status === 'checked_in' && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(reservation.id, 'completed')}
                            className="text-emerald-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Hoàn thành
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Gửi tin nhắn
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Nhắc nhở
                        </DropdownMenuItem>
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                            className="text-red-600"
                          >
                            <CalendarX className="mr-2 h-4 w-4" />
                            Hủy đặt bàn
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(reservation.id)}
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
