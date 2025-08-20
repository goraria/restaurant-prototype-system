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
  Palette,
  Layout,
  FileImage,
  Download,
  Eye,
  Copy,
  Smartphone,
  Monitor,
  Printer,
  Share2,
  Settings,
  ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface MenuDesign {
  id: string;
  name: string;
  description: string;
  template_type: 'classic' | 'modern' | 'minimal' | 'premium' | 'mobile';
  layout: 'single_column' | 'two_column' | 'grid' | 'category_tabs';
  color_scheme: string;
  font_family: string;
  logo_url?: string;
  background_image?: string;
  is_active: boolean;
  menu_id: string;
  menu_name: string;
  last_exported: string;
  created_at: string;
  updated_at: string;
}

// Mock data for menu designs
const mockDesigns: MenuDesign[] = [
  {
    id: '1',
    name: 'Thiết kế thực đơn chính - Phong cách cổ điển',
    description: 'Thiết kế sang trọng với màu sắc ấm áp cho thực đơn chính',
    template_type: 'classic',
    layout: 'two_column',
    color_scheme: '#8B4513,#F5DEB3,#FFE4B5',
    font_family: 'Times New Roman',
    logo_url: '/images/logo-classic.png',
    background_image: '/images/bg-classic.jpg',
    is_active: true,
    menu_id: '1',
    menu_name: 'Thực đơn chính',
    last_exported: '2024-01-15T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Thiết kế thực đơn đồ uống - Phong cách hiện đại',
    description: 'Thiết kế trẻ trung, năng động cho thực đơn đồ uống',
    template_type: 'modern',
    layout: 'grid',
    color_scheme: '#2196F3,#FFFFFF,#E3F2FD',
    font_family: 'Arial',
    logo_url: '/images/logo-modern.png',
    is_active: true,
    menu_id: '4',
    menu_name: 'Thực đơn đồ uống',
    last_exported: '2024-01-20T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Thiết kế thực đơn mobile - Tối giản',
    description: 'Thiết kế tối giản dành riêng cho thiết bị di động',
    template_type: 'minimal',
    layout: 'single_column',
    color_scheme: '#000000,#FFFFFF,#F5F5F5',
    font_family: 'Roboto',
    is_active: false,
    menu_id: '2',
    menu_name: 'Thực đơn trưa',
    last_exported: '2024-01-10T10:00:00Z',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '4',
    name: 'Thiết kế thực đơn cao cấp - Premium',
    description: 'Thiết kế cao cấp với hiệu ứng và màu sắc đặc biệt',
    template_type: 'premium',
    layout: 'category_tabs',
    color_scheme: '#FFD700,#000000,#FFFFFF',
    font_family: 'Playfair Display',
    logo_url: '/images/logo-premium.png',
    background_image: '/images/bg-premium.jpg',
    is_active: true,
    menu_id: '3',
    menu_name: 'Thực đơn tối',
    last_exported: '2024-02-01T10:00:00Z',
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  }
];

const templateTypes = [
  { value: 'classic', label: 'Cổ điển', icon: Layout },
  { value: 'modern', label: 'Hiện đại', icon: Smartphone },
  { value: 'minimal', label: 'Tối giản', icon: FileImage },
  { value: 'premium', label: 'Cao cấp', icon: Palette },
  { value: 'mobile', label: 'Di động', icon: Smartphone }
];

const layoutTypes = [
  { value: 'single_column', label: 'Một cột' },
  { value: 'two_column', label: 'Hai cột' },
  { value: 'grid', label: 'Lưới' },
  { value: 'category_tabs', label: 'Tab danh mục' }
];

const fontFamilies = [
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Open Sans', label: 'Open Sans' }
];

const availableMenus = [
  { id: '1', name: 'Thực đơn chính' },
  { id: '2', name: 'Thực đơn trưa' },
  { id: '3', name: 'Thực đơn tối' },
  { id: '4', name: 'Thực đơn đồ uống' }
];

export default function DesignPage() {
  const [designs, setDesigns] = useState<MenuDesign[]>(mockDesigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<MenuDesign | null>(null);
  const [previewDesign, setPreviewDesign] = useState<MenuDesign | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_type: 'classic' as const,
    layout: 'two_column' as const,
    color_scheme: '#8B4513,#F5DEB3,#FFE4B5',
    font_family: 'Times New Roman',
    logo_url: '',
    background_image: '',
    is_active: true,
    menu_id: ''
  });

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate = selectedTemplate === 'all' || design.template_type === selectedTemplate;
    return matchesSearch && matchesTemplate;
  });

  const getDesignStats = () => {
    const active = designs.filter(d => d.is_active).length;
    const inactive = designs.filter(d => !d.is_active).length;
    const recentlyExported = designs.filter(d => {
      const exportDate = new Date(d.last_exported);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return exportDate > weekAgo;
    }).length;
    
    return { active, inactive, recentlyExported };
  };

  const getColorPreview = (colorScheme: string) => {
    const colors = colorScheme.split(',');
    return (
      <div className="flex gap-1">
        {colors.slice(0, 3).map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: color.trim() }}
          />
        ))}
      </div>
    );
  };

  const handleCreate = () => {
    const newDesign: MenuDesign = {
      id: Date.now().toString(),
      ...formData,
      menu_name: availableMenus.find(m => m.id === formData.menu_id)?.name || '',
      last_exported: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setDesigns([...designs, newDesign]);
    toast.success('Thiết kế thực đơn đã được tạo thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingDesign) return;
    
    setDesigns(designs.map(design => 
      design.id === editingDesign.id 
        ? { 
            ...design, 
            ...formData, 
            menu_name: availableMenus.find(m => m.id === formData.menu_id)?.name || design.menu_name,
            updated_at: new Date().toISOString() 
          }
        : design
    ));
    toast.success('Thiết kế thực đơn đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDesigns(designs.filter(design => design.id !== id));
    toast.success('Thiết kế thực đơn đã được xóa thành công!');
  };

  const handleExport = (design: MenuDesign, format: 'pdf' | 'png' | 'jpg') => {
    // TODO: Implement export functionality
    const updatedDesigns = designs.map(d => 
      d.id === design.id 
        ? { ...d, last_exported: new Date().toISOString() }
        : d
    );
    setDesigns(updatedDesigns);
    toast.success(`Đã xuất thiết kế thành định dạng ${format.toUpperCase()}`);
  };

  const handleDuplicate = (design: MenuDesign) => {
    const duplicatedDesign: MenuDesign = {
      ...design,
      id: Date.now().toString(),
      name: design.name + ' (Sao chép)',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setDesigns([...designs, duplicatedDesign]);
    toast.success('Thiết kế đã được sao chép thành công!');
  };

  const handlePreview = (design: MenuDesign) => {
    setPreviewDesign(design);
    setIsPreviewOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      template_type: 'classic',
      layout: 'two_column',
      color_scheme: '#8B4513,#F5DEB3,#FFE4B5',
      font_family: 'Times New Roman',
      logo_url: '',
      background_image: '',
      is_active: true,
      menu_id: ''
    });
    setEditingDesign(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (design: MenuDesign) => {
    setEditingDesign(design);
    setFormData({
      name: design.name,
      description: design.description,
      template_type: design.template_type,
      layout: design.layout,
      color_scheme: design.color_scheme,
      font_family: design.font_family,
      logo_url: design.logo_url || '',
      background_image: design.background_image || '',
      is_active: design.is_active,
      menu_id: design.menu_id
    });
    setIsDialogOpen(true);
  };

  const getTemplateTypeLabel = (type: string) => {
    return templateTypes.find(t => t.value === type)?.label || type;
  };

  const getLayoutLabel = (layout: string) => {
    return layoutTypes.find(l => l.value === layout)?.label || layout;
  };

  const stats = getDesignStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thiết kế thực đơn</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý thiết kế giao diện cho các thực đơn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo thiết kế
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingDesign ? 'Chỉnh sửa thiết kế' : 'Tạo thiết kế mới'}
              </DialogTitle>
              <DialogDescription>
                {editingDesign 
                  ? 'Cập nhật thiết kế thực đơn'
                  : 'Tạo thiết kế giao diện mới cho thực đơn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên thiết kế
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="menu_id" className="text-right">
                  Thực đơn
                </Label>
                <Select value={formData.menu_id} onValueChange={(value) => setFormData({...formData, menu_id: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn thực đơn" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMenus.map(menu => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template_type" className="text-right">
                  Kiểu template
                </Label>
                <Select value={formData.template_type} onValueChange={(value: any) => setFormData({...formData, template_type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="layout" className="text-right">
                  Bố cục
                </Label>
                <Select value={formData.layout} onValueChange={(value: any) => setFormData({...formData, layout: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutTypes.map(layout => (
                      <SelectItem key={layout.value} value={layout.value}>
                        {layout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="font_family" className="text-right">
                  Font chữ
                </Label>
                <Select value={formData.font_family} onValueChange={(value) => setFormData({...formData, font_family: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color_scheme" className="text-right">
                  Bảng màu
                </Label>
                <Input
                  id="color_scheme"
                  value={formData.color_scheme}
                  onChange={(e) => setFormData({...formData, color_scheme: e.target.value})}
                  className="col-span-3"
                  placeholder="VD: #8B4513,#F5DEB3,#FFE4B5"
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
                <Label htmlFor="logo_url" className="text-right">
                  URL Logo
                </Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="background_image" className="text-right">
                  Ảnh nền
                </Label>
                <Input
                  id="background_image"
                  value={formData.background_image}
                  onChange={(e) => setFormData({...formData, background_image: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com/background.jpg"
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
              <Button onClick={editingDesign ? handleUpdate : handleCreate}>
                {editingDesign ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Xem trước thiết kế</DialogTitle>
            <DialogDescription>
              {previewDesign?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewDesign && (
              <div className="border rounded-lg p-4 min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Layout className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold" style={{ fontFamily: previewDesign.font_family }}>
                      {previewDesign.menu_name}
                    </h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Template: {getTemplateTypeLabel(previewDesign.template_type)} | 
                    Bố cục: {getLayoutLabel(previewDesign.layout)}
                  </div>
                  <div className="flex justify-center">
                    {getColorPreview(previewDesign.color_scheme)}
                  </div>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Đây là bản xem trước của thiết kế thực đơn. 
                      Thiết kế thực tế sẽ hiển thị đầy đủ nội dung món ăn và giá cả.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Đóng
            </Button>
            {previewDesign && (
              <>
                <Button onClick={() => handleExport(previewDesign, 'pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất PDF
                </Button>
                <Button onClick={() => handleExport(previewDesign, 'png')}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất PNG
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng thiết kế
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designs.length}</div>
            <p className="text-xs text-muted-foreground">
              Thiết kế trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang sử dụng
            </CardTitle>
            <Monitor className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / designs.length) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Xuất gần đây
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyExported}</div>
            <p className="text-xs text-muted-foreground">
              7 ngày qua
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chưa sử dụng
            </CardTitle>
            <Settings className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Thiết kế tạm dừng
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Thiết kế thực đơn
          </CardTitle>
          <CardDescription>
            Tạo và quản lý giao diện thiết kế cho các thực đơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thiết kế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả template</SelectItem>
                {templateTypes.map(type => (
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
                <TableHead>Thiết kế</TableHead>
                <TableHead>Template & Bố cục</TableHead>
                <TableHead>Màu sắc & Font</TableHead>
                <TableHead>Thực đơn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Xuất gần nhất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDesigns.map((design) => {
                const TemplateIcon = templateTypes.find(t => t.value === design.template_type)?.icon || Layout;
                
                return (
                  <TableRow key={design.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TemplateIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{design.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {design.description.length > 40 
                              ? design.description.substring(0, 40) + '...'
                              : design.description
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getTemplateTypeLabel(design.template_type)}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {getLayoutLabel(design.layout)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getColorPreview(design.color_scheme)}
                        <div className="text-xs text-muted-foreground" style={{ fontFamily: design.font_family }}>
                          {design.font_family}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{design.menu_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={design.is_active ? 'default' : 'secondary'}>
                        {design.is_active ? 'Đang sử dụng' : 'Tạm dừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(design.last_exported).toLocaleDateString('vi-VN')}
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
                          <DropdownMenuItem onClick={() => handlePreview(design)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem trước
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(design)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(design, 'pdf')}>
                            <Download className="mr-2 h-4 w-4" />
                            Xuất PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(design, 'png')}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Xuất hình ảnh
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Chia sẻ
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(design.id)}
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
