import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Supabase client với service role key để bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ================================
// 🔄 POST - Migrate Organizations from Clerk to Supabase
// ================================
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dry_run') === 'true';
    const forceSync = searchParams.get('force') === 'true';

    console.log('🔄 Starting Clerk → Supabase migration:', { dryRun, forceSync });

    // Get organizations from Clerk
    const clerk = await clerkClient();
    const clerkOrgs = await clerk.organizations.getOrganizationList({
      limit: 100,
    });

    console.log(`📋 Found ${clerkOrgs.data.length} organizations in Clerk`);

    const migrationResults = [];
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const clerkOrg of clerkOrgs.data) {
      try {
        console.log(`\n🏢 Processing: ${clerkOrg.name} (${clerkOrg.id})`);

        // Generate code from Clerk org name/slug
        const code = clerkOrg.slug || 
                    clerkOrg.name.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');

        // Check if organization already exists in Supabase by code
        const { data: existingOrg } = await supabase
          .from('organizations')
          .select('id, name, code')
          .eq('code', code)
          .single();

        if (existingOrg && !forceSync) {
          console.log(`⏭️ Organization with code '${code}' already exists, skipping`);
          migrationResults.push({
            clerk_org_id: clerkOrg.id,
            name: clerkOrg.name,
            code: code,
            status: 'skipped',
            reason: 'Already exists in Supabase',
            existing_id: existingOrg.id
          });
          skipCount++;
          continue;
        }

        // Get organization owner from Clerk
        const clerkMembers = await clerk.organizations.getOrganizationMembershipList({
          organizationId: clerkOrg.id,
          limit: 10,
        });

        // Find admin/owner
        const ownerMembership = clerkMembers.data.find(
          m => m.role === 'org:admin' || m.role === 'admin'
        ) || clerkMembers.data[0]; // Fallback to first member

        if (!ownerMembership) {
          console.log(`❌ No members found for ${clerkOrg.name}`);
          migrationResults.push({
            clerk_org_id: clerkOrg.id,
            name: clerkOrg.name,
            code: code,
            status: 'error',
            reason: 'No members found in Clerk organization'
          });
          errorCount++;
          continue;
        }

        // Find user in Supabase by clerk_id
        const { data: supabaseUser } = await supabase
          .from('users')
          .select('id, clerk_id, username, email')
          .eq('clerk_id', ownerMembership.publicUserData?.userId)
          .single();

        if (!supabaseUser) {
          console.log(`❌ Owner user not found in Supabase: ${ownerMembership.publicUserData?.userId}`);
          migrationResults.push({
            clerk_org_id: clerkOrg.id,
            name: clerkOrg.name,
            code: code,
            status: 'error',
            reason: `Owner user not found in Supabase: ${ownerMembership.publicUserData?.userId}`
          });
          errorCount++;
          continue;
        }

        if (dryRun) {
          console.log(`✅ [DRY RUN] Would create organization:`, {
            name: clerkOrg.name,
            code: code,
            owner: supabaseUser.email
          });
          migrationResults.push({
            clerk_org_id: clerkOrg.id,
            name: clerkOrg.name,
            code: code,
            status: 'dry_run_success',
            owner_email: supabaseUser.email
          });
          successCount++;
          continue;
        }

        // Create organization in Supabase
        const newOrgData = {
          id: uuidv4(),
          name: clerkOrg.name,
          code: code,
          description: `Migrated from Clerk organization: ${clerkOrg.id}`,
          logo_url: clerkOrg.imageUrl || null,
          owner_id: supabaseUser.id,
          created_at: clerkOrg.createdAt ? new Date(clerkOrg.createdAt).toISOString() : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        let finalOrg;
        if (existingOrg && forceSync) {
          // Update existing organization
          const { data: updatedOrg, error: updateError } = await supabase
            .from('organizations')
            .update({
              name: newOrgData.name,
              description: newOrgData.description,
              logo_url: newOrgData.logo_url,
              owner_id: newOrgData.owner_id,
              updated_at: newOrgData.updated_at,
            })
            .eq('id', existingOrg.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }
          finalOrg = updatedOrg;
          console.log(`🔄 Updated existing organization: ${finalOrg.id}`);
        } else {
          // Create new organization
          const { data: createdOrg, error: createError } = await supabase
            .from('organizations')
            .insert(newOrgData)
            .select()
            .single();

          if (createError) {
            throw createError;
          }
          finalOrg = createdOrg;
          console.log(`✅ Created new organization: ${finalOrg.id}`);
        }

        migrationResults.push({
          clerk_org_id: clerkOrg.id,
          supabase_id: finalOrg.id,
          name: finalOrg.name,
          code: finalOrg.code,
          status: existingOrg ? 'updated' : 'created',
          owner_email: supabaseUser.email
        });
        successCount++;

      } catch (error) {
        console.error(`❌ Error processing ${clerkOrg.name}:`, error);
        migrationResults.push({
          clerk_org_id: clerkOrg.id,
          name: clerkOrg.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:', {
      total: clerkOrgs.data.length,
      success: successCount,
      skipped: skipCount,
      errors: errorCount
    });

    return NextResponse.json({
      success: true,
      summary: {
        total_clerk_orgs: clerkOrgs.data.length,
        successful: successCount,
        skipped: skipCount,
        errors: errorCount,
        dry_run: dryRun
      },
      results: migrationResults
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ================================
// 📋 GET - Preview Clerk Organizations
// ================================
export async function GET() {
  try {
    console.log('📋 Getting Clerk organizations preview');

    const clerk = await clerkClient();
    const clerkOrgs = await clerk.organizations.getOrganizationList({
      limit: 100,
    });

    const preview = [];

    for (const clerkOrg of clerkOrgs.data) {
      const code = clerkOrg.slug || 
                  clerkOrg.name.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

      // Check if exists in Supabase
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('code', code)
        .single();

      // Get members count
      const clerkMembers = await clerk.organizations.getOrganizationMembershipList({
        organizationId: clerkOrg.id,
        limit: 1,
      });

      preview.push({
        clerk_id: clerkOrg.id,
        name: clerkOrg.name,
        slug: clerkOrg.slug,
        generated_code: code,
        members_count: clerkMembers.totalCount,
        exists_in_supabase: !!existingOrg,
        supabase_id: existingOrg?.id || null,
        created_at: clerkOrg.createdAt
      });
    }

    return NextResponse.json({
      success: true,
      total_clerk_orgs: clerkOrgs.data.length,
      organizations: preview
    });

  } catch (error) {
    console.error('❌ Preview error:', error);
    return NextResponse.json(
      { error: 'Failed to preview organizations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
