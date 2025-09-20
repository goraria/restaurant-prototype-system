import { z } from 'zod';

// ================================
// 🍽️ MENU SCHEMAS
// ================================

// Create Menu Schema  
export const CreateMenuSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  name: z.string()
    .min(1, "Tên menu là bắt buộc")
    .max(100, "Tên menu không được quá 100 ký tự"),
  description: z.string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
  image_url: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(255, "URL hình ảnh không được quá 255 ký tự")
    .optional()
});

// Update Menu Schema
export const UpdateMenuSchema = z.object({
  name: z.string()
    .min(1, "Tên menu là bắt buộc")
    .max(100, "Tên menu không được quá 100 ký tự")
    .optional(),
  description: z.string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
  image_url: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(255, "URL hình ảnh không được quá 255 ký tự")
    .optional()
});

// Menu Query Schema
export const MenuQuerySchema = z.object({
  id: z.string().uuid("ID menu không hợp lệ").optional(),

  // page: z.coerce.number().int().min(1).default(1),
  // limit: z.coerce.number().int().min(1).max(100).default(20),
  // restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ").optional(),
  // category_id: z.string().uuid().optional(),
  // menu_id: z.string().uuid().optional(),
  // search: z.string().max(200).optional(),
  // name: z.string().max(200).optional(),
  // is_active: z.coerce.boolean().optional(),
  // is_featured: z.coerce.boolean().optional(),
  // min_price: z.coerce.number().positive().optional(),
  // max_price: z.coerce.number().positive().optional(),
  // is_vegetarian: z.coerce.boolean().optional(),
  // is_vegan: z.coerce.boolean().optional(),
  // is_available: z.coerce.boolean().optional(),
  // spice_level: z.enum(['none', 'mild', 'medium', 'hot', 'very_hot']).optional(),
  // allergens: z.array(z.string()).optional(),
  // dietary_info: z.array(z.string()).optional(),
  // sort_by: z.enum(['name', 'price', 'display_order', 'created_at']).default('display_order'),
  // sort_order: z.enum(['asc', 'desc']).default('asc')
});

// Menu Analytics Schema
export const MenuAnalyticsSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày bắt đầu phải có định dạng YYYY-MM-DD"),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày kết thúc phải có định dạng YYYY-MM-DD"),
  group_by: z.enum(['day', 'week', 'month']).default('day')
});

// Create Menu Item Schema
export const CreateMenuItemSchema = z.object({
  menu_id: z.string().uuid("ID menu không hợp lệ"),
  category_id: z.string().uuid("ID danh mục không hợp lệ").optional(),
  name: z.string()
    .min(1, "Tên món ăn là bắt buộc")
    .max(255, "Tên món ăn không được quá 255 ký tự"),
  description: z.string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  price: z.number()
    .positive("Giá phải lớn hơn 0")
    .max(999999999.99, "Giá không được quá 999,999,999.99"),
  image_url: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(255, "URL hình ảnh không được quá 255 ký tự")
    .optional(),
  is_available: z.boolean().default(true),
  allergens: z.array(z.string().max(100)).default([]),
  calories: z.number()
    .int("Calories phải là số nguyên")
    .min(0, "Calories không được âm")
    .optional(),
  dietary_info: z.array(z.string().max(100)).default([]),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
  preparation_time: z.number()
    .int("Thời gian chuẩn bị phải là số nguyên")
    .min(1, "Thời gian chuẩn bị tối thiểu 1 phút")
    .max(1440, "Thời gian chuẩn bị tối đa 1440 phút")
    .optional()

  // restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  // menu_id: z.string().uuid("ID menu không hợp lệ"),
  // category_id: z.string().uuid("ID danh mục không hợp lệ"),
  // name: z.string()
  //   .min(1, "Tên món ăn là bắt buộc")
  //   .max(200, "Tên món ăn không được quá 200 ký tự"),
  // description: z.string()
  //   .max(1000, "Mô tả không được quá 1000 ký tự")
  //   .optional(),
  // price: z.number()
  //   .positive("Giá phải lớn hơn 0")
  //   .max(10000000, "Giá không được quá 10,000,000 VNĐ"),
  // original_price: z.number()
  //   .positive("Giá gốc phải lớn hơn 0")
  //   .max(10000000, "Giá gốc không được quá 10,000,000 VNĐ")
  //   .optional(),
  // image_url: z.string()
  //   .url("URL hình ảnh không hợp lệ")
  //   .max(500, "URL hình ảnh không được quá 500 ký tự")
  //   .optional(),
  // images: z.array(z.string().url()).max(10, "Tối đa 10 hình ảnh").optional(),
  // preparation_time: z.number()
  //   .int("Thời gian chuẩn bị phải là số nguyên")
  //   .min(1, "Thời gian chuẩn bị tối thiểu 1 phút")
  //   .max(180, "Thời gian chuẩn bị tối đa 180 phút")
  //   .optional(),
  // calories: z.number()
  //   .int("Calories phải là số nguyên")
  //   .min(0, "Calories không được âm")
  //   .optional(),
  // ingredients: z.array(z.string().max(100)).optional(),
  // allergens: z.array(z.string().max(50)).optional(),
  // spice_level: z.enum(['none', 'mild', 'medium', 'hot', 'very_hot']).default('none'),
  // is_vegetarian: z.boolean().default(false),
  // is_vegan: z.boolean().default(false),
  // is_available: z.boolean().default(true),
  // display_order: z.number().int().min(0).default(0)
});

// Update Menu Item Schema
export const UpdateMenuItemSchema = z.object({
  category_id: z.string().uuid("ID danh mục không hợp lệ").optional(),
  name: z.string()
    .min(1, "Tên món ăn là bắt buộc")
    .max(255, "Tên món ăn không được quá 255 ký tự")
    .optional(),
  description: z.string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  price: z.number()
    .positive("Giá phải lớn hơn 0")
    .max(999999999.99, "Giá không được quá 999,999,999.99")
    .optional(),
  image_url: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(255, "URL hình ảnh không được quá 255 ký tự")
    .optional(),
  is_available: z.boolean().optional(),
  allergens: z.array(z.string().max(100)).optional(),
  calories: z.number()
    .int("Calories phải là số nguyên")
    .min(0, "Calories không được âm")
    .optional(),
  dietary_info: z.array(z.string().max(100)).optional(),
  display_order: z.number().int().min(0).optional(),
  is_featured: z.boolean().optional(),
  preparation_time: z.number()
    .int("Thời gian chuẩn bị phải là số nguyên")
    .min(1, "Thời gian chuẩn bị tối thiểu 1 phút")
    .max(1440, "Thời gian chuẩn bị tối đa 1440 phút")
    .optional()

  // category_id: z.string().uuid("ID danh mục không hợp lệ").optional(),
  // name: z.string()
  //   .min(1, "Tên món ăn là bắt buộc")
  //   .max(200, "Tên món ăn không được quá 200 ký tự")
  //   .optional(),
  // description: z.string()
  //   .max(1000, "Mô tả không được quá 1000 ký tự")
  //   .optional(),
  // price: z.number()
  //   .positive("Giá phải lớn hơn 0")
  //   .max(10000000, "Giá không được quá 10,000,000 VNĐ")
  //   .optional(),
  // original_price: z.number()
  //   .positive("Giá gốc phải lớn hơn 0")
  //   .max(10000000, "Giá gốc không được quá 10,000,000 VNĐ")
  //   .optional(),
  // image_url: z.string()
  //   .url("URL hình ảnh không hợp lệ")
  //   .max(500, "URL hình ảnh không được quá 500 ký tự")
  //   .optional(),
  // images: z.array(z.string().url()).max(10, "Tối đa 10 hình ảnh").optional(),
  // preparation_time: z.number()
  //   .int("Thời gian chuẩn bị phải là số nguyên")
  //   .min(1, "Thời gian chuẩn bị tối thiểu 1 phút")
  //   .max(180, "Thời gian chuẩn bị tối đa 180 phút")
  //   .optional(),
  // calories: z.number()
  //   .int("Calories phải là số nguyên")
  //   .min(0, "Calories không được âm")
  //   .optional(),
  // ingredients: z.array(z.string().max(100)).optional(),
  // allergens: z.array(z.string().max(50)).optional(),
  // spice_level: z.enum(['none', 'mild', 'medium', 'hot', 'very_hot']).optional(),
  // is_vegetarian: z.boolean().optional(),
  // is_vegan: z.boolean().optional(),
  // is_available: z.boolean().optional(),
  // display_order: z.number().int().min(0).optional()
});

// Menu Item Query Schema (using MenuQuerySchema)
export const MenuItemQuerySchema = MenuQuerySchema;

// Bulk Update Menu Schema
export const BulkUpdateMenuSchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  menu_item_ids: z.array(z.string().uuid()).min(1, "Phải chọn ít nhất 1 món ăn"),
  updates: z.union([
    z.array(z.object({
      menu_item_id: z.string().uuid(),
      data: UpdateMenuItemSchema
    })).min(1, "Phải có ít nhất 1 item để cập nhật"),
    UpdateMenuItemSchema
  ]),
  performer_id: z.string().uuid("ID người thực hiện không hợp lệ")
});

// Bulk Update Menu Items Schema (alias)
export const BulkUpdateMenuItemsSchema = BulkUpdateMenuSchema;

// Bulk Toggle Availability Schema
export const BulkToggleAvailabilitySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  menu_item_ids: z.array(z.string().uuid()).min(1, "Phải chọn ít nhất 1 món ăn"),
  is_available: z.boolean(),
  performer_id: z.string().uuid("ID người thực hiện không hợp lệ")
});

// Featured Items Query Schema
export const FeaturedItemsQuerySchema = z.object({
  restaurant_id: z.string().uuid("ID nhà hàng không hợp lệ"),
  limit: z.number().int().min(1).max(50).default(10),
  category_id: z.string().uuid().optional(),
  sort_by: z.enum(['popularity', 'rating', 'price', 'name']).default('popularity')
});

// ================================
// 🔧 TYPE EXPORTS
// ================================

export type CreateMenuInput = z.infer<typeof CreateMenuSchema>;
export type UpdateMenuInput = z.infer<typeof UpdateMenuSchema>;
export type MenuQueryInput = z.infer<typeof MenuQuerySchema>;
export type CreateMenuItemInput = z.infer<typeof CreateMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;
export type BulkUpdateMenuInput = z.infer<typeof BulkUpdateMenuSchema>;
export type MenuAnalyticsInput = z.infer<typeof MenuAnalyticsSchema>;

// Type aliases for services (matching service imports)
export type CreateMenu = CreateMenuInput;
export type UpdateMenu = UpdateMenuInput;
export type MenuQuery = MenuQueryInput;
export type CreateMenuItem = CreateMenuItemInput;
export type UpdateMenuItem = UpdateMenuItemInput;
export type MenuItemQuery = MenuQueryInput;
export type BulkUpdateMenuItems = BulkUpdateMenuInput;
export type BulkToggleAvailability = z.infer<typeof BulkToggleAvailabilitySchema>;
export type FeaturedItemsQuery = z.infer<typeof FeaturedItemsQuerySchema>;
