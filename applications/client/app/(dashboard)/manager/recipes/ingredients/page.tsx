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
  Package,
  Scale,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Warehouse,
  ShoppingCart,
  Copy,
  Eye,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface RecipeIngredient {
  id: string;
  recipe_id: string;
  recipe_name: string;
  inventory_item_id: string;
  ingredient_name: string;
  quantity_needed: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  is_critical: boolean;
  substitutes: string[];
  preparation_note?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for recipe ingredients
const mockIngredients: RecipeIngredient[] = [
  {
    id: '1',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    inventory_item_id: 'inv-1',
    ingredient_name: 'Thịt bò thăn',
    quantity_needed: 500,
    unit: 'gram',
    cost_per_unit: 180000,
    total_cost: 90000,
    is_critical: true,
    substitutes: ['Thịt bò vai', 'Thịt bò nạm'],
    preparation_note: 'Thái mỏng, ngược thớ thịt',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    inventory_item_id: 'inv-2',
    ingredient_name: 'Xương bò',
    quantity_needed: 2000,
    unit: 'gram',
    cost_per_unit: 45000,
    total_cost: 90000,
    is_critical: true,
    substitutes: ['Xương heo'],
    preparation_note: 'Chần qua nước sôi để loại bỏ tạp chất',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    inventory_item_id: 'inv-3',
    ingredient_name: 'Bánh phở',
    quantity_needed: 400,
    unit: 'gram',
    cost_per_unit: 8000,
    total_cost: 3200,
    is_critical: true,
    substitutes: [],
    preparation_note: 'Ngâm nước ấm trước khi chần',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    recipe_id: '2',
    recipe_name: 'Cơm Gà Nướng Mật Ong',
    inventory_item_id: 'inv-4',
    ingredient_name: 'Thịt gà',
    quantity_needed: 1000,
    unit: 'gram',
    cost_per_unit: 85000,
    total_cost: 85000,
    is_critical: true,
    substitutes: ['Gà ta'],
    preparation_note: 'Tách xương, giữ nguyên da',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    recipe_id: '2',
    recipe_name: 'Cơm Gà Nướng Mật Ong',
    inventory_item_id: 'inv-5',
    ingredient_name: 'Mật ong',
    quantity_needed: 100,
    unit: 'ml',
    cost_per_unit: 150000,
    total_cost: 15000,
    is_critical: false,
    substitutes: ['Đường nâu', 'Đường cát trắng'],
    preparation_note: 'Pha loãng với nước ấm',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '6',
    recipe_id: '3',
    recipe_name: 'Trà Đá Chanh Tươi',
    inventory_item_id: 'inv-6',
    ingredient_name: 'Trà đen',
    quantity_needed: 10,
    unit: 'gram',
    cost_per_unit: 200000,
    total_cost: 2000,
    is_critical: true,
    substitutes: ['Trà xanh'],
    preparation_note: 'Pha đậm đặc, để nguội',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '7',
    recipe_id: '3',
    recipe_name: 'Trà Đá Chanh Tươi',
    inventory_item_id: 'inv-7',
    ingredient_name: 'Chanh tươi',
    quantity_needed: 2,
    unit: 'quả',
    cost_per_unit: 5000,
    total_cost: 10000,
    is_critical: true,
    substitutes: [],
    preparation_note: 'Chọn chanh có vỏ mỏng, nhiều nước',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '8',
    recipe_id: '4',
    recipe_name: 'Bánh Tiramisu',
    inventory_item_id: 'inv-8',
    ingredient_name: 'Kem mascarpone',
    quantity_needed: 500,
    unit: 'gram',
    cost_per_unit: 280000,
    total_cost: 140000,
    is_critical: true,
    substitutes: ['Cream cheese'],
    preparation_note: 'Để nhiệt độ phòng trước khi sử dụng',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  }
];

const units = [
  { value: 'gram', label: 'gram' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'lít', label: 'lít' },
  { value: 'quả', label: 'quả' },
  { value: 'củ', label: 'củ' },
  { value: 'thìa', label: 'thìa' },
  { value: 'chén', label: 'chén' }
];

const availableRecipes = [
  { id: '1', name: 'Phở Bò Đặc Biệt' },
  { id: '2', name: 'Cơm Gà Nướng Mật Ong' },
  { id: '3', name: 'Trà Đá Chanh Tươi' },
  { id: '4', name: 'Bánh Tiramisu' },
  { id: '5', name: 'Salad Caesar' }
];

const mockInventoryItems = [
  { id: 'inv-1', name: 'Thịt bò thăn', price: 180000 },
  { id: 'inv-2', name: 'Xương bò', price: 45000 },
  { id: 'inv-3', name: 'Bánh phở', price: 8000 },
  { id: 'inv-4', name: 'Thịt gà', price: 85000 },
  { id: 'inv-5', name: 'Mật ong', price: 150000 },
  { id: 'inv-6', name: 'Trà đen', price: 200000 },
  { id: 'inv-7', name: 'Chanh tươi', price: 5000 },
  { id: 'inv-8', name: 'Kem mascarpone', price: 280000 }
];

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(mockIngredients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [filterCritical, setFilterCritical] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<RecipeIngredient | null>(null);
  
  const [formData, setFormData] = useState({
    recipe_id: '',
    inventory_item_id: '',
    quantity_needed: 0,
    unit: 'gram',
    is_critical: false,
    substitutes: [] as string[],
    preparation_note: ''
  });

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.recipe_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRecipe = selectedRecipe === 'all' || ingredient.recipe_id === selectedRecipe;
    const matchesCritical = filterCritical === 'all' || 
                           (filterCritical === 'critical' && ingredient.is_critical) ||
                           (filterCritical === 'normal' && !ingredient.is_critical);
    return matchesSearch && matchesRecipe && matchesCritical;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getIngredientStats = () => {
    const totalIngredients = ingredients.length;
    const criticalIngredients = ingredients.filter(i => i.is_critical).length;
    const totalCost = ingredients.reduce((sum, i) => sum + i.total_cost, 0);
    const avgCostPerIngredient = totalCost / totalIngredients;
    
    return { totalIngredients, criticalIngredients, totalCost, avgCostPerIngredient };
  };

  const getRecipeIngredientCount = (recipeId: string) => {
    return ingredients.filter(i => i.recipe_id === recipeId).length;
  };

  const getRecipeTotalCost = (recipeId: string) => {
    return ingredients
      .filter(i => i.recipe_id === recipeId)
      .reduce((sum, i) => sum + i.total_cost, 0);
  };

  const handleCreate = () => {
    const inventoryItem = mockInventoryItems.find(item => item.id === formData.inventory_item_id);
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!inventoryItem || !recipe) {
      toast.error('Vui lòng chọn công thức và nguyên liệu!');
      return;
    }

    const totalCost = (formData.quantity_needed * inventoryItem.price) / 1000; // Assuming price per kg/liter

    const newIngredient: RecipeIngredient = {
      id: Date.now().toString(),
      recipe_id: formData.recipe_id,
      recipe_name: recipe.name,
      inventory_item_id: formData.inventory_item_id,
      ingredient_name: inventoryItem.name,
      quantity_needed: formData.quantity_needed,
      unit: formData.unit,
      cost_per_unit: inventoryItem.price,
      total_cost: totalCost,
      is_critical: formData.is_critical,
      substitutes: formData.substitutes,
      preparation_note: formData.preparation_note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setIngredients([...ingredients, newIngredient]);
    toast.success('Nguyên liệu đã được thêm vào công thức!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingIngredient) return;
    
    const inventoryItem = mockInventoryItems.find(item => item.id === formData.inventory_item_id);
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!inventoryItem || !recipe) {
      toast.error('Vui lòng chọn công thức và nguyên liệu!');
      return;
    }

    const totalCost = (formData.quantity_needed * inventoryItem.price) / 1000;
    
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === editingIngredient.id 
        ? { 
            ...ingredient, 
            ...formData,
            recipe_name: recipe.name,
            ingredient_name: inventoryItem.name,
            cost_per_unit: inventoryItem.price,
            total_cost: totalCost,
            updated_at: new Date().toISOString() 
          }
        : ingredient
    ));
    toast.success('Nguyên liệu đã được cập nhật!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    toast.success('Nguyên liệu đã được xóa khỏi công thức!');
  };

  const handleDuplicate = (ingredient: RecipeIngredient) => {
    const duplicatedIngredient: RecipeIngredient = {
      ...ingredient,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setIngredients([...ingredients, duplicatedIngredient]);
    toast.success('Nguyên liệu đã được sao chép!');
  };

  const resetForm = () => {
    setFormData({
      recipe_id: '',
      inventory_item_id: '',
      quantity_needed: 0,
      unit: 'gram',
      is_critical: false,
      substitutes: [],
      preparation_note: ''
    });
    setEditingIngredient(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (ingredient: RecipeIngredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      recipe_id: ingredient.recipe_id,
      inventory_item_id: ingredient.inventory_item_id,
      quantity_needed: ingredient.quantity_needed,
      unit: ingredient.unit,
      is_critical: ingredient.is_critical,
      substitutes: ingredient.substitutes,
      preparation_note: ingredient.preparation_note || ''
    });
    setIsDialogOpen(true);
  };

  const stats = getIngredientStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nguyên liệu công thức</h1>
          <p className="text-muted-foreground">
            Quản lý nguyên liệu và định lượng cho từng công thức nấu ăn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nguyên liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
              </DialogTitle>
              <DialogDescription>
                {editingIngredient 
                  ? 'Cập nhật thông tin nguyên liệu trong công thức'
                  : 'Thêm nguyên liệu mới vào công thức nấu ăn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="inventory_item_id" className="text-right">
                  Nguyên liệu
                </Label>
                <Select value={formData.inventory_item_id} onValueChange={(value) => setFormData({...formData, inventory_item_id: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn nguyên liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatPrice(item.price)}/kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity_needed" className="text-right">
                  Số lượng
                </Label>
                <Input
                  id="quantity_needed"
                  type="number"
                  value={formData.quantity_needed}
                  onChange={(e) => setFormData({...formData, quantity_needed: parseFloat(e.target.value)})}
                  className="col-span-2"
                />
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preparation_note" className="text-right">
                  Ghi chú chế biến
                </Label>
                <Textarea
                  id="preparation_note"
                  value={formData.preparation_note}
                  onChange={(e) => setFormData({...formData, preparation_note: e.target.value})}
                  className="col-span-3"
                  rows={3}
                  placeholder="Hướng dẫn chế biến nguyên liệu..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_critical" className="text-right">
                  Nguyên liệu quan trọng
                </Label>
                <Switch
                  id="is_critical"
                  checked={formData.is_critical}
                  onCheckedChange={(checked) => setFormData({...formData, is_critical: checked})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingIngredient ? handleUpdate : handleCreate}>
                {editingIngredient ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nguyên liệu
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIngredients}</div>
            <p className="text-xs text-muted-foreground">
              Nguyên liệu trong các công thức
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nguyên liệu quan trọng
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalIngredients}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.criticalIngredients / stats.totalIngredients) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng chi phí
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              Chi phí nguyên liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TB/nguyên liệu
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.avgCostPerIngredient)}</div>
            <p className="text-xs text-muted-foreground">
              Chi phí trung bình
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Nguyên liệu theo công thức
          </CardTitle>
          <CardDescription>
            Quản lý định lượng và chi phí nguyên liệu cho từng công thức
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nguyên liệu hoặc công thức..."
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
            <Select value={filterCritical} onValueChange={setFilterCritical}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo độ quan trọng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="critical">Quan trọng</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nguyên liệu</TableHead>
                <TableHead>Công thức</TableHead>
                <TableHead>Định lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Độ quan trọng</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{ingredient.ingredient_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {ingredient.inventory_item_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{ingredient.recipe_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Scale className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono font-medium">
                        {ingredient.quantity_needed} {ingredient.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(ingredient.cost_per_unit)}</div>
                    <div className="text-xs text-muted-foreground">/{ingredient.unit}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-primary">
                      {formatPrice(ingredient.total_cost)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={ingredient.is_critical ? 'destructive' : 'secondary'}>
                        {ingredient.is_critical ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
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
                    <div className="text-sm">
                      {ingredient.preparation_note ? (
                        <div className="max-w-[200px]">
                          {ingredient.preparation_note.length > 50
                            ? ingredient.preparation_note.substring(0, 50) + '...'
                            : ingredient.preparation_note
                          }
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Không có ghi chú</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(ingredient.updated_at).toLocaleDateString('vi-VN')}
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
                        <DropdownMenuItem onClick={() => openEditDialog(ingredient)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(ingredient)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Kiểm tra tồn kho
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Lịch sử giá
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(ingredient.id)}
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
