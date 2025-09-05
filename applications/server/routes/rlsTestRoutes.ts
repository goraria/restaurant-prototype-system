import { Router } from 'express';
import { addSupabaseRLS, requireSupabaseAuth, requireAdminRole } from '../middlewares/supabaseRLSMiddlewares';
import { rlsManager } from '../services/rlsManagers';

const router = Router();

/**
 * 🔐 Simple RLS Testing Routes for Users & Organizations
 */

// Apply RLS middleware to all routes
router.use(addSupabaseRLS);

// Error handler utility
const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error occurred';
};

// ================================
// 🧪 BASIC TEST ROUTES
// ================================

/**
 * 🟢 Test anonymous access (should work without auth)
 */
router.get('/test/public', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Public endpoint accessible',
      timestamp: new Date().toISOString(),
      auth_status: {
        authenticated: !!req.clerkUserId,
        user_id: req.clerkUserId || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: handleError(error)
    });
  }
});

/**
 * 🔒 Test authenticated user access to their profile
 */
router.get('/test/profile', requireSupabaseAuth, async (req, res) => {
  try {
    // Get current user profile
    const { data: userProfile, error: userError } = await req.supabase
      .from('users')
      .select('id, username, email, role, first_name, last_name, status')
      .eq('clerk_id', req.clerkUserId)
      .single();

    if (userError) {
      return res.status(404).json({
        success: false,
        error: 'User not found in database',
        details: userError.message,
        suggestion: 'User may need to be synced from Clerk webhook'
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved with RLS protection',
      data: userProfile,
      context: {
        clerk_id: req.clerkUserId,
        database_id: userProfile.id,
        role: userProfile.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      message: handleError(error)
    });
  }
});

/**
 * 🏢 Test organization access
 */
router.get('/test/organizations', requireSupabaseAuth, async (req, res) => {
  try {
    // Get organizations (RLS will filter based on user permissions)
    const { data: organizations, error } = await req.supabase
      .from('organizations')
      .select('id, name, description, status, created_at')
      .limit(10);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Organizations retrieved (filtered by RLS)',
      data: organizations,
      count: organizations?.length || 0,
      note: 'RLS filters organizations based on user permissions'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get organizations',
      message: handleError(error)
    });
  }
});

/**
 * 🔍 Debug current user context and RLS functions
 */
router.get('/debug/context', requireSupabaseAuth, async (req, res) => {
  try {
    // Test RLS utility functions
    const { data: rlsTest, error: rlsError } = await req.supabase
      .rpc('test_rls_context');

    // Get current user from database
    const { data: user, error: userError } = await req.supabase
      .from('users')
      .select('id, clerk_id, username, email, role, status')
      .eq('clerk_id', req.clerkUserId)
      .single();

    res.json({
      success: true,
      message: 'RLS context debug information',
      context: {
        request: {
          clerk_user_id: req.clerkUserId,
          has_jwt: !!req.clerkJWT,
          has_supabase_client: !!req.supabase
        },
        database: {
          user_exists: !userError,
          user_data: user,
          user_error: userError?.message || null
        },
        rls_functions: {
          test_result: rlsTest,
          test_error: rlsError?.message || null
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug failed',
      message: handleError(error)
    });
  }
});

/**
 * � Create test user (authenticated users)
 */
router.post('/test/user', requireSupabaseAuth, async (req, res) => {
  try {
    const { username, email, first_name, last_name } = req.body;
    
    const { data: newUser, error } = await req.supabase
      .from('users')
      .insert({
        clerk_id: req.clerkUserId,
        username: username || `user_${Date.now()}`,
        email: email || `test_${Date.now()}@example.com`,
        first_name: first_name || 'Test',
        last_name: last_name || 'User',
        role: 'user',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create user',
        details: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create test user',
      message: handleError(error)
    });
  }
});

/**
 * 🏢 Create test organization (authenticated users)
 */
router.post('/test/organization', requireSupabaseAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const { data: newOrg, error } = await req.supabase
      .from('organizations')
      .insert({
        name: name || `Test Org ${Date.now()}`,
        description: description || 'Test organization created via RLS API',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create organization',
        details: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Test organization created successfully',
      data: newOrg,
      note: 'RLS policies control who can see this organization'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create test organization',
      message: handleError(error)
    });
  }
});

export default router;
