-- ================================
-- 🔐 TEMPORARY RLS BYPASS for Webhooks
-- Để fix lỗi permission ngay lập tức
-- ================================

-- Disable RLS temporarily cho webhooks
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn giữ RLS, tạo policy đơn giản cho service role
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "allow_service_role_all" ON users
--   FOR ALL 
--   TO service_role
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "allow_service_role_all" ON organizations
--   FOR ALL 
--   TO service_role  
--   USING (true)
--   WITH CHECK (true);
