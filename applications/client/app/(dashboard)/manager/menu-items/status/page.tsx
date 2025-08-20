'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Search, 
  MoreHorizontal, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  ImageIcon,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data based on database schema
const mockMenuItems = [
  {
    id: '1',
    menu_id: 'menu-1',
    category_id: 'cat-1',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò với đầy đủ topping: tái, chín, gân, sách',
    price: 85000,
    image_url: '/menu-items/pho-bo-dac-biet.jpg',
    is_available: true,
    is_featured: true,
    preparation_time: 15,
    calories: 650,
    allergens: ['gluten'],
    dietary_info: ['halal'],
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Phở', slug: 'pho' },
    status_history: [
      { date: '2024-01-15', status: 'available', reason: 'Món mới ra mắt' }
    ]
  },
  {
    id: '2',
    menu_id: 'menu-1',
    category_id: 'cat-2',
    name: 'Cơm Gà Nướng',
    description: 'Cơm trắng với gà nướng mật ong, rau sống',
    price: 75000,
    image_url: '/menu-items/com-ga-nuong.jpg',
    is_available: true,
    is_featured: false,
    preparation_time: 20,
    calories: 580,
    allergens: [],
    dietary_info: ['gluten-free'],
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Cơm', slug: 'com' },
    status_history: [
      { date: '2024-01-15', status: 'available', reason: 'Có đủ nguyên liệu' }
    ]
  },
  {
    id: '3',
    menu_id: 'menu-1',
    category_id: 'cat-3',
    name: 'Trà Đá Chanh',
    description: 'Trà đá truyền thống với chanh tươi',
    price: 15000,
    image_url: '/menu-items/tra-da-chanh.jpg',
    is_available: false,
    is_featured: false,
    preparation_time: 3,
    calories: 25,
    allergens: [],
    dietary_info: ['vegan'],
    display_order: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Đồ uống', slug: 'do-uong' },
    status_history: [
      { date: '2024-01-14', status: 'available', reason: 'Bình thường' },
      { date: '2024-01-15', status: 'unavailable', reason: 'Hết chanh tươi' }
    ]
  },
  {
    id: '4',
    menu_id: 'menu-1',
    category_id: 'cat-1',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng đậm đà hương vị miền Trung',
    price: 65000,
    image_url: '/menu-items/bun-bo-hue.jpg',
    is_available: false,
    is_featured: true,
    preparation_time: 18,
    calories: 520,
    allergens: ['shellfish'],
    dietary_info: [],
    display_order: 4,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Bún', slug: 'bun' },
    status_history: [
      { date: '2024-01-12', status: 'available', reason: 'Món mới' },
      { date: '2024-01-15', status: 'unavailable', reason: 'Hết nguyên liệu đặc biệt' }
    ]
  }
];

const availabilityOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'available', label: 'Có sẵn' },
  { value: 'unavailable', label: 'Hết hàng' }
];

const featuredOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'featured', label: 'Nổi bật' },
  { value: 'normal', label: 'Thường' }
];

export default function StatusPage() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    is_available: false,
    is_featured: false,
    reason: ''
  });

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === 'all' ||
                               (availabilityFilter === 'available' && item.is_available) ||
                               (availabilityFilter === 'unavailable' && !item.is_available);
    
    const matchesFeatured = featuredFilter === 'all' ||
                           (featuredFilter === 'featured' && item.is_featured) ||
                           (featuredFilter === 'normal' && !item.is_featured);
    
    return matchesSearch && matchesAvailability && matchesFeatured;
  });

  const getStatusStats = () => {
    const available = menuItems.filter(item => item.is_available).length;
    const unavailable = menuItems.filter(item => !item.is_available).length;
    const featured = menuItems.filter(item => item.is_featured).length;
    const total = menuItems.length;
    
    return { available, unavailable, featured, total };
  };

  const handleUpdateStatus = () => {
    if (!editingItem) return;
    
    // TODO: Implement API call to update status
    const updatedItems = menuItems.map(item => {
      if (item.id === editingItem.id) {
        const newHistory = [
          ...item.status_history,
          {
            date: new Date().toISOString().split('T')[0],
            status: formData.is_available ? 'available' : 'unavailable',
            reason: formData.reason
          }
        ];
        return {
          ...item,
          is_available: formData.is_available,
          is_featured: formData.is_featured,
          status_history: newHistory,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    toast.success('Trạng thái món ăn đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const quickToggleAvailability = (itemId: string) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === itemId) {
        const newStatus = !item.is_available;
        const newHistory = [
          ...item.status_history,
          {
            date: new Date().toISOString().split('T')[0],
            status: newStatus ? 'available' : 'unavailable',
            reason: 'Thay đổi nhanh từ bảng quản lý'
          }
        ];
        return {
          ...item,
          is_available: newStatus,
          status_history: newHistory,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    toast.success('Đã thay đổi trạng thái món ăn!');
  };

  const resetForm = () => {
    setFormData({
      is_available: false,
      is_featured: false,
      reason: ''
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData({
      is_available: item.is_available,
      is_featured: item.is_featured,
      reason: ''
    });
    setIsDialogOpen(true);
  };

  const renderStatusBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Có sẵn
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Hết hàng
      </Badge>
    );
  };

  const renderPreparationTime = (time: number) => {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-3 h-3" />
        {time} phút
      </div>
    );
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tình trạng</h1>
          <p className="text-muted-foreground">
            Quản lý tình trạng có sẵn và nổi bật của các món ăn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cập nhật trạng thái món ăn</DialogTitle>
              <DialogDescription>
                Thay đổi trạng thái cho món: {editingItem?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                />
                <Label htmlFor="is_available">Có sẵn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                />
                <Label htmlFor="is_featured">Món nổi bật</Label>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Lý do thay đổi
                </Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Hết nguyên liệu, tạm dừng phục vụ..."
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateStatus}>
                Cập nhật trạng thái
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số món
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Món ăn trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang có sẵn
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.available / stats.total) * 100).toFixed(1)}% tổng số món
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hết hàng
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.unavailable / stats.total) * 100).toFixed(1)}% tổng số món
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món nổi bật
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">
              Đang được đánh dấu nổi bật
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Bảng trạng thái món ăn
          </CardTitle>
          <CardDescription>
            Quản lý tình trạng có sẵn và nổi bật của các món ăn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-48">
                <Star className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {featuredOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Món ăn</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Nổi bật</TableHead>
                <TableHead className="text-center">Thời gian chế biến</TableHead>
                <TableHead className="text-center">Thông tin khác</TableHead>
                <TableHead>Cập nhật lần cuối</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description && item.description.length > 40 
                            ? item.description.substring(0, 40) + '...'
                            : item.description
                          }
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div 
                      className="cursor-pointer"
                      onClick={() => quickToggleAvailability(item.id)}
                    >
                      {renderStatusBadge(item.is_available)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_featured ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        Nổi bật
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderPreparationTime(item.preparation_time || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      {item.allergens.length > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            {item.allergens.join(', ')}
                          </span>
                        </div>
                      )}
                      {item.dietary_info.length > 0 && (
                        <div className="text-xs text-green-600">
                          {item.dietary_info.join(', ')}
                        </div>
                      )}
                      {item.calories && (
                        <div className="text-xs text-muted-foreground">
                          {item.calories} cal
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString('vi-VN')}
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
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa trạng thái
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem lịch sử
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => quickToggleAvailability(item.id)}>
                          {item.is_available ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Đánh dấu hết hàng
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Đánh dấu có sẵn
                            </>
                          )}
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
