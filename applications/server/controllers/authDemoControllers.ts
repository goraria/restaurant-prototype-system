import { Response } from 'express';
import { AuthenticatedRequest } from '@/types/auth';

/**
 * Demo API để test các middleware authentication
 */

// API Public - không cần authentication
export const publicApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Public API - không cần authentication',
    timestamp: new Date().toISOString()
  });
};

// API chỉ cần authentication - không kiểm tra role
export const authenticatedApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Authenticated API - chỉ cần login',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    timestamp: new Date().toISOString()
  });
};

// API chỉ dành cho customer
export const customerOnlyApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Customer Only API - chỉ dành cho khách hàng',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      total_orders: req.user?.total_orders,
      total_spent: req.user?.total_spent,
      loyalty_points: req.user?.loyalty_points
    },
    timestamp: new Date().toISOString()
  });
};

// API chỉ dành cho staff
export const staffOnlyApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Staff Only API - chỉ dành cho nhân viên',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    timestamp: new Date().toISOString()
  });
};

// API chỉ dành cho manager
export const managerOnlyApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Manager Only API - chỉ dành cho quản lý',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    timestamp: new Date().toISOString()
  });
};

// API chỉ dành cho admin
export const adminOnlyApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Admin Only API - chỉ dành cho admin',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role
    },
    timestamp: new Date().toISOString()
  });
};

// API cho phép nhiều role: customer hoặc staff
export const customerOrStaffApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Customer hoặc Staff API - cho phép khách hàng hoặc nhân viên',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    timestamp: new Date().toISOString()
  });
};

// API cho phép nhiều role: staff hoặc manager
export const staffOrManagerApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Staff hoặc Manager API - cho phép nhân viên hoặc quản lý',
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    timestamp: new Date().toISOString()
  });
};

// API có kiểm tra quyền truy cập restaurant cụ thể
export const restaurantSpecificApiController = async (req: AuthenticatedRequest, res: Response) => {
  const { restaurantId } = req.params;
  
  res.json({
    message: `Restaurant Specific API - truy cập restaurant ${restaurantId}`,
    user: {
      id: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      restaurant_context: req.user?.restaurant_context
    },
    restaurant_id: restaurantId,
    timestamp: new Date().toISOString()
  });
};

// API hiển thị thông tin user đầy đủ từ Clerk sync
export const userProfileApiController = async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'User Profile - thông tin user đầy đủ từ Clerk',
    user: req.user,
    clerk_sync_info: {
      all_clerk_attributes_synced: true,
      includes: [
        'email', 'username', 'first_name', 'last_name', 'full_name',
        'avatar_url', 'phone_number', 'phone_code', 'date_of_birth',
        'gender', 'email_verified_at', 'phone_verified_at'
      ]
    },
    timestamp: new Date().toISOString()
  });
};
