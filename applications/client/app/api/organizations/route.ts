import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Types for organization data - synced with Prisma schema
interface OrganizationUpdateData {
  name?: string;
  code?: string;
  description?: string;
  logo_url?: string;
  updated_at: string;
}

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
// 📋 GET - List Organizations
// ================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📋 Getting organizations, org_id:', orgId);

    // Nếu có org_id, lấy organization cụ thể
    if (orgId) {
      const { data: org, error } = await supabase
        .from('organizations')
        .select(`
          *,
          owner:users!organizations_owner(id, username, email, full_name)
        `)
        .eq('id', orgId)
        .single();

      if (error) {
        console.error('❌ Error fetching organization:', error);
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: org,
      });
    }

    // Lấy tất cả organizations với pagination và owner info
    const { data: organizations, error, count } = await supabase
      .from('organizations')
      .select(`
        *,
        owner:users!organizations_owner(id, username, email, full_name)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching organizations:', error);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: organizations,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0),
      },
    });

  } catch (error) {
    console.error('❌ GET organizations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================
// 🆕 POST - Create Organization
// ================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, description, logo_url, owner_clerk_id } = body;

    console.log('🆕 Creating organization:', { name, code, owner_clerk_id });

    // Validate required fields
    if (!name || !code || !owner_clerk_id) {
      return NextResponse.json(
        { error: 'Name, code, and owner_clerk_id are required' },
        { status: 400 }
      );
    }

    // Validate code format (30 chars max, unique)
    if (code.length > 30) {
      return NextResponse.json(
        { error: 'Organization code must be 30 characters or less' },
        { status: 400 }
      );
    }

    // Tìm owner trong database
    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', owner_clerk_id)
      .single();

    if (ownerError || !owner) {
      console.error('❌ Owner not found:', owner_clerk_id);
      return NextResponse.json(
        { error: 'Owner not found in database' },
        { status: 404 }
      );
    }

    // Kiểm tra code đã tồn tại chưa
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('code', code)
      .single();

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization code already exists' },
        { status: 409 }
      );
    }

    // Tạo organization trong database theo schema Prisma
    const orgId = uuidv4();
    const { data: newOrg, error: dbError } = await supabase
      .from('organizations')
      .insert({
        id: orgId,
        name: name,
        code: code,
        description: description || null,
        logo_url: logo_url || null,
        owner_id: owner.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        owner:users!organizations_owner(id, username, email, full_name)
      `)
      .single();

    if (dbError) {
      console.error('❌ Error creating organization in database:', dbError);
      return NextResponse.json(
        { error: 'Failed to create organization in database', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('✅ Organization created successfully:', newOrg.id);

    return NextResponse.json({
      success: true,
      data: newOrg,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ POST organization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================
// 🔄 PUT - Update Organization
// ================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, code, description, logo_url } = body;

    console.log('🔄 Updating organization:', { id, name, code });

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Organization id is required' },
        { status: 400 }
      );
    }

    // Validate code format if provided
    if (code && code.length > 30) {
      return NextResponse.json(
        { error: 'Organization code must be 30 characters or less' },
        { status: 400 }
      );
    }

    // Tìm organization hiện tại
    const { data: existingOrg, error: findError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingOrg) {
      console.error('❌ Organization not found:', id);
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Nếu có thay đổi code, kiểm tra uniqueness
    if (code && code !== existingOrg.code) {
      const { data: conflictOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('code', code)
        .neq('id', id)
        .single();

      if (conflictOrg) {
        return NextResponse.json(
          { error: 'Organization code already exists' },
          { status: 409 }
        );
      }
    }

    // Cập nhật trong database theo schema Prisma
    const updateFields: OrganizationUpdateData = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateFields.name = name;
    if (code !== undefined) updateFields.code = code;
    if (description !== undefined) updateFields.description = description;
    if (logo_url !== undefined) updateFields.logo_url = logo_url;

    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update(updateFields)
      .eq('id', id)
      .select(`
        *,
        owner:users!organizations_owner(id, username, email, full_name)
      `)
      .single();

    if (updateError) {
      console.error('❌ Error updating organization in database:', updateError);
      return NextResponse.json(
        { error: 'Failed to update organization in database', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('✅ Organization updated successfully:', updatedOrg.id);

    return NextResponse.json({
      success: true,
      data: updatedOrg,
    });

  } catch (error) {
    console.error('❌ PUT organization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ================================
// 🗑️ DELETE - Delete Organization
// ================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('🗑️ Deleting organization:', { id });

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Organization id is required' },
        { status: 400 }
      );
    }

    // Tìm organization hiện tại
    const { data: existingOrg, error: findError } = await supabase
      .from('organizations')
      .select(`
        *,
        owner:users!organizations_owner(id, username, email, full_name)
      `)
      .eq('id', id)
      .single();

    if (findError || !existingOrg) {
      console.error('❌ Organization not found:', id);
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Kiểm tra có thể xóa không (check dependencies theo schema Prisma)
    // Check restaurants
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('organization_id', existingOrg.id)
      .limit(1);

    if (restaurantError) {
      console.error('❌ Error checking restaurants:', restaurantError);
      return NextResponse.json(
        { error: 'Failed to check organization dependencies' },
        { status: 500 }
      );
    }

    if (restaurants && restaurants.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete organization with existing restaurants',
          details: 'Please delete all restaurants first' 
        },
        { status: 409 }
      );
    }

    // Check restaurant_chains
    const { data: chains, error: chainError } = await supabase
      .from('restaurant_chains')
      .select('id')
      .eq('organization_id', existingOrg.id)
      .limit(1);

    if (chainError) {
      console.error('❌ Error checking restaurant chains:', chainError);
      return NextResponse.json(
        { error: 'Failed to check organization dependencies' },
        { status: 500 }
      );
    }

    if (chains && chains.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete organization with existing restaurant chains',
          details: 'Please delete all restaurant chains first' 
        },
        { status: 409 }
      );
    }

    // Xóa từ database (hard delete theo schema Prisma)
    const { error: deleteError } = await supabase
      .from('organizations')
      .delete()
      .eq('id', existingOrg.id);

    if (deleteError) {
      console.error('❌ Error deleting organization from database:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete organization from database', details: deleteError.message },
        { status: 500 }
      );
    }

    console.log('✅ Organization deleted successfully:', existingOrg.id);

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
      data: {
        id: existingOrg.id,
        name: existingOrg.name,
        code: existingOrg.code,
        owner: existingOrg.owner,
      },
    });

  } catch (error) {
    console.error('❌ DELETE organization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
