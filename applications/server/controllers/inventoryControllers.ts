import { Request, Response } from 'express';
import { 
  CreateInventoryItemSchema,
  UpdateInventoryItemSchema,
  InventoryQuerySchema,
  BulkUpdateInventorySchema,
  LowStockAlertSchema,
  CreateInventoryTransactionSchema,
  TransactionQuerySchema,
  CreateRecipeSchema,
  UpdateRecipeSchema,
  RecipeQuerySchema,
  UpdateRecipeIngredientsSchema,
  RecipeCostCalculationSchema,
  InventoryStatsQuerySchema,
  StockValuationSchema,
  UsageForecastSchema,
  WasteAnalysisSchema,
  BatchStockAdjustmentSchema,
  ImportInventoryDataSchema,
  QRInventoryCheckSchema,
  QuickStockUpdateSchema
} from '@/schemas/inventorySchemas';
import * as inventoryServices from '@/services/inventoryServices';

// ================================
// 🏪 INVENTORY ITEM CONTROLLERS
// ================================

// Tạo nguyên liệu mới
export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateInventoryItemSchema.parse(req.body);
    const item = await inventoryServices.createInventoryItem(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo nguyên liệu thành công',
      data: item
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo nguyên liệu',
      error: error.issues || error
    });
  }
};

// Lấy nguyên liệu theo ID
export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await inventoryServices.getInventoryItemById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin nguyên liệu thành công',
      data: item
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy nguyên liệu',
    });
  }
};

// Lấy danh sách nguyên liệu với filter
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const validatedQuery = InventoryQuerySchema.parse(req.query);
    const result = await inventoryServices.getInventoryItems(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách nguyên liệu thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách nguyên liệu',
      error: error.issues || error
    });
  }
};

// Lấy nguyên liệu theo nhà hàng
export const getInventoryItemsByRestaurantId = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const items = await inventoryServices.getInventoryItemsByRestaurantId(restaurantId);
    
    res.status(200).json({
      success: true,
      message: 'Lấy nguyên liệu của nhà hàng thành công',
      data: items
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy nguyên liệu của nhà hàng',
    });
  }
};

// Cập nhật nguyên liệu
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateInventoryItemSchema.parse(req.body);
    const item = await inventoryServices.updateInventoryItem(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật nguyên liệu thành công',
      data: item
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật nguyên liệu',
      error: error.issues || error
    });
  }
};

// Xóa nguyên liệu
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await inventoryServices.deleteInventoryItem(id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xóa nguyên liệu',
    });
  }
};

// Cập nhật hàng loạt
export const bulkUpdateInventory = async (req: Request, res: Response) => {
  try {
    const validatedData = BulkUpdateInventorySchema.parse(req.body);
    const result = await inventoryServices.bulkUpdateInventory(validatedData);
    
    res.status(200).json({
      success: true,
      message: result.message,
      count: result.count
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật hàng loạt',
      error: error.issues || error
    });
  }
};

// Cảnh báo tồn kho thấp
export const getLowStockAlert = async (req: Request, res: Response) => {
  try {
    const validatedQuery = LowStockAlertSchema.parse(req.query);
    const result = await inventoryServices.getLowStockAlert(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: `Tìm thấy ${result.total_alerts} cảnh báo`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy cảnh báo tồn kho',
      error: error.issues || error
    });
  }
};

// ================================
// 📦 INVENTORY TRANSACTION CONTROLLERS
// ================================

// Tạo giao dịch kho
export const createInventoryTransaction = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateInventoryTransactionSchema.parse(req.body);
    const transaction = await inventoryServices.createInventoryTransaction(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo giao dịch kho thành công',
      data: transaction
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo giao dịch kho',
      error: error.issues || error
    });
  }
};

// Lấy danh sách giao dịch
export const getInventoryTransactions = async (req: Request, res: Response) => {
  try {
    const validatedQuery = TransactionQuerySchema.parse(req.query);
    const result = await inventoryServices.getInventoryTransactions(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách giao dịch thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách giao dịch',
      error: error.issues || error
    });
  }
};

// ================================
// 👨‍🍳 RECIPE CONTROLLERS
// ================================

// Tạo công thức mới
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateRecipeSchema.parse(req.body);
    const recipe = await inventoryServices.createRecipe(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo công thức thành công',
      data: recipe
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo công thức',
      error: error.issues || error
    });
  }
};

// Lấy công thức theo ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await inventoryServices.getRecipeById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin công thức thành công',
      data: recipe
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy công thức',
    });
  }
};

// Lấy danh sách công thức
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const validatedQuery = RecipeQuerySchema.parse(req.query);
    const result = await inventoryServices.getRecipes(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách công thức thành công',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách công thức',
      error: error.issues || error
    });
  }
};

// Cập nhật công thức
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateRecipeSchema.parse(req.body);
    const recipe = await inventoryServices.updateRecipe(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật công thức thành công',
      data: recipe
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật công thức',
      error: error.issues || error
    });
  }
};

// Tính chi phí công thức
export const calculateRecipeCost = async (req: Request, res: Response) => {
  try {
    const validatedData = RecipeCostCalculationSchema.parse(req.body);
    const result = await inventoryServices.calculateRecipeCost(validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Tính chi phí công thức thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tính chi phí công thức',
      error: error.issues || error
    });
  }
};

// ================================
// 📊 ANALYTICS CONTROLLERS
// ================================

// Thống kê tồn kho
export const getInventoryStats = async (req: Request, res: Response) => {
  try {
    const validatedQuery = InventoryStatsQuerySchema.parse(req.query);
    const stats = await inventoryServices.getInventoryStats(validatedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Lấy thống kê tồn kho thành công',
      data: stats
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê tồn kho',
      error: error.issues || error
    });
  }
};

// ================================
// 📱 MOBILE/QUICK OPERATIONS
// ================================

// Kiểm tra QR Code
export const checkQRInventory = async (req: Request, res: Response) => {
  try {
    const validatedData = QRInventoryCheckSchema.parse(req.body);
    // Implementation for QR code checking would go here
    
    res.status(200).json({
      success: true,
      message: 'Kiểm tra QR thành công',
      data: { qr_code: validatedData.qr_code }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra QR',
      error: error.issues || error
    });
  }
};

// Cập nhật nhanh số lượng
export const quickStockUpdate = async (req: Request, res: Response) => {
  try {
    const validatedData = QuickStockUpdateSchema.parse(req.body);
    // Implementation for quick stock update would go here
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật nhanh thành công',
      data: validatedData
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật nhanh',
      error: error.issues || error
    });
  }
};
