import { Router } from 'express';
import {
  getAllInventoryItem,
  createInventoryItem,
  getInventoryItems,
  bulkUpdateInventory,
  getLowStockAlert,
  // getInventoryItemById,
  // updateInventoryItem,
  // deleteInventoryItem,
  // getInventoryItemsByRestaurantId,
  createInventoryTransaction,
  getInventoryTransactions,
  createRecipe,
  getRecipes,
  calculateRecipeCost,
  // getRecipeById,
  // updateRecipe,
  getInventoryStats,
  checkQRInventory,
  quickStockUpdate,
} from '@/controllers/inventoryControllers';

const router = Router();

// ================================
// 🏪 INVENTORY ITEM ROUTES
// ================================

router.get("/", getAllInventoryItem)

// 🔹 Tạo nguyên liệu mới
router.post('/inventory-items', createInventoryItem);

// 🔹 Lấy danh sách nguyên liệu với filter & pagination
router.get('/inventory-items', getInventoryItems);

// 🔹 Cập nhật hàng loạt
router.patch('/inventory-items/bulk-update', bulkUpdateInventory);

// 🔹 Cảnh báo tồn kho thấp
router.get('/inventory-items/low-stock-alert', getLowStockAlert);

// 🔹 Lấy nguyên liệu theo ID
// router.get('/inventory-items/:id', getInventoryItemById);

// 🔹 Cập nhật nguyên liệu
// router.put('/inventory-items/:id', updateInventoryItem);

// 🔹 Xóa nguyên liệu
// router.delete('/inventory-items/:id', deleteInventoryItem);

// 🔹 Lấy nguyên liệu theo nhà hàng
// router.get('/restaurants/:restaurantId/inventory-items', getInventoryItemsByRestaurantId);

// ================================
// 📦 INVENTORY TRANSACTION ROUTES
// ================================

// 🔹 Tạo giao dịch kho mới
router.post('/inventory-transactions', createInventoryTransaction);

// 🔹 Lấy danh sách giao dịch với filter & pagination
router.get('/inventory-transactions', getInventoryTransactions);

// ================================
// 👨‍🍳 RECIPE ROUTES
// ================================

// 🔹 Tạo công thức mới
router.post('/recipes', createRecipe);

// 🔹 Lấy danh sách công thức với filter & pagination
router.get('/recipes', getRecipes);

// 🔹 Tính chi phí công thức
router.post('/recipes/calculate-cost', calculateRecipeCost);

// 🔹 Lấy công thức theo ID
// router.get('/recipes/:id', getRecipeById);

// 🔹 Cập nhật công thức
// router.put('/recipes/:id', updateRecipe);

// ================================
// 📊 ANALYTICS & REPORTING ROUTES
// ================================

// 🔹 Thống kê tồn kho
router.get('/stats/inventory', getInventoryStats);

// ================================
// 📱 MOBILE/QUICK OPERATIONS ROUTES
// ================================

// 🔹 Kiểm tra QR Code
router.post('/inventory/qr-check', checkQRInventory);

// 🔹 Cập nhật nhanh số lượng
router.post('/inventory/quick-update', quickStockUpdate);

export default router;
