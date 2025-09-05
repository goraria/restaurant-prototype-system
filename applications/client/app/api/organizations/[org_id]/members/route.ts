import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
// 👥 GET - Get Organization Members  
// ================================
export async function GET(
  request: NextRequest,
  { params }: { params: { org_id: string } }
) {
  try {
    const { org_id } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('👥 Getting organization members:', { org_id, limit, offset });

    if (!org_id) {
      return NextResponse.json(
        { error: 'org_id is required' },
        { status: 400 }
      );
    }

    // Tìm organization trong database theo schema Prisma mới
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        code,
        description,
        logo_url,
        owner:users!organizations_owner_id_fkey(id, username, email, full_name, avatar_url)
      `)
      .eq('id', org_id)
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', org_id);
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Lấy danh sách members từ restaurants thuộc organization
    // Dựa vào relationships: organization -> restaurants -> restaurant_staff -> users
    const { data: dbMembers, error: membersError, count } = await supabase
      .from('restaurant_staff')
      .select(`
        id,
        role,
        status,
        joined_at,
        user:users (
          id,
          clerk_id,
          username,
          email,
          first_name,
          last_name,
          full_name,
          avatar_url
        ),
        restaurant:restaurants!inner (
          id,
          name,
          organization_id
        )
      `, { count: 'exact' })
      .eq('restaurant.organization_id', org_id)
      .range(offset, offset + limit - 1)
      .order('joined_at', { ascending: false });

    if (membersError) {
      console.error('❌ Error fetching members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    // Format response theo schema mới
    const members = dbMembers?.map(member => ({
      id: member.id,
      role: member.role,
      status: member.status,
      joined_at: member.joined_at,
      user: member.user,
      restaurant: {
        id: member.restaurant.id,
        name: member.restaurant.name,
      },
    })) || [];

    console.log(`✅ Found ${members.length} members for organization ${org_id}`);

    return NextResponse.json({
      success: true,
      data: {
        organization: {
          id: organization.id,
          name: organization.name,
          code: organization.code,
          description: organization.description,
          logo_url: organization.logo_url,
          owner: organization.owner,
        },
        members: members,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: (offset + limit) < (count || 0),
        },
      },
    });

  } catch (error) {
    console.error('❌ GET organization members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================
// ➕ POST - Add Member to Organization
// ================================
export async function POST(
  request: NextRequest,
  { params }: { params: { org_id: string } }
) {
  try {
    const { org_id } = params;
    const body = await request.json();
    const { user_clerk_id, restaurant_id, role = 'staff' } = body;

    console.log('➕ Adding member to organization:', { org_id, user_clerk_id, restaurant_id, role });

    if (!org_id || !user_clerk_id || !restaurant_id) {
      return NextResponse.json(
        { error: 'org_id, user_clerk_id, and restaurant_id are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['staff', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: staff, manager, admin' },
        { status: 400 }
      );
    }

    // Tìm organization theo schema mới
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, code')
      .eq('id', org_id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Tìm user bằng clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, clerk_id, username, email, full_name')
      .eq('clerk_id', user_clerk_id)
      .single();

    if (userError || !user) {
      console.error('❌ User not found:', user_clerk_id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify restaurant thuộc organization
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name, organization_id')
      .eq('id', restaurant_id)
      .eq('organization_id', org_id)
      .single();

    if (restaurantError || !restaurant) {
      console.error('❌ Restaurant not found or does not belong to organization:', { restaurant_id, org_id });
      return NextResponse.json(
        { error: 'Restaurant not found or does not belong to this organization' },
        { status: 404 }
      );
    }

    // Kiểm tra xem user đã là member của restaurant chưa
    const { data: existingMember } = await supabase
      .from('restaurant_staff')
      .select('id')
      .eq('user_id', user.id)
      .eq('restaurant_id', restaurant_id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this restaurant' },
        { status: 409 }
      );
    }

    // Thêm member vào database
    const { data: newMember, error: createError } = await supabase
      .from('restaurant_staff')
      .insert({
        user_id: user.id,
        restaurant_id: restaurant_id,
        role: role,
        status: 'active',
        joined_at: new Date().toISOString(),
      })
      .select(`
        id,
        role,
        status,
        joined_at,
        user:users (
          id,
          clerk_id,
          username,
          email,
          full_name,
          avatar_url
        ),
        restaurant:restaurants (
          id,
          name
        )
      `)
      .single();

    if (createError) {
      console.error('❌ Error creating staff member:', createError);
      return NextResponse.json(
        { error: 'Failed to add member' },
        { status: 500 }
      );
    }

    console.log('✅ Member added successfully to organization');

    return NextResponse.json({
      success: true,
      data: newMember,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ POST organization member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================
// 🗑️ DELETE - Remove Member from Organization
// ================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { org_id: string } }
) {
  try {
    const { org_id } = params;
    const { searchParams } = new URL(request.url);
    const staff_id = searchParams.get('staff_id');

    console.log('🗑️ Removing member from organization:', { org_id, staff_id });

    if (!org_id || !staff_id) {
      return NextResponse.json(
        { error: 'org_id and staff_id are required' },
        { status: 400 }
      );
    }

    // Verify staff member exists and belongs to the organization
    const { data: staffMember, error: staffError } = await supabase
      .from('restaurant_staff')
      .select(`
        id,
        user_id,
        restaurant:restaurants!inner (
          id,
          name,
          organization_id
        )
      `)
      .eq('id', staff_id)
      .eq('restaurant.organization_id', org_id)
      .single();

    if (staffError || !staffMember) {
      console.error('❌ Staff member not found:', { staff_id, org_id });
      return NextResponse.json(
        { error: 'Staff member not found or does not belong to this organization' },
        { status: 404 }
      );
    }

    // Remove from database
    const { error: deleteError } = await supabase
      .from('restaurant_staff')
      .delete()
      .eq('id', staff_id);

    if (deleteError) {
      console.error('❌ Error removing staff member:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove member' },
        { status: 500 }
      );
    }

    console.log('✅ Member removed successfully from organization');

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    });

  } catch (error) {
    console.error('❌ DELETE organization member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
