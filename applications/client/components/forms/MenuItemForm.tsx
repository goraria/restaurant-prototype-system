"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CreateMenuItemSchema, UpdateMenuItemSchema } from "@/schemas/menuSchemas";
import type { CreateMenuItem, UpdateMenuItem } from "@/schemas/menuSchemas";
import { useAppDispatch } from "@/state/redux";
import { createMenuItem, updateMenuItem } from "@/services/menuServices";

type Mode = "create" | "update";

type MenuItemFormProps = {
  mode?: Mode;
  restaurantId?: string;
  menuId?: string;
  initialValues?: Partial<z.infer<typeof UpdateMenuItemSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

// Helper function to parse CSV string to array
const parseCsv = (csv: string): string[] => {
  if (!csv) return [];
  return csv.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

export default function MenuItemForm({
  mode = "create",
  restaurantId,
  menuId,
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: MenuItemFormProps) {
  const dispatch = useAppDispatch();

  const schema = mode === "create" ? CreateMenuItemSchema : UpdateMenuItemSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: (initialValues as any)?.description ?? "",
      price: (initialValues as any)?.price ?? "",
      image_url: (initialValues as any)?.image_url ?? "",
      preparation_time: (initialValues as any)?.preparation_time ?? "",
      calories: (initialValues as any)?.calories ?? "",
      allergens: (initialValues as any)?.allergens ?? "",
      dietary_info: (initialValues as any)?.dietary_info ?? "",
      is_vegetarian: (initialValues as any)?.is_vegetarian ?? false,
      is_vegan: (initialValues as any)?.is_vegan ?? false,
      is_available: (initialValues as any)?.is_available ?? true,
      display_order: (initialValues as any)?.display_order ?? 0,
      ...(mode === "create" ? {} : {}),
    } as any,
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const payload: CreateMenuItem = {
          restaurant_id: restaurantId || '5dc89877-8c0b-482d-a71d-609d6e14cb9e', // Default restaurant ID
          menu_id: menuId || 'e904d033-3a03-4905-bc39-4cb0c7f29196', // Default menu ID
          category_id: values.category_id || undefined,
          name: values.name,
          description: values.description || undefined,
          price: Number(values.price),
          image_url: values.image_url || undefined,
          preparation_time: values.preparation_time ? Number(values.preparation_time) : undefined,
          calories: values.calories ? Number(values.calories) : undefined,
          allergens: Array.isArray(values.allergens) ? values.allergens : parseCsv(values.allergens || ""),
          dietary_info: Array.isArray(values.dietary_info) ? values.dietary_info : parseCsv(values.dietary_info || ""),
          is_vegetarian: !!values.is_vegetarian,
          is_vegan: !!values.is_vegan,
          is_available: !!values.is_available,
          display_order: Number(values.display_order ?? 0),
        } as any;
        const res = await createMenuItem(dispatch, payload);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const payload: UpdateMenuItem = {
          name: values.name ?? undefined,
          description: values.description || undefined,
          price: values.price ? Number(values.price) : undefined,
          image_url: values.image_url || undefined,
          preparation_time: values.preparation_time ? Number(values.preparation_time) : undefined,
          calories: values.calories ? Number(values.calories) : undefined,
          allergens: Array.isArray(values.allergens) ? values.allergens : parseCsv(values.allergens || ""),
          dietary_info: Array.isArray(values.dietary_info) ? values.dietary_info : parseCsv(values.dietary_info || ""),
          is_vegetarian: values.is_vegetarian !== undefined ? !!values.is_vegetarian : undefined,
          is_vegan: values.is_vegan !== undefined ? !!values.is_vegan : undefined,
          is_available: values.is_available !== undefined ? !!values.is_available : undefined,
          display_order: values.display_order ? Number(values.display_order) : undefined,
        } as any;
        const res = await updateMenuItem(dispatch, id, payload);
        onSuccess?.(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Thêm món mới" : "Cập nhật món")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name={"name" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên món *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Phở bò, Cà phê sữa đá, Bánh mì thịt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"description" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả chi tiết về món ăn (tùy chọn)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"price" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1000"
                        placeholder="VD: 45000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Giá tính bằng VND
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"preparation_time" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian chế biến (phút)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="VD: 15"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"calories" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="VD: 250"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"display_order" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
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

            <FormField
              control={form.control}
              name={"image_url" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL hình ảnh</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"allergens" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dị ứng</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Đậu phộng, Hải sản, Sữa (phân cách bằng dấu phẩy)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Các thành phần có thể gây dị ứng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"dietary_info" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thông tin dinh dưỡng</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Nhiều protein, Ít carb, Không gluten (phân cách bằng dấu phẩy)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={"is_vegetarian" as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Chay</FormLabel>
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
                name={"is_vegan" as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Thuần chay</FormLabel>
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
                name={"is_available" as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Có sẵn</FormLabel>
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit">
              {submitText ?? (mode === "create" ? "Thêm món" : "Cập nhật")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


