// ================================
// 🔄 CLERK SYNC MIDDLEWARE
// ================================

import { Request, Response, NextFunction } from 'express';
import { requireAuth as clerkRequireAuth, getAuth } from '@clerk/express';
import { syncClerkUserToDatabase, getUserByClerkId } from '@/utils/clerkSync';
import { DatabaseUser } from '@/constants/types';

// ================================
// 🔧 MIDDLEWARE: AUTO SYNC CLERK USER
// ================================

export async function clerkUserSyncMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Lấy thông tin user từ Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      // Không có user đăng nhập -> tiếp tục
      return next();
    }

    // Kiểm tra user đã tồn tại trong database chưa
    let user = await getUserByClerkId(userId);
    
    if (!user) {
      console.log('🔄 User not found in database, syncing from Clerk...');
      
      // TODO: Fetch full user data from Clerk API
      // Bạn cần implement logic này để lấy full user data
      // const clerkUser = await fetchClerkUser(userId);
      // user = await syncClerkUserToDatabase(clerkUser);
      
      console.log('⚠️ Please implement Clerk API fetch in middleware');
    }

    // Attach user vào request object
    (req as any).user = user;
    (req as any).clerkUserId = userId;

    next();
  } catch (error) {
    console.error('❌ Clerk sync middleware error:', error);
    // Không block request, chỉ log error
    next();
  }
}

// ================================
// 🎯 MIDDLEWARE: REQUIRE AUTHENTICATED USER
// ================================

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }

  (req as any).clerkUserId = userId;
  next();
}

// ================================
// 🛡️ MIDDLEWARE: REQUIRE SPECIFIC ROLE
// ================================

export function requireRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        });
      }

      const user = await getUserByClerkId(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required_roles: allowedRoles,
          user_role: user.role
        });
      }

      (req as any).user = user;
      (req as any).clerkUserId = userId;
      next();
    } catch (error) {
      console.error('❌ Role check middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}

// ================================
// 📊 MIDDLEWARE: ATTACH USER STATS
// ================================

export async function attachUserStats(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    
    if (user) {
      // Có thể thêm logic để attach statistics, recent orders, etc.
      const userWithStats = await getUserByClerkId(user.clerk_id);
      (req as any).user = userWithStats;
    }

    next();
  } catch (error) {
    console.error('❌ User stats middleware error:', error);
    next(); // Không block request
  }
}

// ================================
// 🔄 WEBHOOK MIDDLEWARE
// ================================

export function clerkWebhookMiddleware(req: Request, res: Response, next: NextFunction) {
  // Verify webhook signature (nếu cần)
  const signature = req.headers['clerk-signature'];
  
  if (!signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing webhook signature'
    });
  }

  // TODO: Implement signature verification
  // const isValid = verifyClerkWebhookSignature(req.body, signature);
  // if (!isValid) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Invalid webhook signature'
  //   });
  // }

  next();
}

export default {
  clerkUserSyncMiddleware,
  requireAuth,
  requireRole,
  attachUserStats,
  clerkWebhookMiddleware,
};
