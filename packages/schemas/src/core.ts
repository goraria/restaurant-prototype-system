import { z } from 'zod';

// ================================
// 📋 SHARED ENUMS
// ================================

export const UserStatusEnum = z.enum([
  'active',
  'inactive', 
  'suspended',
  'banned'
]);

export const UserRoleEnum = z.enum([
  'customer',
  'staff',
  'manager', 
  'admin',
  'super_admin'
]);

export const RestaurantStatusEnum = z.enum([
  'active',
  'inactive',
  'maintenance',
  'closed'
]);

export const TableStatusEnum = z.enum([
  'available',
  'occupied',
  'reserved',
  'maintenance',
  'out_of_order'
]);

export const ReservationStatusEnum = z.enum([
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show'
]);

export const TableOrderStatusEnum = z.enum([
  'active',
  'completed',
  'cancelled'
]);

export const OrderTypeEnum = z.enum([
  'dine_in',
  'takeaway',
  'delivery'
]);

export const OrderStatusEnum = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'served',
  'completed',
  'cancelled'
]);

export const CookingStatusEnum = z.enum([
  'pending',
  'preparing',
  'cooking',
  'ready',
  'served',
  'cancelled'
]);

export const PaymentMethodEnum = z.enum([
  'cash',
  'card',
  'bank_transfer',
  'momo',
  'zalopay',
  'viettelpay',
  'vnpay',
  'shopeepay'
]);

export const PaymentStatusEnum = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'refunded'
]);

export const RestaurantStaffRoleEnum = z.enum([
  'staff',
  'supervisor',
  'manager',
  'chef',
  'sous_chef',
  'cashier',
  'waiter',
  'host',
  'cleaner',
  'security'
]);

export const StaffStatusEnum = z.enum([
  'active',
  'inactive',
  'on_leave',
  'suspended',
  'terminated'
]);

export const StaffShiftTypeEnum = z.enum([
  'morning',
  'afternoon',
  'evening',
  'night',
  'full_day',
  'split_shift'
]);

export const StaffScheduleStatusEnum = z.enum([
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'absent',
  'late',
  'cancelled'
]);

export const InventoryTransactionTypeEnum = z.enum([
  'purchase',
  'usage',
  'adjustment',
  'waste',
  'return',
  'transfer'
]);

export const VoucherDiscountTypeEnum = z.enum([
  'percentage',
  'fixed_amount'
]);

export const PromotionTypeEnum = z.enum([
  'percentage',
  'fixed_amount',
  'buy_one_get_one',
  'combo_deal',
  'happy_hour',
  'seasonal'
]);

export const ReviewStatusEnum = z.enum([
  'active',
  'hidden',
  'flagged',
  'deleted'
]);

export const RevenueReportTypeEnum = z.enum([
  'daily',
  'weekly',
  'monthly',
  'yearly'
]);

export const ConversationTypeEnum = z.enum([
  'support',
  'feedback',
  'complaint',
  'inquiry'
]);

export const ConversationStatusEnum = z.enum([
  'active',
  'resolved',
  'closed'
]);

export const MessageTypeEnum = z.enum([
  'text',
  'image',
  'file',
  'system'
]);

// ================================
// 🎯 SHARED VALIDATION HELPERS
// ================================

export const UuidSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const PhoneSchema = z.string().regex(/^[0-9+\-\s()]+$/);
export const DecimalSchema = z.number().or(z.string().regex(/^\d+(\.\d{1,2})?$/));
export const DateStringSchema = z.string().datetime();
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// ================================
// 👤 USER SCHEMAS
// ================================

export const UserBaseSchema = z.object({
  clerk_id: z.string().optional(),
  username: z.string().min(3).max(50),
  email: EmailSchema,
  phone_code: z.string().max(8).optional(),
  phone_number: PhoneSchema.optional(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  full_name: z.string().min(1).max(200),
  avatar_url: z.string().url().optional(),
  date_of_birth: z.string().date().optional(),
  gender: z.string().max(10).optional(),
  status: UserStatusEnum.default('active'),
  role: UserRoleEnum.default('customer'),
  total_orders: z.number().int().min(0).default(0),
  total_spent: DecimalSchema.default(0),
  loyalty_points: z.number().int().min(0).default(0),
});

export const UserCreateSchema = UserBaseSchema.omit({
  total_orders: true,
  total_spent: true,
  loyalty_points: true,
});

export const UserUpdateSchema = UserBaseSchema.partial();

export const UserSchema = UserBaseSchema.extend({
  id: UuidSchema,
  email_verified_at: z.string().datetime().optional(),
  phone_verified_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🏢 ORGANIZATION SCHEMAS
// ================================

export const OrganizationBaseSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(30),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  owner_id: UuidSchema,
});

export const OrganizationCreateSchema = OrganizationBaseSchema;
export const OrganizationUpdateSchema = OrganizationBaseSchema.partial().omit({ owner_id: true });

export const OrganizationSchema = OrganizationBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🏪 RESTAURANT CHAIN SCHEMAS
// ================================

export const RestaurantChainBaseSchema = z.object({
  organization_id: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
});

export const RestaurantChainCreateSchema = RestaurantChainBaseSchema;
export const RestaurantChainUpdateSchema = RestaurantChainBaseSchema.partial().omit({ organization_id: true });

export const RestaurantChainSchema = RestaurantChainBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🍽️ RESTAURANT SCHEMAS
// ================================

export const RestaurantBaseSchema = z.object({
  organization_id: UuidSchema,
  chain_id: UuidSchema.optional(),
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(255),
  phone_number: PhoneSchema.optional(),
  email: EmailSchema.optional(),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  cover_url: z.string().url().optional(),
  opening_hours: z.record(z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).optional(),
  status: RestaurantStatusEnum.default('active'),
  manager_id: UuidSchema.optional(),
});

export const RestaurantCreateSchema = RestaurantBaseSchema;
export const RestaurantUpdateSchema = RestaurantBaseSchema.partial().omit({ 
  organization_id: true,
  code: true 
});

export const RestaurantSchema = RestaurantBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📂 CATEGORY SCHEMAS
// ================================

export const CategoryBaseSchema = z.object({
  parent_id: UuidSchema.optional(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const CategoryCreateSchema = CategoryBaseSchema;
export const CategoryUpdateSchema = CategoryBaseSchema.partial();

export const CategorySchema = CategoryBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📋 MENU SCHEMAS
// ================================

export const MenuBaseSchema = z.object({
  restaurant_id: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export const MenuCreateSchema = MenuBaseSchema;
export const MenuUpdateSchema = MenuBaseSchema.partial().omit({ restaurant_id: true });

export const MenuSchema = MenuBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🍽️ MENU ITEM SCHEMAS
// ================================

export const MenuItemBaseSchema = z.object({
  menu_id: UuidSchema,
  category_id: UuidSchema.optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: DecimalSchema,
  image_url: z.string().url().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  preparation_time: z.number().int().min(0).optional(),
  calories: z.number().int().min(0).optional(),
  allergens: z.array(z.string()).default([]),
  dietary_info: z.array(z.string()).default([]),
  display_order: z.number().int().min(0).default(0),
});

export const MenuItemCreateSchema = MenuItemBaseSchema;
export const MenuItemUpdateSchema = MenuItemBaseSchema.partial().omit({ menu_id: true });

export const MenuItemSchema = MenuItemBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 🪑 TABLE SCHEMAS
// ================================

export const TableBaseSchema = z.object({
  restaurant_id: UuidSchema,
  table_number: z.string().min(1).max(20),
  capacity: z.number().int().min(1).default(4),
  location: z.string().max(50).optional(),
  status: TableStatusEnum.default('available'),
  qr_code: z.string().max(255).optional(),
});

export const TableCreateSchema = TableBaseSchema;
export const TableUpdateSchema = TableBaseSchema.partial().omit({ 
  restaurant_id: true,
  table_number: true 
});

export const TableSchema = TableBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ================================
// 📅 RESERVATION SCHEMAS
// ================================

export const ReservationBaseSchema = z.object({
  table_id: UuidSchema,
  customer_id: UuidSchema.optional(),
  customer_name: z.string().min(1).max(100),
  customer_phone: PhoneSchema,
  customer_email: EmailSchema.optional(),
  party_size: z.number().int().min(1),
  reservation_date: z.string().datetime(),
  duration_hours: DecimalSchema.default(2),
  status: ReservationStatusEnum.default('pending'),
  special_requests: z.string().optional(),
  notes: z.string().optional(),
});

export const ReservationCreateSchema = ReservationBaseSchema;
export const ReservationUpdateSchema = ReservationBaseSchema.partial().omit({ 
  table_id: true 
});

export const ReservationSchema = ReservationBaseSchema.extend({
  id: UuidSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserStatusType = z.infer<typeof UserStatusEnum>;
export type UserRoleType = z.infer<typeof UserRoleEnum>;
export type UserType = z.infer<typeof UserSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

export type OrganizationType = z.infer<typeof OrganizationSchema>;
export type OrganizationCreateType = z.infer<typeof OrganizationCreateSchema>;
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>;

export type RestaurantChainType = z.infer<typeof RestaurantChainSchema>;
export type RestaurantChainCreateType = z.infer<typeof RestaurantChainCreateSchema>;
export type RestaurantChainUpdateType = z.infer<typeof RestaurantChainUpdateSchema>;

export type RestaurantType = z.infer<typeof RestaurantSchema>;
export type RestaurantCreateType = z.infer<typeof RestaurantCreateSchema>;
export type RestaurantUpdateType = z.infer<typeof RestaurantUpdateSchema>;

export type CategoryType = z.infer<typeof CategorySchema>;
export type CategoryCreateType = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateType = z.infer<typeof CategoryUpdateSchema>;

export type MenuType = z.infer<typeof MenuSchema>;
export type MenuCreateType = z.infer<typeof MenuCreateSchema>;
export type MenuUpdateType = z.infer<typeof MenuUpdateSchema>;

export type MenuItemType = z.infer<typeof MenuItemSchema>;
export type MenuItemCreateType = z.infer<typeof MenuItemCreateSchema>;
export type MenuItemUpdateType = z.infer<typeof MenuItemUpdateSchema>;

export type TableType = z.infer<typeof TableSchema>;
export type TableCreateType = z.infer<typeof TableCreateSchema>;
export type TableUpdateType = z.infer<typeof TableUpdateSchema>;

export type ReservationType = z.infer<typeof ReservationSchema>;
export type ReservationCreateType = z.infer<typeof ReservationCreateSchema>;
export type ReservationUpdateType = z.infer<typeof ReservationUpdateSchema>;
