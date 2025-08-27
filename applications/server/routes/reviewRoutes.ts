import { Router } from 'express';
import reviewControllers from '../controllers/reviewControllers';

const router = Router();

// ================================
// 🌟 REVIEW ROUTES
// ================================

// Customer review creation routes
router.post('/restaurant', reviewControllers.createRestaurantReview);
router.post('/menu-item', reviewControllers.createMenuItemReview);
router.post('/order', reviewControllers.createOrderReview);

// General review management routes
router.get('/', reviewControllers.getReviews);
router.get('/stats', reviewControllers.getReviewStats);
router.get('/my-reviews', reviewControllers.getCustomerReviews);

// Individual review management
router.get('/:reviewId', reviewControllers.getReviewById);
router.put('/:reviewId', reviewControllers.updateReview);
router.delete('/:reviewId', reviewControllers.deleteReview);

// Restaurant response management
router.post('/:reviewId/response', reviewControllers.addReviewResponse);

// Bulk actions (admin/staff)
router.post('/bulk-action', reviewControllers.bulkReviewAction);

// Restaurant-specific review routes
router.get('/restaurant/:restaurantId', reviewControllers.getRestaurantReviews);
router.get('/restaurant/:restaurantId/stats', reviewControllers.getRestaurantReviewStats);

// Menu item-specific review routes
router.get('/menu-item/:menuItemId', reviewControllers.getMenuItemReviews);
router.get('/menu-item/:menuItemId/stats', reviewControllers.getMenuItemReviewStats);

export default router;
