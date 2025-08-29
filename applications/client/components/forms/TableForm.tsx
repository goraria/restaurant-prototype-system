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

import { CreateTableSchema, UpdateTableSchema } from "@/schemas/tableSchemas";
import type { CreateTable, UpdateTable } from "@/schemas/tableSchemas";
import { useAppDispatch } from "@/state/redux";
import { createTable, updateTable } from "@/services/tableServices";

type Mode = "create" | "update";

type TableFormProps = {
  mode?: Mode;
  restaurantId?: string;
  initialValues?: Partial<z.infer<typeof UpdateTableSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function TableForm({
  mode = "create",
  restaurantId,
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: TableFormProps) {
  const dispatch = useAppDispatch();

  const schema = mode === "create" ? CreateTableSchema : UpdateTableSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      table_number: initialValues?.table_number ?? "",
      capacity: (initialValues as any)?.capacity ?? 2,
      location: (initialValues as any)?.location ?? "",
      status: (initialValues as any)?.status ?? "available",
      qr_code: (initialValues as any)?.qr_code ?? "",
      ...(mode === "create" ? {} : {}),
    } as any,
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const payload: CreateTable = {
          restaurant_id: restaurantId as string,
          table_number: values.table_number,
          capacity: values.capacity,
          location: values.location || undefined,
          status: values.status,
          qr_code: values.qr_code || undefined,
        };
        const res = await createTable(dispatch, payload);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const payload: UpdateTable = {
          table_number: values.table_number ?? undefined,
          capacity: values.capacity,
          location: values.location || undefined,
          status: values.status,
          qr_code: values.qr_code || undefined,
        };
        const res = await updateTable(dispatch, id, payload);
        onSuccess?.(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Tạo bàn mới" : "Cập nhật bàn")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"table_number" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số bàn *</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: A01, B02, VIP01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"capacity" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sức chứa *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20" 
                        placeholder="Số người tối đa"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                name={"location" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vị trí</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Tầng 1 - Khu A, VIP" {...field} />
                    </FormControl>
                    <FormDescription>
                      Vị trí của bàn trong nhà hàng
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"status" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Trống</SelectItem>
                        <SelectItem value="occupied">Có khách</SelectItem>
                        <SelectItem value="reserved">Đã đặt</SelectItem>
                        <SelectItem value="cleaning">Đang dọn</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={"qr_code" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Mã QR code cho bàn (tùy chọn)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Mã QR code để khách hàng quét đặt món
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit">
              {submitText ?? (mode === "create" ? "Tạo bàn" : "Cập nhật")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
