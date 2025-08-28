import { Router } from 'express';
// import { restaurantControllers } from '@controllers/restaurantControllers';
// Import middleware (tạm thời comment để không lỗi)
// import { authMiddleware, managerMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
// const restaurantControllerInstance = new restaurantControllers();
//
// // Public routes
// router.get('/search', restaurantControllerInstance.searchRestaurants);
// router.get('/stats', restaurantControllerInstance.getRestaurantStats);
// router.get('/:id/operational', restaurantControllerInstance.checkOperational);
//
// // Protected routes (cần auth)
// // router.use(authMiddleware); // Uncomment khi có auth middleware
//
// // CRUD routes
// router.get('/', restaurantControllerInstance.getRestaurants);
// router.post('/', restaurantControllerInstance.createRestaurant);
// router.put('/:id', restaurantControllerInstance.updateRestaurant);
// router.delete('/:id', restaurantControllerInstance.deleteRestaurant);
//
// // Special routes with parameters (đặt trước /:id)
// router.put('/:id/opening-hours', restaurantControllerInstance.updateOpeningHours);
// router.get('/:id/operational', restaurantControllerInstance.checkOperational);
// router.get('/:id', restaurantControllerInstance.getRestaurantById); // Đặt cuối

// Manager/Admin only routes
// router.use(managerMiddleware); // Uncomment khi có manager middleware

export default router;
