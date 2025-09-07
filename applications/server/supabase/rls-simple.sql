-- ================================
-- 🔐 SUPABASE RLS POLICIES 
-- for Users & Organizations with Clerk Sync
-- ================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_insert_webhook" ON users;
DROP POLICY IF EXISTS "users_delete_own" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;
DROP POLICY IF EXISTS "organizations_select_public" ON organizations;
DROP POLICY IF EXISTS "organizations_select_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_select_admin" ON organizations;
DROP POLICY IF EXISTS "organizations_insert_auth" ON organizations;
DROP POLICY IF EXISTS "organizations_update_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_update_admin" ON organizations;
DROP POLICY IF EXISTS "organizations_delete_owners" ON organizations;
DROP POLICY IF EXISTS "organizations_delete_admin" ON organizations;

-- Drop existing functions
DROP FUNCTION IF EXISTS get_current_clerk_user_id();
DROP FUNCTION IF EXISTS is_admin_user(TEXT);
DROP FUNCTION IF EXISTS is_organization_owner(UUID, TEXT);
DROP FUNCTION IF EXISTS test_rls_context();

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- ================================
-- 🎯 UTILITY FUNCTIONS
-- ================================

-- Function to get current Clerk user ID from JWT
CREATE OR REPLACE FUNCTION get_current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Extract clerk user ID from auth.jwt() claims
  RETURN COALESCE(
    auth.jwt() ->> 'sub',  -- Clerk user ID is in 'sub' claim
    (auth.jwt() ->> 'clerk_user_id'),  -- Fallback
    (auth.jwt() ->> 'user_id')  -- Another fallback
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's organizations from Clerk
CREATE OR REPLACE FUNCTION get_current_user_organizations()
RETURNS TEXT[] AS $$
BEGIN
  -- Extract organization IDs from Clerk JWT claims
  RETURN COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(auth.jwt() -> 'org_memberships')),
    ARRAY(SELECT jsonb_array_elements_text(auth.jwt() -> 'organizations')),
    '{}'::TEXT[]
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role in organization from Clerk
CREATE OR REPLACE FUNCTION get_user_org_role(org_slug TEXT)
RETURNS TEXT AS $$
DECLARE
  memberships JSONB;
  membership JSONB;
BEGIN
  -- Get organization memberships from JWT
  memberships := auth.jwt() -> 'org_memberships';
  
  IF memberships IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Find the organization and return role
  FOR membership IN SELECT jsonb_array_elements(memberships)
  LOOP
    IF membership ->> 'org_slug' = org_slug OR membership ->> 'org_id' = org_slug THEN
      RETURN membership ->> 'role';
    END IF;
  END LOOP;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin (in any organization or globally)
CREATE OR REPLACE FUNCTION is_admin_user(user_clerk_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id TEXT;
  user_role TEXT;
BEGIN
  current_user_id := COALESCE(user_clerk_id, get_current_clerk_user_id());
  
  -- Check if user has admin role in database
  SELECT role INTO user_role 
  FROM users 
  WHERE clerk_id = current_user_id 
  AND role IN ('admin', 'super_admin');
  
  IF user_role IS NOT NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has admin role in any organization (from Clerk)
  RETURN COALESCE(
    (auth.jwt() -> 'org_role') ? 'admin',
    (auth.jwt() -> 'org_role') ? 'org:admin',
    FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns organization
CREATE OR REPLACE FUNCTION is_organization_owner(org_id UUID, user_clerk_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id TEXT;
  org_slug TEXT;
  user_org_role TEXT;
BEGIN
  current_user_id := COALESCE(user_clerk_id, get_current_clerk_user_id());
  
  -- Check database ownership
  IF EXISTS (
    SELECT 1 FROM organizations o
    JOIN users u ON u.id = o.owner_id
    WHERE o.id = org_id 
    AND u.clerk_id = current_user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check Clerk organization role
  SELECT slug INTO org_slug FROM organizations WHERE id = org_id;
  IF org_slug IS NOT NULL THEN
    user_org_role := get_user_org_role(org_slug);
    RETURN user_org_role IN ('admin', 'owner', 'org:admin');
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is member of organization
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_clerk_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id TEXT;
  org_slug TEXT;
  user_org_role TEXT;
BEGIN
  current_user_id := COALESCE(user_clerk_id, get_current_clerk_user_id());
  
  -- Check Clerk organization membership
  SELECT slug INTO org_slug FROM organizations WHERE id = org_id;
  IF org_slug IS NOT NULL THEN
    user_org_role := get_user_org_role(org_slug);
    RETURN user_org_role IS NOT NULL;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 👥 USERS TABLE POLICIES
-- ================================

-- Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (
    clerk_id = get_current_clerk_user_id()
  );

-- Admins can view all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT USING (
    is_admin_user()
  );

-- Organization members can view other organization members
CREATE POLICY "users_select_org_members" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE is_organization_member(o.id) AND EXISTS (
        SELECT 1 FROM users u2 
        WHERE u2.clerk_id = get_current_clerk_user_id()
        AND is_organization_member(o.id, u2.clerk_id)
      )
    )
  );

-- Allow upsert from Clerk webhooks (service role)
CREATE POLICY "users_upsert_webhook" ON users
  FOR ALL USING (
    auth.role() = 'service_role' OR
    clerk_id = get_current_clerk_user_id()
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    clerk_id = get_current_clerk_user_id()
  );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (
    clerk_id = get_current_clerk_user_id()
  );

-- Admins can update any user
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (
    is_admin_user()
  );

-- ================================
-- 🏢 ORGANIZATIONS TABLE POLICIES
-- ================================

-- Public read access to basic organization info
CREATE POLICY "organizations_select_public" ON organizations
  FOR SELECT USING (true);

-- Organization members can view their organizations
CREATE POLICY "organizations_select_members" ON organizations
  FOR SELECT USING (
    is_organization_member(id)
  );

-- Allow upsert from Clerk webhooks (service role)
CREATE POLICY "organizations_upsert_webhook" ON organizations
  FOR ALL USING (
    auth.role() = 'service_role' OR
    is_organization_owner(id)
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    is_organization_owner(id) OR
    get_current_clerk_user_id() IS NOT NULL
  );

-- Organization owners can update their organizations
CREATE POLICY "organizations_update_owners" ON organizations
  FOR UPDATE USING (
    is_organization_owner(id)
  );

-- System admins can update any organization
CREATE POLICY "organizations_update_admin" ON organizations
  FOR UPDATE USING (
    is_admin_user()
  );

-- Organization owners can delete their organizations
CREATE POLICY "organizations_delete_owners" ON organizations
  FOR DELETE USING (
    is_organization_owner(id)
  );

-- System admins can delete any organization
CREATE POLICY "organizations_delete_admin" ON organizations
  FOR DELETE USING (
    is_admin_user()
  );

-- ================================
-- 🔧 TESTING & DEBUG FUNCTIONS
-- ================================

-- Function to test current user context
CREATE OR REPLACE FUNCTION test_rls_context()
RETURNS TABLE (
  current_clerk_id TEXT,
  is_admin BOOLEAN,
  user_organizations TEXT[],
  jwt_claims JSONB
) AS $$
BEGIN
  RETURN QUERY SELECT 
    get_current_clerk_user_id(),
    is_admin_user(),
    get_current_user_organizations(),
    auth.jwt();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test organization access
CREATE OR REPLACE FUNCTION test_org_access(org_uuid UUID)
RETURNS TABLE (
  is_member BOOLEAN,
  is_owner BOOLEAN,
  user_role TEXT,
  org_slug TEXT
) AS $$
DECLARE
  slug TEXT;
BEGIN
  SELECT organizations.slug INTO slug FROM organizations WHERE id = org_uuid;
  
  RETURN QUERY SELECT 
    is_organization_member(org_uuid),
    is_organization_owner(org_uuid),
    get_user_org_role(slug),
    slug;
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
