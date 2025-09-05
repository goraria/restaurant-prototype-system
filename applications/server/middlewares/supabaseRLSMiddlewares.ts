import { Request, Response, NextFunction } from 'express';
import { rlsManager } from '../services/rlsManagers';

/**
 * 🔐 Supabase RLS Middleware
 * Adds Clerk authentication context to Supabase requests
 */

// Extend Request interface to include supabase client
declare global {
  namespace Express {
    interface Request {
      supabase?: any;
      clerkUserId?: string;
      clerkJWT?: string;
    }
  }
}

/**
 * 🔑 Add authenticated Supabase client to request
 * Uses Clerk JWT token for RLS context
 */
export const addSupabaseRLS = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Extract Clerk JWT from Authorization header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const clerkJWT = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Add Clerk JWT to request for later use
      req.clerkJWT = clerkJWT;
      
      // Create authenticated Supabase client with RLS context
      req.supabase = rlsManager.createAuthenticatedClient(clerkJWT);
      
      // Extract Clerk user ID from JWT for convenience
      try {
        const payload = JSON.parse(atob(clerkJWT.split('.')[1]));
        req.clerkUserId = payload.sub;
      } catch (error) {
        console.warn('⚠️ Could not parse Clerk JWT payload:', error);
      }
      
      console.log('✅ Added Supabase RLS context for user:', req.clerkUserId);
    } else {
      // No auth header - use anonymous Supabase client
      req.supabase = rlsManager.createAuthenticatedClient('');
      console.log('👤 Using anonymous Supabase client');
    }
    
    next();
  } catch (error) {
    console.error('❌ Error adding Supabase RLS context:', error);
    
    // Continue with anonymous client on error
    req.supabase = rlsManager.createAuthenticatedClient('');
    next();
  }
};

/**
 * 🔒 Require authenticated Supabase client
 * Ensures user is authenticated before accessing protected resources
 */
export const requireSupabaseAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (!req.clerkUserId || !req.clerkJWT) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Valid Clerk JWT token required for this endpoint'
    });
    return;
  }
  
  next();
};

/**
 * 🛡️ Check user role for admin operations
 */
export const requireAdminRole = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.supabase || !req.clerkUserId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Valid authentication required for admin operations'
      });
      return;
    }
    
    // Check user role in database
    const { data: user, error } = await req.supabase
      .from('users')
      .select('role')
      .eq('clerk_id', req.clerkUserId)
      .single();
    
    if (error || !user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User profile not found in database'
      });
      return;
    }
    
    if (!['admin', 'super_admin', 'owner'].includes(user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'Admin role required for this operation'
      });
      return;
    }
    
    next();
  } catch (error) {
    console.error('❌ Error checking admin role:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify user permissions'
    });
  }
};

/**
 * 🏢 Check organization membership
 */
export const requireOrganizationMember = (organizationField: string = 'organizationId') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.supabase || !req.clerkUserId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }
      
      const organizationId = req.params[organizationField] || req.body[organizationField];
      
      if (!organizationId) {
        res.status(400).json({
          success: false,
          error: 'Organization ID required'
        });
        return;
      }
      
      // Check if user is member of organization
      const { data: membership, error } = await req.supabase
        .rpc('is_organization_member', {
          org_id: organizationId
        });
      
      if (error || !membership) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You are not a member of this organization'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('❌ Error checking organization membership:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

/**
 * 🍽️ Check restaurant staff access
 */
export const requireRestaurantStaff = (restaurantField: string = 'restaurantId') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.supabase || !req.clerkUserId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }
      
      const restaurantId = req.params[restaurantField] || req.body[restaurantField];
      
      if (!restaurantId) {
        res.status(400).json({
          success: false,
          error: 'Restaurant ID required'
        });
        return;
      }
      
      // Get current user ID
      const { data: user } = await req.supabase
        .from('users')
        .select('id')
        .eq('clerk_id', req.clerkUserId)
        .single();
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      // Check if user is staff of restaurant
      const { data: staffMember, error } = await req.supabase
        .from('restaurant_staffs')
        .select('role')
        .eq('restaurant_id', restaurantId)
        .eq('user_id', user.id)
        .single();
      
      if (error || !staffMember) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You are not a staff member of this restaurant'
        });
        return;
      }
      
      // Add staff role to request for further use
      req.body.staffRole = staffMember.role;
      
      next();
    } catch (error) {
      console.error('❌ Error checking restaurant staff access:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

/**
 * 🔍 Debug RLS context
 * Use for testing RLS policies
 */
export const debugRLSContext = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.log('🔍 RLS Debug Context:', {
    clerkUserId: req.clerkUserId,
    hasSupabaseClient: !!req.supabase,
    hasJWT: !!req.clerkJWT,
    userAgent: req.get('User-Agent'),
    endpoint: `${req.method} ${req.path}`
  });
  
  next();
};
