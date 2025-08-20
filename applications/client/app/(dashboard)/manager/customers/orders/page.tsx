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
  Search, 
  MoreHorizontal, 
  Eye, 
  ShoppingBag,
  Calendar,
  Clock,
  Users,
  Phone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  CreditCard,
  Download,
  RefreshCw,
  Star,
  Gift,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Receipt,
  MessageSquare,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
}

interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
  order_time: string;
  order_type: 'dine_in' | 'takeout' | 'delivery';
  table_number?: string;
  delivery_address?: string;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  service_charge: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'ewallet';
  payment_status: 'pending' | 'paid' | 'refunded' | 'partial';
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  staff_id: string;
  staff_name: string;
  preparation_time: number;
  actual_preparation_time?: number;
  delivery_time?: string;
  customer_rating?: number;
  customer_feedback?: string;
  loyalty_points_earned: number;
  loyalty_points_used: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Mock data cho đơn hàng
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customer_id: 'CUST001',
    customer_name: 'Nguyễn Văn Minh',
    customer_phone: '0901234567',
    customer_email: 'nguyen.minh@email.com',
    order_date: '2024-03-30',
    order_time: '19:45',
    order_type: 'dine_in',
    table_number: 'B05',
    items: [
      { id: '1', dish_name: 'Bò nướng lá lốt', quantity: 2, unit_price: 185000, subtotal: 370000 },
      { id: '2', dish_name: 'Gỏi cuốn tôm thịt', quantity: 1, unit_price: 85000, subtotal: 85000 },
      { id: '3', dish_name: 'Bia Sài Gòn', quantity: 4, unit_price: 35000, subtotal: 140000, special_instructions: 'Ướp lạnh' }
    ],
    subtotal: 595000,
    tax_amount: 59500,
    discount_amount: 59500,
    service_charge: 29750,
    delivery_fee: 0,
    total_amount: 624750,
    payment_method: 'card',
    payment_status: 'paid',
    order_status: 'completed',
    staff_id: 'EMP002',
    staff_name: 'Trần Thị Mai',
    preparation_time: 25,
    actual_preparation_time: 22,
    customer_rating: 5,
    customer_feedback: 'Món ăn ngon, phục vụ chu đáo',
    loyalty_points_earned: 62,
    loyalty_points_used: 0,
    notes: 'Khách VIP - sinh nhật',
    created_at: '2024-03-30T19:45:00Z',
    updated_at: '2024-03-30T21:15:00Z'
  },
  {
    id: 'ORD002',
    customer_id: 'CUST002',
    customer_name: 'Trần Thị Hương',
    customer_phone: '0907654321',
    customer_email: 'tran.huong@company.vn',
    order_date: '2024-03-30',
    order_time: '12:30',
    order_type: 'dine_in',
    table_number: 'VIP01',
    items: [
      { id: '1', dish_name: 'Set ăn chay đặc biệt', quantity: 8, unit_price: 165000, subtotal: 1320000 },
      { id: '2', dish_name: 'Nước ép cam tươi', quantity: 8, unit_price: 45000, subtotal: 360000 },
      { id: '3', dish_name: 'Bánh flan', quantity: 8, unit_price: 35000, subtotal: 280000 }
    ],
    subtotal: 1960000,
    tax_amount: 196000,
    discount_amount: 196000,
    service_charge: 98000,
    delivery_fee: 0,
    total_amount: 2058000,
    payment_method: 'transfer',
    payment_status: 'paid',
    order_status: 'completed',
    staff_id: 'EMP002',
    staff_name: 'Trần Thị Mai',
    preparation_time: 35,
    actual_preparation_time: 32,
    customer_rating: 4,
    customer_feedback: 'Món ăn chay ngon, phù hợp cho công ty',
    loyalty_points_earned: 206,
    loyalty_points_used: 100,
    notes: 'Họp mặt công ty ABC',
    created_at: '2024-03-30T12:30:00Z',
    updated_at: '2024-03-30T14:45:00Z'
  },
  {
    id: 'ORD003',
    customer_id: 'CUST003',
    customer_name: 'Lê Hoàng Phúc',
    customer_phone: '0912345678',
    customer_email: 'le.phuc@gmail.com',
    order_date: '2024-03-29',
    order_time: '18:15',
    order_type: 'delivery',
    delivery_address: '789 Đường DEF, Quận 7, TP.HCM',
    items: [
      { id: '1', dish_name: 'Phở bò đặc biệt', quantity: 2, unit_price: 85000, subtotal: 170000 },
      { id: '2', dish_name: 'Chả giò', quantity: 1, unit_price: 75000, subtotal: 75000 },
      { id: '3', dish_name: 'Trà đá', quantity: 2, unit_price: 15000, subtotal: 30000 }
    ],
    subtotal: 275000,
    tax_amount: 27500,
    discount_amount: 0,
    service_charge: 0,
    delivery_fee: 25000,
    total_amount: 327500,
    payment_method: 'ewallet',
    payment_status: 'paid',
    order_status: 'delivered',
    staff_id: 'EMP004',
    staff_name: 'Phạm Minh Tuấn',
    preparation_time: 20,
    actual_preparation_time: 18,
    delivery_time: '2024-03-29T19:05:00Z',
    customer_rating: 4,
    customer_feedback: 'Giao hàng nhanh, món ăn còn nóng',
    loyalty_points_earned: 33,
    loyalty_points_used: 25,
    notes: 'Giao hàng tận nơi',
    created_at: '2024-03-29T18:15:00Z',
    updated_at: '2024-03-29T19:05:00Z'
  },
  {
    id: 'ORD004',
    customer_id: 'CUST004',
    customer_name: 'Phạm Minh Tú',
    customer_phone: '0938765432',
    customer_email: 'pham.tu@outlook.com',
    order_date: '2024-03-28',
    order_time: '20:15',
    order_type: 'takeout',
    items: [
      { id: '1', dish_name: 'Cơm tấm sườn nướng', quantity: 3, unit_price: 65000, subtotal: 195000 },
      { id: '2', dish_name: 'Canh chua cá', quantity: 1, unit_price: 85000, subtotal: 85000 },
      { id: '3', dish_name: 'Nước ngọt', quantity: 3, unit_price: 25000, subtotal: 75000 }
    ],
    subtotal: 355000,
    tax_amount: 35500,
    discount_amount: 35500,
    service_charge: 0,
    delivery_fee: 0,
    total_amount: 355000,
    payment_method: 'cash',
    payment_status: 'paid',
    order_status: 'completed',
    staff_id: 'EMP003',
    staff_name: 'Lê Hoàng Nam',
    preparation_time: 15,
    actual_preparation_time: 12,
    customer_rating: 5,
    customer_feedback: 'Nhanh gọn, món ăn ngon',
    loyalty_points_earned: 36,
    loyalty_points_used: 0,
    notes: 'Khách quen',
    created_at: '2024-03-28T20:15:00Z',
    updated_at: '2024-03-28T20:45:00Z'
  },
  {
    id: 'ORD005',
    customer_id: 'CUST005',
    customer_name: 'Vũ Thành Đạt',
    customer_phone: '0945123789',
    customer_email: 'vu.dat@email.vn',
    order_date: '2024-03-27',
    order_time: '19:30',
    order_type: 'dine_in',
    table_number: 'A04',
    items: [
      { id: '1', dish_name: 'Lẩu Thái hải sản', quantity: 1, unit_price: 385000, subtotal: 385000 },
      { id: '2', dish_name: 'Bánh tráng nướng', quantity: 2, unit_price: 45000, subtotal: 90000 }
    ],
    subtotal: 475000,
    tax_amount: 47500,
    discount_amount: 0,
    service_charge: 23750,
    delivery_fee: 0,
    total_amount: 546250,
    payment_method: 'card',
    payment_status: 'paid',
    order_status: 'completed',
    staff_id: 'EMP004',
    staff_name: 'Phạm Minh Tuấn',
    preparation_time: 30,
    actual_preparation_time: 28,
    customer_rating: 3,
    customer_feedback: 'Lẩu hơi nhạt, cần cải thiện',
    loyalty_points_earned: 55,
    loyalty_points_used: 0,
    notes: 'Lần đầu đến',
    created_at: '2024-03-27T19:30:00Z',
    updated_at: '2024-03-27T21:15:00Z'
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_phone.includes(searchTerm) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.order_status === selectedStatus;
    const matchesType = selectedType === 'all' || order.order_type === selectedType;
    const matchesPayment = selectedPayment === 'all' || order.payment_method === selectedPayment;
    const matchesDate = selectedDate === '' || order.order_date === selectedDate;
    return matchesSearch && matchesStatus && matchesType && matchesPayment && matchesDate;
  });

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const completedOrders = orders.filter(o => o.order_status === 'completed').length;
    const pendingOrders = orders.filter(o => o.order_status === 'pending' || o.order_status === 'preparing').length;
    const totalItemsSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const avgRating = orders.filter(o => o.customer_rating).length > 0
      ? orders.filter(o => o.customer_rating).reduce((sum, o) => sum + (o.customer_rating || 0), 0) / orders.filter(o => o.customer_rating).length
      : 0;
    
    return { totalOrders, totalRevenue, avgOrderValue, completedOrders, pendingOrders, totalItemsSold, avgRating };
  };

  const getOrderTypeBadge = (type: Order['order_type']) => {
    switch (type) {
      case 'dine_in':
        return <Badge className="bg-blue-100 text-blue-800">Tại chỗ</Badge>;
      case 'takeout':
        return <Badge className="bg-green-100 text-green-800">Mang về</Badge>;
      case 'delivery':
        return <Badge className="bg-orange-100 text-orange-800"><Truck className="w-3 h-3 mr-1" />Giao hàng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getOrderStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xác nhận</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Đã xác nhận</Badge>;
      case 'preparing':
        return <Badge className="bg-yellow-100 text-yellow-800"><Timer className="w-3 h-3 mr-1" />Đang làm</Badge>;
      case 'ready':
        return <Badge className="bg-purple-100 text-purple-800"><Package className="w-3 h-3 mr-1" />Sẵn sàng</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800"><Truck className="w-3 h-3 mr-1" />Đã giao</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order['payment_status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ thanh toán</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Đã thanh toán</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800"><ArrowDownRight className="w-3 h-3 mr-1" />Đã hoàn tiền</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Thanh toán một phần</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: Order['payment_method']) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-purple-600" />;
      case 'ewallet':
        return <Phone className="w-4 h-4 text-orange-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-3 h-3 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const openDetailDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả đơn hàng của khách hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đơn hàng
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedOrders} hoàn thành
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Từ tất cả đơn hàng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trị TB
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Trung bình mỗi đơn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món đã bán
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItemsSold}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số món
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đánh giá TB
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5</div>
            <div className="flex mt-1">
              {getRatingStars(Math.round(stats.avgRating))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang xử lý
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Đơn hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Danh sách đơn hàng
          </CardTitle>
          <CardDescription>
            Theo dõi và quản lý tất cả đơn hàng của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, hoặc mã đơn..."
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
                <SelectItem value="preparing">Đang làm</SelectItem>
                <SelectItem value="ready">Sẵn sàng</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="dine_in">Tại chỗ</SelectItem>
                <SelectItem value="takeout">Mang về</SelectItem>
                <SelectItem value="delivery">Giao hàng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="card">Thẻ</SelectItem>
                <SelectItem value="transfer">Chuyển khoản</SelectItem>
                <SelectItem value="ewallet">Ví điện tử</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Ngày/Giờ</TableHead>
                <TableHead>Loại/Bàn</TableHead>
                <TableHead>Món ăn</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {order.customer_name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customer_phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(order.order_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{formatTime(order.order_time)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getOrderTypeBadge(order.order_type)}
                      {order.table_number && (
                        <div className="text-sm text-muted-foreground">
                          Bàn: {order.table_number}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {order.items.length} món ({order.items.reduce((sum, item) => sum + item.quantity, 0)} phần)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items.slice(0, 2).map(item => item.dish_name).join(', ')}
                        {order.items.length > 2 && '...'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(order.payment_method)}
                        <span className="text-sm capitalize">
                          {order.payment_method === 'cash' ? 'Tiền mặt' :
                           order.payment_method === 'card' ? 'Thẻ' :
                           order.payment_method === 'transfer' ? 'Chuyển khoản' : 'Ví điện tử'}
                        </span>
                      </div>
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getOrderStatusBadge(order.order_status)}
                  </TableCell>
                  <TableCell>
                    {order.customer_rating ? (
                      <div className="space-y-1">
                        <div className="flex">
                          {getRatingStars(order.customer_rating)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer_rating}/5
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Chưa đánh giá</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                      {order.loyalty_points_earned > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Gift className="w-3 h-3" />
                          +{order.loyalty_points_earned} điểm
                        </div>
                      )}
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
                        <DropdownMenuItem onClick={() => openDetailDialog(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="mr-2 h-4 w-4" />
                          In hóa đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Gửi phản hồi
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Xuất báo cáo
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

      {/* Dialog chi tiết đơn hàng */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng của khách hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4 max-h-[600px] overflow-y-auto">
              {/* Thông tin khách hàng và đơn hàng */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedOrder.customer_name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{selectedOrder.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{selectedOrder.customer_email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedOrder.customer_phone}</span>
                    </div>
                    {selectedOrder.delivery_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-sm">{selectedOrder.delivery_address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Mã đơn:</span>
                      <span className="font-mono font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày đặt:</span>
                      <span>{formatDate(selectedOrder.order_date)} {formatTime(selectedOrder.order_time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loại đơn:</span>
                      {getOrderTypeBadge(selectedOrder.order_type)}
                    </div>
                    {selectedOrder.table_number && (
                      <div className="flex justify-between">
                        <span>Bàn:</span>
                        <span className="font-medium">{selectedOrder.table_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Nhân viên:</span>
                      <span>{selectedOrder.staff_name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Danh sách món ăn */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Danh sách món ăn</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Món ăn</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.dish_name}</div>
                              {item.special_instructions && (
                                <div className="text-sm text-muted-foreground">
                                  Ghi chú: {item.special_instructions}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Thông tin thanh toán và trạng thái */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế:</span>
                      <span>{formatCurrency(selectedOrder.tax_amount)}</span>
                    </div>
                    {selectedOrder.service_charge > 0 && (
                      <div className="flex justify-between">
                        <span>Phí phục vụ:</span>
                        <span>{formatCurrency(selectedOrder.service_charge)}</span>
                      </div>
                    )}
                    {selectedOrder.delivery_fee > 0 && (
                      <div className="flex justify-between">
                        <span>Phí giao hàng:</span>
                        <span>{formatCurrency(selectedOrder.delivery_fee)}</span>
                      </div>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Phương thức:</span>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(selectedOrder.payment_method)}
                        <span>
                          {selectedOrder.payment_method === 'cash' ? 'Tiền mặt' :
                           selectedOrder.payment_method === 'card' ? 'Thẻ' :
                           selectedOrder.payment_method === 'transfer' ? 'Chuyển khoản' : 'Ví điện tử'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      {getPaymentStatusBadge(selectedOrder.payment_status)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trạng thái & Đánh giá</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Trạng thái đơn:</span>
                      {getOrderStatusBadge(selectedOrder.order_status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian làm:</span>
                      <span>
                        {selectedOrder.actual_preparation_time 
                          ? `${selectedOrder.actual_preparation_time} phút` 
                          : `${selectedOrder.preparation_time} phút (dự kiến)`}
                      </span>
                    </div>
                    {selectedOrder.delivery_time && (
                      <div className="flex justify-between">
                        <span>Giao lúc:</span>
                        <span>{new Date(selectedOrder.delivery_time).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    {selectedOrder.customer_rating && (
                      <div>
                        <div className="flex justify-between">
                          <span>Đánh giá:</span>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {getRatingStars(selectedOrder.customer_rating)}
                            </div>
                            <span>{selectedOrder.customer_rating}/5</span>
                          </div>
                        </div>
                        {selectedOrder.customer_feedback && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium mb-1">Phản hồi:</div>
                            <div className="text-sm text-gray-600">"{selectedOrder.customer_feedback}"</div>
                          </div>
                        )}
                      </div>
                    )}
                    {(selectedOrder.loyalty_points_earned > 0 || selectedOrder.loyalty_points_used > 0) && (
                      <div className="space-y-2">
                        {selectedOrder.loyalty_points_used > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Điểm đã dùng:</span>
                            <span>-{selectedOrder.loyalty_points_used}</span>
                          </div>
                        )}
                        {selectedOrder.loyalty_points_earned > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Điểm tích lũy:</span>
                            <span>+{selectedOrder.loyalty_points_earned}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Ghi chú */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
            <Button>
              <Receipt className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
