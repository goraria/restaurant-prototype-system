import { z } from 'zod';
import { 
  UuidSchema, 
  EmailSchema, 
  PhoneSchema, 
  DecimalSchema,
  OrderTypeEnum,
  OrderStatusEnum,
  CookingStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum
} from './core';

// ================================
// 📍 ADDRESS SCHEMAS
// ================================

export const AddressBaseSchema = z.object({
  user_id: UuidSchema,
  recipient_name: z.string().min(1).max(100),
  recipient_phone: PhoneSchema,
  street_address: z.string().min(1).max(255),
  ward: z.string().max(100).optional(),
  district: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  country: z.string().max(100).default('Vietnam'),
  is_default: z.boolean().default(false),
});

export const AddressCreateSchema = AddressBaseSchema;
export const AddressUpdateSchema = AddressBaseSchema.partial().omit({ user_id: true });

export const AddressSchema = AddressBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🛒 ORDER SCHEMAS
// ================================

export const OrderBaseSchema = z.object({
  restaurant_id: UuidSchema,
  customer_id: UuidSchema,
  address_id: UuidSchema.optional(),
  order_code: z.string().min(1).max(20),
  order_type: OrderTypeEnum.default('dine_in'),
  total_amount: DecimalSchema,
  delivery_fee: DecimalSchema.default(0),
  discount_amount: DecimalSchema.default(0),
  tax_amount: DecimalSchema.default(0),
  final_amount: DecimalSchema,
  status: OrderStatusEnum.default('pending'),
  payment_status: PaymentStatusEnum.default('pending'),
  notes: z.string().optional(),
  estimated_time: z.number().int().min(0).optional(),
});

export const OrderCreateSchema = OrderBaseSchema;
export const OrderUpdateSchema = OrderBaseSchema.partial().omit({ 
  restaurant_id: true,
  customer_id: true,
  order_code: true 
});

export const OrderSchema = OrderBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🛒 ORDER ITEM SCHEMAS
// ================================

export const OrderItemBaseSchema = z.object({
  order_id: UuidSchema,
  menu_item_id: UuidSchema,
  quantity: z.number().int().min(1),
  unit_price: DecimalSchema,
  total_price: DecimalSchema,
  special_instructions: z.string().optional(),
  cooking_status: CookingStatusEnum.default('pending'),
  prepared_at: z.string().datetime().optional(),
  served_at: z.string().datetime().optional(),
});

export const OrderItemCreateSchema = OrderItemBaseSchema;
export const OrderItemUpdateSchema = OrderItemBaseSchema.partial().omit({ 
  order_id: true,
  menu_item_id: true 
});

export const OrderItemSchema = OrderItemBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 📋 ORDER STATUS HISTORY SCHEMAS
// ================================

export const OrderStatusHistoryBaseSchema = z.object({
  order_id: UuidSchema,
  status: OrderStatusEnum,
  changed_by_user_id: UuidSchema.optional(),
  notes: z.string().optional(),
});

export const OrderStatusHistoryCreateSchema = OrderStatusHistoryBaseSchema;

export const OrderStatusHistorySchema = OrderStatusHistoryBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 💳 PAYMENT SCHEMAS
// ================================

export const PaymentBaseSchema = z.object({
  order_id: UuidSchema,
  amount: DecimalSchema,
  method: PaymentMethodEnum,
  status: PaymentStatusEnum.default('pending'),
  provider: z.string().max(50).optional(),
  transaction_id: z.string().max(255).optional(),
  gateway_response: z.record(z.any()).optional(),
  processed_at: z.string().datetime().optional(),
});

export const PaymentCreateSchema = PaymentBaseSchema;
export const PaymentUpdateSchema = PaymentBaseSchema.partial().omit({ 
  order_id: true,
  amount: true 
});

export const PaymentSchema = PaymentBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🪑 TABLE ORDER SCHEMAS
// ================================

export const TableOrderBaseSchema = z.object({
  table_id: UuidSchema,
  order_id: UuidSchema.optional(),
  session_code: z.string().min(1).max(20),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  opened_at: z.string().datetime(),
  closed_at: z.string().datetime().optional(),
  total_amount: DecimalSchema.optional(),
  staff_id: UuidSchema.optional(),
});

export const TableOrderCreateSchema = TableOrderBaseSchema;
export const TableOrderUpdateSchema = TableOrderBaseSchema.partial().omit({ 
  table_id: true,
  session_code: true 
});

export const TableOrderSchema = TableOrderBaseSchema.extend({
  id: UuidSchema,
});

// Type exports
export type AddressType = z.infer<typeof AddressSchema>;
export type AddressCreateType = z.infer<typeof AddressCreateSchema>;
export type AddressUpdateType = z.infer<typeof AddressUpdateSchema>;

export type OrderType = z.infer<typeof OrderSchema>;
export type OrderCreateType = z.infer<typeof OrderCreateSchema>;
export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type OrderItemCreateType = z.infer<typeof OrderItemCreateSchema>;
export type OrderItemUpdateType = z.infer<typeof OrderItemUpdateSchema>;

export type OrderStatusHistoryType = z.infer<typeof OrderStatusHistorySchema>;
export type OrderStatusHistoryCreateType = z.infer<typeof OrderStatusHistoryCreateSchema>;

export type PaymentType = z.infer<typeof PaymentSchema>;
export type PaymentCreateType = z.infer<typeof PaymentCreateSchema>;
export type PaymentUpdateType = z.infer<typeof PaymentUpdateSchema>;

export type TableOrderType = z.infer<typeof TableOrderSchema>;
export type TableOrderCreateType = z.infer<typeof TableOrderCreateSchema>;
export type TableOrderUpdateType = z.infer<typeof TableOrderUpdateSchema>;
