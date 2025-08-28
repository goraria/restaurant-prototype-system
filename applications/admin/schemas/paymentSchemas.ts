import { z } from 'zod';

// ================================
// 💳 PAYMENT SCHEMAS
// ================================

// Create Payment Schema
export const CreatePaymentSchema = z.object({
  order_id: z.string().uuid("ID đơn hàng không hợp lệ"),
  amount: z.number()
    .positive("Số tiền phải lớn hơn 0")
    .max(100000000, "Số tiền quá lớn"),
  payment_method: z.enum(['cash', 'card', 'momo', 'zalopay', 'vnpay', 'bank_transfer']),
  gateway: z.enum(['momo', 'zalopay', 'vnpay', 'stripe', 'manual']).optional(),
  transaction_id: z.string()
    .max(200, "ID giao dịch không được quá 200 ký tự")
    .optional(),
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Update Payment Schema
export const UpdatePaymentSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).optional(),
  transaction_id: z.string()
    .max(200, "ID giao dịch không được quá 200 ký tự")
    .optional(),
  gateway_response: z.any().optional(),
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
});

// Payment Query Schema
export const PaymentQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  order_id: z.string().uuid().optional(),
  payment_method: z.enum(['cash', 'card', 'momo', 'zalopay', 'vnpay', 'bank_transfer']).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).optional(),
  provider: z.string().max(50).optional(),
  transaction_id: z.string().max(255).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort_by: z.enum(['created_at', 'amount', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// ================================
// 🔧 TYPE EXPORTS
// ================================

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
export type PaymentQueryInput = z.infer<typeof PaymentQuerySchema>;
