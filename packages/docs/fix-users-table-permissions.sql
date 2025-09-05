-- Kiểm tra bảng users hiện tại
SELECT * FROM information_schema.tables WHERE table_name = 'users';

-- Kiểm tra RLS có được bật không
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Kiểm tra các policies hiện tại
SELECT * FROM pg_policies WHERE tablename = 'users';

-- TẮT RLS tạm thời để test (KHÔNG khuyến khích cho production)
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- HOẶC tạo policy cho service_role (KHUYẾN KHÍCH)
-- Xóa policy cũ nếu có
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "service_role_policy" ON public.users;

-- Tạo policy mới cho service role
CREATE POLICY "service_role_full_access" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Đảm bảo service_role có quyền trên bảng
GRANT ALL ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
