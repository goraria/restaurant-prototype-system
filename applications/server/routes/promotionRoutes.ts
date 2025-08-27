import { Router } from 'express';
import promotionControllers from '../controllers/promotionControllers';

const router = Router();

// ================================
// 🎟️ VOUCHER ROUTES
// ================================

// Admin/Manager voucher management
router.post('/vouchers', promotionControllers.createVoucher);
router.get('/vouchers', promotionControllers.getVouchers);
router.put('/vouchers/:id', promotionControllers.updateVoucher);
router.delete('/vouchers/:id', promotionControllers.deleteVoucher);

// Customer voucher operations
router.post('/vouchers/apply', promotionControllers.applyVoucher);
router.get('/my-vouchers', promotionControllers.getCustomerVouchers);

// ================================
// 🎯 PROMOTION ROUTES
// ================================

// Admin/Manager promotion management
router.post('/promotions', promotionControllers.createPromotion);
router.get('/promotions', promotionControllers.getPromotions);
router.put('/promotions/:id', promotionControllers.updatePromotion);
router.delete('/promotions/:id', promotionControllers.deletePromotion);

// Customer promotion operations
router.post('/promotions/check', promotionControllers.checkPromotions);
router.get('/my-promotions', promotionControllers.getCustomerPromotions);

// ================================
// 🧮 COMBINED DISCOUNT ROUTES
// ================================

// Calculate best discount (voucher vs promotions)
router.post('/calculate-discount', promotionControllers.calculateBestDiscount);

// Analytics and reporting
router.get('/analytics', promotionControllers.getDiscountAnalytics);

// ================================
// 📊 RESTAURANT SPECIFIC ROUTES
// ================================

// Restaurant voucher management
router.get('/restaurants/:restaurant_id/vouchers', promotionControllers.getRestaurantVouchers);

// Restaurant promotion management
router.get('/restaurants/:restaurant_id/promotions', promotionControllers.getRestaurantPromotions);

export default router;
