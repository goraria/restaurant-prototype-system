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
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Gift,
  Star,
  Crown,
  Award,
  Users,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Send,
  History,
  Target,
  Coins,
  Sparkles,
  Heart,
  Percent,
  ShoppingBag,
  Clock,
  ArrowUp,
  ArrowDown,
  Ticket,
  PiggyBank,
  CreditCard,
  MessageSquare,
  Bell,
  Filter,
  FileText,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points_required: number;
  benefits: string[];
  discount_percentage: number;
  free_items: string[];
  special_access: string[];
  validity_months: number;
  status: 'active' | 'inactive' | 'coming_soon';
  created_at: string;
  updated_at: string;
}

interface CustomerLoyalty {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  current_points: number;
  total_points_earned: number;
  total_points_used: number;
  current_level: 'bronze' | 'silver' | 'gold' | 'platinum';
  next_level: 'silver' | 'gold' | 'platinum' | null;
  points_to_next_level: number;
  total_spent: number;
  total_orders: number;
  join_date: string;
  last_activity: string;
  tier_expires_at: string;
  lifetime_value: number;
  status: 'active' | 'inactive' | 'suspended';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface PointTransaction {
  id: string;
  customer_id: string;
  customer_name: string;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'bonus' | 'penalty';
  points: number;
  description: string;
  order_id?: string;
  campaign_id?: string;
  expiry_date?: string;
  processed_by: string;
  created_at: string;
}

// Mock data cho chương trình khách hàng thân thiết
const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: '1',
    name: 'Thành viên Đồng',
    description: 'Chào mừng khách hàng mới gia nhập chương trình thân thiết',
    level: 'bronze',
    points_required: 0,
    benefits: [
      'Tích điểm từ mỗi đơn hàng',
      'Nhận thông báo khuyến mãi',
      'Sinh nhật được giảm giá 5%'
    ],
    discount_percentage: 0,
    free_items: [],
    special_access: ['Thông báo khuyến mãi sớm'],
    validity_months: 12,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Thành viên Bạc',
    description: 'Dành cho khách hàng có chi tiêu từ 5 triệu trong 12 tháng',
    level: 'silver',
    points_required: 1000,
    benefits: [
      'Giảm giá 5% mọi đơn hàng',
      'Ưu tiên đặt bàn',
      'Miễn phí giao hàng dưới 3km',
      'Sinh nhật được tặng bánh miễn phí'
    ],
    discount_percentage: 5,
    free_items: ['Trà đá miễn phí'],
    special_access: ['Đặt bàn VIP', 'Menu đặc biệt'],
    validity_months: 12,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Thành viên Vàng',
    description: 'Dành cho khách hàng VIP có chi tiêu từ 15 triệu trong 12 tháng',
    level: 'gold',
    points_required: 3000,
    benefits: [
      'Giảm giá 10% mọi đơn hàng',
      'Đặt bàn VIP miễn phí',
      'Giao hàng miễn phí toàn thành phố',
      'Sinh nhật được tặng set món đặc biệt',
      'Tích điểm gấp đôi vào cuối tuần'
    ],
    discount_percentage: 10,
    free_items: ['Khai vị miễn phí', 'Đồ uống chào mừng'],
    special_access: ['Phòng VIP', 'Menu Chef đặc biệt', 'Tư vấn thực đơn riêng'],
    validity_months: 12,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Thành viên Bạch Kim',
    description: 'Đẳng cấp cao nhất dành cho khách hàng VVIP',
    level: 'platinum',
    points_required: 8000,
    benefits: [
      'Giảm giá 15% mọi đơn hàng',
      'Đặt bàn VIP miễn phí mọi lúc',
      'Giao hàng miễn phí toàn quốc',
      'Sinh nhật được tổ chức tiệc riêng',
      'Tích điểm gấp 3 lần',
      'Tư vấn menu cá nhân hóa',
      'Ưu tiên phục vụ tuyệt đối'
    ],
    discount_percentage: 15,
    free_items: ['Full set khai vị', 'Rượu vang chào mừng', 'Tráng miệng đặc biệt'],
    special_access: ['Phòng VVIP', 'Chef riêng', 'Menu độc quyền', 'Sự kiện đặc biệt'],
    validity_months: 24,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockCustomerLoyalty: CustomerLoyalty[] = [
  {
    id: '1',
    customer_id: 'CUST001',
    customer_name: 'Nguyễn Văn Minh',
    customer_phone: '0901234567',
    customer_email: 'nguyen.minh@email.com',
    current_points: 2850,
    total_points_earned: 3200,
    total_points_used: 350,
    current_level: 'gold',
    next_level: 'platinum',
    points_to_next_level: 5150,
    total_spent: 125000000,
    total_orders: 85,
    join_date: '2023-01-15',
    last_activity: '2024-03-30',
    tier_expires_at: '2025-01-15',
    lifetime_value: 125000000,
    status: 'active',
    notes: 'Khách hàng VIP, rất hài lòng với dịch vụ',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-03-30T18:30:00Z'
  },
  {
    id: '2',
    customer_id: 'CUST002',
    customer_name: 'Trần Thị Hương',
    customer_phone: '0907654321',
    customer_email: 'tran.huong@company.vn',
    current_points: 8950,
    total_points_earned: 9500,
    total_points_used: 550,
    current_level: 'platinum',
    next_level: null,
    points_to_next_level: 0,
    total_spent: 280000000,
    total_orders: 156,
    join_date: '2022-08-20',
    last_activity: '2024-03-30',
    tier_expires_at: '2025-08-20',
    lifetime_value: 280000000,
    status: 'active',
    notes: 'Doanh nghiệp đối tác, thường đặt tiệc lớn',
    created_at: '2022-08-20T14:15:00Z',
    updated_at: '2024-03-30T12:45:00Z'
  },
  {
    id: '3',
    customer_id: 'CUST003',
    customer_name: 'Lê Hoàng Phúc',
    customer_phone: '0912345678',
    customer_email: 'le.phuc@gmail.com',
    current_points: 1650,
    total_points_earned: 1850,
    total_points_used: 200,
    current_level: 'silver',
    next_level: 'gold',
    points_to_next_level: 1350,
    total_spent: 68000000,
    total_orders: 42,
    join_date: '2023-06-10',
    last_activity: '2024-03-29',
    tier_expires_at: '2024-06-10',
    lifetime_value: 68000000,
    status: 'active',
    notes: 'Khách hàng tiềm năng, có thể phát triển lên Gold',
    created_at: '2023-06-10T16:20:00Z',
    updated_at: '2024-03-29T19:15:00Z'
  },
  {
    id: '4',
    customer_id: 'CUST004',
    customer_name: 'Phạm Minh Tú',
    customer_phone: '0938765432',
    customer_email: 'pham.tu@outlook.com',
    current_points: 480,
    total_points_earned: 520,
    total_points_used: 40,
    current_level: 'bronze',
    next_level: 'silver',
    points_to_next_level: 520,
    total_spent: 22000000,
    total_orders: 18,
    join_date: '2024-01-20',
    last_activity: '2024-03-28',
    tier_expires_at: '2025-01-20',
    lifetime_value: 22000000,
    status: 'active',
    notes: 'Khách hàng mới, cần chăm sóc để phát triển',
    created_at: '2024-01-20T11:30:00Z',
    updated_at: '2024-03-28T20:10:00Z'
  },
  {
    id: '5',
    customer_id: 'CUST005',
    customer_name: 'Vũ Thành Đạt',
    customer_phone: '0945123789',
    customer_email: 'vu.dat@email.vn',
    current_points: 180,
    total_points_earned: 240,
    total_points_used: 60,
    current_level: 'bronze',
    next_level: 'silver',
    points_to_next_level: 820,
    total_spent: 12000000,
    total_orders: 8,
    join_date: '2024-02-05',
    last_activity: '2024-02-28',
    tier_expires_at: '2025-02-05',
    lifetime_value: 12000000,
    status: 'inactive',
    notes: 'Chưa hoạt động gần đây, cần liên hệ',
    created_at: '2024-02-05T13:45:00Z',
    updated_at: '2024-02-28T17:25:00Z'
  }
];

const mockPointTransactions: PointTransaction[] = [
  {
    id: '1',
    customer_id: 'CUST001',
    customer_name: 'Nguyễn Văn Minh',
    transaction_type: 'earned',
    points: 62,
    description: 'Tích điểm từ đơn hàng ORD001 - Bữa tiệc sinh nhật',
    order_id: 'ORD001',
    processed_by: 'EMP002',
    created_at: '2024-03-30T21:15:00Z'
  },
  {
    id: '2',
    customer_id: 'CUST002',
    customer_name: 'Trần Thị Hương',
    transaction_type: 'earned',
    points: 206,
    description: 'Tích điểm từ đơn hàng ORD002 - Họp mặt công ty',
    order_id: 'ORD002',
    processed_by: 'EMP002',
    created_at: '2024-03-30T14:45:00Z'
  },
  {
    id: '3',
    customer_id: 'CUST002',
    customer_name: 'Trần Thị Hương',
    transaction_type: 'redeemed',
    points: -100,
    description: 'Sử dụng điểm để giảm giá đơn hàng ORD002',
    order_id: 'ORD002',
    processed_by: 'EMP002',
    created_at: '2024-03-30T12:30:00Z'
  },
  {
    id: '4',
    customer_id: 'CUST003',
    customer_name: 'Lê Hoàng Phúc',
    transaction_type: 'earned',
    points: 33,
    description: 'Tích điểm từ đơn hàng ORD003 - Giao hàng tận nơi',
    order_id: 'ORD003',
    processed_by: 'EMP004',
    created_at: '2024-03-29T19:05:00Z'
  },
  {
    id: '5',
    customer_id: 'CUST001',
    customer_name: 'Nguyễn Văn Minh',
    transaction_type: 'bonus',
    points: 500,
    description: 'Điểm thưởng sinh nhật - Thành viên Vàng',
    campaign_id: 'BIRTHDAY2024',
    processed_by: 'SYSTEM',
    created_at: '2024-03-28T00:00:00Z'
  }
];

export default function LoyaltyPage() {
  const [customerLoyalty, setCustomerLoyalty] = useState<CustomerLoyalty[]>(mockCustomerLoyalty);
  const [pointTransactions] = useState<PointTransaction[]>(mockPointTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'customers' | 'programs' | 'transactions'>('customers');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerLoyalty | null>(null);
  
  const [formData, setFormData] = useState({
    points: 0,
    transaction_type: 'bonus' as const,
    description: '',
    expiry_date: ''
  });

  const filteredCustomers = customerLoyalty.filter(customer => {
    const matchesSearch = customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customer_phone.includes(searchTerm) ||
                         customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || customer.current_level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getLoyaltyStats = () => {
    const totalCustomers = customerLoyalty.length;
    const activeCustomers = customerLoyalty.filter(c => c.status === 'active').length;
    const totalPointsIssued = customerLoyalty.reduce((sum, c) => sum + c.total_points_earned, 0);
    const totalPointsRedeemed = customerLoyalty.reduce((sum, c) => sum + c.total_points_used, 0);
    const avgLifetimeValue = customerLoyalty.reduce((sum, c) => sum + c.lifetime_value, 0) / totalCustomers;
    
    const levelDistribution = {
      bronze: customerLoyalty.filter(c => c.current_level === 'bronze').length,
      silver: customerLoyalty.filter(c => c.current_level === 'silver').length,
      gold: customerLoyalty.filter(c => c.current_level === 'gold').length,
      platinum: customerLoyalty.filter(c => c.current_level === 'platinum').length
    };
    
    return { 
      totalCustomers, 
      activeCustomers, 
      totalPointsIssued, 
      totalPointsRedeemed, 
      avgLifetimeValue,
      levelDistribution
    };
  };

  const getLevelBadge = (level: CustomerLoyalty['current_level']) => {
    switch (level) {
      case 'bronze':
        return <Badge className="bg-amber-100 text-amber-800">Đồng</Badge>;
      case 'silver':
        return <Badge className="bg-gray-100 text-gray-800">Bạc</Badge>;
      case 'gold':
        return <Badge className="bg-yellow-100 text-yellow-800"><Crown className="w-3 h-3 mr-1" />Vàng</Badge>;
      case 'platinum':
        return <Badge className="bg-purple-100 text-purple-800"><Sparkles className="w-3 h-3 mr-1" />Bạch kim</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusBadge = (status: CustomerLoyalty['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Không hoạt động</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Tạm khóa</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTransactionTypeBadge = (type: PointTransaction['transaction_type']) => {
    switch (type) {
      case 'earned':
        return <Badge className="bg-green-100 text-green-800"><ArrowUp className="w-3 h-3 mr-1" />Tích điểm</Badge>;
      case 'redeemed':
        return <Badge className="bg-red-100 text-red-800"><ArrowDown className="w-3 h-3 mr-1" />Đổi điểm</Badge>;
      case 'bonus':
        return <Badge className="bg-blue-100 text-blue-800"><Gift className="w-3 h-3 mr-1" />Thưởng</Badge>;
      case 'penalty':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Phạt</Badge>;
      case 'expired':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Hết hạn</Badge>;
      default:
        return <Badge variant="outline">Khác</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAdjustPoints = () => {
    if (!editingCustomer) return;
    
    if (!formData.description || formData.points === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Cập nhật điểm cho khách hàng
    setCustomerLoyalty(customerLoyalty.map(customer => 
      customer.id === editingCustomer.id 
        ? { 
            ...customer, 
            current_points: customer.current_points + formData.points,
            total_points_earned: formData.points > 0 
              ? customer.total_points_earned + formData.points 
              : customer.total_points_earned,
            total_points_used: formData.points < 0 
              ? customer.total_points_used + Math.abs(formData.points)
              : customer.total_points_used,
            updated_at: new Date().toISOString() 
          }
        : customer
    ));

    toast.success(`Đã ${formData.points > 0 ? 'cộng' : 'trừ'} ${Math.abs(formData.points)} điểm cho ${editingCustomer.customer_name}!`);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      points: 0,
      transaction_type: 'bonus',
      description: '',
      expiry_date: ''
    });
    setEditingCustomer(null);
  };

  const openAdjustDialog = (customer: CustomerLoyalty) => {
    setEditingCustomer(customer);
    resetForm();
    setIsDialogOpen(true);
  };

  const stats = getLoyaltyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chương trình khách hàng thân thiết</h1>
          <p className="text-muted-foreground">
            Quản lý điểm tích lũy và chương trình ưu đãi khách hàng
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

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'customers' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('customers')}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Khách hàng thân thiết
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'programs' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('programs')}
        >
          <Award className="w-4 h-4 inline mr-2" />
          Chương trình
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'transactions' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <History className="w-4 h-4 inline mr-2" />
          Lịch sử điểm
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng thành viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCustomers} đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm đã phát
            </CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalPointsIssued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tổng điểm tích lũy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm đã dùng
            </CardTitle>
            <Ticket className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalPointsRedeemed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalPointsRedeemed / stats.totalPointsIssued) * 100).toFixed(1)}% tỷ lệ sử dụng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trị TB
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgLifetimeValue)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Thành viên Vàng+
            </CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.levelDistribution.gold + stats.levelDistribution.platinum}
            </div>
            <p className="text-xs text-muted-foreground">
              {(((stats.levelDistribution.gold + stats.levelDistribution.platinum) / stats.totalCustomers) * 100).toFixed(1)}% VIP
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ tham gia
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Khách hàng tích cực
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Content */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Danh sách khách hàng thân thiết
            </CardTitle>
            <CardDescription>
              Quản lý thông tin và điểm tích lũy của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Hạng thành viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hạng</SelectItem>
                  <SelectItem value="bronze">Đồng</SelectItem>
                  <SelectItem value="silver">Bạc</SelectItem>
                  <SelectItem value="gold">Vàng</SelectItem>
                  <SelectItem value="platinum">Bạch kim</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Hạng thành viên</TableHead>
                  <TableHead>Điểm hiện tại</TableHead>
                  <TableHead>Tiến độ hạng</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Hoạt động gần nhất</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.customer_name.split(' ').map(n => n.charAt(0)).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{customer.customer_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customer.customer_phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getLevelBadge(customer.current_level)}
                        <div className="text-xs text-muted-foreground">
                          Thành viên từ {formatDate(customer.join_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-600">{customer.current_points.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tích: {customer.total_points_earned.toLocaleString()} | 
                          Dùng: {customer.total_points_used.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.next_level ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Tới {customer.next_level === 'silver' ? 'Bạc' : customer.next_level === 'gold' ? 'Vàng' : 'Bạch kim'}</span>
                            <span>{customer.points_to_next_level.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={calculateProgress(
                              customer.current_points, 
                              customer.current_points + customer.points_to_next_level
                            )} 
                            className="h-2" 
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-purple-600 font-medium">
                          Hạng cao nhất
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold">{formatCurrency(customer.total_spent)}</div>
                        <div className="text-xs text-muted-foreground">
                          {customer.total_orders} đơn hàng
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(customer.last_activity)}
                        <div className="text-xs text-muted-foreground">
                          Hết hạn: {formatDate(customer.tier_expires_at)}
                          {getDaysUntilExpiry(customer.tier_expires_at) < 30 && (
                            <span className="text-red-600 ml-1">
                              ({getDaysUntilExpiry(customer.tier_expires_at)} ngày)
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAdjustDialog(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Điều chỉnh điểm
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Gửi ưu đãi
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            Lịch sử điểm
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
      )}

      {activeTab === 'programs' && (
        <div className="grid gap-6 md:grid-cols-2">
          {mockLoyaltyPrograms.map((program) => (
            <Card key={program.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-2 ${
                program.level === 'bronze' ? 'bg-amber-500' :
                program.level === 'silver' ? 'bg-gray-400' :
                program.level === 'gold' ? 'bg-yellow-500' : 'bg-purple-500'
              }`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {program.level === 'gold' && <Crown className="w-5 h-5 text-yellow-500" />}
                    {program.level === 'platinum' && <Sparkles className="w-5 h-5 text-purple-500" />}
                    {program.name}
                  </CardTitle>
                  <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                    {program.status === 'active' ? 'Đang hoạt động' : 
                     program.status === 'inactive' ? 'Không hoạt động' : 'Sắp ra mắt'}
                  </Badge>
                </div>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Điểm yêu cầu</div>
                    <div className="text-lg font-semibold">{program.points_required.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Giảm giá</div>
                    <div className="text-lg font-semibold text-green-600">{program.discount_percentage}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Quyền lợi</div>
                  <ul className="space-y-1">
                    {program.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {program.free_items.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Món miễn phí</div>
                    <div className="flex flex-wrap gap-1">
                      {program.free_items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Gift className="w-3 h-3 mr-1" />
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {program.special_access.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Quyền truy cập đặc biệt</div>
                    <div className="flex flex-wrap gap-1">
                      {program.special_access.map((access, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {access}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Thành viên: {stats.levelDistribution[program.level]} người
                  </span>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Lịch sử giao dịch điểm
            </CardTitle>
            <CardDescription>
              Theo dõi tất cả giao dịch tích điểm và đổi điểm của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng..."
                  className="pl-8"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="earned">Tích điểm</SelectItem>
                  <SelectItem value="redeemed">Đổi điểm</SelectItem>
                  <SelectItem value="bonus">Thưởng</SelectItem>
                  <SelectItem value="penalty">Phạt</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại giao dịch</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Người xử lý</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPointTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {transaction.customer_name.split(' ').map(n => n.charAt(0)).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{transaction.customer_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTransactionTypeBadge(transaction.transaction_type)}
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.order_id ? (
                        <span className="font-mono text-sm">{transaction.order_id}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{transaction.processed_by}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDateTime(transaction.created_at)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog điều chỉnh điểm */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Điều chỉnh điểm tích lũy</DialogTitle>
            <DialogDescription>
              Cộng hoặc trừ điểm cho khách hàng {editingCustomer?.customer_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="points">Số điểm (nhập số âm để trừ điểm)</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
                placeholder="Nhập số điểm..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Loại giao dịch</Label>
              <Select value={formData.transaction_type} onValueChange={(value: any) => setFormData({...formData, transaction_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus">Thưởng</SelectItem>
                  <SelectItem value="penalty">Phạt</SelectItem>
                  <SelectItem value="earned">Tích điểm thủ công</SelectItem>
                  <SelectItem value="redeemed">Trừ điểm thủ công</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Nhập mô tả lý do điều chỉnh..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Ngày hết hạn (tùy chọn)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdjustPoints}>
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
