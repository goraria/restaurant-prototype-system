import { Request, Response, NextFunction } from 'express';
import { clerkConfigClient } from '@/config/clerk';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/types/auth';
import { user_role_enum } from '@prisma/client';
import { verifyToken } from '@clerk/backend';

const prisma = new PrismaClient();

/**
 * Clerk Authentication Middleware
 * Đồng bộ tất cả thuộc tính từ Clerk
 */
export const clerkAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No valid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Clerk - sử dụng @clerk/backend verifyToken
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!
      });
      
      if (!payload || !payload.sub) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      // Get user from Clerk
      const clerkUser = await clerkConfigClient.users.getUser(payload.sub);
      if (!clerkUser) {
        res.status(401).json({ error: 'User not found in Clerk' });
        return;
      }

      // Find or sync user in local database
      let dbUser = await prisma.users.findUnique({
        where: { clerk_id: clerkUser.id }
      });

      if (!dbUser) {
        // Auto-sync user if not exists - đồng bộ tất cả thuộc tính từ Clerk
        dbUser = await prisma.users.create({
          data: {
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || '',
            first_name: clerkUser.firstName || '',
            last_name: clerkUser.lastName || '',
            full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            avatar_url: clerkUser.imageUrl,
            phone_number: clerkUser.phoneNumbers[0]?.phoneNumber,
            phone_code: clerkUser.phoneNumbers[0]?.phoneNumber?.split(' ')[0] || null,
            // Sử dụng publicMetadata cho các thuộc tính mở rộng
            date_of_birth: clerkUser.publicMetadata?.dateOfBirth ? new Date(clerkUser.publicMetadata.dateOfBirth as string) : null,
            gender: clerkUser.publicMetadata?.gender as string || null,
            role: 'customer', // Default role
            status: 'active',
            email_verified_at: clerkUser.emailAddresses[0]?.verification?.status === 'verified' 
              ? new Date() : null,
            phone_verified_at: clerkUser.phoneNumbers[0]?.verification?.status === 'verified' 
              ? new Date() : null
          }
        });
      } else {
        // Update existing user with latest Clerk data
        dbUser = await prisma.users.update({
          where: { id: dbUser.id },
          data: {
            email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email,
            first_name: clerkUser.firstName || dbUser.first_name,
            last_name: clerkUser.lastName || dbUser.last_name,
            full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || dbUser.full_name,
            avatar_url: clerkUser.imageUrl || dbUser.avatar_url,
            phone_number: clerkUser.phoneNumbers[0]?.phoneNumber || dbUser.phone_number,
            phone_code: clerkUser.phoneNumbers[0]?.phoneNumber?.split(' ')[0] || dbUser.phone_code,
            date_of_birth: clerkUser.publicMetadata?.dateOfBirth ? new Date(clerkUser.publicMetadata.dateOfBirth as string) : dbUser.date_of_birth,
            gender: clerkUser.publicMetadata?.gender as string || dbUser.gender,
            email_verified_at: clerkUser.emailAddresses[0]?.verification?.status === 'verified' 
              ? new Date() : dbUser.email_verified_at,
            phone_verified_at: clerkUser.phoneNumbers[0]?.verification?.status === 'verified' 
              ? new Date() : dbUser.phone_verified_at,
            updated_at: new Date()
          }
        });
      }

      // Get restaurant context for staff/manager/admin
      let restaurantContext = null;
      if (['staff', 'manager', 'admin'].includes(dbUser.role)) {
        const staffAssignment = await prisma.restaurant_staffs.findFirst({
          where: { 
            user_id: dbUser.id,
            status: 'active'
          },
          include: {
            restaurants: true
          }
        });
        
        if (staffAssignment) {
          restaurantContext = {
            restaurant_id: staffAssignment.restaurant_id,
            restaurant_name: staffAssignment.restaurants.name,
            staff_role: staffAssignment.role
          };
        }
      }

      // Attach user data to request
      req.user = {
        id: dbUser.id,
        clerk_id: dbUser.clerk_id,
        email: dbUser.email,
        username: dbUser.username,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        full_name: dbUser.full_name,
        avatar_url: dbUser.avatar_url,
        phone_number: dbUser.phone_number,
        phone_code: dbUser.phone_code,
        date_of_birth: dbUser.date_of_birth,
        gender: dbUser.gender,
        role: dbUser.role,
        status: dbUser.status,
        total_orders: dbUser.total_orders,
        total_spent: dbUser.total_spent,
        loyalty_points: dbUser.loyalty_points,
        email_verified_at: dbUser.email_verified_at,
        phone_verified_at: dbUser.phone_verified_at,
        restaurant_context: restaurantContext
      };

      next();
    } catch (clerkError) {
      console.error('Clerk verification error:', clerkError);
      res.status(401).json({ error: 'Invalid Clerk token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Role-based Authentication Middleware
 * @param allowedRoles - Array of allowed roles or single role
 */
export const requireAuth = (allowedRoles?: user_role_enum | user_role_enum[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // First run the basic auth middleware
    try {
      await new Promise<void>((resolve, reject) => {
        clerkAuthMiddleware(req, res, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    } catch {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // If no roles specified, just require authentication
    if (!allowedRoles) {
      next();
      return;
    }

    // Check role permissions
    const userRole = req.user?.role;
    if (!userRole) {
      res.status(401).json({ error: 'User role not found' });
      return;
    }

    // Convert single role to array for uniform handling
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Admin và super_admin có quyền truy cập tất cả
    if (userRole === 'admin' || userRole === 'super_admin') {
      next();
      return;
    }

    // Check if user role is in allowed roles
    if (!rolesArray.includes(userRole)) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required_roles: rolesArray,
        user_role: userRole
      });
      return;
    }

    next();
  };
};

/**
 * Specific role middlewares for convenience
 */
export const requireCustomer = requireAuth('customer');
export const requireStaff = requireAuth(['staff', 'manager', 'admin']);
export const requireManager = requireAuth(['manager', 'admin']);
export const requireAdmin = requireAuth(['admin', 'super_admin']);

/**
 * Multi-role middlewares - API cho phép nhiều role
 */
export const requireCustomerOrStaff = requireAuth(['customer', 'staff', 'manager', 'admin']);
export const requireStaffOrManager = requireAuth(['staff', 'manager', 'admin']);
export const requireManagerOrAdmin = requireAuth(['manager', 'admin']);

/**
 * Restaurant context middleware - yêu cầu staff làm việc trong restaurant cụ thể
 */
export const requireRestaurantAccess = (restaurantIdParam: string = 'restaurantId') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Admin có quyền truy cập tất cả restaurants
    if (user.role === 'admin' || user.role === 'super_admin') {
      next();
      return;
    }

    // Get restaurant ID from request params
    const requestedRestaurantId = req.params[restaurantIdParam];
    if (!requestedRestaurantId) {
      res.status(400).json({ error: 'Restaurant ID required' });
      return;
    }

    // Check if staff has access to this restaurant
    if (['staff', 'manager'].includes(user.role)) {
      if (!user.restaurant_context || user.restaurant_context.restaurant_id !== requestedRestaurantId) {
        res.status(403).json({ error: 'Access denied to this restaurant' });
        return;
      }
    }

    next();
  };
};

/**
 * Legacy middleware for backward compatibility
 */
export const requireAuthentication = requireAuth();

/**
 * Verify token and get user (utility function)
 */
export const verifyTokenAndGetUser = async (token: string) => {
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!
    });
    
    if (!payload?.sub) return null;

    const clerkUser = await clerkConfigClient.users.getUser(payload.sub);
    if (!clerkUser) return null;

    const dbUser = await prisma.users.findUnique({
      where: { clerk_id: clerkUser.id }
    });

    return dbUser;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};
