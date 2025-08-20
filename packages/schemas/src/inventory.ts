import { z } from 'zod';
import { 
  UuidSchema, 
  EmailSchema, 
  PhoneSchema, 
  DecimalSchema 
} from './core';

// ================================
// 📦 INVENTORY ITEM SCHEMAS
// ================================

export const InventoryItemBaseSchema = z.object({
  restaurant_id: UuidSchema,
  name: z.string().min(1).max(100),
  category: z.string().max(50).optional(),
  unit: z.string().min(1).max(20),
  current_stock: DecimalSchema.default(0),
  minimum_stock: DecimalSchema.default(0),
  maximum_stock: DecimalSchema.optional(),
  unit_cost: DecimalSchema.default(0),
  supplier: z.string().max(100).optional(),
  description: z.string().optional(),
  location: z.string().max(100).optional(),
  expiry_date: z.string().date().optional(),
  last_restocked: z.string().datetime().optional(),
});

export const InventoryItemCreateSchema = InventoryItemBaseSchema;
export const InventoryItemUpdateSchema = InventoryItemBaseSchema.partial().omit({ restaurant_id: true });

export const InventoryItemSchema = InventoryItemBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📦 INVENTORY TRANSACTION SCHEMAS
// ================================

export const InventoryTransactionBaseSchema = z.object({
  inventory_item_id: UuidSchema,
  transaction_type: z.enum(['in', 'out', 'adjustment']),
  quantity: DecimalSchema,
  unit_cost: DecimalSchema.optional(),
  reference_type: z.enum(['purchase', 'sale', 'waste', 'adjustment', 'recipe']).optional(),
  reference_id: UuidSchema.optional(),
  notes: z.string().optional(),
  performed_by: UuidSchema.optional(),
});

export const InventoryTransactionCreateSchema = InventoryTransactionBaseSchema;
export const InventoryTransactionUpdateSchema = InventoryTransactionBaseSchema.partial().omit({ 
  inventory_item_id: true,
  transaction_type: true 
});

export const InventoryTransactionSchema = InventoryTransactionBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 🧾 RECIPE SCHEMAS
// ================================

export const RecipeBaseSchema = z.object({
  restaurant_id: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  serving_size: z.number().int().min(1).default(1),
  prep_time: z.number().int().min(0).optional(),
  cook_time: z.number().int().min(0).optional(),
  instructions: z.string().optional(),
  cost_per_serving: DecimalSchema.default(0),
  category: z.string().max(50).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  is_active: z.boolean().default(true),
});

export const RecipeCreateSchema = RecipeBaseSchema;
export const RecipeUpdateSchema = RecipeBaseSchema.partial().omit({ restaurant_id: true });

export const RecipeSchema = RecipeBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🧾 RECIPE INGREDIENT SCHEMAS
// ================================

export const RecipeIngredientBaseSchema = z.object({
  recipe_id: UuidSchema,
  inventory_item_id: UuidSchema,
  quantity: DecimalSchema,
  unit: z.string().min(1).max(20),
  preparation_notes: z.string().optional(),
  is_optional: z.boolean().default(false),
});

export const RecipeIngredientCreateSchema = RecipeIngredientBaseSchema;
export const RecipeIngredientUpdateSchema = RecipeIngredientBaseSchema.partial().omit({ 
  recipe_id: true,
  inventory_item_id: true 
});

export const RecipeIngredientSchema = RecipeIngredientBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 🧾 MENU ITEM RECIPE SCHEMAS
// ================================

export const MenuItemRecipeBaseSchema = z.object({
  menu_item_id: UuidSchema,
  recipe_id: UuidSchema,
  portion_multiplier: DecimalSchema.default(1),
});

export const MenuItemRecipeCreateSchema = MenuItemRecipeBaseSchema;
export const MenuItemRecipeUpdateSchema = MenuItemRecipeBaseSchema.partial().omit({ 
  menu_item_id: true,
  recipe_id: true 
});

export const MenuItemRecipeSchema = MenuItemRecipeBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// ================================
// 📋 SUPPLIER SCHEMAS
// ================================

export const SupplierBaseSchema = z.object({
  restaurant_id: UuidSchema,
  name: z.string().min(1).max(100),
  contact_person: z.string().max(100).optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const SupplierCreateSchema = SupplierBaseSchema;
export const SupplierUpdateSchema = SupplierBaseSchema.partial().omit({ restaurant_id: true });

export const SupplierSchema = SupplierBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📋 PURCHASE ORDER SCHEMAS
// ================================

export const PurchaseOrderBaseSchema = z.object({
  restaurant_id: UuidSchema,
  supplier_id: UuidSchema,
  order_number: z.string().min(1).max(50),
  status: z.enum(['draft', 'sent', 'confirmed', 'received', 'cancelled']).default('draft'),
  order_date: z.string().date(),
  expected_delivery: z.string().date().optional(),
  actual_delivery: z.string().date().optional(),
  total_amount: DecimalSchema.default(0),
  notes: z.string().optional(),
  created_by: UuidSchema,
  received_by: UuidSchema.optional(),
});

export const PurchaseOrderCreateSchema = PurchaseOrderBaseSchema;
export const PurchaseOrderUpdateSchema = PurchaseOrderBaseSchema.partial().omit({ 
  restaurant_id: true,
  supplier_id: true,
  order_number: true 
});

export const PurchaseOrderSchema = PurchaseOrderBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📋 PURCHASE ORDER ITEM SCHEMAS
// ================================

export const PurchaseOrderItemBaseSchema = z.object({
  purchase_order_id: UuidSchema,
  inventory_item_id: UuidSchema,
  quantity_ordered: DecimalSchema,
  quantity_received: DecimalSchema.default(0),
  unit_price: DecimalSchema,
  total_price: DecimalSchema,
  notes: z.string().optional(),
});

export const PurchaseOrderItemCreateSchema = PurchaseOrderItemBaseSchema;
export const PurchaseOrderItemUpdateSchema = PurchaseOrderItemBaseSchema.partial().omit({ 
  purchase_order_id: true,
  inventory_item_id: true 
});

export const PurchaseOrderItemSchema = PurchaseOrderItemBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
});

// Type exports
export type InventoryItemType = z.infer<typeof InventoryItemSchema>;
export type InventoryItemCreateType = z.infer<typeof InventoryItemCreateSchema>;
export type InventoryItemUpdateType = z.infer<typeof InventoryItemUpdateSchema>;

export type InventoryTransactionType = z.infer<typeof InventoryTransactionSchema>;
export type InventoryTransactionCreateType = z.infer<typeof InventoryTransactionCreateSchema>;
export type InventoryTransactionUpdateType = z.infer<typeof InventoryTransactionUpdateSchema>;

export type RecipeType = z.infer<typeof RecipeSchema>;
export type RecipeCreateType = z.infer<typeof RecipeCreateSchema>;
export type RecipeUpdateType = z.infer<typeof RecipeUpdateSchema>;

export type RecipeIngredientType = z.infer<typeof RecipeIngredientSchema>;
export type RecipeIngredientCreateType = z.infer<typeof RecipeIngredientCreateSchema>;
export type RecipeIngredientUpdateType = z.infer<typeof RecipeIngredientUpdateSchema>;

export type MenuItemRecipeType = z.infer<typeof MenuItemRecipeSchema>;
export type MenuItemRecipeCreateType = z.infer<typeof MenuItemRecipeCreateSchema>;
export type MenuItemRecipeUpdateType = z.infer<typeof MenuItemRecipeUpdateSchema>;

export type SupplierType = z.infer<typeof SupplierSchema>;
export type SupplierCreateType = z.infer<typeof SupplierCreateSchema>;
export type SupplierUpdateType = z.infer<typeof SupplierUpdateSchema>;

export type PurchaseOrderType = z.infer<typeof PurchaseOrderSchema>;
export type PurchaseOrderCreateType = z.infer<typeof PurchaseOrderCreateSchema>;
export type PurchaseOrderUpdateType = z.infer<typeof PurchaseOrderUpdateSchema>;

export type PurchaseOrderItemType = z.infer<typeof PurchaseOrderItemSchema>;
export type PurchaseOrderItemCreateType = z.infer<typeof PurchaseOrderItemCreateSchema>;
export type PurchaseOrderItemUpdateType = z.infer<typeof PurchaseOrderItemUpdateSchema>;
