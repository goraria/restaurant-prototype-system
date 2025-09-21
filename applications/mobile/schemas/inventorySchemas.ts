import { z } from 'zod';

// ================================
// 🏪 INVENTORY ITEM SCHEMAS
// ================================

// Base Inventory Item Schema
export const InventoryItemSchema = z.object({
  id: z.string().uuid('ID nguyên liệu không hợp lệ'),
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  name: z.string().min(1, 'Tên nguyên liệu không được để trống').max(100, 'Tên nguyên liệu không quá 100 ký tự'),
  description: z.string().optional(),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự'),
  quantity: z.number().min(0, 'Số lượng không được âm'),
  min_quantity: z.number().min(0, 'Số lượng tối thiểu không được âm').optional(),
  max_quantity: z.number().min(0, 'Số lượng tối đa không được âm').optional(),
  unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  expiry_date: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create Inventory Item Schema
export const CreateInventoryItemSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  name: z.string().min(1, 'Tên nguyên liệu không được để trống').max(100, 'Tên nguyên liệu không quá 100 ký tự'),
  description: z.string().optional(),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự'),
  quantity: z.number().min(0, 'Số lượng không được âm'),
  min_quantity: z.number().min(0, 'Số lượng tối thiểu không được âm').optional(),
  max_quantity: z.number().min(0, 'Số lượng tối đa không được âm').optional(),
  unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  expiry_date: z.date().optional(),
}).refine(
  (data) => !data.max_quantity || !data.min_quantity || data.max_quantity >= data.min_quantity,
  {
    message: 'Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu',
    path: ['max_quantity']
  }
);

// Update Inventory Item Schema
export const UpdateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Tên nguyên liệu không được để trống').max(100, 'Tên nguyên liệu không quá 100 ký tự').optional(),
  description: z.string().optional(),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự').optional(),
  quantity: z.number().min(0, 'Số lượng không được âm').optional(),
  min_quantity: z.number().min(0, 'Số lượng tối thiểu không được âm').optional(),
  max_quantity: z.number().min(0, 'Số lượng tối đa không được âm').optional(),
  unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  expiry_date: z.date().optional(),
}).refine(
  (data) => !data.max_quantity || !data.min_quantity || data.max_quantity >= data.min_quantity,
  {
    message: 'Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu',
    path: ['max_quantity']
  }
);

// Inventory Query Schema
export const InventoryQuerySchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ').optional(),
  name: z.string().max(100, 'Tên tìm kiếm không quá 100 ký tự').optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  unit: z.string().max(20, 'Đơn vị tính không quá 20 ký tự').optional(),
  low_stock: z.string().transform(val => val === 'true').optional(), // Items below min_quantity
  expiring_soon: z.string().transform(val => val === 'true').optional(), // Items expiring within 7 days
  expired: z.string().transform(val => val === 'true').optional(), // Expired items
  min_quantity: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Số lượng tối thiểu không hợp lệ').optional(),
  max_quantity: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Số lượng tối đa không hợp lệ').optional(),
  min_cost: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Giá tối thiểu không hợp lệ').optional(),
  max_cost: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Giá tối đa không hợp lệ').optional(),
  expiry_from: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ').optional(),
  expiry_to: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày kết thúc không hợp lệ').optional(),
  page: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, 'Số trang không hợp lệ').optional().default(() => 1),
  limit: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0 && val <= 100, 'Giới hạn không hợp lệ (1-100)').optional().default(() => 10),
  sort_by: z.enum(['name', 'quantity', 'unit_cost', 'expiry_date', 'created_at', 'updated_at']).optional().default('name'),
  sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Bulk Update Inventory Schema
export const BulkUpdateInventorySchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid('ID nguyên liệu không hợp lệ'),
    quantity: z.number().min(0, 'Số lượng không được âm').optional(),
    unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
    min_quantity: z.number().min(0, 'Số lượng tối thiểu không được âm').optional(),
    max_quantity: z.number().min(0, 'Số lượng tối đa không được âm').optional(),
  })).min(1, 'Danh sách cập nhật không được trống'),
});

// Low Stock Alert Schema
export const LowStockAlertSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  threshold_days: z.number().min(1, 'Ngưỡng cảnh báo phải ít nhất 1 ngày').max(30, 'Ngưỡng cảnh báo không quá 30 ngày').optional().default(7),
});

// ================================
// 📦 INVENTORY TRANSACTION SCHEMAS  
// ================================

// Transaction Types
export const TransactionTypeEnum = z.enum(['purchase', 'usage', 'adjustment', 'waste', 'return', 'transfer']);

// Create Transaction Schema
export const CreateInventoryTransactionSchema = z.object({
  inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
  type: TransactionTypeEnum.refine(val => val, 'Loại giao dịch không hợp lệ'),
  quantity: z.number().refine(val => val !== 0, 'Số lượng không được bằng 0'),
  unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
  total_cost: z.number().min(0, 'Tổng chi phí không được âm').optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  invoice_number: z.string().max(50, 'Số hóa đơn không quá 50 ký tự').optional(),
  notes: z.string().max(500, 'Ghi chú không quá 500 ký tự').optional(),
});

// Transaction Query Schema
export const TransactionQuerySchema = z.object({
  inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ').optional(),
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ').optional(),
  type: TransactionTypeEnum.optional(),
  supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
  invoice_number: z.string().max(50, 'Số hóa đơn không quá 50 ký tự').optional(),
  date_from: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ').optional(),
  date_to: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày kết thúc không hợp lệ').optional(),
  min_amount: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Số tiền tối thiểu không hợp lệ').optional(),
  max_amount: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Số tiền tối đa không hợp lệ').optional(),
  page: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, 'Số trang không hợp lệ').optional().default(() => 1),
  limit: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0 && val <= 100, 'Giới hạn không hợp lệ (1-100)').optional().default(() => 10),
  sort_by: z.enum(['created_at', 'quantity', 'total_cost', 'type']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ================================
// 👨‍🍳 RECIPE SCHEMAS
// ================================

// Create Recipe Schema
export const CreateRecipeSchema = z.object({
  menu_item_id: z.string().uuid('ID món ăn không hợp lệ'),
  name: z.string().min(1, 'Tên công thức không được để trống').max(100, 'Tên công thức không quá 100 ký tự'),
  description: z.string().max(500, 'Mô tả không quá 500 ký tự').optional(),
  instructions: z.string().max(2000, 'Hướng dẫn không quá 2000 ký tự').optional(),
  prep_time: z.number().min(0, 'Thời gian chuẩn bị không được âm').optional(),
  cook_time: z.number().min(0, 'Thời gian nấu không được âm').optional(),
  serving_size: z.number().min(1, 'Khẩu phần ít nhất là 1').optional(),
  ingredients: z.array(z.object({
    inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
    quantity: z.number().min(0, 'Số lượng không được âm'),
    unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự'),
    notes: z.string().max(200, 'Ghi chú không quá 200 ký tự').optional(),
  })).min(1, 'Công thức phải có ít nhất 1 nguyên liệu'),
});

// Update Recipe Schema
export const UpdateRecipeSchema = z.object({
  name: z.string().min(1, 'Tên công thức không được để trống').max(100, 'Tên công thức không quá 100 ký tự').optional(),
  description: z.string().max(500, 'Mô tả không quá 500 ký tự').optional(),
  instructions: z.string().max(2000, 'Hướng dẫn không quá 2000 ký tự').optional(),
  prep_time: z.number().min(0, 'Thời gian chuẩn bị không được âm').optional(),
  cook_time: z.number().min(0, 'Thời gian nấu không được âm').optional(),
  serving_size: z.number().min(1, 'Khẩu phần ít nhất là 1').optional(),
});

// Recipe Query Schema
export const RecipeQuerySchema = z.object({
  menu_item_id: z.string().uuid('ID món ăn không hợp lệ').optional(),
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ').optional(),
  name: z.string().max(100, 'Tên tìm kiếm không quá 100 ký tự').optional(),
  ingredient_id: z.string().uuid('ID nguyên liệu không hợp lệ').optional(), // Recipes containing this ingredient
  min_prep_time: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Thời gian chuẩn bị tối thiểu không hợp lệ').optional(),
  max_prep_time: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Thời gian chuẩn bị tối đa không hợp lệ').optional(),
  min_cook_time: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Thời gian nấu tối thiểu không hợp lệ').optional(),
  max_cook_time: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 'Thời gian nấu tối đa không hợp lệ').optional(),
  page: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, 'Số trang không hợp lệ').optional().default(() => 1),
  limit: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0 && val <= 100, 'Giới hạn không hợp lệ (1-100)').optional().default(() => 10),
  sort_by: z.enum(['name', 'prep_time', 'cook_time', 'serving_size', 'created_at']).optional().default('name'),
  sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Update Recipe Ingredients Schema
export const UpdateRecipeIngredientsSchema = z.object({
  recipe_id: z.string().uuid('ID công thức không hợp lệ'),
  ingredients: z.array(z.object({
    inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
    quantity: z.number().min(0, 'Số lượng không được âm'),
    unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự'),
    notes: z.string().max(200, 'Ghi chú không quá 200 ký tự').optional(),
  })).min(1, 'Công thức phải có ít nhất 1 nguyên liệu'),
});

// Recipe Cost Calculation Schema
export const RecipeCostCalculationSchema = z.object({
  recipe_id: z.string().uuid('ID công thức không hợp lệ'),
  serving_size: z.number().min(1, 'Khẩu phần ít nhất là 1').optional(),
});

// ================================
// 📊 INVENTORY ANALYTICS SCHEMAS
// ================================

// Inventory Stats Query Schema
export const InventoryStatsQuerySchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  date_from: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ').optional(),
  date_to: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày kết thúc không hợp lệ').optional(),
  category: z.string().max(50, 'Danh mục không quá 50 ký tự').optional(),
});

// Stock Valuation Schema
export const StockValuationSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  calculation_method: z.enum(['current_cost', 'average_cost', 'fifo', 'lifo']).optional().default('current_cost'),
});

// Usage Forecast Schema
export const UsageForecastSchema = z.object({
  inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
  days_ahead: z.number().min(1, 'Số ngày dự báo ít nhất là 1').max(90, 'Số ngày dự báo không quá 90').optional().default(30),
  include_seasonal: z.boolean().optional().default(true),
});

// Waste Analysis Schema
export const WasteAnalysisSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  date_from: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ').optional(),
  date_to: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày kết thúc không hợp lệ').optional(),
  category: z.string().max(50, 'Danh mục không quá 50 ký tự').optional(),
  min_waste_value: z.number().min(0, 'Giá trị lãng phí tối thiểu không được âm').optional(),
});

// ================================
// 🔄 BATCH OPERATIONS SCHEMAS
// ================================

// Batch Stock Adjustment Schema
export const BatchStockAdjustmentSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  adjustments: z.array(z.object({
    inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
    adjustment_quantity: z.number().refine(val => val !== 0, 'Số lượng điều chỉnh không được bằng 0'),
    reason: z.string().min(1, 'Lý do điều chỉnh không được để trống').max(200, 'Lý do không quá 200 ký tự'),
    notes: z.string().max(300, 'Ghi chú không quá 300 ký tự').optional(),
  })).min(1, 'Danh sách điều chỉnh không được trống'),
  adjustment_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày điều chỉnh không hợp lệ').optional(),
});

// Import Inventory Data Schema
export const ImportInventoryDataSchema = z.object({
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
  items: z.array(z.object({
    name: z.string().min(1, 'Tên nguyên liệu không được để trống').max(100, 'Tên nguyên liệu không quá 100 ký tự'),
    unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20, 'Đơn vị tính không quá 20 ký tự'),
    quantity: z.number().min(0, 'Số lượng không được âm'),
    unit_cost: z.number().min(0, 'Giá đơn vị không được âm').optional(),
    supplier: z.string().max(100, 'Tên nhà cung cấp không quá 100 ký tự').optional(),
    min_quantity: z.number().min(0, 'Số lượng tối thiểu không được âm').optional(),
    max_quantity: z.number().min(0, 'Số lượng tối đa không được âm').optional(),
    expiry_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày hết hạn không hợp lệ').optional(),
  })).min(1, 'Danh sách import không được trống'),
  overwrite_existing: z.boolean().optional().default(false),
});

// ================================
// 📱 MOBILE/QR CODE SCHEMAS
// ================================

// QR Code Inventory Check Schema
export const QRInventoryCheckSchema = z.object({
  qr_code: z.string().min(1, 'Mã QR không được để trống'),
  restaurant_id: z.string().uuid('ID nhà hàng không hợp lệ'),
});

// Quick Stock Update Schema (for mobile apps)
export const QuickStockUpdateSchema = z.object({
  inventory_item_id: z.string().uuid('ID nguyên liệu không hợp lệ'),
  new_quantity: z.number().min(0, 'Số lượng mới không được âm'),
  update_reason: z.enum(['recount', 'usage', 'delivery', 'waste', 'other']),
  notes: z.string().max(200, 'Ghi chú không quá 200 ký tự').optional(),
  location: z.string().max(100, 'Vị trí không quá 100 ký tự').optional(),
});

// ================================
// 🎯 TYPE EXPORTS
// ================================

export type CreateInventoryItem = z.infer<typeof CreateInventoryItemSchema>;
export type UpdateInventoryItem = z.infer<typeof UpdateInventoryItemSchema>;
export type InventoryQuery = z.infer<typeof InventoryQuerySchema>;
export type BulkUpdateInventory = z.infer<typeof BulkUpdateInventorySchema>;
export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;

export type CreateInventoryTransaction = z.infer<typeof CreateInventoryTransactionSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;

export type CreateRecipe = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>;
export type RecipeQuery = z.infer<typeof RecipeQuerySchema>;
export type UpdateRecipeIngredients = z.infer<typeof UpdateRecipeIngredientsSchema>;
export type RecipeCostCalculation = z.infer<typeof RecipeCostCalculationSchema>;

export type InventoryStatsQuery = z.infer<typeof InventoryStatsQuerySchema>;
export type StockValuation = z.infer<typeof StockValuationSchema>;
export type UsageForecast = z.infer<typeof UsageForecastSchema>;
export type WasteAnalysis = z.infer<typeof WasteAnalysisSchema>;

export type BatchStockAdjustment = z.infer<typeof BatchStockAdjustmentSchema>;
export type ImportInventoryData = z.infer<typeof ImportInventoryDataSchema>;
export type QRInventoryCheck = z.infer<typeof QRInventoryCheckSchema>;
export type QuickStockUpdate = z.infer<typeof QuickStockUpdateSchema>;
