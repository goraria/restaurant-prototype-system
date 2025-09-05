import express from 'express';
import { ClerkRoleSyncService } from '../services/roleServices';

const router = express.Router();

// Sync single user role from Clerk to database
router.post('/sync-user-role', async (req, res) => {
  try {
    const { clerkUserId, organizationId } = req.body;
    
    if (!clerkUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'clerkUserId is required' 
      });
    }

    const result = await ClerkRoleSyncService.syncUserRoleFromClerk(
      clerkUserId, 
      organizationId
    );

    res.json(result);
  } catch (error) {
    console.error('Sync user role error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Sync all organization members' roles
router.post('/sync-organization-roles', async (req, res) => {
  try {
    const { organizationId, requesterClerkUserId } = req.body;
    
    if (!organizationId) {
      return res.status(400).json({ 
        success: false, 
        error: 'organizationId is required' 
      });
    }

    // Verify requester has admin access to organization
    if (requesterClerkUserId) {
      const hasAccess = await ClerkRoleSyncService.hasRequiredRole(
        requesterClerkUserId, 
        organizationId, 
        'admin'
      );
      
      if (!hasAccess) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }
    }

    const result = await ClerkRoleSyncService.syncOrganizationMembersRoles(organizationId);
    res.json(result);
  } catch (error) {
    console.error('Sync organization roles error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get user's organization memberships and roles
router.get('/user/:clerkUserId/organizations', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const memberships = await ClerkRoleSyncService.getUserOrganizationMemberships(clerkUserId);
    
    res.json({ 
      success: true, 
      memberships 
    });
  } catch (error) {
    console.error('Get user organizations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get role mapping configuration
router.get('/role-mapping', async (req, res) => {
  try {
    const mapping = ClerkRoleSyncService.getRoleMapping();
    
    res.json({ 
      success: true, 
      mapping 
    });
  } catch (error) {
    console.error('Get role mapping error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Update role mapping (admin only)
router.put('/role-mapping', async (req, res) => {
  try {
    const { newMapping, requesterClerkUserId, organizationId } = req.body;
    
    // Verify requester is admin
    if (requesterClerkUserId && organizationId) {
      const hasAccess = await ClerkRoleSyncService.hasRequiredRole(
        requesterClerkUserId, 
        organizationId, 
        'admin'
      );
      
      if (!hasAccess) {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }
    }

    ClerkRoleSyncService.updateRoleMapping(newMapping);
    
    res.json({ 
      success: true, 
      message: 'Role mapping updated',
      mapping: ClerkRoleSyncService.getRoleMapping()
    });
  } catch (error) {
    console.error('Update role mapping error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Check user role in organization
router.get('/user/:clerkUserId/organization/:organizationId/role', async (req, res) => {
  try {
    const { clerkUserId, organizationId } = req.params;
    
    const clerkRole = await ClerkRoleSyncService.getClerkOrganizationRole(
      clerkUserId, 
      organizationId
    );
    
    if (!clerkRole) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found in organization' 
      });
    }

    const mapping = ClerkRoleSyncService.getRoleMapping();
    const prismaRole = mapping[clerkRole.role] || 'customer';
    
    res.json({ 
      success: true, 
      clerkRole: clerkRole.role,
      prismaRole,
      permissions: clerkRole.permissions
    });
  } catch (error) {
    console.error('Get user role error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Webhook endpoint for Clerk organization membership changes
router.post('/webhook/organization-membership', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Verify webhook signature here if needed
    // const signature = req.headers['clerk-webhook-signature'];
    // if (!verifyWebhookSignature(signature, req.body)) {
    //   return res.status(400).json({ error: 'Invalid signature' });
    // }

    const result = await ClerkRoleSyncService.handleOrganizationMembershipChange({
      type,
      object: data
    });

    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Middleware to auto-sync role before processing requests
export const autoSyncRoleMiddleware = async (req: any, res: any, next: any) => {
  try {
    const { clerkUserId, organizationId } = req.body || req.query;
    
    if (clerkUserId && organizationId) {
      // Auto-sync user role in background
      ClerkRoleSyncService.syncUserRoleFromClerk(clerkUserId, organizationId)
        .catch(error => console.error('Auto-sync role error:', error));
    }
    
    next();
  } catch (error) {
    console.error('Auto-sync middleware error:', error);
    next(); // Continue anyway
  }
};

export default router;
