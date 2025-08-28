import { Router } from 'express';
import * as inventoryControllers from '@/controllers/inventoryControllers';

const router = Router();

// ================================
// 🏪 INVENTORY ITEM ROUTES
// ================================

// 🔹 Tạo nguyên liệu mới
router.post('/inventory-items', inventoryControllers.createInventoryItem);

// 🔹 Lấy danh sách nguyên liệu với filter & pagination
router.get('/inventory-items', inventoryControllers.getInventoryItems);

// 🔹 Cập nhật hàng loạt
router.patch('/inventory-items/bulk-update', inventoryControllers.bulkUpdateInventory);

// 🔹 Cảnh báo tồn kho thấp
router.get('/inventory-items/low-stock-alert', inventoryControllers.getLowStockAlert);

// 🔹 Lấy nguyên liệu theo ID
router.get('/inventory-items/:id', inventoryControllers.getInventoryItemById);

// 🔹 Cập nhật nguyên liệu
router.put('/inventory-items/:id', inventoryControllers.updateInventoryItem);

// 🔹 Xóa nguyên liệu
router.delete('/inventory-items/:id', inventoryControllers.deleteInventoryItem);

// 🔹 Lấy nguyên liệu theo nhà hàng
router.get('/restaurants/:restaurantId/inventory-items', inventoryControllers.getInventoryItemsByRestaurantId);

// ================================
// 📦 INVENTORY TRANSACTION ROUTES
// ================================

// 🔹 Tạo giao dịch kho mới
router.post('/inventory-transactions', inventoryControllers.createInventoryTransaction);

// 🔹 Lấy danh sách giao dịch với filter & pagination
router.get('/inventory-transactions', inventoryControllers.getInventoryTransactions);

// ================================
// 👨‍🍳 RECIPE ROUTES
// ================================

// 🔹 Tạo công thức mới
router.post('/recipes', inventoryControllers.createRecipe);

// 🔹 Lấy danh sách công thức với filter & pagination
router.get('/recipes', inventoryControllers.getRecipes);

// 🔹 Tính chi phí công thức
router.post('/recipes/calculate-cost', inventoryControllers.calculateRecipeCost);

// 🔹 Lấy công thức theo ID
router.get('/recipes/:id', inventoryControllers.getRecipeById);

// 🔹 Cập nhật công thức
router.put('/recipes/:id', inventoryControllers.updateRecipe);

// ================================
// 📊 ANALYTICS & REPORTING ROUTES
// ================================

// 🔹 Thống kê tồn kho
router.get('/stats/inventory', inventoryControllers.getInventoryStats);

// ================================
// 📱 MOBILE/QUICK OPERATIONS ROUTES
// ================================

// 🔹 Kiểm tra QR Code
router.post('/inventory/qr-check', inventoryControllers.checkQRInventory);

// 🔹 Cập nhật nhanh số lượng
router.post('/inventory/quick-update', inventoryControllers.quickStockUpdate);

export default router;
