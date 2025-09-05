import express from 'express';
import { HybridAuthService } from '../services/hybridServices';
import type { restaurant_staff_role_enum, staff_status_enum } from '@prisma/client';

const router = express.Router();

// Staff login (database-only authentication)
router.post('/staff/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const result = await HybridAuthService.authenticateStaffUser(email, password);
    
    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Create staff account (Clerk organization admins only)
router.post('/staff/create', async (req, res) => {
  try {
    const { clerkUserId, userData, restaurantId, role, hourlyRate } = req.body;
    
    // Verify Clerk user has permission to create staff
    const clerkAuthResult = await HybridAuthService.authenticateClerkUser(clerkUserId);
    if (!clerkAuthResult.success) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid Clerk user' 
      });
    }

    // Check if Clerk user can manage this restaurant
    const hasAccess = await HybridAuthService.hasRestaurantAccess(clerkUserId, restaurantId);
    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: No access to this restaurant' 
      });
    }

    const result = await HybridAuthService.createStaffUser(
      userData,
      restaurantId,
      role as restaurant_staff_role_enum,
      hourlyRate
    );

    res.json(result);
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get restaurant staff (for Clerk organization admins)
router.get('/restaurant/:restaurantId/staff', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { clerkUserId } = req.query;
    
    if (!clerkUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Clerk user ID is required' 
      });
    }

    // Verify Clerk user has permission
    const hasAccess = await HybridAuthService.hasRestaurantAccess(clerkUserId as string, restaurantId);
    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: No access to this restaurant' 
      });
    }

    const staffList = await HybridAuthService.getRestaurantStaff(restaurantId);
    res.json({ success: true, staff: staffList });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Update staff member
router.put('/staff/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const { clerkUserId, updates } = req.body;
    
    // Verify Clerk user has permission
    const clerkAuthResult = await HybridAuthService.authenticateClerkUser(clerkUserId);
    if (!clerkAuthResult.success) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid Clerk user' 
      });
    }

    // Get staff to check restaurant access
    const staff = await HybridAuthService.getStaffById(staffId);
    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        error: 'Staff member not found' 
      });
    }

    const hasAccess = await HybridAuthService.hasRestaurantAccess(
      clerkUserId, 
      staff.restaurant_staffs[0]?.restaurants.id
    );
    
    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: No access to this restaurant' 
      });
    }

    const result = await HybridAuthService.updateStaff(staffId, updates);
    res.json(result);
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Middleware to verify staff access for protected routes
export const verifyStaffAccess = async (req: any, res: any, next: any) => {
  try {
    const { staffToken } = req.headers;
    const { restaurantId } = req.params || req.body;
    
    if (!staffToken || !restaurantId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Staff token and restaurant ID required' 
      });
    }

    const hasAccess = await HybridAuthService.verifyStaffToken(staffToken as string);
    if (!hasAccess) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid staff token' 
      });
    }

    next();
  } catch (error) {
    console.error('Staff access verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

export default router;
