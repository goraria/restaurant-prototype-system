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
  DollarSign,
  TrendingUp,
  TrendingDown,
  ImageIcon
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
    display_order: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Phở', slug: 'pho' },
    price_history: [
      { date: '2024-01-01', price: 80000 },
      { date: '2024-01-15', price: 85000 }
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
    display_order: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Cơm', slug: 'com' },
    price_history: [
      { date: '2024-01-01', price: 70000 },
      { date: '2024-01-10', price: 75000 }
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
    is_available: true,
    is_featured: false,
    preparation_time: 3,
    calories: 25,
    display_order: 3,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Đồ uống', slug: 'do-uong' },
    price_history: [
      { date: '2024-01-01', price: 12000 },
      { date: '2024-01-05', price: 15000 }
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
    is_featured: false,
    preparation_time: 18,
    calories: 520,
    display_order: 4,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { name: 'Bún', slug: 'bun' },
    price_history: [
      { date: '2024-01-01', price: 60000 },
      { date: '2024-01-12', price: 65000 }
    ]
  }
];

export default function PricingPage() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    price: 0,
    reason: ''
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPriceChange = (item: any) => {
    const history = item.price_history;
    if (history.length < 2) return { change: 0, percentage: 0 };
    
    const oldPrice = history[history.length - 2].price;
    const newPrice = history[history.length - 1].price;
    const change = newPrice - oldPrice;
    const percentage = ((change / oldPrice) * 100);
    
    return { change, percentage };
  };

  const handleUpdatePrice = () => {
    if (!editingItem) return;
    
    // TODO: Implement API call to update price
    const updatedItems = menuItems.map(item => {
      if (item.id === editingItem.id) {
        const newHistory = [
          ...item.price_history,
          {
            date: new Date().toISOString().split('T')[0],
            price: formData.price
          }
        ];
        return {
          ...item,
          price: formData.price,
          price_history: newHistory,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    toast.success('Giá món ăn đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      price: 0,
      reason: ''
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData({
      price: item.price,
      reason: ''
    });
    setIsDialogOpen(true);
  };

  const renderPriceChange = (item: any) => {
    const { change, percentage } = getPriceChange(item);
    
    if (change === 0) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    const isIncrease = change > 0;
    return (
      <div className={`flex items-center gap-1 ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
        {isIncrease ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {isIncrease ? '+' : ''}{formatPrice(change)}
        </span>
        <span className="text-xs">
          ({isIncrease ? '+' : ''}{percentage.toFixed(1)}%)
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý giá cả</h1>
          <p className="text-muted-foreground">
            Quản lý giá cả và lịch sử thay đổi giá của các món ăn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cập nhật giá món ăn</DialogTitle>
              <DialogDescription>
                Thay đổi giá cho món: {editingItem?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-price" className="text-right">
                  Giá hiện tại
                </Label>
                <div className="col-span-3 text-lg font-semibold">
                  {editingItem && formatPrice(editingItem.price)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-price" className="text-right">
                  Giá mới
                </Label>
                <Input
                  id="new-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Lý do thay đổi
                </Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Tăng giá nguyên liệu..."
                  className="col-span-3"
                />
              </div>
              {editingItem && formData.price !== editingItem.price && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Thay đổi</Label>
                  <div className="col-span-3">
                    <div className={`text-lg font-semibold ${formData.price > editingItem.price ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.price > editingItem.price ? '+' : ''}{formatPrice(formData.price - editingItem.price)}
                      <span className="text-sm ml-2">
                        ({formData.price > editingItem.price ? '+' : ''}
                        {(((formData.price - editingItem.price) / editingItem.price) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdatePrice}>
                Cập nhật giá
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Đang có giá trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trung bình
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tính theo tất cả món ăn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món đắt nhất
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(Math.max(...menuItems.map(item => item.price)))}
            </div>
            <p className="text-xs text-muted-foreground">
              {menuItems.find(item => item.price === Math.max(...menuItems.map(i => i.price)))?.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Món rẻ nhất
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(Math.min(...menuItems.map(item => item.price)))}
            </div>
            <p className="text-xs text-muted-foreground">
              {menuItems.find(item => item.price === Math.min(...menuItems.map(i => i.price)))?.name}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Bảng giá món ăn
          </CardTitle>
          <CardDescription>
            Quản lý giá cả và theo dõi lịch sử thay đổi giá
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Món ăn</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Giá hiện tại</TableHead>
                <TableHead className="text-center">Thay đổi gần nhất</TableHead>
                <TableHead>Trạng thái</TableHead>
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
                          {item.description && item.description.length > 50 
                            ? item.description.substring(0, 50) + '...'
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
                  <TableCell className="text-right font-semibold">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderPriceChange(item)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_available ? 'default' : 'secondary'}>
                      {item.is_available ? 'Có sẵn' : 'Hết hàng'}
                    </Badge>
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
                          Cập nhật giá
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Lịch sử giá
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
