'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FolderTree,
  ImageIcon,
  XCircle, CheckCircle,
  Clock, Utensils
} from 'lucide-react';
import { DataTable, DataTableSortButton, DataTableColumnHeader } from '@/components/elements/data-table';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/format-utils';
import { CategoryDataColumn } from '@/constants/interfaces';
import { useGetAllCategoriesQuery } from "@/state/api";

export default function CategoriesPage() {
  // const [categories, setCategories] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDataColumn | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_active: true,
    parent_id: null
  });

  const {
    data: categories = [],
    error,
    isLoading,
    refetch: refetchCategories
  } = useGetAllCategoriesQuery();

  // Mock data based on database schema
  const data: CategoryDataColumn[] = [
    {
      id: '1',
      name: 'Món chính',
      slug: 'mon-chinh',
      description: 'Các món ăn chính của nhà hàng',
      image_url: null,
      display_order: 1,
      is_active: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      parent_category: null,
      child_categories: [],
      _count: {
        "menu_items": 20
      },
      // menu_items_count: 20
    },
    {
      id: '4',
      name: 'Đồ uống',
      slug: 'do-uong',
      description: 'Các loại thức uống',
      image_url: null,
      display_order: 2,
      is_active: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      parent_category: null,
      child_categories: [
        {
          id: "27f315ff-50bc-4f62-8cd4-c0e53530352b",
          name: "Âu",
          slug: "western",
          description: null,
          created_at: "2025-09-07T16:34:28.013Z",
          display_order: 0,
          image_url: null,
          is_active: true,
          parent_id: null,
          updated_at: "2025-09-07T16:34:28.013Z",
          parent_category: null,
          child_categories: [],
          _count: {
            "menu_items": 10
          },
          // menu_items_count: 10
        },
      ],
      _count: {
        "menu_items": 20
      },
      // menu_items_count: 20
    },
    {
      id: '7',
      name: 'Tráng miệng',
      slug: 'trang-mieng',
      description: 'Các món tráng miệng ngọt ngào',
      image_url: null,
      display_order: 3,
      is_active: false,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      parent_category: null,
      child_categories: [],
      _count: {
        "menu_items": 20
      },
      // menu_items_count: 20
    },
    {
      id: "036cfab9-6a79-43e8-be09-e1ef41f96743",
      name: "Tráng Miệng",
      slug: "dessert",
      description: null,
      created_at: "2025-09-07T16:34:28.862Z",
      display_order: 0,
      image_url: null,
      is_active: false,
      parent_id: null,
      updated_at: "2025-09-07T16:34:28.862Z",
      parent_category: null,
      child_categories: [],
      _count: {
        "menu_items": 20
      },
      // menu_items_count: 20
    }
  ];

  const columns: ColumnDef<CategoryDataColumn, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="w-[18px] h-[18px] ml-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="w-[18px] h-[18px] ml-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      // enableResizing: false,
      size: 50, // Width cho checkbox column
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        // <DataTableColumnHeader column={column} title="Món ăn" />
        <DataTableSortButton column={column} title="Danh mục" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {row.original.image_url ? (
                <Image
                  className="h-9 w-9 rounded-md object-cover"
                  src={row.original.image_url}
                  alt="avatar"
                  width={36}
                  height={36}
                />
              ) : (
                <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    FD
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate">
                {row.original.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {row.original.description}
              </div>
            </div>
          </div>
        )
      },
      size: 300, // Width cho Profile column
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Switch checked={row.original.is_active} onCheckedChange={() => {}}/>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 90, // Width cho Status column
    },
    {
      accessorKey: "items",
      header: () => <div className="text-center">Số món ăn</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original._count?.menu_items}
        </div>
      ),
      size: 90
    },
    {
      accessorKey: "counter",
      header: () => <div className="text-center">Lượt order</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.display_order}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 90,
    },
    {
      id: "actions",
      // accessorKey: "actions",
      // header: () => <div className="text-right">Actions</div>,
      enableResizing: false,
      size: 64, // Width cho Actions column
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0" // h-8 w-8
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openEditDialog(payment)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              {/*<DropdownMenuItem*/}
              {/*  onClick={() => handleToggleAvailability(payment)}*/}
              {/*>*/}
              {/*  {payment.is_available ? (*/}
              {/*    <>*/}
              {/*      <XCircle className="mr-2 h-4 w-4" />*/}
              {/*      Tắt trạng thái*/}
              {/*    </>*/}
              {/*  ) : (*/}
              {/*    <>*/}
              {/*      <CheckCircle className="mr-2 h-4 w-4" />*/}
              {/*      Bật trạng thái*/}
              {/*    </>*/}
              {/*  )}*/}
              {/*</DropdownMenuItem>*/}
              <DropdownMenuItem>
                <Utensils className="mr-2 h-4 w-4" />
                Xem công thức
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                Lịch sử thay đổi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                // onClick={() => openDeleteDialog(payment)}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Confirmed</DropdownMenuItem>
                    <DropdownMenuItem>Preparing</DropdownMenuItem>
                    <DropdownMenuItem>Ready</DropdownMenuItem>
                    <DropdownMenuItem>Served</DropdownMenuItem>
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Cancelled</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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

  const openEditDialog = (category: CategoryDataColumn) => {
    setEditingCategory(category);
    // setFormData({
    //   name: category.name,
    //   slug: category.slug,
    //   description: category.description || '',
    //   image_url: category.image_url || '',
    //   display_order: category.display_order,
    //   is_active: category.is_active,
    //   parent_id: category.parent_id
    // });
    setIsDialogOpen(true);
  };

  const renderCategoryRow = (category: CategoryDataColumn, isChild = false) => (
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
              // onClick={() => handleDelete(category.id)}
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
      {/*<div className="flex items-center justify-between">*/}
      {/*  <div>*/}
      {/*    <h1 className="text-3xl font-bold tracking-tight">Quản lý phân loại</h1>*/}
      {/*    <p className="text-muted-foreground">*/}
      {/*      Quản lý các danh mục món ăn và phân loại thực đơn*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>*/}
      {/*    <DialogTrigger asChild>*/}
      {/*      <Button onClick={openCreateDialog}>*/}
      {/*        <Plus className="mr-2 h-4 w-4" />*/}
      {/*        Thêm danh mục*/}
      {/*      </Button>*/}
      {/*    </DialogTrigger>*/}
      {/*    <DialogContent className="sm:max-w-[525px]">*/}
      {/*      <DialogHeader>*/}
      {/*        <DialogTitle>*/}
      {/*          {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}*/}
      {/*        </DialogTitle>*/}
      {/*        <DialogDescription>*/}
      {/*          {editingCategory*/}
      {/*            ? 'Cập nhật thông tin danh mục món ăn'*/}
      {/*            : 'Tạo danh mục mới cho món ăn trong thực đơn'*/}
      {/*          }*/}
      {/*        </DialogDescription>*/}
      {/*      </DialogHeader>*/}
      {/*      <div className="grid gap-4 py-4">*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="name" className="text-right">*/}
      {/*            Tên danh mục*/}
      {/*          </Label>*/}
      {/*          <Input*/}
      {/*            id="name"*/}
      {/*            value={formData.name}*/}
      {/*            onChange={(e) => setFormData({ ...formData, name: e.target.value })}*/}
      {/*            className="col-span-3"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="slug" className="text-right">*/}
      {/*            Slug*/}
      {/*          </Label>*/}
      {/*          <Input*/}
      {/*            id="slug"*/}
      {/*            value={formData.slug}*/}
      {/*            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}*/}
      {/*            className="col-span-3"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="description" className="text-right">*/}
      {/*            Mô tả*/}
      {/*          </Label>*/}
      {/*          <Textarea*/}
      {/*            id="description"*/}
      {/*            value={formData.description}*/}
      {/*            onChange={(e) => setFormData({ ...formData, description: e.target.value })}*/}
      {/*            className="col-span-3"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="image_url" className="text-right">*/}
      {/*            URL hình ảnh*/}
      {/*          </Label>*/}
      {/*          <Input*/}
      {/*            id="image_url"*/}
      {/*            value={formData.image_url}*/}
      {/*            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}*/}
      {/*            className="col-span-3"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="display_order" className="text-right">*/}
      {/*            Thứ tự hiển thị*/}
      {/*          </Label>*/}
      {/*          <Input*/}
      {/*            id="display_order"*/}
      {/*            type="number"*/}
      {/*            value={formData.display_order}*/}
      {/*            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}*/}
      {/*            className="col-span-3"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div className="grid grid-cols-4 items-center gap-4">*/}
      {/*          <Label htmlFor="is_active" className="text-right">*/}
      {/*            Hoạt động*/}
      {/*          </Label>*/}
      {/*          <Switch*/}
      {/*            id="is_active"*/}
      {/*            checked={formData.is_active}*/}
      {/*            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="flex justify-end gap-2">*/}
      {/*        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>*/}
      {/*          Hủy*/}
      {/*        </Button>*/}
      {/*        <Button*/}
      {/*          // onClick={editingCategory ? handleUpdate : handleCreate}*/}
      {/*        >*/}
      {/*          {editingCategory ? 'Cập nhật' : 'Tạo mới'}*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </DialogContent>*/}
      {/*  </Dialog>*/}
      {/*</div>*/}

      <DataTable
        columns={columns}
        data={categories}
        // order={["select", "menu-item"]}
        search={{
          column: "name",
          placeholder: "Tìm kiếm danh mục..."
        }}
        max="name"
        filter={[]}
      />

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
              {/*{filteredCategories.map((category) => (*/}
              {/*  <React.Fragment key={category.id}>*/}
              {/*    {renderCategoryRow(category)}*/}
              {/*    {category.child_categories?.map((child) =>*/}
              {/*      renderCategoryRow(child, true)*/}
              {/*    )}*/}
              {/*  </React.Fragment>*/}
              {/*))}*/}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
