"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateInventoryItemSchema, UpdateInventoryItemSchema } from "@/schemas/inventorySchemas";
import { useAppDispatch } from "@/state/redux";
import { createInventoryItem, updateInventoryItem } from "@/services/inventoryServices";

type Mode = "create" | "update";

type InventoryItemFormProps = {
  mode?: Mode;
  initialValues?: Partial<z.infer<typeof UpdateInventoryItemSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function InventoryItemForm({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: InventoryItemFormProps) {
  const dispatch = useAppDispatch();
  const schema = mode === "create" ? CreateInventoryItemSchema : UpdateInventoryItemSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: (initialValues as any) ?? {},
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const res = await createInventoryItem(dispatch as any, values);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const res = await updateInventoryItem(dispatch as any, id, values);
        onSuccess?.(res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Thêm nguyên liệu" : "Cập nhật nguyên liệu")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name={"name" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên nguyên liệu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"unit" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị</FormLabel>
                  <FormControl>
                    <Input placeholder="kg, cái, lít..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name={"description" as any} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả (tuỳ chọn)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField name={"quantity" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"min_quantity" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tối thiểu</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"max_quantity" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tối đa</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField name={"unit_cost" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá đơn vị</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"supplier" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên nhà cung cấp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"expiry_date" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>HSD</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Huỷ
              </Button>
            )}
            <Button type="submit">{submitText ?? (mode === "create" ? "Thêm" : "Lưu thay đổi")}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


