# 🏢 Restaurant Staff & Organization Sync Strategy

## 🎯 Problem Analysis

**Clerk Limitations:**
- Free plan: 5 members per organization
- Paid plan: More members but costly for large restaurant chains
- Not suitable for managing 50+ restaurant staff

**Restaurant Reality:**
- 1 Organization = Multiple restaurants
- 1 Restaurant = 10-50+ staff members
- Need flexible role management

## 🔄 Hybrid Sync Solution

### Level 1: Clerk Organizations (Business Level)
```
Clerk Organization
├── Owner (Business owner)
├── Manager 1 (Chain manager)
├── Manager 2 (Operations manager)
├── Admin (IT admin)
└── Accountant (Financial access)
```

### Level 2: Database Staff Management (Operational Level)
```
Database Organization
├── restaurants[]
    ├── restaurant_staffs[] (All staff)
    │   ├── chef, waiter, cashier, cleaner...
    │   └── supervisor, shift_manager...
    └── staff_schedules[]
```

## 📋 Implementation Strategy

### 1. Clerk Webhook for High-Level Changes
```javascript
// Only sync organization-level changes
if (event.type === 'organization.created') {
  // Create database organization
  // Set owner_id from Clerk
}

if (event.type === 'organizationMembership.created') {
  // Only for managers/admins
  // Update user role to 'manager' or 'admin'
}
```

### 2. Database-Only Staff Management
```javascript
// Restaurant staff operations
- Add staff → Direct database insert
- Staff scheduling → Database only
- Daily operations → Database only
- Payroll → Database only
```

### 3. Authentication Strategy
```javascript
// Check access level
function checkRestaurantAccess(userId, restaurantId) {
  // 1. Check if user is Clerk org member (high-level access)
  const clerkAccess = await checkClerkOrgMembership(userId);
  
  // 2. Check if user is restaurant staff (operational access)
  const staffAccess = await checkRestaurantStaff(userId, restaurantId);
  
  return clerkAccess || staffAccess;
}
```

## 🏗️ Database Schema Alignment

### Users Table Roles
```prisma
enum user_role_enum {
  customer        // Regular customers
  staff          // Restaurant operational staff (DB only)
  manager        // Restaurant/chain managers (Clerk + DB)
  admin          // Organization admins (Clerk + DB)
  super_admin    // System admins (Clerk + DB)
}
```

### Staff Assignment Pattern
```prisma
// This table handles operational staff
model restaurant_staffs {
  user_id       String  // Links to users table
  restaurant_id String  // Which restaurant
  role          restaurant_staff_role_enum  // Operational roles
  status        staff_status_enum
  
  // These are NOT synced to Clerk
  // Managed purely in database
}

enum restaurant_staff_role_enum {
  staff, supervisor, chef, waiter, cashier, host, cleaner, security
}
```

## 🔐 RLS Policy Updates

### Modified Access Control
```sql
-- Organization owners (via Clerk)
CREATE FUNCTION is_organization_owner(org_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organizations o
    JOIN users u ON u.id = o.owner_id
    WHERE o.id = org_id 
    AND u.clerk_id = user_clerk_id
    AND u.role IN ('admin', 'super_admin', 'manager')
  );
END;

-- Restaurant staff (database only)
CREATE FUNCTION is_restaurant_staff(restaurant_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurant_staffs rs
    JOIN users u ON u.id = rs.user_id
    WHERE rs.restaurant_id = restaurant_id
    AND u.clerk_id = user_clerk_id
    AND rs.status = 'active'
  );
END;

-- Combined access check
CREATE FUNCTION has_restaurant_access(restaurant_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check both organization ownership AND staff membership
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = restaurant_id
      AND (
        is_organization_owner(r.organization_id, user_clerk_id) OR
        is_restaurant_staff(restaurant_id, user_clerk_id)
      )
    )
  );
END;
```

## 🚀 Practical Implementation

### 1. Organization Setup (Clerk + DB)
```javascript
// When creating restaurant chain
async function createRestaurantChain(clerkOrgId, ownerData) {
  // 1. Create in database
  const organization = await prisma.organizations.create({
    data: {
      name: clerkOrgData.name,
      owner_id: ownerData.id,
      clerk_org_id: clerkOrgId  // Link to Clerk
    }
  });
  
  // 2. Create restaurants under this org
  // 3. Owner automatically has full access
}
```

### 2. Staff Management (DB Only)
```javascript
// Add restaurant staff (no Clerk sync needed)
async function addRestaurantStaff(restaurantId, staffData) {
  // 1. Create user account (if new)
  const user = await prisma.users.create({
    data: {
      ...staffData,
      role: 'staff',  // Database role only
      clerk_id: null  // No Clerk account needed
    }
  });
  
  // 2. Assign to restaurant
  await prisma.restaurant_staffs.create({
    data: {
      user_id: user.id,
      restaurant_id: restaurantId,
      role: 'waiter',  // Operational role
      status: 'active'
    }
  });
}
```

### 3. Authentication Flow
```javascript
// Staff login (simple email/password)
async function staffLogin(email, password) {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { restaurant_staffs: true }
  });
  
  // Generate JWT with restaurant access
  const token = jwt.sign({
    user_id: user.id,
    role: user.role,
    restaurants: user.restaurant_staffs.map(rs => rs.restaurant_id)
  });
}

// Manager login (Clerk + Database)
async function managerLogin(clerkUserId) {
  // Get both Clerk org access + database staff access
}
```

## ✅ Benefits of This Approach

1. **Cost Effective**: Only key personnel in Clerk orgs
2. **Scalable**: Unlimited staff in database
3. **Flexible**: Different access levels for different roles
4. **Secure**: Proper RLS for all access patterns
5. **Practical**: Matches real restaurant operations

## 📝 Next Steps

1. Update RLS policies for hybrid access
2. Create staff management endpoints (database only)
3. Implement separate auth flows for staff vs managers
4. Test access patterns for different user types

This way bạn có thể có 1000+ staff members mà chỉ cần 5 Clerk memberships cho management!
