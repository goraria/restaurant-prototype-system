-- ================================
-- 🔍 SUPABASE TABLE STRUCTURE CHECK
-- Check what columns exist before applying RLS
-- ================================

-- Check users table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check organizations table structure  
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'organizations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'organizations');

-- Check existing RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  hasindexes
FROM pg_tables 
WHERE tablename IN ('users', 'organizations')
AND schemaname = 'public';

-- Check existing policies
SELECT 
  schemaname,
  tablename, 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'organizations')
AND schemaname = 'public'
ORDER BY tablename, policyname;
