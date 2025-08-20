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
  Clock,
  ChefHat,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  FileText,
  Copy,
  Eye,
  Timer,
  Thermometer,
  Scale,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

interface CookingProcess {
  id: string;
  recipe_id: string;
  recipe_name: string;
  step_number: number;
  title: string;
  description: string;
  duration_minutes: number;
  temperature?: number;
  equipment?: string;
  technique: string;
  critical_point: boolean;
  photo_url?: string;
  video_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for cooking processes
const mockProcesses: CookingProcess[] = [
  {
    id: '1',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    step_number: 1,
    title: 'Chuẩn bị xương bò',
    description: 'Rửa sạch xương bò, chần qua nước sôi để loại bỏ tạp chất và mùi hôi',
    duration_minutes: 30,
    temperature: 100,
    equipment: 'Nồi lớn',
    technique: 'blanching',
    critical_point: true,
    notes: 'Nước phải sôi mạnh và xương phải được rửa kỹ',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    step_number: 2,
    title: 'Niêu nước dùng',
    description: 'Niêu xương bò với gia vị thơm (hành, gừng, quế, hồi) trong 6-8 tiếng',
    duration_minutes: 480,
    temperature: 85,
    equipment: 'Nồi niêu lớn',
    technique: 'simmering',
    critical_point: true,
    notes: 'Nhiệt độ không được quá cao để nước dùng trong suốt',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    step_number: 3,
    title: 'Chuẩn bị thịt bò',
    description: 'Thái thịt bò thăn mỏng, ngược thớ để thịt mềm khi ăn',
    duration_minutes: 15,
    equipment: 'Dao thái thịt sắc',
    technique: 'slicing',
    critical_point: false,
    notes: 'Thịt cần được làm lạnh trước khi thái để dễ thái mỏng',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    step_number: 4,
    title: 'Chần bánh phở',
    description: 'Chần bánh phở tươi trong nước sôi, vớt ra để ráo nước',
    duration_minutes: 2,
    temperature: 100,
    equipment: 'Rổ vớt',
    technique: 'blanching',
    critical_point: false,
    notes: 'Thời gian chần không quá lâu để bánh không bị nhão',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    recipe_id: '2',
    recipe_name: 'Cơm Gà Nướng Mật Ong',
    step_number: 1,
    title: 'Ướp gà',
    description: 'Ướp gà với gia vị, tỏi, ớt, dầu ăn trong 2 tiếng',
    duration_minutes: 120,
    equipment: 'Tô lớn có nắp',
    technique: 'marinating',
    critical_point: true,
    notes: 'Ướp đủ thời gian để thịt thấm vị',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '6',
    recipe_id: '2',
    recipe_name: 'Cơm Gà Nướng Mật Ong',
    step_number: 2,
    title: 'Nướng gà',
    description: 'Nướng gà trong lò ở nhiệt độ 180°C, quết mật ong 10 phút cuối',
    duration_minutes: 45,
    temperature: 180,
    equipment: 'Lò nướng',
    technique: 'roasting',
    critical_point: true,
    notes: 'Kiểm tra độ chín bằng que xiên, nước trong không có máu',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  }
];

const techniques = [
  { value: 'blanching', label: 'Chần (Blanching)' },
  { value: 'simmering', label: 'Niêu nhỏ lửa (Simmering)' },
  { value: 'boiling', label: 'Luộc (Boiling)' },
  { value: 'roasting', label: 'Nướng (Roasting)' },
  { value: 'grilling', label: 'Nướng vỉ (Grilling)' },
  { value: 'frying', label: 'Chiên (Frying)' },
  { value: 'steaming', label: 'Hấp (Steaming)' },
  { value: 'sauteing', label: 'Xào (Sautéing)' },
  { value: 'marinating', label: 'Ướp (Marinating)' },
  { value: 'slicing', label: 'Thái (Slicing)' },
  { value: 'chopping', label: 'Cắt nhỏ (Chopping)' },
  { value: 'mixing', label: 'Trộn (Mixing)' }
];

const availableRecipes = [
  { id: '1', name: 'Phở Bò Đặc Biệt' },
  { id: '2', name: 'Cơm Gà Nướng Mật Ong' },
  { id: '3', name: 'Trà Đá Chanh Tươi' },
  { id: '4', name: 'Bánh Tiramisu' },
  { id: '5', name: 'Salad Caesar' }
];

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<CookingProcess[]>(mockProcesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [selectedTechnique, setSelectedTechnique] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<CookingProcess | null>(null);
  
  const [formData, setFormData] = useState({
    recipe_id: '',
    step_number: 1,
    title: '',
    description: '',
    duration_minutes: 30,
    temperature: 0,
    equipment: '',
    technique: 'mixing',
    critical_point: false,
    photo_url: '',
    video_url: '',
    notes: ''
  });

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.recipe_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRecipe = selectedRecipe === 'all' || process.recipe_id === selectedRecipe;
    const matchesTechnique = selectedTechnique === 'all' || process.technique === selectedTechnique;
    return matchesSearch && matchesRecipe && matchesTechnique;
  });

  const getProcessStats = () => {
    const totalProcesses = processes.length;
    const criticalSteps = processes.filter(p => p.critical_point).length;
    const avgDuration = processes.reduce((sum, p) => sum + p.duration_minutes, 0) / totalProcesses;
    const uniqueRecipes = new Set(processes.map(p => p.recipe_id)).size;
    
    return { totalProcesses, criticalSteps, avgDuration, uniqueRecipes };
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}p` : `${hours} giờ`;
  };

  const getTechnique = (technique: string) => {
    return techniques.find(t => t.value === technique)?.label || technique;
  };

  const handleCreate = () => {
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!recipe) {
      toast.error('Vui lòng chọn công thức!');
      return;
    }

    const newProcess: CookingProcess = {
      id: Date.now().toString(),
      recipe_name: recipe.name,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setProcesses([...processes, newProcess]);
    toast.success('Quy trình đã được thêm thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingProcess) return;
    
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!recipe) {
      toast.error('Vui lòng chọn công thức!');
      return;
    }
    
    setProcesses(processes.map(process => 
      process.id === editingProcess.id 
        ? { 
            ...process, 
            ...formData,
            recipe_name: recipe.name,
            updated_at: new Date().toISOString() 
          }
        : process
    ));
    toast.success('Quy trình đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProcesses(processes.filter(process => process.id !== id));
    toast.success('Quy trình đã được xóa thành công!');
  };

  const handleMoveStep = (id: string, direction: 'up' | 'down') => {
    const process = processes.find(p => p.id === id);
    if (!process) return;

    const sameRecipeProcesses = processes.filter(p => p.recipe_id === process.recipe_id);
    const currentIndex = sameRecipeProcesses.findIndex(p => p.id === id);
    
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sameRecipeProcesses.length - 1)) {
      return;
    }

    const newStepNumber = direction === 'up' ? process.step_number - 1 : process.step_number + 1;
    const otherProcessId = sameRecipeProcesses[direction === 'up' ? currentIndex - 1 : currentIndex + 1].id;

    setProcesses(processes.map(p => {
      if (p.id === id) return { ...p, step_number: newStepNumber, updated_at: new Date().toISOString() };
      if (p.id === otherProcessId) return { ...p, step_number: process.step_number, updated_at: new Date().toISOString() };
      return p;
    }));

    toast.success(`Đã di chuyển bước ${direction === 'up' ? 'lên' : 'xuống'}!`);
  };

  const handleDuplicate = (process: CookingProcess) => {
    const duplicatedProcess: CookingProcess = {
      ...process,
      id: Date.now().toString(),
      step_number: process.step_number + 1,
      title: process.title + ' (Sao chép)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setProcesses([...processes, duplicatedProcess]);
    toast.success('Quy trình đã được sao chép thành công!');
  };

  const resetForm = () => {
    setFormData({
      recipe_id: '',
      step_number: 1,
      title: '',
      description: '',
      duration_minutes: 30,
      temperature: 0,
      equipment: '',
      technique: 'mixing',
      critical_point: false,
      photo_url: '',
      video_url: '',
      notes: ''
    });
    setEditingProcess(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (process: CookingProcess) => {
    setEditingProcess(process);
    setFormData({
      recipe_id: process.recipe_id,
      step_number: process.step_number,
      title: process.title,
      description: process.description,
      duration_minutes: process.duration_minutes,
      temperature: process.temperature || 0,
      equipment: process.equipment || '',
      technique: process.technique,
      critical_point: process.critical_point,
      photo_url: process.photo_url || '',
      video_url: process.video_url || '',
      notes: process.notes || ''
    });
    setIsDialogOpen(true);
  };

  const stats = getProcessStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quy trình nấu ăn</h1>
          <p className="text-muted-foreground">
            Quản lý các bước chi tiết trong quy trình chế biến món ăn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm quy trình
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingProcess ? 'Chỉnh sửa quy trình' : 'Thêm quy trình mới'}
              </DialogTitle>
              <DialogDescription>
                {editingProcess 
                  ? 'Cập nhật bước trong quy trình nấu ăn'
                  : 'Thêm bước mới vào quy trình chế biến món ăn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipe_id" className="text-right">
                  Công thức
                </Label>
                <Select value={formData.recipe_id} onValueChange={(value) => setFormData({...formData, recipe_id: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn công thức" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipes.map(recipe => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="step_number" className="text-right">
                  Bước số
                </Label>
                <Input
                  id="step_number"
                  type="number"
                  min="1"
                  value={formData.step_number}
                  onChange={(e) => setFormData({...formData, step_number: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Tiêu đề bước
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technique" className="text-right">
                  Kỹ thuật
                </Label>
                <Select value={formData.technique} onValueChange={(value) => setFormData({...formData, technique: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {techniques.map(technique => (
                      <SelectItem key={technique.value} value={technique.value}>
                        {technique.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả chi tiết
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration_minutes" className="text-right">
                    Thời gian (phút)
                  </Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temperature" className="text-right">
                    Nhiệt độ (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="equipment" className="text-right">
                  Dụng cụ
                </Label>
                <Input
                  id="equipment"
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  className="col-span-3"
                  placeholder="VD: Nồi lớn, Dao thái, Lò nướng..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="col-span-3"
                  rows={2}
                  placeholder="Lưu ý đặc biệt, mẹo vặt..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="critical_point" className="text-right">
                  Bước quan trọng
                </Label>
                <Switch
                  id="critical_point"
                  checked={formData.critical_point}
                  onCheckedChange={(checked) => setFormData({...formData, critical_point: checked})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingProcess ? handleUpdate : handleCreate}>
                {editingProcess ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng quy trình
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcesses}</div>
            <p className="text-xs text-muted-foreground">
              Bước quy trình trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bước quan trọng
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalSteps}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.criticalSteps / stats.totalProcesses) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TB thời gian/bước
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</div>
            <p className="text-xs text-muted-foreground">
              Thời gian trung bình
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Công thức có quy trình
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueRecipes}</div>
            <p className="text-xs text-muted-foreground">
              Công thức đã có quy trình
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Quy trình nấu ăn
          </CardTitle>
          <CardDescription>
            Chi tiết các bước thực hiện trong quy trình chế biến món ăn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm quy trình hoặc công thức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo công thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả công thức</SelectItem>
                {availableRecipes.map(recipe => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTechnique} onValueChange={setSelectedTechnique}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo kỹ thuật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỹ thuật</SelectItem>
                {techniques.map(technique => (
                  <SelectItem key={technique.value} value={technique.value}>
                    {technique.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quy trình</TableHead>
                <TableHead>Công thức</TableHead>
                <TableHead className="text-center">Bước</TableHead>
                <TableHead>Kỹ thuật</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Nhiệt độ</TableHead>
                <TableHead>Dụng cụ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcesses
                .sort((a, b) => {
                  if (a.recipe_id === b.recipe_id) {
                    return a.step_number - b.step_number;
                  }
                  return a.recipe_name.localeCompare(b.recipe_name);
                })
                .map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{process.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {process.description.length > 50 
                              ? process.description.substring(0, 50) + '...'
                              : process.description
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{process.recipe_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        #{process.step_number}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getTechnique(process.technique)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formatDuration(process.duration_minutes)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {process.temperature ? (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{process.temperature}°C</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Scale className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {process.equipment || 'Không xác định'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={process.critical_point ? 'destructive' : 'default'}>
                          {process.critical_point ? (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Quan trọng
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Bình thường
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(process.updated_at).toLocaleDateString('vi-VN')}
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
                          <DropdownMenuItem onClick={() => openEditDialog(process)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(process)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleMoveStep(process.id, 'up')}
                            disabled={process.step_number === 1}
                          >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Di chuyển lên
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleMoveStep(process.id, 'down')}
                          >
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Di chuyển xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Bắt đầu timer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(process.id)}
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
