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

import { CreateMenuSchema, UpdateMenuSchema } from "@/schemas/menuSchemas";
import type { CreateMenu, UpdateMenu } from "@/schemas/menuSchemas";
import { useAppDispatch } from "@/state/redux";
import { createMenu, updateMenu } from "@/services/menuServices";

type Mode = "create" | "update";

type MenuFormProps = {
  mode?: Mode;
  restaurantId?: string;
  initialValues?: Partial<z.infer<typeof UpdateMenuSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function MenuForm({
  mode = "create",
  restaurantId,
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: MenuFormProps) {
  const dispatch = useAppDispatch();

  const schema = mode === "create" ? CreateMenuSchema : UpdateMenuSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: (initialValues as any)?.description ?? "",
      is_active: (initialValues as any)?.is_active ?? true,
      display_order: (initialValues as any)?.display_order ?? 0,
      ...(mode === "create" ? {} : {}),
    } as any,
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const payload: CreateMenu = {
          restaurant_id: restaurantId || '5dc89877-8c0b-482d-a71d-609d6e14cb9e', // Default restaurant ID
          name: values.name,
          description: values.description || undefined,
          is_active: values.is_active,
          display_order: values.display_order ?? 0,
        };
        const res = await createMenu(dispatch, payload);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const payload: UpdateMenu = {
          name: values.name ?? undefined,
          description: values.description || undefined,
          is_active: values.is_active,
          display_order: values.display_order ?? 0,
        };
        const res = await updateMenu(dispatch, id, payload);
        onSuccess?.(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Tạo menu mới" : "Cập nhật menu")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name={"name" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên menu *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Menu chính, Menu tráng miệng, Menu đồ uống" {...field} />
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
                      placeholder="Mô tả về menu (tùy chọn)"
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
                    <FormDescription>
                      Số càng nhỏ hiển thị càng trước
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={"is_active" as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Kích hoạt</FormLabel>
                    <FormDescription>
                      Menu này có hiển thị cho khách hàng không
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
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit">
              {submitText ?? (mode === "create" ? "Tạo menu" : "Cập nhật")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


