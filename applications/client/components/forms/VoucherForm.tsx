"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateVoucherSchema, UpdateVoucherSchema, VoucherDiscountTypeSchema } from "@/schemas/voucherSchemas";
import { useAppDispatch } from "@/state/redux";
import { createVoucher, updateVoucher } from "@/services/voucherServices";

type Mode = "create" | "update";

type VoucherFormProps = {
  mode?: Mode;
  initialValues?: Partial<z.infer<typeof UpdateVoucherSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function VoucherForm({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: VoucherFormProps) {
  const dispatch = useAppDispatch();
  const schema = mode === "create" ? CreateVoucherSchema : UpdateVoucherSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: (initialValues as any) ?? {
      is_active: true,
    },
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const res = await createVoucher(dispatch as any, values);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const res = await updateVoucher(dispatch as any, id, values);
        onSuccess?.(res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Tạo voucher" : "Cập nhật voucher")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name={"code" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"name" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Khuyến mãi mùa hè" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name={"discount_type" as any} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giảm</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm</SelectItem>
                      <SelectItem value="fixed_amount">Số tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField name={"discount_value" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị giảm</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"min_order_value" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị tối thiểu</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name={"max_discount" as any} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảm tối đa</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="decimal" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <FormField name={"is_active" as any} control={form.control} render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Kích hoạt</FormLabel>
                  <FormDescription>Cho phép áp dụng voucher</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
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


