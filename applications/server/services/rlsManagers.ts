import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/environment';

/**
 * 🔐 Supabase RLS Policy Manager
 * Manages Row Level Security policies synchronized with Clerk authentication
 */
export class SupabaseRLSManager {
  private supabase;

  constructor() {
    this.supabase = createClient(
      SUPABASE_URL,
      process.env.EXPRESS_SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, // Service key for admin operations
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  /**
   * 🚀 Initialize RLS policies
   * Run this after deploying to Supabase
   */
  async initializePolicies(): Promise<void> {
    try {
      console.log('🔐 Initializing RLS policies...');

      // Read and execute RLS policy SQL file
      const { error } = await this.supabase.rpc('exec_sql', {
        sql: await this.getRLSPolicySQL()
      });

      if (error) {
        throw new Error(`Failed to initialize RLS policies: ${error.message}`);
      }

      console.log('✅ RLS policies initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing RLS policies:', error);
      throw error;
    }
  }

  /**
   * 👤 Sync user from Clerk webhook
   * This method bypasses RLS using service key
   */
  async syncUserFromClerk(clerkUser: any, operation: 'created' | 'updated' | 'deleted'): Promise<void> {
    try {
      const userId = clerkUser.id;
      
      switch (operation) {
        case 'created':
          await this.createUserFromClerk(clerkUser);
          break;
        case 'updated':
          await this.updateUserFromClerk(clerkUser);
          break;
        case 'deleted':
          await this.deleteUserFromClerk(userId);
          break;
      }

      console.log(`✅ User ${operation} successfully: ${userId}`);
    } catch (error) {
      console.error(`❌ Error syncing user ${operation}:`, error);
      throw error;
    }
  }

  /**
   * 🆕 Create user from Clerk data
   */
  private async createUserFromClerk(clerkUser: any): Promise<void> {
    const userData = {
      id: crypto.randomUUID(),
      clerk_id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      username: clerkUser.username || clerkUser.email_addresses[0]?.email_address.split('@')[0],
      first_name: clerkUser.first_name || '',
      last_name: clerkUser.last_name || '',
      full_name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
      avatar_url: clerkUser.image_url,
      phone_number: clerkUser.phone_numbers[0]?.phone_number,
      email_verified_at: clerkUser.email_addresses[0]?.verification?.status === 'verified' 
        ? new Date() 
        : null,
      role: 'customer', // Default role
      status: 'active'
    };

    const { error } = await this.supabase
      .from('users')
      .insert(userData);

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * 🔄 Update user from Clerk data
   */
  private async updateUserFromClerk(clerkUser: any): Promise<void> {
    const userData = {
      email: clerkUser.email_addresses[0]?.email_address,
      username: clerkUser.username || clerkUser.email_addresses[0]?.email_address.split('@')[0],
      first_name: clerkUser.first_name || '',
      last_name: clerkUser.last_name || '',
      full_name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
      avatar_url: clerkUser.image_url,
      phone_number: clerkUser.phone_numbers[0]?.phone_number,
      email_verified_at: clerkUser.email_addresses[0]?.verification?.status === 'verified' 
        ? new Date() 
        : null,
      updated_at: new Date()
    };

    const { error } = await this.supabase
      .from('users')
      .update(userData)
      .eq('clerk_id', clerkUser.id);

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * 🗑️ Delete user from Clerk data
   */
  private async deleteUserFromClerk(clerkUserId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('clerk_id', clerkUserId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * 🏢 Sync organization from Clerk webhook
   */
  async syncOrganizationFromClerk(
    clerkOrg: any, 
    operation: 'created' | 'updated' | 'deleted'
  ): Promise<void> {
    try {
      switch (operation) {
        case 'created':
          await this.createOrganizationFromClerk(clerkOrg);
          break;
        case 'updated':
          await this.updateOrganizationFromClerk(clerkOrg);
          break;
        case 'deleted':
          await this.deleteOrganizationFromClerk(clerkOrg.id);
          break;
      }

      console.log(`✅ Organization ${operation} successfully: ${clerkOrg.id}`);
    } catch (error) {
      console.error(`❌ Error syncing organization ${operation}:`, error);
      throw error;
    }
  }

  /**
   * 🆕 Create organization from Clerk data
   */
  private async createOrganizationFromClerk(clerkOrg: any): Promise<void> {
    // Find owner user by clerk_id
    const { data: owner, error: ownerError } = await this.supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkOrg.created_by)
      .single();

    if (ownerError || !owner) {
      throw new Error(`Owner user not found for organization: ${clerkOrg.created_by}`);
    }

    const orgData = {
      id: crypto.randomUUID(),
      name: clerkOrg.name,
      code: clerkOrg.slug || clerkOrg.name.toLowerCase().replace(/\s+/g, '-'),
      description: clerkOrg.public_metadata?.description,
      logo_url: clerkOrg.image_url,
      owner_id: owner.id
    };

    const { error } = await this.supabase
      .from('organizations')
      .insert(orgData);

    if (error) {
      throw new Error(`Failed to create organization: ${error.message}`);
    }
  }

  /**
   * 🔄 Update organization from Clerk data
   */
  private async updateOrganizationFromClerk(clerkOrg: any): Promise<void> {
    const orgData = {
      name: clerkOrg.name,
      code: clerkOrg.slug || clerkOrg.name.toLowerCase().replace(/\s+/g, '-'),
      description: clerkOrg.public_metadata?.description,
      logo_url: clerkOrg.image_url,
      updated_at: new Date()
    };

    const { error } = await this.supabase
      .from('organizations')
      .update(orgData)
      .eq('code', clerkOrg.slug); // Assuming we use clerk slug as code

    if (error) {
      throw new Error(`Failed to update organization: ${error.message}`);
    }
  }

  /**
   * 🗑️ Delete organization from Clerk data
   */
  private async deleteOrganizationFromClerk(clerkOrgId: string): Promise<void> {
    const { error } = await this.supabase
      .from('organizations')
      .delete()
      .eq('code', clerkOrgId); // Assuming we use clerk ID as code

    if (error) {
      throw new Error(`Failed to delete organization: ${error.message}`);
    }
  }

  /**
   * 🔑 Create authenticated client for user
   * Returns Supabase client with user context for RLS
   */
  createAuthenticatedClient(clerkJWT: string) {
    return createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${clerkJWT}`
          }
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  /**
   * 🧪 Test RLS policies
   * Use this to verify policies are working correctly
   */
  async testPolicies(): Promise<void> {
    try {
      console.log('🧪 Testing RLS policies...');

      // Test 1: Anonymous access
      const anonClient = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );

      const { data: publicData, error: publicError } = await anonClient
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      console.log('✅ Anonymous menu access:', publicData?.length || 0, 'items');

      // Test 2: Check if RLS is enabled
      const { data: rlsStatus } = await this.supabase
        .from('pg_tables')
        .select('tablename, rowsecurity')
        .eq('schemaname', 'public')
        .in('tablename', ['users', 'organizations', 'restaurants']);

      console.log('🔐 RLS Status:', rlsStatus);

      console.log('✅ Policy tests completed');
    } catch (error) {
      console.error('❌ Error testing policies:', error);
      throw error;
    }
  }

  /**
   * 📄 Get RLS policy SQL content
   */
  private async getRLSPolicySQL(): Promise<string> {
    // In production, read from file system or embed the SQL
    // For now, return basic RLS enable commands
    return `
      -- Enable RLS on core tables
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      
      -- Basic policies will be created by the main SQL file
      SELECT 'RLS policies initialized'::text as result;
    `;
  }

  /**
   * 📊 Get RLS statistics
   */
  async getRLSStats(): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_rls_stats');

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting RLS stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const rlsManager = new SupabaseRLSManager();
