'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  FileText,
  Download,
  BarChart3,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_position: string;
  reviewer_id: string;
  reviewer_name: string;
  review_period_start: string;
  review_period_end: string;
  overall_score: number;
  quality_score: number;
  productivity_score: number;
  teamwork_score: number;
  punctuality_score: number;
  communication_score: number;
  strengths: string;
  areas_for_improvement: string;
  goals_next_period: string;
  reviewer_comments: string;
  status: 'draft' | 'completed' | 'approved' | 'disputed';
  created_at: string;
  updated_at: string;
}

// Mock data cho đánh giá hiệu suất
const mockReviews: Review[] = [
  {
    id: '1',
    staff_id: 'EMP001',
    staff_name: 'Nguyễn Văn An',
    staff_position: 'Đầu bếp trưởng',
    reviewer_id: 'MGR001',
    reviewer_name: 'Trần Quản Lý',
    review_period_start: '2024-01-01',
    review_period_end: '2024-03-31',
    overall_score: 9.2,
    quality_score: 9.5,
    productivity_score: 9.0,
    teamwork_score: 8.8,
    punctuality_score: 9.5,
    communication_score: 8.5,
    strengths: 'Kỹ năng nấu ăn xuất sắc, khả năng lãnh đạo tốt, luôn đảm bảo chất lượng món ăn. Có khả năng đào tạo nhân viên mới hiệu quả.',
    areas_for_improvement: 'Cần cải thiện kỹ năng giao tiếp với khách hàng, đôi khi có thể căng thẳng trong giờ cao điểm.',
    goals_next_period: 'Phát triển thêm 3 món ăn mới cho menu, đào tạo 2 đầu bếp phụ, cải thiện thời gian phục vụ trong giờ cao điểm.',
    reviewer_comments: 'Nhân viên xuất sắc với đóng góp lớn cho nhà hàng. Đề xuất tăng lương và xem xét thăng chức.',
    status: 'approved',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-20T15:30:00Z'
  },
  {
    id: '2',
    staff_id: 'EMP002',
    staff_name: 'Trần Thị Mai',
    staff_position: 'Quản lý ca',
    reviewer_id: 'MGR001',
    reviewer_name: 'Trần Quản Lý',
    review_period_start: '2024-01-01',
    review_period_end: '2024-03-31',
    overall_score: 8.8,
    quality_score: 9.0,
    productivity_score: 8.5,
    teamwork_score: 9.2,
    punctuality_score: 9.0,
    communication_score: 9.0,
    strengths: 'Khả năng quản lý nhóm tốt, giao tiếp hiệu quả với khách hàng và nhân viên. Luôn chủ động xử lý các tình huống phát sinh.',
    areas_for_improvement: 'Cần cải thiện khả năng quản lý thời gian trong ca làm việc, đôi khi các công việc bị chồng chéo.',
    goals_next_period: 'Tối ưu quy trình phục vụ, đào tạo kỹ năng bán hàng cho nhân viên, tăng điểm đánh giá khách hàng lên 4.5 sao.',
    reviewer_comments: 'Nhân viên có tiềm năng phát triển cao, rất phù hợp với vị trí quản lý.',
    status: 'completed',
    created_at: '2024-03-18T14:00:00Z',
    updated_at: '2024-03-25T09:15:00Z'
  },
  {
    id: '3',
    staff_id: 'EMP003',
    staff_name: 'Lê Hoàng Nam',
    staff_position: 'Thu ngân',
    reviewer_id: 'EMP002',
    reviewer_name: 'Trần Thị Mai',
    review_period_start: '2024-01-01',
    review_period_end: '2024-03-31',
    overall_score: 8.5,
    quality_score: 8.8,
    productivity_score: 8.5,
    teamwork_score: 8.0,
    punctuality_score: 9.0,
    communication_score: 8.5,
    strengths: 'Chính xác trong tính toán, thái độ phục vụ tốt, ít khi mắc lỗi trong quá trình thanh toán.',
    areas_for_improvement: 'Cần tích cực hơn trong việc tương tác với đồng nghiệp, phát triển kỹ năng bán hàng.',
    goals_next_period: 'Học thêm về các phương thức thanh toán mới, tăng doanh số bán món phụ và đồ uống.',
    reviewer_comments: 'Nhân viên đáng tin cậy, có thể phát triển thêm về mặt kỹ năng mềm.',
    status: 'completed',
    created_at: '2024-03-20T11:30:00Z',
    updated_at: '2024-03-22T16:45:00Z'
  },
  {
    id: '4',
    staff_id: 'EMP004',
    staff_name: 'Phạm Minh Tuấn',
    staff_position: 'Bồi bàn',
    reviewer_id: 'EMP002',
    reviewer_name: 'Trần Thị Mai',
    review_period_start: '2024-01-01',
    review_period_end: '2024-03-31',
    overall_score: 7.8,
    quality_score: 8.0,
    productivity_score: 7.5,
    teamwork_score: 8.2,
    punctuality_score: 7.0,
    communication_score: 8.0,
    strengths: 'Thái độ phục vụ tốt, nhiệt tình với khách hàng, làm việc nhóm hiệu quả.',
    areas_for_improvement: 'Cần cải thiện tính đúng giờ, đôi khi chậm trong việc ghi nhận đơn hàng.',
    goals_next_period: 'Cải thiện kỹ năng ghi chép đơn hàng, học thêm về thực đơn để tư vấn khách hàng tốt hơn.',
    reviewer_comments: 'Nhân viên có tinh thần làm việc tốt, cần hỗ trợ thêm về kỹ năng.',
    status: 'draft',
    created_at: '2024-03-25T10:00:00Z',
    updated_at: '2024-03-25T10:00:00Z'
  },
  {
    id: '5',
    staff_id: 'EMP005',
    staff_name: 'Vũ Thành Long',
    staff_position: 'Bảo vệ',
    reviewer_id: 'MGR001',
    reviewer_name: 'Trần Quản Lý',
    review_period_start: '2024-01-01',
    review_period_end: '2024-03-31',
    overall_score: 8.0,
    quality_score: 8.5,
    productivity_score: 8.0,
    teamwork_score: 7.5,
    punctuality_score: 9.0,
    communication_score: 7.8,
    strengths: 'Chấp hành kỷ luật tốt, có trách nhiệm cao trong công việc, luôn đảm bảo an ninh cho nhà hàng.',
    areas_for_improvement: 'Cần cải thiện kỹ năng giao tiếp với khách hàng, đôi khi có thái độ hơi cứng nhắc.',
    goals_next_period: 'Tham gia khóa đào tạo dịch vụ khách hàng, nâng cao kỹ năng xử lý tình huống.',
    reviewer_comments: 'Nhân viên có ý thức trách nhiệm cao, cần phát triển thêm kỹ năng mềm.',
    status: 'completed',
    created_at: '2024-03-22T09:00:00Z',
    updated_at: '2024-03-28T14:20:00Z'
  }
];

const mockStaff = [
  { id: 'EMP001', name: 'Nguyễn Văn An', position: 'Đầu bếp trưởng' },
  { id: 'EMP002', name: 'Trần Thị Mai', position: 'Quản lý ca' },
  { id: 'EMP003', name: 'Lê Hoàng Nam', position: 'Thu ngân' },
  { id: 'EMP004', name: 'Phạm Minh Tuấn', position: 'Bồi bàn' },
  { id: 'EMP005', name: 'Vũ Thành Long', position: 'Bảo vệ' },
  { id: 'EMP006', name: 'Hoàng Thị Linh', position: 'Kế toán' }
];

const mockReviewers = [
  { id: 'MGR001', name: 'Trần Quản Lý' },
  { id: 'EMP002', name: 'Trần Thị Mai' },
  { id: 'EMP001', name: 'Nguyễn Văn An' }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [formData, setFormData] = useState({
    staff_id: '',
    reviewer_id: '',
    review_period_start: '',
    review_period_end: '',
    overall_score: 5.0,
    quality_score: 5.0,
    productivity_score: 5.0,
    teamwork_score: 5.0,
    punctuality_score: 5.0,
    communication_score: 5.0,
    strengths: '',
    areas_for_improvement: '',
    goals_next_period: '',
    reviewer_comments: '',
    status: 'draft' as const
  });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.staff_position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    const matchesPeriod = selectedPeriod === 'all' || 
                         (selectedPeriod === 'q1' && review.review_period_end.includes('03-31')) ||
                         (selectedPeriod === 'q2' && review.review_period_end.includes('06-30')) ||
                         (selectedPeriod === 'q3' && review.review_period_end.includes('09-30')) ||
                         (selectedPeriod === 'q4' && review.review_period_end.includes('12-31'));
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const getReviewStats = () => {
    const totalReviews = reviews.length;
    const completedReviews = reviews.filter(r => r.status === 'completed' || r.status === 'approved').length;
    const avgOverallScore = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.overall_score, 0) / reviews.length 
      : 0;
    const highPerformers = reviews.filter(r => r.overall_score >= 9.0).length;
    const needsImprovement = reviews.filter(r => r.overall_score < 7.0).length;
    
    return { totalReviews, completedReviews, avgOverallScore, highPerformers, needsImprovement };
  };

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline"><Edit className="w-3 h-3 mr-1" />Nháp</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><Award className="w-3 h-3 mr-1" />Đã duyệt</Badge>;
      case 'disputed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Tranh chấp</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 9) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 7) return <Target className="w-4 h-4 text-blue-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateAverageScores = (review: Review) => {
    const scores = [
      review.quality_score,
      review.productivity_score,
      review.teamwork_score,
      review.punctuality_score,
      review.communication_score
    ];
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const handleCreate = () => {
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    const reviewer = mockReviewers.find(r => r.id === formData.reviewer_id);
    
    if (!staff || !reviewer) {
      toast.error('Vui lòng chọn nhân viên và người đánh giá!');
      return;
    }

    const avgScore = calculateAverageScores({
      ...formData,
      quality_score: formData.quality_score,
      productivity_score: formData.productivity_score,
      teamwork_score: formData.teamwork_score,
      punctuality_score: formData.punctuality_score,
      communication_score: formData.communication_score
    } as Review);

    const newReview: Review = {
      id: Date.now().toString(),
      staff_name: staff.name,
      staff_position: staff.position,
      reviewer_name: reviewer.name,
      overall_score: avgScore,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setReviews([...reviews, newReview]);
    toast.success('Đánh giá đã được thêm thành công!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!editingReview) return;
    
    const staff = mockStaff.find(s => s.id === formData.staff_id);
    const reviewer = mockReviewers.find(r => r.id === formData.reviewer_id);
    
    if (!staff || !reviewer) {
      toast.error('Vui lòng chọn nhân viên và người đánh giá!');
      return;
    }

    const avgScore = calculateAverageScores({
      ...formData,
      quality_score: formData.quality_score,
      productivity_score: formData.productivity_score,
      teamwork_score: formData.teamwork_score,
      punctuality_score: formData.punctuality_score,
      communication_score: formData.communication_score
    } as Review);
    
    setReviews(reviews.map(review => 
      review.id === editingReview.id 
        ? { 
            ...review, 
            ...formData,
            staff_name: staff.name,
            staff_position: staff.position,
            reviewer_name: reviewer.name,
            overall_score: avgScore,
            updated_at: new Date().toISOString() 
          }
        : review
    ));
    toast.success('Đánh giá đã được cập nhật!');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
    toast.success('Đánh giá đã được xóa!');
  };

  const handleUpdateStatus = (id: string, status: Review['status']) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, status, updated_at: new Date().toISOString() }
        : review
    ));
    toast.success(`Trạng thái đã được cập nhật!`);
  };

  const resetForm = () => {
    setFormData({
      staff_id: '',
      reviewer_id: '',
      review_period_start: '',
      review_period_end: '',
      overall_score: 5.0,
      quality_score: 5.0,
      productivity_score: 5.0,
      teamwork_score: 5.0,
      punctuality_score: 5.0,
      communication_score: 5.0,
      strengths: '',
      areas_for_improvement: '',
      goals_next_period: '',
      reviewer_comments: '',
      status: 'draft'
    });
    setEditingReview(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setFormData({
      staff_id: review.staff_id,
      reviewer_id: review.reviewer_id,
      review_period_start: review.review_period_start,
      review_period_end: review.review_period_end,
      overall_score: review.overall_score,
      quality_score: review.quality_score,
      productivity_score: review.productivity_score,
      teamwork_score: review.teamwork_score,
      punctuality_score: review.punctuality_score,
      communication_score: review.communication_score,
      strengths: review.strengths,
      areas_for_improvement: review.areas_for_improvement,
      goals_next_period: review.goals_next_period,
      reviewer_comments: review.reviewer_comments,
      status: review.status
    });
    setIsDialogOpen(true);
  };

  const stats = getReviewStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đánh giá hiệu suất</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi hiệu suất làm việc của nhân viên
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đánh giá
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'Chỉnh sửa đánh giá' : 'Tạo đánh giá hiệu suất mới'}
              </DialogTitle>
              <DialogDescription>
                {editingReview 
                  ? 'Cập nhật thông tin đánh giá hiệu suất'
                  : 'Tạo đánh giá hiệu suất cho nhân viên'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff_id" className="text-right">
                    Nhân viên
                  </Label>
                  <Select value={formData.staff_id} onValueChange={(value) => setFormData({...formData, staff_id: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} - {staff.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reviewer_id" className="text-right">
                    Người đánh giá
                  </Label>
                  <Select value={formData.reviewer_id} onValueChange={(value) => setFormData({...formData, reviewer_id: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn người đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockReviewers.map(reviewer => (
                        <SelectItem key={reviewer.id} value={reviewer.id}>
                          {reviewer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="review_period_start" className="text-right">
                    Từ ngày
                  </Label>
                  <Input
                    id="review_period_start"
                    type="date"
                    value={formData.review_period_start}
                    onChange={(e) => setFormData({...formData, review_period_start: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="review_period_end" className="text-right">
                    Đến ngày
                  </Label>
                  <Input
                    id="review_period_end"
                    type="date"
                    value={formData.review_period_end}
                    onChange={(e) => setFormData({...formData, review_period_end: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Điểm đánh giá (1-10)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quality_score" className="text-right">
                        Chất lượng công việc
                      </Label>
                      <Input
                        id="quality_score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={formData.quality_score}
                        onChange={(e) => setFormData({...formData, quality_score: parseFloat(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productivity_score" className="text-right">
                        Năng suất
                      </Label>
                      <Input
                        id="productivity_score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={formData.productivity_score}
                        onChange={(e) => setFormData({...formData, productivity_score: parseFloat(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamwork_score" className="text-right">
                        Làm việc nhóm
                      </Label>
                      <Input
                        id="teamwork_score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={formData.teamwork_score}
                        onChange={(e) => setFormData({...formData, teamwork_score: parseFloat(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="punctuality_score" className="text-right">
                        Tính đúng giờ
                      </Label>
                      <Input
                        id="punctuality_score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={formData.punctuality_score}
                        onChange={(e) => setFormData({...formData, punctuality_score: parseFloat(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="communication_score" className="text-right">
                        Giao tiếp
                      </Label>
                      <Input
                        id="communication_score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={formData.communication_score}
                        onChange={(e) => setFormData({...formData, communication_score: parseFloat(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Trạng thái
                      </Label>
                      <Select value={formData.status} onValueChange={(value: Review['status']) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Nháp</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="approved">Đã duyệt</SelectItem>
                          <SelectItem value="disputed">Tranh chấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="strengths" className="text-right">
                    Điểm mạnh
                  </Label>
                  <Textarea
                    id="strengths"
                    value={formData.strengths}
                    onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                    className="col-span-3"
                    rows={3}
                    placeholder="Mô tả những điểm mạnh của nhân viên..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="areas_for_improvement" className="text-right">
                    Cần cải thiện
                  </Label>
                  <Textarea
                    id="areas_for_improvement"
                    value={formData.areas_for_improvement}
                    onChange={(e) => setFormData({...formData, areas_for_improvement: e.target.value})}
                    className="col-span-3"
                    rows={3}
                    placeholder="Mô tả những điểm cần cải thiện..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goals_next_period" className="text-right">
                    Mục tiêu kỳ tới
                  </Label>
                  <Textarea
                    id="goals_next_period"
                    value={formData.goals_next_period}
                    onChange={(e) => setFormData({...formData, goals_next_period: e.target.value})}
                    className="col-span-3"
                    rows={3}
                    placeholder="Đặt mục tiêu cho kỳ đánh giá tiếp theo..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reviewer_comments" className="text-right">
                    Nhận xét của người đánh giá
                  </Label>
                  <Textarea
                    id="reviewer_comments"
                    value={formData.reviewer_comments}
                    onChange={(e) => setFormData({...formData, reviewer_comments: e.target.value})}
                    className="col-span-3"
                    rows={3}
                    placeholder="Nhận xét tổng quan về nhân viên..."
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={editingReview ? handleUpdate : handleCreate}>
                {editingReview ? 'Cập nhật' : 'Tạo đánh giá'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đánh giá
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedReviews} đã hoàn thành
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm TB
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgOverallScore)}`}>
              {stats.avgOverallScore.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Điểm trung bình tổng thể
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Xuất sắc
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highPerformers}</div>
            <p className="text-xs text-muted-foreground">
              Điểm ≥ 9.0
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cần cải thiện
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.needsImprovement}</div>
            <p className="text-xs text-muted-foreground">
              Điểm &lt; 7.0
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalReviews > 0 ? ((stats.completedReviews / stats.totalReviews) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Đánh giá đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Danh sách đánh giá hiệu suất
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi kết quả đánh giá hiệu suất của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên hoặc người đánh giá..."
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
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="disputed">Tranh chấp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỳ đánh giá</SelectItem>
                <SelectItem value="q1">Quý 1</SelectItem>
                <SelectItem value="q2">Quý 2</SelectItem>
                <SelectItem value="q3">Quý 3</SelectItem>
                <SelectItem value="q4">Quý 4</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Kỳ đánh giá</TableHead>
                <TableHead>Điểm tổng</TableHead>
                <TableHead>Chi tiết điểm</TableHead>
                <TableHead>Người đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.staff_name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.staff_name}</div>
                        <div className="text-sm text-muted-foreground">{review.staff_position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(review.review_period_start)} - {formatDate(review.review_period_end)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(review.overall_score)}
                      <span className={`font-bold text-lg ${getScoreColor(review.overall_score)}`}>
                        {review.overall_score.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16">Chất lượng:</span>
                        <Progress value={review.quality_score * 10} className="w-16 h-2" />
                        <span className="font-medium">{review.quality_score.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16">Năng suất:</span>
                        <Progress value={review.productivity_score * 10} className="w-16 h-2" />
                        <span className="font-medium">{review.productivity_score.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16">Nhóm:</span>
                        <Progress value={review.teamwork_score * 10} className="w-16 h-2" />
                        <span className="font-medium">{review.teamwork_score.toFixed(1)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{review.reviewer_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(review.updated_at)}
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
                        <DropdownMenuItem onClick={() => openEditDialog(review)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          In báo cáo
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Gửi phản hồi
                        </DropdownMenuItem>
                        {review.status === 'completed' && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                            className="text-green-600"
                          >
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Duyệt đánh giá
                          </DropdownMenuItem>
                        )}
                        {review.status === 'completed' && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(review.id, 'disputed')}
                            className="text-red-600"
                          >
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Tranh chấp
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(review.id)}
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
