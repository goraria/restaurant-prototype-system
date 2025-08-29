"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CreatePromotionSchema, UpdatePromotionSchema } from "@/schemas/promotionSchemas";
import { useAppDispatch } from "@/state/redux";
import { promotionCreatePromotion, promotionUpdatePromotion } from "@/services/promotionServices";

type Mode = "create" | "update";

type PromotionFormProps = {
  mode?: Mode;
  initialValues?: Partial<z.infer<typeof UpdatePromotionSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function PromotionForm({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: PromotionFormProps) {
  const dispatch = useAppDispatch();
  const schema = mode === "create" ? CreatePromotionSchema : UpdatePromotionSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: (initialValues as any) ?? {},
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const res = await promotionCreatePromotion(dispatch as any, values);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const res = await promotionUpdatePromotion(dispatch as any, id, values);
        onSuccess?.(res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Tạo khuyến mãi" : "Cập nhật khuyến mãi")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name={"name" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Giảm giá combo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"type" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Phần trăm</SelectItem>
                        <SelectItem value="fixed_amount">Số tiền</SelectItem>
                        <SelectItem value="buy_one_get_one">Mua 1 tặng 1</SelectItem>
                        <SelectItem value="combo_deal">Combo</SelectItem>
                        <SelectItem value="happy_hour">Giờ vàng</SelectItem>
                        <SelectItem value="seasonal">Theo mùa</SelectItem>
                      </SelectContent>
                    </Select>
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
              <FormField name={"discount_value" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"start_date" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"end_date" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name={"applicable_items" as any} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Áp dụng cho món (IDs, cách nhau bởi dấu phẩy)</FormLabel>
                <FormControl>
                  <Input placeholder="uuid1,uuid2" value={Array.isArray(field.value) ? field.value.join(",") : field.value || ""} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormDescription>Để trống để áp dụng rộng</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter className="flex items-center gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Huỷ
              </Button>
            )}
            <Button type="submit">{submitText ?? (mode === "create" ? "Tạo" : "Lưu thay đổi")}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


