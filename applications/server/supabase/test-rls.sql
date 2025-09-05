-- ================================
-- 🧪 TEST RLS POLICIES
-- Quick test for organization policies
-- ================================

-- Test simple queries that should work
SELECT 'Testing basic organization query' as test;

-- Test if we can select from organizations (should work with public policy)
SELECT COUNT(*) as organization_count FROM organizations;

-- Test role hierarchy function
SELECT test_role_hierarchy('test_clerk_id', 'manager') as role_test;

-- Test service role function
SELECT is_service_role() as service_role_check;

-- Test RLS context
SELECT * FROM test_rls_context();

SELECT '✅ All tests completed successfully!' as result;
