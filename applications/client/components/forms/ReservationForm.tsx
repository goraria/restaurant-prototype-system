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

import { CreateReservationSchema, UpdateReservationSchema } from "@/schemas/reservationSchemas";
import { useAppDispatch } from "@/state/redux";
import { createReservation, updateReservation } from "@/services/reservationServices";

type Mode = "create" | "update";

type ReservationFormProps = {
  mode?: Mode;
  initialValues?: Partial<z.infer<typeof UpdateReservationSchema>> & { id?: string };
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  submitText?: string;
};

export default function ReservationForm({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  title,
  submitText,
}: ReservationFormProps) {
  const dispatch = useAppDispatch();
  const schema = mode === "create" ? CreateReservationSchema : UpdateReservationSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      table_id: (initialValues as any)?.table_id ?? "",
      customer_id: (initialValues as any)?.customer_id ?? undefined,
      customer_name: (initialValues as any)?.customer_name ?? "",
      customer_phone: (initialValues as any)?.customer_phone ?? "",
      customer_email: (initialValues as any)?.customer_email ?? "",
      party_size: (initialValues as any)?.party_size ?? 2,
      reservation_date: (initialValues as any)?.reservation_date ?? "",
      duration_hours: (initialValues as any)?.duration_hours ?? 2,
      special_requests: (initialValues as any)?.special_requests ?? "",
      notes: (initialValues as any)?.notes ?? "",
    } as any,
  });

  async function onSubmit(values: any) {
    try {
      if (mode === "create") {
        const res = await createReservation(dispatch as any, values);
        onSuccess?.(res);
      } else {
        const id = (initialValues as any)?.id as string;
        const res = await updateReservation(dispatch as any, id, values);
        onSuccess?.(res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (mode === "create" ? "Tạo đặt bàn" : "Cập nhật đặt bàn")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"table_id" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID bàn</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID bàn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"customer_id" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID khách hàng (tuỳ chọn)</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={"customer_name" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên khách" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"customer_phone" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"customer_email" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={"party_size" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số người</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="numeric" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"reservation_date" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian (ISO)</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-08-25T18:30:00Z" {...field} />
                    </FormControl>
                    <FormDescription>Dạng ISO 8601</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"duration_hours" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời lượng (giờ)</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="decimal" step="0.5" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={"special_requests" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yêu cầu đặc biệt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi rõ yêu cầu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"notes" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi chú (tuỳ chọn)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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


