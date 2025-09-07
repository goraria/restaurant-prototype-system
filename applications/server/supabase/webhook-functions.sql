-- ================================
-- 🔐 WEBHOOK FUNCTIONS
-- for Clerk user/organization sync
-- ================================

-- Function để insert user từ webhook (bypass RLS)
CREATE OR REPLACE FUNCTION insert_user_from_webhook(
  p_id UUID,
  p_clerk_id TEXT,
  p_username TEXT,
  p_email TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_full_name TEXT,
  p_avatar_url TEXT DEFAULT NULL,
  p_email_verified_at TIMESTAMPTZ DEFAULT NULL,
  p_created_at TIMESTAMPTZ DEFAULT NOW(),
  p_updated_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  inserted_user JSONB;
BEGIN
  -- Insert user với service role (bypass RLS)
  INSERT INTO users (
    id,
    clerk_id,
    username,
    email,
    first_name,
    last_name,
    full_name,
    avatar_url,
    email_verified_at,
    created_at,
    updated_at,
    activity_status,
    is_online,
    last_seen_at,
    last_activity_at
  ) VALUES (
    p_id,
    p_clerk_id,
    p_username,
    p_email,
    p_first_name,
    p_last_name,
    p_full_name,
    p_avatar_url,
    p_email_verified_at,
    p_created_at,
    p_updated_at,
    'available'::user_activity_status_enum,
    false,
    p_created_at,
    p_created_at
  )
  RETURNING to_jsonb(users.*) INTO inserted_user;
  
  RETURN jsonb_build_object(
    'success', true,
    'user', inserted_user
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để update user từ webhook (bypass RLS)
CREATE OR REPLACE FUNCTION update_user_from_webhook(
  p_clerk_id TEXT,
  p_email TEXT DEFAULT NULL,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_updated_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  updated_user JSONB;
BEGIN
  -- Update user với service role (bypass RLS)
  UPDATE users SET
    email = COALESCE(p_email, email),
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    full_name = COALESCE(p_full_name, full_name),
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    updated_at = p_updated_at,
    last_activity_at = p_updated_at
  WHERE clerk_id = p_clerk_id
  RETURNING to_jsonb(users.*) INTO updated_user;
  
  IF updated_user IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'clerk_id', p_clerk_id
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'user', updated_user
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để insert organization từ webhook (bypass RLS)
CREATE OR REPLACE FUNCTION insert_organization_from_webhook(
  p_id UUID,
  p_clerk_id TEXT,
  p_name TEXT,
  p_slug TEXT,
  p_logo_url TEXT DEFAULT NULL,
  p_owner_clerk_id TEXT DEFAULT NULL,
  p_created_at TIMESTAMPTZ DEFAULT NOW(),
  p_updated_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  inserted_org JSONB;
  owner_uuid UUID;
BEGIN
  -- Tìm owner UUID từ clerk_id (nếu có)
  IF p_owner_clerk_id IS NOT NULL THEN
    SELECT id INTO owner_uuid FROM users WHERE clerk_id = p_owner_clerk_id;
  END IF;
  
  -- Insert organization với service role (bypass RLS)
  INSERT INTO organizations (
    id,
    clerk_id,
    name,
    slug,
    logo_url,
    owner_id,
    created_at,
    updated_at
  ) VALUES (
    p_id,
    p_clerk_id,
    p_name,
    p_slug,
    p_logo_url,
    owner_uuid,
    p_created_at,
    p_updated_at
  )
  RETURNING to_jsonb(organizations.*) INTO inserted_org;
  
  RETURN jsonb_build_object(
    'success', true,
    'organization', inserted_org
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để update organization từ webhook (bypass RLS)
CREATE OR REPLACE FUNCTION update_organization_from_webhook(
  p_clerk_id TEXT,
  p_name TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_updated_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  updated_org JSONB;
BEGIN
  -- Update organization với service role (bypass RLS)
  UPDATE organizations SET
    name = COALESCE(p_name, name),
    slug = COALESCE(p_slug, slug),
    logo_url = COALESCE(p_logo_url, logo_url),
    updated_at = p_updated_at
  WHERE clerk_id = p_clerk_id
  RETURNING to_jsonb(organizations.*) INTO updated_org;
  
  IF updated_org IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Organization not found',
      'clerk_id', p_clerk_id
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'organization', updated_org
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để delete user từ webhook (soft delete)
CREATE OR REPLACE FUNCTION delete_user_from_webhook(
  p_clerk_id TEXT,
  p_deleted_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  deleted_user JSONB;
BEGIN
  -- Soft delete user với service role (bypass RLS)
  UPDATE users SET
    deleted_at = p_deleted_at,
    updated_at = p_deleted_at,
    is_online = false,
    activity_status = 'offline'::user_activity_status_enum
  WHERE clerk_id = p_clerk_id
  RETURNING to_jsonb(users.*) INTO deleted_user;
  
  IF deleted_user IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'clerk_id', p_clerk_id
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'user', deleted_user,
    'action', 'soft_delete'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để delete organization từ webhook (soft delete)
CREATE OR REPLACE FUNCTION delete_organization_from_webhook(
  p_clerk_id TEXT,
  p_deleted_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  deleted_org JSONB;
BEGIN
  -- Soft delete organization với service role (bypass RLS)
  UPDATE organizations SET
    deleted_at = p_deleted_at,
    updated_at = p_deleted_at
  WHERE clerk_id = p_clerk_id
  RETURNING to_jsonb(organizations.*) INTO deleted_org;
  
  IF deleted_org IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Organization not found',
      'clerk_id', p_clerk_id
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'organization', deleted_org,
    'action', 'soft_delete'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission for authenticated users (webhook calls will use service role)
GRANT EXECUTE ON FUNCTION insert_user_from_webhook TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_user_from_webhook TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION insert_organization_from_webhook TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_organization_from_webhook TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION delete_user_from_webhook TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION delete_organization_from_webhook TO authenticated, service_role;
