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
  Percent,
  Gift,
  Target,
  TrendingUp,
  Star,
  Copy,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

// Import form components and API hooks
import { PromotionForm, VoucherForm } from '@/components/forms';
import { DeleteConfirmDialog } from '@/components/forms';
import { useGetPromotionsQuery, useCreatePromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation, useGetVouchersQuery, useCreateVoucherMutation, useUpdateVoucherMutation, useDeleteVoucherMutation } from '@/state/api';

interface Promotion {
  id: string;
  name: string;
  description: string;
  promotion_type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'combo';
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
  applicable_menus: string[];
  created_at: string;
  updated_at: string;
}

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
  created_at: string;
  updated_at: string;
}

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'promotions' | 'vouchers'>('promotions');
  
  // Promotion dialogs
  const [isCreatePromotionDialogOpen, setIsCreatePromotionDialogOpen] = useState(false);
  const [isEditPromotionDialogOpen, setIsEditPromotionDialogOpen] = useState(false);
  const [isDeletePromotionDialogOpen, setIsDeletePromotionDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);

  // Voucher dialogs
  const [isCreateVoucherDialogOpen, setIsCreateVoucherDialogOpen] = useState(false);
  const [isEditVoucherDialogOpen, setIsEditVoucherDialogOpen] = useState(false);
  const [isDeleteVoucherDialogOpen, setIsDeleteVoucherDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);

  // API hooks
  const { data: promotions = [], isLoading: promotionsLoading, refetch: refetchPromotions } = useGetPromotionsQuery();
  const [createPromotion] = useCreatePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();

  const { data: vouchers = [], isLoading: vouchersLoading, refetch: refetchVouchers } = useGetVouchersQuery();
  const [createVoucher] = useCreateVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const filteredPromotions = promotions.filter((promotion: Promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || promotion.promotion_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && promotion.is_active) ||
                         (selectedStatus === 'inactive' && !promotion.is_active);
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredVouchers = vouchers.filter((voucher: Voucher) => {
    const matchesSearch = voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || voucher.discount_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && voucher.is_active) ||
                         (selectedStatus === 'inactive' && !voucher.is_active);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPromotionStats = () => {
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter((p: Promotion) => p.is_active).length;
    const totalUsage = promotions.reduce((sum: number, p: Promotion) => sum + p.used_count, 0);
    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter((v: Voucher) => v.is_active).length;
    const totalVoucherUsage = vouchers.reduce((sum: number, v: Voucher) => sum + v.used_count, 0);

    return { 
      totalPromotions, 
      activePromotions, 
      totalUsage, 
      totalVouchers, 
      activeVouchers, 
      totalVoucherUsage 
    };
  };

  const getPromotionTypeBadge = (type: Promotion['promotion_type']) => {
    switch (type) {
      case 'percentage':
        return <Badge className="bg-blue-100 text-blue-800"><Percent className="w-3 h-3 mr-1" />Phần trăm</Badge>;
      case 'fixed_amount':
        return <Badge className="bg-green-100 text-green-800"><Gift className="w-3 h-3 mr-1" />Số tiền cố định</Badge>;
      case 'buy_one_get_one':
        return <Badge className="bg-purple-100 text-purple-800"><Target className="w-3 h-3 mr-1" />Mua 1 tặng 1</Badge>;
      case 'combo':
        return <Badge className="bg-orange-100 text-orange-800"><TrendingUp className="w-3 h-3 mr-1" />Combo</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getVoucherTypeBadge = (type: Voucher['discount_type']) => {
    switch (type) {
      case 'percentage':
        return <Badge className="bg-blue-100 text-blue-800"><Percent className="w-3 h-3 mr-1" />Phần trăm</Badge>;
      case 'fixed_amount':
        return <Badge className="bg-green-100 text-green-800"><Gift className="w-3 h-3 mr-1" />Số tiền cố định</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800"><Play className="w-3 h-3 mr-1" />Đang hoạt động</Badge> :
      <Badge className="bg-gray-100 text-gray-800"><Pause className="w-3 h-3 mr-1" />Tạm dừng</Badge>;
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

  // Promotion handlers
  const handleCreatePromotionSuccess = () => {
    setIsCreatePromotionDialogOpen(false);
    refetchPromotions();
    toast.success('Khuyến mãi đã được tạo thành công!');
  };

  const handleUpdatePromotionSuccess = () => {
    setIsEditPromotionDialogOpen(false);
    setEditingPromotion(null);
    refetchPromotions();
    toast.success('Khuyến mãi đã được cập nhật!');
  };

  const handleDeletePromotionSuccess = () => {
    setIsDeletePromotionDialogOpen(false);
    setDeletingPromotion(null);
    refetchPromotions();
    toast.success('Khuyến mãi đã được xóa!');
  };

  const openCreatePromotionDialog = () => {
    setIsCreatePromotionDialogOpen(true);
  };

  const openEditPromotionDialog = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsEditPromotionDialogOpen(true);
  };

  const openDeletePromotionDialog = (promotion: Promotion) => {
    setDeletingPromotion(promotion);
    setIsDeletePromotionDialogOpen(true);
  };

  // Voucher handlers
  const handleCreateVoucherSuccess = () => {
    setIsCreateVoucherDialogOpen(false);
    refetchVouchers();
    toast.success('Mã giảm giá đã được tạo thành công!');
  };

  const handleUpdateVoucherSuccess = () => {
    setIsEditVoucherDialogOpen(false);
    setEditingVoucher(null);
    refetchVouchers();
    toast.success('Mã giảm giá đã được cập nhật!');
  };

  const handleDeleteVoucherSuccess = () => {
    setIsDeleteVoucherDialogOpen(false);
    setDeletingVoucher(null);
    refetchVouchers();
    toast.success('Mã giảm giá đã được xóa!');
  };

  const openCreateVoucherDialog = () => {
    setIsCreateVoucherDialogOpen(true);
  };

  const openEditVoucherDialog = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsEditVoucherDialogOpen(true);
  };

  const openDeleteVoucherDialog = (voucher: Voucher) => {
    setDeletingVoucher(voucher);
    setIsDeleteVoucherDialogOpen(true);
  };

  const stats = getPromotionStats();
  const isLoading = promotionsLoading || vouchersLoading;

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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h1>
          <p className="text-muted-foreground">
            Quản lý khuyến mãi và mã giảm giá
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreatePromotionDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo khuyến mãi
          </Button>
          <Button variant="outline" onClick={openCreateVoucherDialog}>
            <Gift className="mr-2 h-4 w-4" />
            Tạo mã giảm giá
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng khuyến mãi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPromotions}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả khuyến mãi
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
            <div className="text-2xl font-bold text-green-600">{stats.activePromotions}</div>
            <p className="text-xs text-muted-foreground">
              Khuyến mãi hiện tại
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt sử dụng
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt dùng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng mã giảm giá
            </CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalVouchers}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả mã giảm giá
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mã đang hoạt động
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.activeVouchers}</div>
            <p className="text-xs text-muted-foreground">
              Mã hiện tại
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt dùng mã
            </CardTitle>
            <Gift className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalVoucherUsage}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt dùng mã
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quản lý khuyến mãi và mã giảm giá
          </CardTitle>
          <CardDescription>
            Tạo và quản lý các chương trình khuyến mãi, mã giảm giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              if (activeTab === 'promotions') refetchPromotions();
              else refetchVouchers();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === 'promotions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('promotions')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Khuyến mãi ({stats.totalPromotions})
            </Button>
            <Button
              variant={activeTab === 'vouchers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('vouchers')}
            >
              <Gift className="mr-2 h-4 w-4" />
              Mã giảm giá ({stats.totalVouchers})
            </Button>
          </div>

          {activeTab === 'promotions' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên khuyến mãi</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion: Promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{promotion.name}</div>
                        <div className="text-sm text-muted-foreground">{promotion.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPromotionTypeBadge(promotion.promotion_type)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {promotion.promotion_type === 'percentage' 
                            ? `${promotion.discount_value}%` 
                            : formatCurrency(promotion.discount_value)
                          }
                        </div>
                        {promotion.min_order_value && (
                          <div className="text-xs text-muted-foreground">
                            Tối thiểu: {formatCurrency(promotion.min_order_value)}
                          </div>
                        )}
                        {promotion.max_discount && (
                          <div className="text-xs text-muted-foreground">
                            Tối đa: {formatCurrency(promotion.max_discount)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(promotion.start_date)}
                        </div>
                        <div className="text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(promotion.end_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(promotion.is_active)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {promotion.used_count}
                        {promotion.usage_limit && ` / ${promotion.usage_limit}`}
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
                          <DropdownMenuItem onClick={() => openEditPromotionDialog(promotion)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeletePromotionDialog(promotion)}
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
          )}

          {activeTab === 'vouchers' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giảm giá</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher: Voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">
                      <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {voucher.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{voucher.name}</div>
                        <div className="text-sm text-muted-foreground">{voucher.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getVoucherTypeBadge(voucher.discount_type)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {voucher.discount_type === 'percentage' 
                            ? `${voucher.discount_value}%` 
                            : formatCurrency(voucher.discount_value)
                          }
                        </div>
                        {voucher.min_order_value && (
                          <div className="text-xs text-muted-foreground">
                            Tối thiểu: {formatCurrency(voucher.min_order_value)}
                          </div>
                        )}
                        {voucher.max_discount && (
                          <div className="text-xs text-muted-foreground">
                            Tối đa: {formatCurrency(voucher.max_discount)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(voucher.start_date)}
                        </div>
                        <div className="text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(voucher.end_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(voucher.is_active)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.used_count}
                        {voucher.usage_limit && ` / ${voucher.usage_limit}`}
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
                          <DropdownMenuItem onClick={() => openEditVoucherDialog(voucher)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép mã
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteVoucherDialog(voucher)}
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
          )}
        </CardContent>
      </Card>

      {/* Create Promotion Dialog */}
      <Dialog open={isCreatePromotionDialogOpen} onOpenChange={setIsCreatePromotionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
            <DialogDescription>
              Tạo mới chương trình khuyến mãi
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            mode="create"
            onSuccess={handleCreatePromotionSuccess}
            onCancel={() => setIsCreatePromotionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditPromotionDialogOpen} onOpenChange={setIsEditPromotionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khuyến mãi
            </DialogDescription>
          </DialogHeader>
          {editingPromotion && (
            <PromotionForm
              mode="update"
              initialValues={editingPromotion}
              onSuccess={handleUpdatePromotionSuccess}
              onCancel={() => setIsEditPromotionDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Promotion Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeletePromotionDialogOpen}
        onOpenChange={setIsDeletePromotionDialogOpen}
        title="Xóa khuyến mãi"
        description={`Bạn có chắc chắn muốn xóa "${deletingPromotion?.name}"?`}
        onConfirm={() => {
          if (deletingPromotion) {
            deletePromotion(deletingPromotion.id)
              .unwrap()
              .then(handleDeletePromotionSuccess)
              .catch(() => toast.error('Có lỗi xảy ra khi xóa khuyến mãi!'));
          }
        }}
      />

      {/* Create Voucher Dialog */}
      <Dialog open={isCreateVoucherDialogOpen} onOpenChange={setIsCreateVoucherDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo mã giảm giá mới</DialogTitle>
            <DialogDescription>
              Tạo mới mã giảm giá
            </DialogDescription>
          </DialogHeader>
          <VoucherForm
            mode="create"
            onSuccess={handleCreateVoucherSuccess}
            onCancel={() => setIsCreateVoucherDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Voucher Dialog */}
      <Dialog open={isEditVoucherDialogOpen} onOpenChange={setIsEditVoucherDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin mã giảm giá
            </DialogDescription>
          </DialogHeader>
          {editingVoucher && (
            <VoucherForm
              mode="update"
              initialValues={editingVoucher}
              onSuccess={handleUpdateVoucherSuccess}
              onCancel={() => setIsEditVoucherDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Voucher Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteVoucherDialogOpen}
        onOpenChange={setIsDeleteVoucherDialogOpen}
        title="Xóa mã giảm giá"
        description={`Bạn có chắc chắn muốn xóa "${deletingVoucher?.name}"?`}
        onConfirm={() => {
          if (deletingVoucher) {
            deleteVoucher(deletingVoucher.id)
              .unwrap()
              .then(handleDeleteVoucherSuccess)
              .catch(() => toast.error('Có lỗi xảy ra khi xóa mã giảm giá!'));
          }
        }}
      />
    </div>
  );
}
