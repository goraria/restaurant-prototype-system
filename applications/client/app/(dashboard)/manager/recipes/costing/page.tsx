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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Percent,
  FileText,
  Eye,
  Download,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Banknote,
  ShoppingCart,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface RecipeCosting {
  id: string;
  recipe_id: string;
  recipe_name: string;
  portion_size: number;
  ingredient_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
  selling_price: number;
  profit_margin: number;
  profit_amount: number;
  cost_per_portion: number;
  markup_percentage: number;
  break_even_price: number;
  last_updated: string;
  notes?: string;
  status: 'active' | 'draft' | 'archived';
}

// Mock data for recipe costing
const mockCostings: RecipeCosting[] = [
  {
    id: '1',
    recipe_id: '1',
    recipe_name: 'Phở Bò Đặc Biệt',
    portion_size: 1,
    ingredient_cost: 65000,
    labor_cost: 25000,
    overhead_cost: 15000,
    total_cost: 105000,
    selling_price: 180000,
    profit_margin: 41.67,
    profit_amount: 75000,
    cost_per_portion: 105000,
    markup_percentage: 71.43,
    break_even_price: 120000,
    last_updated: '2024-01-15T10:00:00Z',
    status: 'active',
    notes: 'Giá nguyên liệu có xu hướng tăng, cần theo dõi'
  },
  {
    id: '2',
    recipe_id: '2',
    recipe_name: 'Cơm Gà Nướng Mật Ong',
    portion_size: 1,
    ingredient_cost: 45000,
    labor_cost: 20000,
    overhead_cost: 12000,
    total_cost: 77000,
    selling_price: 150000,
    profit_margin: 48.67,
    profit_amount: 73000,
    cost_per_portion: 77000,
    markup_percentage: 94.81,
    break_even_price: 88000,
    last_updated: '2024-01-18T10:00:00Z',
    status: 'active',
    notes: 'Margin tốt, có thể xem xét khuyến mãi'
  },
  {
    id: '3',
    recipe_id: '3',
    recipe_name: 'Trà Đá Chanh Tươi',
    portion_size: 1,
    ingredient_cost: 8000,
    labor_cost: 5000,
    overhead_cost: 3000,
    total_cost: 16000,
    selling_price: 35000,
    profit_margin: 54.29,
    profit_amount: 19000,
    cost_per_portion: 16000,
    markup_percentage: 118.75,
    break_even_price: 18000,
    last_updated: '2024-01-20T10:00:00Z',
    status: 'active',
    notes: 'Margin cao nhất trong menu đồ uống'
  },
  {
    id: '4',
    recipe_id: '4',
    recipe_name: 'Bánh Tiramisu',
    portion_size: 1,
    ingredient_cost: 25000,
    labor_cost: 15000,
    overhead_cost: 8000,
    total_cost: 48000,
    selling_price: 85000,
    profit_margin: 43.53,
    profit_amount: 37000,
    cost_per_portion: 48000,
    markup_percentage: 77.08,
    break_even_price: 55000,
    last_updated: '2024-01-22T10:00:00Z',
    status: 'active',
    notes: 'Thời gian chế biến lâu, cần tối ưu'
  },
  {
    id: '5',
    recipe_id: '5',
    recipe_name: 'Salad Caesar',
    portion_size: 1,
    ingredient_cost: 35000,
    labor_cost: 12000,
    overhead_cost: 8000,
    total_cost: 55000,
    selling_price: 120000,
    profit_margin: 54.17,
    profit_amount: 65000,
    cost_per_portion: 55000,
    markup_percentage: 118.18,
    break_even_price: 63000,
    last_updated: '2024-01-25T10:00:00Z',
    status: 'draft',
    notes: 'Đang xem xét điều chỉnh giá bán'
  }
];

const availableRecipes = [
  { id: '1', name: 'Phở Bò Đặc Biệt' },
  { id: '2', name: 'Cơm Gà Nướng Mật Ong' },
  { id: '3', name: 'Trà Đá Chanh Tươi' },
  { id: '4', name: 'Bánh Tiramisu' },
  { id: '5', name: 'Salad Caesar' },
  { id: '6', name: 'Spaghetti Carbonara' },
  { id: '7', name: 'Cà Phê Sữa Đá' }
];

export default function CostingPage() {
  const [costings, setCostings] = useState<RecipeCosting[]>(mockCostings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCosting, setEditingCosting] = useState<RecipeCosting | null>(null);
  
  const [formData, setFormData] = useState({
    recipe_id: '',
    portion_size: 1,
    ingredient_cost: 0,
    labor_cost: 0,
    overhead_cost: 0,
    selling_price: 0,
    notes: '',
    status: 'draft' as const
  });

  const filteredCostings = costings.filter(costing => {
    const matchesSearch = costing.recipe_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || costing.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateMetrics = (ingredientCost: number, laborCost: number, overheadCost: number, sellingPrice: number) => {
    const totalCost = ingredientCost + laborCost + overheadCost;
    const profitAmount = sellingPrice - totalCost;
    const profitMargin = sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0;
    const markupPercentage = totalCost > 0 ? (profitAmount / totalCost) * 100 : 0;
    const breakEvenPrice = totalCost * 1.15; // 15% buffer
    
    return {
      totalCost,
      profitAmount,
      profitMargin,
      markupPercentage,
      breakEvenPrice
    };
  };

  const getCostingStats = () => {
    const activeCostings = costings.filter(c => c.status === 'active');
    const totalRecipes = activeCostings.length;
    const avgProfitMargin = totalRecipes > 0 
      ? activeCostings.reduce((sum, c) => sum + c.profit_margin, 0) / totalRecipes 
      : 0;
    const totalRevenue = activeCostings.reduce((sum, c) => sum + c.selling_price, 0);
    const totalCost = activeCostings.reduce((sum, c) => sum + c.total_cost, 0);
    const highMarginCount = activeCostings.filter(c => c.profit_margin >= 50).length;
    
    return { totalRecipes, avgProfitMargin, totalRevenue, totalCost, highMarginCount };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMarginStatus = (margin: number) => {
    if (margin >= 50) return { label: 'Xuất sắc', variant: 'default' as const, color: 'text-green-600' };
    if (margin >= 40) return { label: 'Tốt', variant: 'secondary' as const, color: 'text-blue-600' };
    if (margin >= 25) return { label: 'Khá', variant: 'outline' as const, color: 'text-yellow-600' };
    return { label: 'Thấp', variant: 'destructive' as const, color: 'text-red-600' };
  };

  const handleCreate = () => {
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!recipe) {
      toast.error('Vui lòng chọn công thức!');
      return;
    }

    const metrics = calculateMetrics(
      formData.ingredient_cost,
      formData.labor_cost,
      formData.overhead_cost,
      formData.selling_price
    );

    const newCosting: RecipeCosting = {
      id: Date.now().toString(),
      recipe_name: recipe.name,
      cost_per_portion: metrics.totalCost / formData.portion_size,
      ...formData,
      ...metrics,
      last_updated: new Date().toISOString()
    };
    
    setCostings([...costings, newCosting]);
    toast.success('Tính giá thành đã được thêm thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingCosting) return;
    
    const recipe = availableRecipes.find(r => r.id === formData.recipe_id);
    
    if (!recipe) {
      toast.error('Vui lòng chọn công thức!');
      return;
    }

    const metrics = calculateMetrics(
      formData.ingredient_cost,
      formData.labor_cost,
      formData.overhead_cost,
      formData.selling_price
    );
    
    setCostings(costings.map(costing => 
      costing.id === editingCosting.id 
        ? { 
            ...costing, 
            ...formData,
            recipe_name: recipe.name,
            cost_per_portion: metrics.totalCost / formData.portion_size,
            ...metrics,
            last_updated: new Date().toISOString() 
          }
        : costing
    ));
    toast.success('Tính giá thành đã được cập nhật thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCostings(costings.filter(costing => costing.id !== id));
    toast.success('Tính giá thành đã được xóa thành công!');
  };

  const handleUpdateStatus = (id: string, status: RecipeCosting['status']) => {
    setCostings(costings.map(costing => 
      costing.id === id 
        ? { ...costing, status, last_updated: new Date().toISOString() }
        : costing
    ));
    toast.success(`Trạng thái đã được cập nhật thành ${status}!`);
  };

  const resetForm = () => {
    setFormData({
      recipe_id: '',
      portion_size: 1,
      ingredient_cost: 0,
      labor_cost: 0,
      overhead_cost: 0,
      selling_price: 0,
      notes: '',
      status: 'draft'
    });
    setEditingCosting(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (costing: RecipeCosting) => {
    setEditingCosting(costing);
    setFormData({
      recipe_id: costing.recipe_id,
      portion_size: costing.portion_size,
      ingredient_cost: costing.ingredient_cost,
      labor_cost: costing.labor_cost,
      overhead_cost: costing.overhead_cost,
      selling_price: costing.selling_price,
      notes: costing.notes || '',
      status: costing.status
    });
    setIsDialogOpen(true);
  };

  const previewMetrics = calculateMetrics(
    formData.ingredient_cost,
    formData.labor_cost,
    formData.overhead_cost,
    formData.selling_price
  );

  const stats = getCostingStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tính giá thành</h1>
          <p className="text-muted-foreground">
            Phân tích chi phí và lợi nhuận cho từng món ăn trong menu
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tính giá thành
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingCosting ? 'Chỉnh sửa tính giá thành' : 'Thêm tính giá thành mới'}
              </DialogTitle>
              <DialogDescription>
                {editingCosting 
                  ? 'Cập nhật thông tin chi phí và giá bán'
                  : 'Thêm thông tin chi phí và tính toán lợi nhuận cho món ăn'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
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
                <Label htmlFor="portion_size" className="text-right">
                  Khẩu phần
                </Label>
                <Input
                  id="portion_size"
                  type="number"
                  min="1"
                  value={formData.portion_size}
                  onChange={(e) => setFormData({...formData, portion_size: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Chi phí (VND)</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ingredient_cost" className="text-right">
                      Nguyên liệu
                    </Label>
                    <Input
                      id="ingredient_cost"
                      type="number"
                      value={formData.ingredient_cost}
                      onChange={(e) => setFormData({...formData, ingredient_cost: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="labor_cost" className="text-right">
                      Nhân công
                    </Label>
                    <Input
                      id="labor_cost"
                      type="number"
                      value={formData.labor_cost}
                      onChange={(e) => setFormData({...formData, labor_cost: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="overhead_cost" className="text-right">
                      Chi phí chung
                    </Label>
                    <Input
                      id="overhead_cost"
                      type="number"
                      value={formData.overhead_cost}
                      onChange={(e) => setFormData({...formData, overhead_cost: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Giá bán & Trạng thái</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="selling_price" className="text-right">
                      Giá bán
                    </Label>
                    <Input
                      id="selling_price"
                      type="number"
                      value={formData.selling_price}
                      onChange={(e) => setFormData({...formData, selling_price: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Trạng thái
                    </Label>
                    <Select value={formData.status} onValueChange={(value: RecipeCosting['status']) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Nháp</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="archived">Lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {(formData.ingredient_cost > 0 || formData.labor_cost > 0 || formData.selling_price > 0) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Xem trước kết quả</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tổng chi phí</div>
                      <div className="font-semibold">{formatCurrency(previewMetrics.totalCost)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lợi nhuận</div>
                      <div className="font-semibold text-green-600">{formatCurrency(previewMetrics.profitAmount)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Margin</div>
                      <div className="font-semibold">{previewMetrics.profitMargin.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Markup</div>
                      <div className="font-semibold">{previewMetrics.markupPercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="col-span-3"
                  rows={3}
                  placeholder="Ghi chú về chi phí, lợi nhuận hoặc chiến lược giá..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingCosting ? handleUpdate : handleCreate}>
                {editingCosting ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng món ăn
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipes}</div>
            <p className="text-xs text-muted-foreground">
              Món ăn đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Margin trung bình
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProfitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgProfitMargin >= 40 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Tốt
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Cần cải thiện
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu ước tính
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Chi phí: {formatCurrency(stats.totalCost)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Margin cao
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highMarginCount}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.highMarginCount / stats.totalRecipes) * 100).toFixed(1)}% menu (≥50%)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bảng tính giá thành
          </CardTitle>
          <CardDescription>
            Phân tích chi phí và lợi nhuận chi tiết cho từng món ăn
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Món ăn</TableHead>
                <TableHead>Chi phí</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Lợi nhuận</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Markup</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCostings.map((costing) => {
                const marginStatus = getMarginStatus(costing.profit_margin);
                return (
                  <TableRow key={costing.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{costing.recipe_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {costing.portion_size} phần
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(costing.total_cost)}</div>
                        <div className="text-xs text-muted-foreground">
                          NL: {formatCurrency(costing.ingredient_cost)} •&nbsp;
                          NC: {formatCurrency(costing.labor_cost)} •&nbsp;
                          CC: {formatCurrency(costing.overhead_cost)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Banknote className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-green-600">
                          {formatCurrency(costing.selling_price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatCurrency(costing.profit_amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-semibold ${marginStatus.color}`}>
                        {costing.profit_margin.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {costing.markup_percentage.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={marginStatus.variant}>
                        {marginStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        costing.status === 'active' ? 'default' : 
                        costing.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {costing.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {costing.status === 'draft' && <Clock className="w-3 h-3 mr-1" />}
                        {costing.status === 'archived' && <FileText className="w-3 h-3 mr-1" />}
                        {costing.status === 'active' ? 'Hoạt động' : 
                         costing.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(costing.last_updated).toLocaleDateString('vi-VN')}
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
                          <DropdownMenuItem onClick={() => openEditDialog(costing)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PieChart className="mr-2 h-4 w-4" />
                            Phân tích
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Biểu đồ
                          </DropdownMenuItem>
                          {costing.status === 'draft' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(costing.id, 'active')}
                              className="text-green-600"
                            >
                              <Zap className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                          {costing.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(costing.id, 'archived')}
                              className="text-yellow-600"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Lưu trữ
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(costing.id)}
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
