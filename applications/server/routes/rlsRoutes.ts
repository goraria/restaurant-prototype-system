import { Router } from 'express';
import { addSupabaseRLS, requireSupabaseAuth, requireAdminRole, debugRLSContext } from '../middlewares/supabaseRLSMiddlewares';
import { rlsManager } from '../services/rlsManagers';

const router = Router();

/**
 * 🔐 RLS Testing & Management Routes
 * Test Row Level Security policies and manage Supabase integration
 */

// Apply RLS middleware to all routes
router.use(addSupabaseRLS);

// Error handler utility
const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error';
};

// ================================
// 🧪 TEST ROUTES
// ================================

/**
 * 🟢 Test anonymous access (public data)
 */
router.get('/test/anonymous', debugRLSContext, async (req, res) => {
  try {
    const { data: categories, error } = await req.supabase
      .from('categories')
      .select('id, name, description')
      .eq('is_active', true)
      .limit(5);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Anonymous access test successful',
      data: {
        categories_count: categories?.length || 0,
        categories: categories
      },
      context: {
        authenticated: !!req.clerkUserId,
        user_id: req.clerkUserId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
});

/**
 * 🔒 Test authenticated user access
 */
router.get('/test/authenticated', requireSupabaseAuth, debugRLSContext, async (req, res) => {
  try {
    // Test 1: Get current user profile
    const { data: userProfile, error: userError } = await req.supabase
      .from('users')
      .select('id, username, email, role, first_name, last_name')
      .eq('clerk_id', req.clerkUserId)
      .single();

    if (userError) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        details: userError.message
      });
    }

    // Test 2: Get user's addresses
    const { data: addresses, error: addressError } = await req.supabase
      .from('addresses')
      .select('id, recipient_name, street_address, city')
      .eq('user_id', userProfile.id);

    // Test 3: Get user's orders
    const { data: orders, error: orderError } = await req.supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('customer_id', userProfile.id)
      .limit(5);

    res.json({
      success: true,
      message: 'Authenticated access test successful',
      data: {
        user_profile: userProfile,
        addresses_count: addresses?.length || 0,
        orders_count: orders?.length || 0,
        recent_orders: orders
      },
      rls_test: {
        user_profile_access: !userError,
        addresses_access: !addressError,
        orders_access: !orderError
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
});

/**
 * 🏢 Test organization access
 */
router.get('/test/organization/:organizationId', requireSupabaseAuth, async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Test organization access through RLS
    const { data: organization, error: orgError } = await req.supabase
      .from('organizations')
      .select('id, name, description, created_at')
      .eq('id', organizationId)
      .single();

    // Test restaurants in organization
    const { data: restaurants, error: restaurantError } = await req.supabase
      .from('restaurants')
      .select('id, name, address, phone')
      .eq('organization_id', organizationId);

    res.json({
      success: true,
      message: 'Organization access test',
      data: {
        organization: organization,
        restaurants_count: restaurants?.length || 0,
        restaurants: restaurants
      },
      rls_test: {
        organization_access: !orgError,
        restaurants_access: !restaurantError,
        access_granted: !!organization
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
});

/**
 * 👑 Test admin access
 */
router.get('/test/admin', requireSupabaseAuth, requireAdminRole, async (req, res) => {
  try {
    // Test admin-level queries
    const { data: allUsers, error: usersError } = await req.supabase
      .from('users')
      .select('id, username, email, role, status')
      .limit(10);

    const { data: allOrganizations, error: orgsError } = await req.supabase
      .from('organizations')
      .select('id, name, owner_id')
      .limit(10);

    res.json({
      success: true,
      message: 'Admin access test successful',
      data: {
        users_count: allUsers?.length || 0,
        organizations_count: allOrganizations?.length || 0,
        sample_users: allUsers,
        sample_organizations: allOrganizations
      },
      rls_test: {
        admin_user_access: !usersError,
        admin_org_access: !orgsError
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Admin test failed',
      message: error.message
    });
  }
});

// ================================
// 🛠️ MANAGEMENT ROUTES
// ================================

/**
 * 🚀 Initialize RLS policies
 */
router.post('/initialize', requireSupabaseAuth, requireAdminRole, async (req, res) => {
  try {
    await rlsManager.initializePolicies();
    
    res.json({
      success: true,
      message: 'RLS policies initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initialize RLS policies',
      message: error.message
    });
  }
});

/**
 * 🧪 Run RLS policy tests
 */
router.post('/test-policies', requireSupabaseAuth, requireAdminRole, async (req, res) => {
  try {
    await rlsManager.testPolicies();
    
    res.json({
      success: true,
      message: 'RLS policy tests completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'RLS policy tests failed',
      message: error.message
    });
  }
});

/**
 * 📊 Get RLS statistics
 */
router.get('/stats', requireSupabaseAuth, requireAdminRole, async (req, res) => {
  try {
    const stats = await rlsManager.getRLSStats();
    
    res.json({
      success: true,
      message: 'RLS statistics retrieved',
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get RLS statistics',
      message: error.message
    });
  }
});

/**
 * 🔍 Debug current user context
 */
router.get('/debug/context', requireSupabaseAuth, debugRLSContext, async (req, res) => {
  try {
    // Get current user info from Supabase
    const { data: user, error } = await req.supabase
      .from('users')
      .select('id, clerk_id, username, email, role, status')
      .eq('clerk_id', req.clerkUserId)
      .single();

    res.json({
      success: true,
      message: 'User context debug info',
      context: {
        clerk_user_id: req.clerkUserId,
        has_jwt: !!req.clerkJWT,
        has_supabase_client: !!req.supabase,
        jwt_preview: req.clerkJWT ? req.clerkJWT.substring(0, 50) + '...' : null
      },
      database_user: user,
      database_error: error?.message || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug failed',
      message: error.message
    });
  }
});

// ================================
// 💼 EXAMPLE CRUD OPERATIONS WITH RLS
// ================================

/**
 * 📋 Get user's addresses (RLS protected)
 */
router.get('/example/addresses', requireSupabaseAuth, async (req, res) => {
  try {
    const { data: addresses, error } = await req.supabase
      .from('addresses')
      .select('*');

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'User addresses retrieved (RLS protected)',
      data: addresses,
      count: addresses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get addresses',
      message: error.message
    });
  }
});

/**
 * 🛒 Get user's orders (RLS protected)
 */
router.get('/example/orders', requireSupabaseAuth, async (req, res) => {
  try {
    const { data: orders, error } = await req.supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        created_at,
        restaurants (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'User orders retrieved (RLS protected)',
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get orders',
      message: error.message
    });
  }
});

export default router;
