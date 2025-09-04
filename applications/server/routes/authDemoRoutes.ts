import { Router } from 'express';
import {
  publicApiController,
  authenticatedApiController,
  customerOnlyApiController,
  staffOnlyApiController,
  managerOnlyApiController,
  adminOnlyApiController,
  customerOrStaffApiController,
  staffOrManagerApiController,
  restaurantSpecificApiController,
  userProfileApiController
} from '@/controllers/authDemoController';
import {
  requireAuth,
  requireCustomer,
  requireStaff,
  requireManager,
  requireAdmin,
  requireCustomerOrStaff,
  requireStaffOrManager,
  requireRestaurantAccess
} from '@/middlewares/authMiddleware';

const router = Router();

/**
 * Demo Routes để test Authentication & Authorization
 * 
 * Cấu trúc URL:
 * /api/auth-demo/*
 */

// 1. Public API - không cần authentication
router.get('/public', publicApiController);

// 2. Authenticated API - chỉ cần đăng nhập, không kiểm tra role
router.get('/authenticated', requireAuth(), authenticatedApiController);

// 3. API cho từng role cụ thể (1 role duy nhất)
router.get('/customer-only', requireCustomer, customerOnlyApiController);
router.get('/staff-only', requireStaff, staffOnlyApiController);
router.get('/manager-only', requireManager, managerOnlyApiController);
router.get('/admin-only', requireAdmin, adminOnlyApiController);

// 4. API cho phép nhiều role
router.get('/customer-or-staff', requireCustomerOrStaff, customerOrStaffApiController);
router.get('/staff-or-manager', requireStaffOrManager, staffOrManagerApiController);

// 5. API có kiểm tra quyền truy cập restaurant cụ thể
router.get('/restaurant/:restaurantId/data', 
  requireStaffOrManager, 
  requireRestaurantAccess('restaurantId'), 
  restaurantSpecificApiController
);

// 6. API hiển thị thông tin user đầy đủ (tất cả thuộc tính từ Clerk)
router.get('/user-profile', requireAuth(), userProfileApiController);

// 7. API test với các role khác nhau và nhiều tham số
router.get('/restaurant/:restaurantId/orders', 
  requireAuth(['staff', 'manager', 'admin']), 
  requireRestaurantAccess('restaurantId'),
  (req, res) => {
    res.json({
      message: 'Restaurant Orders API - cho staff/manager/admin của restaurant cụ thể',
      restaurant_id: req.params.restaurantId,
      user_role: req.user?.role,
      restaurant_context: req.user?.restaurant_context,
      access_granted: true
    });
  }
);

router.get('/restaurant/:restaurantId/analytics', 
  requireAuth(['manager', 'admin']), 
  requireRestaurantAccess('restaurantId'),
  (req, res) => {
    res.json({
      message: 'Restaurant Analytics API - chỉ cho manager/admin của restaurant cụ thể',
      restaurant_id: req.params.restaurantId,
      user_role: req.user?.role,
      restaurant_context: req.user?.restaurant_context,
      access_granted: true
    });
  }
);

// 8. API customer với quyền truy cập tùy chỉnh
router.get('/my-orders', requireCustomer, (req, res) => {
  res.json({
    message: 'My Orders API - đơn hàng của khách hàng',
    customer_id: req.user?.id,
    total_orders: req.user?.total_orders,
    total_spent: req.user?.total_spent,
    loyalty_points: req.user?.loyalty_points
  });
});

// 9. API admin có thể truy cập tất cả
router.get('/admin/all-restaurants', requireAdmin, (req, res) => {
  res.json({
    message: 'Admin All Restaurants API - admin có thể truy cập tất cả',
    admin_privileges: true,
    user_role: req.user?.role,
    note: 'Admin có thể truy cập mọi restaurant không cần requireRestaurantAccess'
  });
});

export default router;
