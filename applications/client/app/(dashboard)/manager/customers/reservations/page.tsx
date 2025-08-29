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

// Import form components and API hooks
import { ReservationForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { useGetReservationsQuery, useCreateReservationMutation, useUpdateReservationMutation, useDeleteReservationMutation, useUpdateReservationStatusMutation } from '@/state/api';

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

// Mock data for tables and customers (in real app, these would come from API)
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTable, setSelectedTable] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null);

  // API hooks
  const { data: reservations = [], isLoading, refetch } = useGetReservationsQuery();
  const [createReservation] = useCreateReservationMutation();
  const [updateReservation] = useUpdateReservationMutation();
  const [deleteReservation] = useDeleteReservationMutation();
  const [updateReservationStatus] = useUpdateReservationStatusMutation();

  const filteredReservations = reservations.filter((reservation: Reservation) => {
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
    const todayReservations = reservations.filter((r: Reservation) => r.reservation_date === today).length;
    const confirmed = reservations.filter((r: Reservation) => r.status === 'confirmed').length;
    const checkedIn = reservations.filter((r: Reservation) => r.status === 'checked_in').length;
    const pending = reservations.filter((r: Reservation) => r.status === 'pending').length;
    const totalRevenue = reservations
      .filter((r: Reservation) => r.status === 'completed' && r.total_bill)
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

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
    toast.success('Đặt bàn đã được tạo thành công!');
  };

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingReservation(null);
    refetch();
    toast.success('Thông tin đặt bàn đã được cập nhật!');
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setDeletingReservation(null);
    refetch();
    toast.success('Đặt bàn đã được xóa!');
  };

  const handleUpdateStatus = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus({ id, status }).unwrap();
      refetch();
      
      const statusText = {
        'confirmed': 'xác nhận',
        'checked_in': 'check-in', 
        'completed': 'hoàn thành',
        'cancelled': 'hủy',
        'no_show': 'không đến'
      }[status] || status;
      
      toast.success(`Đặt bàn đã được ${statusText}!`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (reservation: Reservation) => {
    setDeletingReservation(reservation);
    setIsDeleteDialogOpen(true);
  };

  const stats = getReservationStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đặt bàn</h1>
          <p className="text-muted-foreground">
            Quản lý đặt chỗ và theo dõi tình trạng bàn
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Đặt bàn mới
        </Button>
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
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
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
              {filteredReservations.map((reservation: Reservation) => (
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
                          onClick={() => openDeleteDialog(reservation)}
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

      {/* Create Reservation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo đặt bàn mới</DialogTitle>
            <DialogDescription>
              Tạo mới thông tin đặt bàn cho khách hàng
            </DialogDescription>
          </DialogHeader>
          <ReservationForm
            mode="create"
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đặt bàn</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đặt bàn
            </DialogDescription>
          </DialogHeader>
          {editingReservation && (
            <ReservationForm
              mode="update"
              initialValues={editingReservation}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa đặt bàn"
        description={`Bạn có chắc chắn muốn xóa đặt bàn của ${deletingReservation?.customer_name}?`}
        onConfirm={() => {
          if (deletingReservation) {
            deleteReservation(deletingReservation.id)
              .unwrap()
              .then(handleDeleteSuccess)
              .catch(() => toast.error('Có lỗi xảy ra khi xóa đặt bàn!'));
          }
        }}
      />
    </div>
  );
}
