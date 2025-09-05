-- ================================
-- 🔐 HYBRID RLS POLICIES 
-- Clerk Organizations + Database Staff
-- ================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staffs ENABLE ROW LEVEL SECURITY;

-- ================================
-- 🎯 UTILITY FUNCTIONS (HYBRID)
-- ================================

-- Function to get current Clerk user ID from JWT
CREATE OR REPLACE FUNCTION get_current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'sub',
    (auth.jwt() ->> 'clerk_user_id')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user ID from any auth source
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
  clerk_id TEXT;
  user_uuid UUID;
BEGIN
  -- Try Clerk first
  clerk_id := get_current_clerk_user_id();
  IF clerk_id IS NOT NULL THEN
    SELECT id INTO user_uuid FROM users WHERE clerk_id = clerk_id;
    IF user_uuid IS NOT NULL THEN
      RETURN user_uuid;
    END IF;
  END IF;
  
  -- Fallback to JWT user_id claim (for staff auth)
  RETURN (auth.jwt() ->> 'user_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organization owner/admin (Clerk level)
CREATE OR REPLACE FUNCTION is_organization_admin(org_id UUID, user_clerk_id TEXT)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is restaurant staff (Database level)
CREATE OR REPLACE FUNCTION is_restaurant_staff(restaurant_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurant_staffs rs
    WHERE rs.restaurant_id = restaurant_id
    AND rs.user_id = user_id
    AND rs.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check combined restaurant access
CREATE OR REPLACE FUNCTION has_restaurant_access(restaurant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  clerk_id TEXT;
BEGIN
  current_user_id := get_current_user_id();
  clerk_id := get_current_clerk_user_id();
  
  -- Check organization admin access (via Clerk)
  IF clerk_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = restaurant_id
      AND is_organization_admin(r.organization_id, clerk_id)
    ) THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Check staff access (via Database)
  IF current_user_id IS NOT NULL THEN
    RETURN is_restaurant_staff(restaurant_id, current_user_id);
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := get_current_user_id();
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = current_user_id 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 👥 USERS TABLE POLICIES
-- ================================

-- Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (
    id = get_current_user_id()
  );

-- System admins can view all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT USING (
    is_system_admin()
  );

-- Organization admins can view their organization's users
CREATE POLICY "users_select_org_admin" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_staffs rs
      JOIN restaurants r ON r.id = rs.restaurant_id
      WHERE rs.user_id = users.id
      AND is_organization_admin(r.organization_id, get_current_clerk_user_id())
    )
  );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (
    id = get_current_user_id()
  );

-- System admins can update any user
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (
    is_system_admin()
  );

-- Allow inserting new users (from webhooks and staff registration)
CREATE POLICY "users_insert_auth" ON users
  FOR INSERT WITH CHECK (true);

-- ================================
-- 🏢 ORGANIZATIONS TABLE POLICIES
-- ================================

-- Public read access to organizations
CREATE POLICY "organizations_select_public" ON organizations
  FOR SELECT USING (true);

-- Organization admins can update their organizations
CREATE POLICY "organizations_update_admin" ON organizations
  FOR UPDATE USING (
    is_organization_admin(id, get_current_clerk_user_id()) OR
    is_system_admin()
  );

-- Authenticated users can create organizations
CREATE POLICY "organizations_insert_auth" ON organizations
  FOR INSERT WITH CHECK (
    get_current_clerk_user_id() IS NOT NULL OR
    is_system_admin()
  );

-- ================================
-- 🏪 RESTAURANTS TABLE POLICIES
-- ================================

-- Public read access to active restaurants
CREATE POLICY "restaurants_select_public" ON restaurants
  FOR SELECT USING (
    status = 'active'
  );

-- Restaurant staff and org admins can view restaurant details
CREATE POLICY "restaurants_select_staff" ON restaurants
  FOR SELECT USING (
    has_restaurant_access(id) OR
    is_system_admin()
  );

-- Organization admins can update restaurants
CREATE POLICY "restaurants_update_admin" ON restaurants
  FOR UPDATE USING (
    is_organization_admin(organization_id, get_current_clerk_user_id()) OR
    is_system_admin()
  );

-- Organization admins can create restaurants
CREATE POLICY "restaurants_insert_admin" ON restaurants
  FOR INSERT WITH CHECK (
    is_organization_admin(organization_id, get_current_clerk_user_id()) OR
    is_system_admin()
  );

-- ================================
-- 👨‍💼 RESTAURANT STAFFS POLICIES
-- ================================

-- Staff can view their own assignments
CREATE POLICY "restaurant_staffs_select_own" ON restaurant_staffs
  FOR SELECT USING (
    user_id = get_current_user_id()
  );

-- Restaurant managers can view all staff in their restaurants
CREATE POLICY "restaurant_staffs_select_manager" ON restaurant_staffs
  FOR SELECT USING (
    has_restaurant_access(restaurant_id) OR
    is_system_admin()
  );

-- Organization admins can manage restaurant staff
CREATE POLICY "restaurant_staffs_insert_admin" ON restaurant_staffs
  FOR INSERT WITH CHECK (
    has_restaurant_access(restaurant_id) OR
    is_system_admin()
  );

CREATE POLICY "restaurant_staffs_update_admin" ON restaurant_staffs
  FOR UPDATE USING (
    has_restaurant_access(restaurant_id) OR
    is_system_admin()
  );

CREATE POLICY "restaurant_staffs_delete_admin" ON restaurant_staffs
  FOR DELETE USING (
    has_restaurant_access(restaurant_id) OR
    is_system_admin()
  );

-- ================================
-- 🔧 TESTING & DEBUG FUNCTIONS
-- ================================

-- Function to test current user context
CREATE OR REPLACE FUNCTION test_hybrid_auth_context()
RETURNS TABLE (
  current_user_id UUID,
  current_clerk_id TEXT,
  is_system_admin BOOLEAN,
  accessible_restaurants UUID[],
  jwt_claims JSONB
) AS $$
BEGIN
  RETURN QUERY SELECT 
    get_current_user_id(),
    get_current_clerk_user_id(),
    is_system_admin(),
    ARRAY(
      SELECT r.id FROM restaurants r 
      WHERE has_restaurant_access(r.id)
    ),
    auth.jwt();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- ✅ VERIFICATION QUERIES
-- ================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'organizations', 'restaurants', 'restaurant_staffs')
AND schemaname = 'public';

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('users', 'organizations', 'restaurants', 'restaurant_staffs')
AND schemaname = 'public'
ORDER BY tablename, policyname;
