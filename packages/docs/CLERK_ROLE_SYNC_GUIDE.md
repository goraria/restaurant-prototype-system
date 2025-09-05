# Clerk Organization Role Sync Guide

## Overview
Hệ thống này tự động đồng bộ roles từ Clerk Organizations sang Prisma database, cho phép quản lý permissions thống nhất.

## Role Mapping

### Clerk → Prisma Role Mapping
```typescript
{
  // Clerk default roles
  'org:admin': 'admin',           // Organization admin → Database admin
  'org:member': 'manager',        // Organization member → Database manager
  
  // Custom organization roles
  'restaurant_owner': 'admin',    // Restaurant owner → Database admin
  'restaurant_manager': 'manager', // Restaurant manager → Database manager
  'area_manager': 'manager',      // Area manager → Database manager
  'supervisor': 'staff',          // Supervisor → Database staff
  'staff': 'staff',               // Staff → Database staff
  
  // System roles
  'super_admin': 'super_admin',   // Super admin → Database super_admin
  'admin': 'admin'                // Admin → Database admin
}
```

### Prisma User Role Hierarchy
```
customer < staff < manager < admin < super_admin
```

## API Endpoints

### 1. Sync Single User Role
```http
POST /api/clerk-role-sync/sync-user-role
Content-Type: application/json

{
  "clerkUserId": "user_clerk123",
  "organizationId": "org_456" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {...},
  "clerkRole": "org:admin",
  "prismaRole": "admin",
  "organizationId": "org_456"
}
```

### 2. Sync All Organization Members
```http
POST /api/clerk-role-sync/sync-organization-roles
Content-Type: application/json

{
  "organizationId": "org_456",
  "requesterClerkUserId": "user_admin123" // for permission check
}
```

### 3. Get User's Organization Memberships
```http
GET /api/clerk-role-sync/user/{clerkUserId}/organizations
```

**Response:**
```json
{
  "success": true,
  "memberships": [
    {
      "organizationId": "org_456",
      "organizationName": "Pizza Palace Chain",
      "role": "org:admin",
      "permissions": [...]
    }
  ]
}
```

### 4. Check User Role in Organization
```http
GET /api/clerk-role-sync/user/{clerkUserId}/organization/{organizationId}/role
```

**Response:**
```json
{
  "success": true,
  "clerkRole": "org:admin",
  "prismaRole": "admin",
  "permissions": [...]
}
```

### 5. Get/Update Role Mapping
```http
GET /api/clerk-role-sync/role-mapping
PUT /api/clerk-role-sync/role-mapping
```

## Integration Examples

### Frontend - Auto Role Sync on Login
```typescript
import { useAuth, useOrganization } from '@clerk/nextjs';

const useAutoRoleSync = () => {
  const { userId } = useAuth();
  const { organization } = useOrganization();

  useEffect(() => {
    if (userId && organization) {
      // Auto-sync user role when organization context changes
      fetch('/api/clerk-role-sync/sync-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: userId,
          organizationId: organization.id
        })
      }).then(response => response.json())
        .then(result => {
          console.log('Role synced:', result.prismaRole);
        });
    }
  }, [userId, organization?.id]);
};

// Use in your app component
const App = () => {
  useAutoRoleSync();
  return <div>Your app content</div>;
};
```

### Backend - Role-Based Access Control
```typescript
import { ClerkRoleSyncService } from '../services/clerkRoleSyncService';

// Middleware to check required role
export const requireRole = (requiredRole: user_role_enum) => {
  return async (req: any, res: any, next: any) => {
    const { clerkUserId, organizationId } = req.body || req.query;
    
    if (!clerkUserId || !organizationId) {
      return res.status(400).json({ error: 'Missing auth parameters' });
    }

    const hasAccess = await ClerkRoleSyncService.hasRequiredRole(
      clerkUserId,
      organizationId,
      requiredRole
    );

    if (!hasAccess) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage in routes
router.post('/admin-only-action', requireRole('admin'), async (req, res) => {
  // Only admin and super_admin can access this
});

router.post('/manager-action', requireRole('manager'), async (req, res) => {
  // Manager, admin, and super_admin can access this
});
```

### Webhook Integration
```typescript
// Set up webhook in Clerk Dashboard:
// Events: organizationMembership.created, organizationMembership.updated, organizationMembership.deleted
// Endpoint: https://yourapp.com/api/clerk-role-sync/webhook/organization-membership

router.post('/webhook/organization-membership', async (req, res) => {
  const { type, data } = req.body;
  
  // Auto-sync roles when organization membership changes
  const result = await ClerkRoleSyncService.handleOrganizationMembershipChange({
    type,
    object: data
  });

  res.json(result);
});
```

## Automatic Sync Scenarios

### 1. User Login Auto-Sync
```typescript
// In your hybrid auth service
const clerkAuth = await HybridAuthService.authenticateClerkUser(
  clerkUserId, 
  organizationId // Auto-syncs role when provided
);
```

### 2. Organization Context Change
```typescript
// Auto-sync when user switches organizations
const switchOrganization = async (newOrgId: string) => {
  await ClerkRoleSyncService.syncUserRoleFromClerk(userId, newOrgId);
  // Update user context
};
```

### 3. Webhook Auto-Sync
- User joins organization → Role auto-assigned
- User role updated → Database role updated
- User leaves organization → Role reset to 'customer'

## Custom Role Configuration

### Dynamic Role Mapping Update
```typescript
// Update role mapping at runtime
ClerkRoleSyncService.updateRoleMapping({
  'custom_role': 'manager',
  'new_role': 'staff'
});

// Or via API
fetch('/api/clerk-role-sync/role-mapping', {
  method: 'PUT',
  body: JSON.stringify({
    newMapping: {
      'custom_role': 'manager'
    },
    requesterClerkUserId: adminUserId,
    organizationId: orgId
  })
});
```

### Organization-Specific Roles
```typescript
// Create custom roles in Clerk Dashboard
// Then map them in your application
const customMapping = {
  'pizza_chef': 'staff',
  'head_chef': 'manager',
  'kitchen_manager': 'manager',
  'restaurant_owner': 'admin'
};
```

## Best Practices

### 1. **Immediate Sync on Critical Actions**
```typescript
// Sync before important operations
await ClerkRoleSyncService.syncUserRoleFromClerk(userId, orgId);
const hasAccess = await ClerkRoleSyncService.hasRequiredRole(userId, orgId, 'admin');
```

### 2. **Background Sync for Performance**
```typescript
// Non-blocking background sync
ClerkRoleSyncService.syncUserRoleFromClerk(userId, orgId)
  .catch(error => console.error('Background sync failed:', error));
```

### 3. **Batch Organization Sync**
```typescript
// Sync all members periodically (cron job)
const syncAllOrganizations = async () => {
  const orgs = await getActiveOrganizations();
  for (const org of orgs) {
    await ClerkRoleSyncService.syncOrganizationMembersRoles(org.id);
  }
};
```

### 4. **Error Handling**
```typescript
const syncWithFallback = async (userId: string, orgId: string) => {
  const result = await ClerkRoleSyncService.syncUserRoleFromClerk(userId, orgId);
  
  if (!result.success) {
    // Fallback to default role or cached role
    console.warn('Role sync failed, using fallback');
    return { role: 'customer', source: 'fallback' };
  }
  
  return { role: result.prismaRole, source: 'clerk' };
};
```

## Troubleshooting

### Common Issues
1. **Role Not Syncing**: Check Clerk organization membership
2. **Permission Denied**: Verify role hierarchy and mapping
3. **Webhook Delays**: Implement manual sync buttons for immediate updates
4. **Missing Roles**: Update role mapping configuration

### Debug Mode
```typescript
// Enable debug logging
process.env.DEBUG_ROLE_SYNC = 'true';

// Manual role check
const debugRole = await ClerkRoleSyncService.getClerkOrganizationRole(userId, orgId);
console.log('Current Clerk role:', debugRole);
```

Hệ thống này đảm bảo roles luôn được đồng bộ giữa Clerk và database, supporting cả automatic sync và manual control! 🎯
