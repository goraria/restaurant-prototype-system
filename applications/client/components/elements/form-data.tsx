"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/pill-tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  CreateMenuSchema,
  UpdateMenuSchema
} from "@/schemas/menuSchemas";
import {
  CreateCategorySchema,
  UpdateCategorySchema
} from "@/schemas/categorySchemas";
import {
  CreateTableSchema,
  UpdateTableSchema
} from "@/schemas/tableSchemas";
import { MenuItemInterface, MenuInterface, CategoryInterface, TableInterface } from "@/constants/interfaces";
import { FileUploadServer } from "@/components/forms/file-upload-server";

export interface MenuItemFormProps {
  mode?: "create" | "update"
  restaurantId?: string
  menuId?: string
  categoryId?: string
  initialValues?: Partial<MenuItemInterface>
  onSuccess?: (data: MenuItemInterface) => void
  onCancel?: () => void
  title?: string
  submitText?: string
  isLoading?: boolean
}

export interface MenuFormProps {
  mode?: "create" | "update"
  restaurantId?: string
  initialValues?: Partial<MenuInterface>
  onSuccess?: (data: MenuInterface) => void
  onCancel?: () => void
  submitText?: string
  isLoading?: boolean
}

export interface InventoryItemFormProps {
  id: string
  name: string
}

export interface ReservationFormProps {
  id: string
  name: string
}

export interface PromotionFormProps {
  id: string
  name: string
}

export interface TableFormProps {
  mode?: "create" | "update"
  restaurantId?: string
  initialValues?: Partial<TableInterface>
  onSuccess?: (data: TableInterface) => void
  onCancel?: () => void
  submitText?: string
  isLoading?: boolean
}

export interface CategoryFormProps {
  mode?: "create" | "update"
  initialValues?: Partial<CategoryInterface>
  onSuccess?: (data: CategoryInterface) => void
  onCancel?: () => void
  submitText?: string
  isLoading?: boolean
}

// type Mode = "create" | "update";

// interface MenuItemFormProps {
//   mode?: Mode;
//   restaurantId?: string;
//   menuId?: string;
//   initialValues?: Partial<z.infer<typeof UpdateMenuItemSchema>> & { id?: string };
//   onSuccess?: (data: any) => void;
//   onCancel?: () => void;
//   title?: string;
//   submitText?: string;
// };

export function MenuItemForm({
  mode = "create",
  restaurantId,
  menuId,
  categoryId,
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
  isLoading = false
}: MenuItemFormProps) {
  const [allergens, setAllergens] = useState<string[]>(initialValues?.allergens || []);
  const [dietaryInfo, setDietaryInfo] = useState<string[]>(initialValues?.dietary_info || []);
  const [newAllergen, setNewAllergen] = useState("");
  const [newDietaryInfo, setNewDietaryInfo] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    // Handle file upload here
    console.log('Files dropped:', acceptedFiles);
  };

  const accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  };

  const multiple = false;
  const maxFiles = 1;
  const disabled = false;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled
  });

  const schema = mode === "create" ? CreateMenuItemSchema : UpdateMenuItemSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      menu_id: menuId || initialValues?.menu_id || "",
      category_id: categoryId || initialValues?.category_id || "",
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      image_url: initialValues?.image_url || "",
      is_available: initialValues?.is_available ?? true,
      allergens: initialValues?.allergens || [],
      calories: initialValues?.calories || undefined,
      dietary_info: initialValues?.dietary_info || [],
      display_order: initialValues?.display_order || 0,
      is_featured: initialValues?.is_featured || false,
      preparation_time: initialValues?.preparation_time || undefined,
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      // Merge allergens and dietary_info from state
      const submitData = {
        ...data,
        allergens,
        dietary_info: dietaryInfo,
      };

      console.log("Submitting menu item:", submitData);

      // Here you would call your API mutation
      // For now, just call onSuccess with the data
      if (onSuccess) {
        onSuccess(submitData as MenuItemInterface);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !allergens.includes(newAllergen.trim())) {
      setAllergens([...allergens, newAllergen.trim()]);
      setNewAllergen("");
    }
  };

  const removeAllergen = (allergen: string) => {
    setAllergens(allergens.filter(a => a !== allergen));
  };

  const addDietaryInfo = () => {
    if (newDietaryInfo.trim() && !dietaryInfo.includes(newDietaryInfo.trim())) {
      setDietaryInfo([...dietaryInfo, newDietaryInfo.trim()]);
      setNewDietaryInfo("");
    }
  };

  const removeDietaryInfo = (info: string) => {
    setDietaryInfo(dietaryInfo.filter(i => i !== info));
  };

  return (
    <>
      {true ? (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    submitText || (mode === "create" ? "Thêm món ăn" : "Cập nhật")
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin món ăn</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="grid grid-cols-4 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="col-span-3">
                              <FormLabel className="">Tên món ăn *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tên món ăn..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel className="">Giá (VNĐ) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="1000.00"
                                  placeholder="00.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Mô tả chi tiết về món ăn..."
                                // className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Hình ảnh món ăn</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div
                        {...getRootProps()}
                        className={`
                          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/24'}
                          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
                        `}
                      >
                        <input {...getInputProps()} />
                        <Badge className="h-9 w-9 p-0 bg-muted">
                          <Upload style={{ width: 16, height: 16 }} className="h-4 w-4 text-foreground" />
                        </Badge>
                        {/* <Badge className="h-9 w-9 p-0 bg-professional-indigo/24">
                          <Upload style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-indigo" />
                        </Badge> */}
                        {isDragActive ? (
                          <p className="text-lg font-medium">Drop files here...</p>
                        ) : (
                          <div>
                            <p className="text-lg font-medium">
                              Drag & drop files here, or click to select
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {multiple ? `Up to ${maxFiles} files` : 'Single file only'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max size: 10MB per file
                            </p>
                          </div>
                        )}

                        {form.watch("image_url") && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium">URL hình ảnh</Label>
                            <Input
                              value={form.watch("image_url")}
                              readOnly
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Nguyên liệu</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <div className="col-span-1 flex flex-col gap-6">
                  <Card>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="is_available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Có sẵn</FormLabel>
                              <FormDescription>
                                Món ăn có thể được đặt hàng
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Nổi bật</FormLabel>
                              <FormDescription>
                                Hiển thị món ăn ở vị trí nổi bật
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Thuộc tính</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="menu_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="">Menu *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn menu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* TODO: Load menus from API */}
                                <SelectItem value="menu-1">Menu Chính</SelectItem>
                                <SelectItem value="menu-2">Menu Tráng Miệng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="">Danh mục</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="flex">
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn danh mục (tùy chọn)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* TODO: Load categories from API */}
                                <SelectItem value="cat-1">Món chính</SelectItem>
                                <SelectItem value="cat-2">Khai vị</SelectItem>
                                <SelectItem value="cat-3">Tráng miệng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Kích thước</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="preparation_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Thời gian chuẩn bị (phút)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="15"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="display_order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Thứ tự hiển thị</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Giá trị</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Calories (kcal)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Nhập số calories..."
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Allergens */}
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Chất gây dị ứng</Label>
                        <div className="flex gap-4">
                          <Input
                            placeholder="Thêm chất gây dị ứng..."
                            value={newAllergen}
                            onChange={(e) => setNewAllergen(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                            className="flex-1"
                          />
                          <Button type="button" onClick={addAllergen} size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* <div className="flex flex-wrap gap-2">
                          {allergens.map((allergen, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {allergen}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeAllergen(allergen)}
                              />
                            </Badge>
                          ))}
                        </div> */}
                      </div>

                      {/* Dietary Information */}
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">Thông tin dinh dưỡng</Label>
                        <div className="flex gap-4">
                          <Input
                            placeholder="Thêm thông tin dinh dưỡng..."
                            value={newDietaryInfo}
                            onChange={(e) => setNewDietaryInfo(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryInfo())}
                            className="flex-1"
                          />
                          <Button type="button" onClick={addDietaryInfo} size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* <div className="flex flex-wrap gap-2">
                          {dietaryInfo.map((info, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {info}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeDietaryInfo(info)}
                              />
                            </Badge>
                          ))}
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <>
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {title || (mode === "create" ? "Thêm món ăn mới" : "Chỉnh sửa món ăn")}
                </CardTitle>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="media">Hình ảnh</TabsTrigger>
                        <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
                        <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                      </TabsList>

                      {/* Basic Information Tab */}
                      <TabsContent value="basic" className="space-y-6">


                        {/* <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Mô tả chi tiết về món ăn..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="menu_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Menu *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Chọn menu" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="menu-1">Menu Chính</SelectItem>
                                    <SelectItem value="menu-2">Menu Tráng Miệng</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Danh mục</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Chọn danh mục (tùy chọn)" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cat-1">Món chính</SelectItem>
                                    <SelectItem value="cat-2">Khai vị</SelectItem>
                                    <SelectItem value="cat-3">Tráng miệng</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div> */}
                      </TabsContent>

                      {/* Media Tab */}
                      <TabsContent value="media" className="space-y-6">
                        {/* <div className="space-y-4">
                          <Label className="text-sm font-medium">Hình ảnh món ăn</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                              Kéo thả hình ảnh vào đây hoặc click để chọn file
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF tối đa 5MB
                            </p>
                            <FileUploadServer
                              folder="menu-items"
                              accept={{
                                'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                              }}
                              maxFiles={1}
                              onUpload={(response) => {
                                if (response.success && response.data) {
                                  form.setValue("image_url", response.data.publicUrl);
                                }
                              }}
                              className="mt-4"
                            />
                          </div>

                          {form.watch("image_url") && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium">URL hình ảnh</Label>
                              <Input
                                value={form.watch("image_url")}
                                readOnly
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div> */}
                      </TabsContent>

                      {/* Nutrition Tab */}
                      <TabsContent value="nutrition" className="space-y-6">
                        {/* <FormField
                          control={form.control}
                          name="calories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Calories (kcal)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Nhập số calories..."
                                  className="h-11"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Chất gây dị ứng</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Thêm chất gây dị ứng..."
                              value={newAllergen}
                              onChange={(e) => setNewAllergen(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                              className="flex-1"
                            />
                            <Button type="button" onClick={addAllergen} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {allergens.map((allergen, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {allergen}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                                  onClick={() => removeAllergen(allergen)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Thông tin dinh dưỡng</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Thêm thông tin dinh dưỡng..."
                              value={newDietaryInfo}
                              onChange={(e) => setNewDietaryInfo(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryInfo())}
                              className="flex-1"
                            />
                            <Button type="button" onClick={addDietaryInfo} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {dietaryInfo.map((info, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                {info}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                                  onClick={() => removeDietaryInfo(info)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div> */}
                      </TabsContent>

                      {/* Settings Tab */}
                      <TabsContent value="settings" className="space-y-6">
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="preparation_time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Thời gian chuẩn bị (phút)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="15"
                                    className="h-11"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="display_order"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Thứ tự hiển thị</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-11"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="is_available"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Có sẵn</FormLabel>
                                  <FormDescription>
                                    Món ăn có thể được đặt hàng
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Nổi bật</FormLabel>
                                  <FormDescription>
                                    Hiển thị món ăn ở vị trí nổi bật
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div> */}
                      </TabsContent>
                    </Tabs>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-3 border-t pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        submitText || (mode === "create" ? "Thêm món ăn" : "Cập nhật")
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export function MenuForm({
  mode = "create",
  restaurantId,
  initialValues,
  onSuccess,
  onCancel,
  submitText,
  isLoading = false
}: MenuFormProps) {
  const schema = mode === "create" ? CreateMenuSchema : UpdateMenuSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      restaurant_id: restaurantId || initialValues?.restaurant_id || "",
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      is_active: initialValues?.is_active ?? true,
      display_order: initialValues?.display_order || 0,
      image_url: initialValues?.image_url || "",
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log("Submitting menu:", data);

      // Here you would call your API mutation
      // For now, just call onSuccess with the data
      if (onSuccess) {
        onSuccess(data as MenuInterface);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-end gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              submitText || (mode === "create" ? "Thêm menu" : "Cập nhật")
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin menu</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Tên menu *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên menu..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về menu..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh menu</CardTitle>
              </CardHeader>
              <CardContent className="">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">URL hình ảnh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <Card>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hoạt động</FormLabel>
                        <FormDescription>
                          Menu có thể được sử dụng
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hiển thị</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}

export function InventoryItemForm({ }: InventoryItemFormProps) {
  return (
    <>
    </>
  )
}

export function ReservationForm({ }: ReservationFormProps) {
  return (
    <>
    </>
  )
}

export function PromotionForm({ }: PromotionFormProps) {
  return (
    <>
    </>
  )
}

export function TableForm({
  mode = "create",
  restaurantId,
  initialValues,
  onSuccess,
  onCancel,
  submitText,
  isLoading = false
}: TableFormProps) {
  const schema = mode === "create" ? CreateTableSchema : UpdateTableSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      restaurant_id: restaurantId || initialValues?.restaurant_id || "",
      table_number: initialValues?.table_number || "",
      capacity: initialValues?.capacity || 4,
      location: initialValues?.location || "",
      status: initialValues?.status || "available",
      qr_code: initialValues?.qr_code || "",
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log("Submitting table:", data);

      // Here you would call your API mutation
      // For now, just call onSuccess with the data
      if (onSuccess) {
        onSuccess(data as TableInterface);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              submitText || (mode === "create" ? "Tạo bàn" : "Cập nhật bàn")
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bàn</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="table_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Số bàn *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: A01, B05, 001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Sức chứa *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="4"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 4)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Vị trí</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Tầng 1, Góc phải, Bên cửa sổ"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mã QR</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="qr_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mã QR</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mã QR để quét đặt bàn"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Mã QR duy nhất cho bàn này (tùy chọn)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <Card>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Có sẵn</SelectItem>
                          <SelectItem value="occupied">Đang sử dụng</SelectItem>
                          <SelectItem value="reserved">Đã đặt</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                          <SelectItem value="out_of_order">Hỏng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}

export function CategoryForm({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  submitText,
  isLoading = false
}: CategoryFormProps) {
  const schema = mode === "create" ? CreateCategorySchema : UpdateCategorySchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      parent_id: initialValues?.parent_id || undefined,
      name: initialValues?.name || "",
      slug: initialValues?.slug || "",
      description: initialValues?.description || "",
      image_url: initialValues?.image_url || "",
      display_order: initialValues?.display_order || 0,
      is_active: initialValues?.is_active ?? true,
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log("Submitting category:", data);

      // Here you would call your API mutation
      // For now, just call onSuccess with the data
      if (onSuccess) {
        onSuccess(data as CategoryInterface);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-end gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              submitText || (mode === "create" ? "Thêm danh mục" : "Cập nhật")
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin danh mục</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Tên danh mục *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên danh mục..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Slug *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ten-danh-muc"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về danh mục..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh danh mục</CardTitle>
              </CardHeader>
              <CardContent className="">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">URL hình ảnh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <Card>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hoạt động</FormLabel>
                        <FormDescription>
                          Danh mục có thể được sử dụng
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hiển thị</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Danh mục cha</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Không có</SelectItem>
                          {/* TODO: Load parent categories from API */}
                          <SelectItem value="cat-1">Danh mục 1</SelectItem>
                          <SelectItem value="cat-2">Danh mục 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}