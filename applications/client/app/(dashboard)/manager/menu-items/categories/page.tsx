'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  FolderTree,
  Clock,
  Utensils
} from 'lucide-react';
import {
  DataTable,
  DataTableSortButton
} from '@/components/elements/data-table';
import { CategoryForm } from "@/components/elements/form-data";
import { toast } from 'sonner';
import { CategoryDataColumn, CategoryInterface } from '@/constants/interfaces';
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateStatusCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteHardCategoryMutation
} from "@/state/api";

export default function CategoriesPage() {
  // const [categories, setCategories] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDataColumn | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryDataColumn | null>(null);

  const {
    data: categories = [],
    error,
    isLoading,
    refetch: refetchCategories
  } = useGetAllCategoriesQuery();

  // Mutations
  const [
    createCategory,
    { isLoading: isCreating }
  ] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [updateStatusCategory, { isLoading: isUpdatingStatus }] = useUpdateStatusCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [deleteHardCategory, { isLoading: isDeletingHard }] = useDeleteHardCategoryMutation();

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
            <Switch 
              checked={row.original.is_active} 
              onCheckedChange={(checked) => handleToggleStatus(row.original.id, checked)}
              disabled={isUpdatingStatus}
            />
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
        const r = row.original

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
                onClick={() => navigator.clipboard.writeText(r.id)}
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openEditDialog(r)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              {/*<DropdownMenuItem*/}
              {/*  onClick={() => handleToggleAvailability(r)}*/}
              {/*>*/}
              {/*  {r.is_available ? (*/}
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
                onClick={() => setDeletingCategory(r)}
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

  const openEditDialog = (category: CategoryDataColumn) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  // CRUD Handlers
  const handleCreateCategory = async (categoryData: CategoryInterface) => {
    try {
      await createCategory(categoryData).unwrap();
      toast.success('Tạo danh mục thành công');
      setIsDialogOpen(false);
      refetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Có lỗi xảy ra khi tạo danh mục');
    }
  };

  const handleUpdateCategory = async (categoryData: Partial<CategoryInterface>) => {
    if (!editingCategory) return;

    try {
      await updateCategory({
        id: editingCategory.id,
        data: categoryData
      }).unwrap();
      toast.success('Cập nhật danh mục thành công');
      setIsDialogOpen(false);
      setEditingCategory(null);
      refetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh mục');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success('Xóa danh mục thành công');
      refetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Có lỗi xảy ra khi xóa danh mục');
    }
  };

  const handleDeleteHardCategory = async (categoryId: string) => {
    try {
      await deleteHardCategory(categoryId).unwrap();
      toast.success('Xóa vĩnh viễn danh mục thành công');
      refetchCategories();
    } catch (error) {
      console.error('Error hard deleting category:', error);
      toast.error('Có lỗi xảy ra khi xóa vĩnh viễn danh mục');
    }
  };

  const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      await updateStatusCategory({
        id: categoryId,
        status: { is_active: isActive }
      }).unwrap();
      toast.success(`Danh mục đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'}`);
      refetchCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái danh mục');
    }
  };

  const handleFormSuccess = (data: CategoryInterface) => {
    if (editingCategory) {
      handleUpdateCategory(data);
    } else {
      handleCreateCategory(data);
    }
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="">
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
          <CategoryForm
            mode={editingCategory ? "update" : "create"}
            initialValues={editingCategory || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingCategory(null);
            }}
            submitText={editingCategory ? "Cập nhật" : "Tạo mới"}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục &quot;{deletingCategory?.name}&quot; không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCategory) {
                  // handleDeleteCategory(deletingCategory.id);
                  deleteHardCategory(deletingCategory.id);
                  setDeletingCategory(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
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
          onCreate={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
          onChange={() => {}}
          onReload={refetchCategories}
          onDownload={() => {}}
          onUpdate={(category: CategoryDataColumn) => {
            setEditingCategory(category);
            setIsDialogOpen(true);
          }}
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
    </>
  );
}
