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
  Calendar,
  Percent,
  Gift,
  Target,
  TrendingUp,
  Star,
  Copy,
  Eye,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';

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

// Mock data for promotions
const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Giảm giá 20% món chính',
    description: 'Giảm 20% cho tất cả món chính trong thực đơn',
    promotion_type: 'percentage',
    discount_value: 20,
    min_order_value: 100000,
    max_discount: 50000,
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    is_active: true,
    usage_limit: 100,
    used_count: 25,
    applicable_menus: ['1', '2'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Mua 1 tặng 1 đồ uống',
    description: 'Mua 1 ly đồ uống bất kỳ tặng 1 ly cùng loại',
    promotion_type: 'buy_one_get_one',
    discount_value: 100,
    start_date: '2024-01-20',
    end_date: '2024-03-20',
    is_active: true,
    usage_limit: 50,
    used_count: 12,
    applicable_menus: ['4'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Combo tiết kiệm cuối tuần',
    description: 'Combo đặc biệt dành cho cuối tuần với giá ưu đãi',
    promotion_type: 'combo',
    discount_value: 30000,
    min_order_value: 200000,
    start_date: '2024-02-01',
    end_date: '2024-02-29',
    is_active: false,
    usage_limit: 30,
    used_count: 8,
    applicable_menus: ['1', '4'],
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'Giảm 50k cho đơn từ 300k',
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 300.000đ',
    promotion_type: 'fixed_amount',
    discount_value: 50000,
    min_order_value: 300000,
    start_date: '2024-02-10',
    end_date: '2024-03-10',
    is_active: true,
    used_count: 45,
    applicable_menus: ['1', '2', '3'],
    created_at: '2024-02-05T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  }
];

const promotionTypes = [
  { value: 'percentage', label: 'Giảm theo %', icon: Percent },
  { value: 'fixed_amount', label: 'Giảm số tiền', icon: Gift },
  { value: 'buy_one_get_one', label: 'Mua 1 tặng 1', icon: Target },
  { value: 'combo', label: 'Combo đặc biệt', icon: Star }
];

const availableMenus = [
  { id: '1', name: 'Thực đơn chính' },
  { id: '2', name: 'Thực đơn trưa' },
  { id: '3', name: 'Thực đơn tối' },
  { id: '4', name: 'Thực đơn đồ uống' }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promotion_type: 'percentage' as const,
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    start_date: '',
    end_date: '',
    is_active: true,
    usage_limit: 0,
    applicable_menus: [] as string[]
  });

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || promotion.promotion_type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPromotionStats = () => {
    const active = promotions.filter(p => p.is_active).length;
    const inactive = promotions.filter(p => !p.is_active).length;
    const totalUsage = promotions.reduce((sum, p) => sum + p.used_count, 0);
    const avgUsage = totalUsage / promotions.length;
    
    return { active, inactive, totalUsage, avgUsage };
  };

  const getPromotionValue = (promotion: Promotion) => {
    switch (promotion.promotion_type) {
      case 'percentage':
        return `${promotion.discount_value}%`;
      case 'fixed_amount':
        return formatPrice(promotion.discount_value);
      case 'buy_one_get_one':
        return 'BOGO';
      case 'combo':
        return formatPrice(promotion.discount_value);
      default:
        return promotion.discount_value.toString();
    }
  };

  const getUsageProgress = (promotion: Promotion) => {
    if (!promotion.usage_limit) return 100;
    return (promotion.used_count / promotion.usage_limit) * 100;
  };

  const isPromotionExpired = (promotion: Promotion) => {
    return new Date(promotion.end_date) < new Date();
  };

  const handleCreate = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      ...formData,
      used_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setPromotions([...promotions, newPromotion]);
    toast.success('Khuyến mãi đã được tạo thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingPromotion) return;
    
    setPromotions(promotions.map(promotion => 
      promotion.id === editingPromotion.id 
        ? { ...promotion, ...formData, updated_at: new Date().toISOString() }
        : promotion
    ));
    toast.success('Khuyến mãi đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
    toast.success('Khuyến mãi đã được xóa thành công!');
  };

  const handleToggleActive = (id: string) => {
    setPromotions(promotions.map(promotion =>
      promotion.id === id
        ? { ...promotion, is_active: !promotion.is_active, updated_at: new Date().toISOString() }
        : promotion
    ));
    toast.success('Trạng thái khuyến mãi đã được cập nhật!');
  };

  const handleDuplicate = (promotion: Promotion) => {
    const duplicatedPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString(),
      name: promotion.name + ' (Sao chép)',
      used_count: 0,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setPromotions([...promotions, duplicatedPromotion]);
    toast.success('Khuyến mãi đã được sao chép thành công!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      promotion_type: 'percentage',
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      start_date: '',
      end_date: '',
      is_active: true,
      usage_limit: 0,
      applicable_menus: []
    });
    setEditingPromotion(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      promotion_type: promotion.promotion_type,
      discount_value: promotion.discount_value,
      min_order_value: promotion.min_order_value || 0,
      max_discount: promotion.max_discount || 0,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      is_active: promotion.is_active,
      usage_limit: promotion.usage_limit || 0,
      applicable_menus: promotion.applicable_menus
    });
    setIsDialogOpen(true);
  };

  const getPromotionTypeLabel = (type: string) => {
    return promotionTypes.find(t => t.value === type)?.label || type;
  };

  const stats = getPromotionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khuyến mãi thực đơn</h1>
          <p className="text-muted-foreground">
            Quản lý các chương trình khuyến mãi và ưu đãi đặc biệt
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
              </DialogTitle>
              <DialogDescription>
                {editingPromotion 
                  ? 'Cập nhật thông tin chương trình khuyến mãi'
                  : 'Tạo chương trình khuyến mãi mới cho thực đơn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên khuyến mãi
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="promotion_type" className="text-right">
                  Loại khuyến mãi
                </Label>
                <Select value={formData.promotion_type} onValueChange={(value: any) => setFormData({...formData, promotion_type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promotionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount_value" className="text-right">
                  Giá trị giảm
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({...formData, discount_value: parseFloat(e.target.value)})}
                  className="col-span-3"
                  placeholder={formData.promotion_type === 'percentage' ? 'Nhập phần trăm (VD: 20)' : 'Nhập số tiền (VD: 50000)'}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="min_order_value" className="text-right">
                  Giá trị đơn tối thiểu
                </Label>
                <Input
                  id="min_order_value"
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({...formData, min_order_value: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              {formData.promotion_type === 'percentage' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max_discount" className="text-right">
                    Giảm tối đa
                  </Label>
                  <Input
                    id="max_discount"
                    type="number"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({...formData, max_discount: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  Ngày kết thúc
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usage_limit" className="text-right">
                  Giới hạn sử dụng
                </Label>
                <Input
                  id="usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({...formData, usage_limit: parseInt(e.target.value)})}
                  className="col-span-3"
                  placeholder="0 = không giới hạn"
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
              <Button onClick={editingPromotion ? handleUpdate : handleCreate}>
                {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng khuyến mãi
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">
              Chương trình trong hệ thống
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
              {((stats.active / promotions.length) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt sử dụng
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt sử dụng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TB/chương trình
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgUsage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Lượt sử dụng trung bình
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Chương trình khuyến mãi
          </CardTitle>
          <CardDescription>
            Quản lý các chương trình khuyến mãi và ưu đãi cho thực đơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khuyến mãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {promotionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khuyến mãi</TableHead>
                <TableHead>Loại & Giá trị</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-center">Sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => {
                const TypeIcon = promotionTypes.find(t => t.value === promotion.promotion_type)?.icon || Gift;
                const isExpired = isPromotionExpired(promotion);
                const usageProgress = getUsageProgress(promotion);
                
                return (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{promotion.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {promotion.description.length > 50 
                              ? promotion.description.substring(0, 50) + '...'
                              : promotion.description
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getPromotionTypeLabel(promotion.promotion_type)}
                        </Badge>
                        <div className="font-semibold text-primary">
                          {getPromotionValue(promotion)}
                        </div>
                        {promotion.min_order_value && (
                          <div className="text-xs text-muted-foreground">
                            Tối thiểu: {formatPrice(promotion.min_order_value)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(promotion.start_date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-muted-foreground">
                          đến {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                        </div>
                        {isExpired && (
                          <Badge variant="destructive" className="mt-1">
                            Hết hạn
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {promotion.used_count}
                          {promotion.usage_limit && ` / ${promotion.usage_limit}`}
                        </div>
                        {promotion.usage_limit && (
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(usageProgress, 100)}%` }}
                            />
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {promotion.usage_limit ? `${usageProgress.toFixed(1)}%` : 'Không giới hạn'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={promotion.is_active && !isExpired ? 'default' : 'secondary'}>
                          {!promotion.is_active ? 'Tạm dừng' : isExpired ? 'Hết hạn' : 'Hoạt động'}
                        </Badge>
                        {!isExpired && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(promotion.id)}
                            className="h-6 w-6 p-0"
                          >
                            {promotion.is_active ? 
                              <Pause className="h-3 w-3" /> : 
                              <Play className="h-3 w-3" />
                            }
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(promotion.updated_at).toLocaleDateString('vi-VN')}
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
                          <DropdownMenuItem onClick={() => openEditDialog(promotion)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(promotion)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem báo cáo
                          </DropdownMenuItem>
                          {!isExpired && (
                            <DropdownMenuItem onClick={() => handleToggleActive(promotion.id)}>
                              {promotion.is_active ? (
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
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(promotion.id)}
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
