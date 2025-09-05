-- ================================
-- 🔐 SUPABASE RLS POLICIES (MINIMAL)
-- for Users & Organizations only
-- No status field dependency
-- ================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- ================================
-- 🎯 UTILITY FUNCTIONS (MINIMAL)
-- ================================

-- Function to get current Clerk user ID from JWT
CREATE OR REPLACE FUNCTION get_current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Extract clerk user ID from auth.jwt() claims
  RETURN COALESCE(
    auth.jwt() ->> 'sub',  -- Clerk user ID is in 'sub' claim
    (auth.jwt() ->> 'clerk_user_id')  -- Fallback
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin (minimal version)
CREATE OR REPLACE FUNCTION is_admin_user_minimal(user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE clerk_id = user_clerk_id 
    AND (
      role = 'admin' OR 
      role = 'super_admin' OR
      role LIKE '%admin%'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns organization (minimal)
CREATE OR REPLACE FUNCTION is_organization_owner_minimal(org_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organizations o
    JOIN users u ON u.id = o.owner_id
    WHERE o.id = org_id 
    AND u.clerk_id = user_clerk_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 👥 USERS TABLE POLICIES (MINIMAL)
-- ================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_insert_webhook" ON users;
DROP POLICY IF EXISTS "users_delete_own" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;

-- Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (
    clerk_id = get_current_clerk_user_id()
  );

-- Admins can view all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (
    clerk_id = get_current_clerk_user_id()
  );

-- Admins can update any user
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- Allow inserting new users (from webhooks)
CREATE POLICY "users_insert_webhook" ON users
  FOR INSERT WITH CHECK (true);

-- Users can delete their own account
CREATE POLICY "users_delete_own" ON users
  FOR DELETE USING (
    clerk_id = get_current_clerk_user_id()
  );

-- Admins can delete any user
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- ================================
-- 🏢 ORGANIZATIONS TABLE POLICIES (MINIMAL)
-- ================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "organizations_select_public" ON organizations;
DROP POLICY IF EXISTS "organizations_select_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_select_admin" ON organizations;
DROP POLICY IF EXISTS "organizations_insert_auth" ON organizations;
DROP POLICY IF EXISTS "organizations_update_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_update_admin" ON organizations;
DROP POLICY IF EXISTS "organizations_delete_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_delete_admin" ON organizations;

-- Public read access to basic organization info
CREATE POLICY "organizations_select_public" ON organizations
  FOR SELECT USING (true);

-- Organization owners can view full details
CREATE POLICY "organizations_select_owners" ON organizations
  FOR SELECT USING (
    is_organization_owner_minimal(id, get_current_clerk_user_id())
  );

-- Admins can view all organizations
CREATE POLICY "organizations_select_admin" ON organizations
  FOR SELECT USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- Only authenticated users can create organizations
CREATE POLICY "organizations_insert_auth" ON organizations
  FOR INSERT WITH CHECK (
    get_current_clerk_user_id() IS NOT NULL
  );

-- Organization owners can update their organizations
CREATE POLICY "organizations_update_owners" ON organizations
  FOR UPDATE USING (
    is_organization_owner_minimal(id, get_current_clerk_user_id())
  );

-- System admins can update any organization
CREATE POLICY "organizations_update_admin" ON organizations
  FOR UPDATE USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- Organization owners can delete their organizations
CREATE POLICY "organizations_delete_owners" ON organizations
  FOR DELETE USING (
    is_organization_owner_minimal(id, get_current_clerk_user_id())
  );

-- System admins can delete any organization
CREATE POLICY "organizations_delete_admin" ON organizations
  FOR DELETE USING (
    is_admin_user_minimal(get_current_clerk_user_id())
  );

-- ================================
-- 🔧 TESTING & DEBUG FUNCTIONS
-- ================================

-- Function to test current user context
CREATE OR REPLACE FUNCTION test_rls_context_minimal()
RETURNS TABLE (
  current_clerk_id TEXT,
  is_admin BOOLEAN,
  jwt_claims JSONB
) AS $$
BEGIN
  RETURN QUERY SELECT 
    get_current_clerk_user_id(),
    is_admin_user_minimal(get_current_clerk_user_id()),
    auth.jwt();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check what columns exist in users table
CREATE OR REPLACE FUNCTION check_users_table_columns()
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT
) AS $$
BEGIN
  RETURN QUERY SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT
  FROM information_schema.columns c
  WHERE c.table_name = 'users'
  AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- ✅ VERIFICATION QUERIES
-- ================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'organizations')
AND schemaname = 'public';

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('users', 'organizations')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Check users table structure
SELECT check_users_table_columns();
