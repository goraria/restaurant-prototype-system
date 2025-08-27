import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

// Custom Decimal transform
const DecimalSchema = z.union([
  z.number(),
  z.instanceof(Decimal),
  z.string()
]).transform((val) => {
  if (val instanceof Decimal) {
    return val.toNumber();
  }
  return typeof val === 'string' ? parseFloat(val) : val;
});

// Voucher discount type enum schema
export const VoucherDiscountTypeSchema = z.enum(['percentage', 'fixed_amount']);

// Base voucher schema (for Prisma responses)
export const VoucherSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid().nullable(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  discount_type: VoucherDiscountTypeSchema,
  discount_value: DecimalSchema,
  min_order_value: DecimalSchema.nullable(),
  max_discount: DecimalSchema.nullable(),
  usage_limit: z.number().int().positive().nullable(),
  used_count: z.number().int().min(0).default(0),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create voucher schema (without auto-generated fields)
export const CreateVoucherSchema = z.object({
  restaurant_id: z.string().uuid().nullable().optional(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  discount_type: VoucherDiscountTypeSchema,
  discount_value: z.number().positive(),
  min_order_value: z.number().positive().nullable().optional(),
  max_discount: z.number().positive().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true).optional(),
}).refine((data) => {
  // Validate that end_date is after start_date
  return data.end_date > data.start_date;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
}).refine((data) => {
  // If discount_type is percentage, discount_value should be <= 100
  if (data.discount_type === 'percentage') {
    return data.discount_value <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discount_value"],
});

// Update voucher schema (partial update)
export const UpdateVoucherSchema = z.object({
  restaurant_id: z.string().uuid().nullable().optional(),
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  discount_type: VoucherDiscountTypeSchema.optional(),
  discount_value: z.number().positive().optional(),
  min_order_value: z.number().positive().nullable().optional(),
  max_discount: z.number().positive().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  is_active: z.boolean().optional(),
}).refine((data) => {
  // Validate that end_date is after start_date if both are provided
  if (data.start_date && data.end_date) {
    return data.end_date > data.start_date;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
}).refine((data) => {
  // If discount_type is percentage, discount_value should be <= 100
  if (data.discount_type === 'percentage' && data.discount_value) {
    return data.discount_value <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discount_value"],
});

// Query params for filtering vouchers
export const VoucherQuerySchema = z.object({
  restaurant_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  discount_type: VoucherDiscountTypeSchema.optional(),
  code: z.string().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(10).optional(),
  sort_by: z.enum(['created_at', 'name', 'start_date', 'end_date', 'discount_value']).default('created_at').optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc').optional(),
});

// Voucher usage schema
export const VoucherUsageSchema = z.object({
  id: z.string().uuid(),
  voucher_id: z.string().uuid(),
  user_id: z.string().uuid(),
  order_id: z.string().uuid().nullable(),
  used_at: z.date(),
});

// Apply voucher schema (for checking if voucher can be applied)
export const ApplyVoucherSchema = z.object({
  code: z.string().min(1).max(50),
  user_id: z.string().uuid(),
  order_value: z.number().positive(),
  restaurant_id: z.string().uuid().optional(),
});

// Voucher validation result schema
export const VoucherValidationResultSchema = z.object({
  is_valid: z.boolean(),
  voucher: VoucherSchema.nullable(),
  discount_amount: z.number().min(0),
  final_amount: z.number().min(0),
  error_message: z.string().nullable(),
});

// Export type definitions
export type Voucher = z.infer<typeof VoucherSchema>;
export type CreateVoucher = z.infer<typeof CreateVoucherSchema>;
export type UpdateVoucher = z.infer<typeof UpdateVoucherSchema>;
export type VoucherQuery = z.infer<typeof VoucherQuerySchema>;
export type VoucherUsage = z.infer<typeof VoucherUsageSchema>;
export type ApplyVoucher = z.infer<typeof ApplyVoucherSchema>;
export type VoucherValidationResult = z.infer<typeof VoucherValidationResultSchema>;
export type VoucherDiscountType = z.infer<typeof VoucherDiscountTypeSchema>;
