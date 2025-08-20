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
  Eye,
  FolderTree,
  ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data based on database schema
const mockCategories = [
  {
    id: '1',
    parent_id: null,
    name: 'Món chính',
    slug: 'mon-chinh',
    description: 'Các món ăn chính của nhà hàng',
    image_url: '/categories/main-dishes.jpg',
    display_order: 1,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    child_categories: [
      {
        id: '2',
        name: 'Phở',
        slug: 'pho',
        description: 'Các loại phở truyền thống',
        image_url: '/categories/pho.jpg',
        display_order: 1,
        is_active: true,
      },
      {
        id: '3',
        name: 'Cơm',
        slug: 'com',
        description: 'Các món cơm đa dạng',
        image_url: '/categories/rice.jpg',
        display_order: 2,
        is_active: true,
      }
    ]
  },
  {
    id: '4',
    parent_id: null,
    name: 'Đồ uống',
    slug: 'do-uong',
    description: 'Các loại thức uống',
    image_url: '/categories/beverages.jpg',
    display_order: 2,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    child_categories: [
      {
        id: '5',
        name: 'Nước ngọt',
        slug: 'nuoc-ngot',
        description: 'Các loại nước ngọt có gas',
        image_url: '/categories/soft-drinks.jpg',
        display_order: 1,
        is_active: true,
      },
      {
        id: '6',
        name: 'Trà và cà phê',
        slug: 'tra-ca-phe',
        description: 'Trà và cà phê các loại',
        image_url: '/categories/tea-coffee.jpg',
        display_order: 2,
        is_active: true,
      }
    ]
  },
  {
    id: '7',
    parent_id: null,
    name: 'Tráng miệng',
    slug: 'trang-mieng',
    description: 'Các món tráng miệng ngọt ngào',
    image_url: '/categories/desserts.jpg',
    display_order: 3,
    is_active: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    child_categories: []
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_active: true,
    parent_id: null
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    // TODO: Implement API call to create category
    const newCategory = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      child_categories: []
    };
    
    setCategories([...categories, newCategory]);
    toast.success('Danh mục đã được tạo thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    // TODO: Implement API call to update category
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...formData, updated_at: new Date().toISOString() }
        : cat
    ));
    toast.success('Danh mục đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement API call to delete category
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Danh mục đã được xóa thành công!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: 0,
      is_active: true,
      parent_id: null
    });
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      display_order: category.display_order,
      is_active: category.is_active,
      parent_id: category.parent_id
    });
    setIsDialogOpen(true);
  };

  const renderCategoryRow = (category: any, isChild = false) => (
    <TableRow key={category.id} className={isChild ? 'bg-muted/50' : ''}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {isChild && <div className="w-4 h-4 border-l border-b border-muted-foreground/30 ml-4" />}
          {category.image_url ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={category.image_url}
                alt={category.name}
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
            <div className="font-semibold">{category.name}</div>
            <div className="text-sm text-muted-foreground">{category.slug}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs">
          {category.description && (
            <p className="text-sm text-muted-foreground truncate">
              {category.description}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {category.display_order}
      </TableCell>
      <TableCell>
        <Badge variant={category.is_active ? 'default' : 'secondary'}>
          {category.is_active ? 'Hoạt động' : 'Tạm dừng'}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {category.child_categories?.length || 0}
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {new Date(category.created_at || '').toLocaleDateString('vi-VN')}
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
            <DropdownMenuItem onClick={() => openEditDialog(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(category.id)}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý phân loại</h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục món ăn và phân loại thực đơn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Cập nhật thông tin danh mục món ăn'
                  : 'Tạo danh mục mới cho món ăn trong thực đơn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên danh mục
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="col-span-3"
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">
                  URL hình ảnh
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="display_order" className="text-right">
                  Thứ tự hiển thị
                </Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Hoạt động
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
              <Button onClick={editingCategory ? handleUpdate : handleCreate}>
                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Danh sách phân loại
          </CardTitle>
          <CardDescription>
            Quản lý các danh mục và phân loại món ăn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center">Thứ tự</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Danh mục con</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  {renderCategoryRow(category)}
                  {category.child_categories?.map((child) => 
                    renderCategoryRow(child, true)
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
