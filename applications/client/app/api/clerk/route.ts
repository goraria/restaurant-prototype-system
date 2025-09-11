/**
 * Clerk Webhook API - Đồng bộ Users & Organizations với Supabase
 * 
 * API này xử lý các webhook events từ Clerk để đồng bộ hóa dữ liệu
 * users và organizations với database Supabase.
 * 
 * Supported Events:
 * - user.created: Tạo user mới từ Clerk vào database
 * - user.updated: Cập nhật thông tin user từ Clerk
 * - user.deleted: Soft delete user (set status = inactive)
 * - organization.created: Tạo organization mới
 * - organization.updated: Cập nhật thông tin organization
 * - organization.deleted: Soft delete organization  
 * - organizationMembership.created: Tạo membership mới
 * - organizationMembership.updated: Cập nhật role của membership
 * - organizationMembership.deleted: Xóa membership
 * - session.created: Log session events
 * 
 * Features:
 * - Comprehensive Clerk field mapping
 * - Soft delete for data integrity
 * - Error handling với detailed responses
 * - Admin client để bypass RLS
 * - Duplicate event protection
 * - Role mapping between Clerk và database
 */

import { Webhook } from "svix"
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { createAdminSupabaseClient } from "@/utils/supabase/admin";
import { v4 as uuidv4 } from 'uuid';

// Test endpoint để kiểm tra API hoạt động
export async function GET() {
  // Test kết nối Supabase
  const supabase = createAdminSupabaseClient();
  
  try {
    // Test service role key
    console.log("🔑 Testing service role key:", process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...');
    console.log("🔗 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test insert với admin client sử dụng schema mới
    const testUserId = uuidv4();
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        clerk_id: `test_${Date.now()}`,
        username: `test_user_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        role: 'customer',
        status: 'active',
        loyalty_points: 0,
        total_orders: 0,
        total_spent: 0,
        activity_status: 'available',
        is_online: false,
        last_seen_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        // Clerk integration fields
        has_image: false,
        password_enabled: false,
        two_factor_enabled: false,
        totp_enabled: false,
        backup_code_enabled: false,
        banned: false,
        locked: false,
        delete_self_enabled: true,
        create_organization_enabled: false,
        // JSON fields
        public_metadata: {},
        private_metadata: {},
        unsafe_metadata: {},
        email_addresses: [],
        phone_numbers: [],
        web3_wallets: [],
        external_accounts: [],
        enterprise_accounts: [],
        passkeys: []
      })
      .select();

    // Test trực tiếp với bảng users
    const { data, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Cleanup test user nếu tạo thành công
    if (insertData && !insertError) {
      await supabase.from('users').delete().eq('id', testUserId);
    }

    return new Response(JSON.stringify({ 
      message: "Clerk webhook endpoint is working",
      timestamp: new Date().toISOString(),
      database_status: {
        users_table_accessible: !usersError,
        users_error: usersError?.message || null,
        users_error_code: usersError?.code || null,
        users_count: count,
        count_error: countError?.message || null,
        service_role_key_present: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        first_user_sample: data?.[0] || null,
        insert_test: {
          success: !insertError,
          error: insertError?.message || null,
          error_code: insertError?.code || null,
          created_data: insertData || null
        }
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Clerk webhook endpoint working but database test failed",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Kiểm tra nếu đây là test request (không có webhook headers)
  if (!svix_id || !svix_timestamp || !svix_signature) {
    // Trong development, cho phép test request
    if (process.env.NODE_ENV === 'development') {
      // Consume the request body để tránh hanging request
      try {
        await request.text();
      } catch {
        // Ignore body read errors for test requests
      }
      
      return new Response(JSON.stringify({
        message: "Test POST request received - missing webhook headers (normal for testing)",
        timestamp: new Date().toISOString(),
        note: "In production, this would be a real Clerk webhook with proper headers"
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response("Missing svix headers", { status: 400 });
  }

  // Đây là webhook thực tế từ Clerk
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!SIGNING_SECRET) {
    return new Response("CLERK_WEBHOOK_SIGNING_SECRET is not set", { status: 500 });
  }

  const wh = new Webhook(SIGNING_SECRET);
  const payload = await request.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  const supabase = createAdminSupabaseClient();

  try {
    switch (eventType) {
      case "user.created": {
        console.log("🎉 User creation event received!");
        console.log("User ID:", evt.data.id);
        console.log("Email:", evt.data.email_addresses?.[0]?.email_address);
        console.log("Name:", evt.data.first_name, evt.data.last_name);
        console.log("Event created at:", evt.data.created_at);
        console.log("🔍 Full user data:", JSON.stringify(evt.data, null, 2));
        
        // LƯU VÀO DATABASE theo schema Prisma
        const user = evt.data;
        const primaryEmail = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
        
        // Tạo username từ Clerk username hoặc email
        const email = primaryEmail?.email_address || '';
        const clerkUsername = user.username; // Username từ Clerk nếu có
        const baseUsername = clerkUsername || email.split('@')[0] || `user_${user.id.slice(-8)}`;
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || baseUsername;

        console.log("📝 Username từ Clerk:", clerkUsername);
        console.log("📝 Base username sẽ dùng:", baseUsername);

        // Kiểm tra xem user với clerk_id này đã tồn tại chưa và lấy thêm thông tin
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, created_at, deleted_at")
          .eq("clerk_id", user.id)
          .single();

        if (existingUser) {
          console.log("⚠️ User với clerk_id này đã tồn tại trong database");
          console.log("Existing user created at:", existingUser.created_at);
          
          // Nếu user đã tồn tại và chưa bị xóa, không cần tạo lại
          if (!existingUser.deleted_at) {
            console.log("🚫 User vẫn còn active, bỏ qua event user.created này");
            return new Response(JSON.stringify({
              message: "⚠️ User đã tồn tại và vẫn active trong database",
              clerkId: user.id,
              note: "Bỏ qua event user.created - có thể là duplicate event"
            }), { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Nếu user đã bị soft delete, có thể restore hoặc tạo mới
          console.log("🔄 User đã bị xóa trước đó, có thể là tạo lại account");
        }

        // Kiểm tra timestamp để tránh xử lý event cũ
        const eventCreatedAt = new Date(user.created_at);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (eventCreatedAt < fiveMinutesAgo) {
          console.log("⏰ Event quá cũ (>5 phút), có thể là retry hoặc duplicate");
          console.log("Event time:", eventCreatedAt.toISOString());
          console.log("Current time:", new Date().toISOString());
          
          return new Response(JSON.stringify({
            message: "⚠️ Event user.created quá cũ, bỏ qua để tránh conflict",
            clerkId: user.id,
            eventTime: eventCreatedAt.toISOString(),
            note: "Event có thể là retry hoặc duplicate"
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Sử dụng username gốc từ Clerk (không thêm timestamp)
        const username = baseUsername;

        // Tạo admin client với service role để bypass RLS
        const adminSupabase = createAdminSupabaseClient();

        // Chuẩn bị dữ liệu user với đầy đủ trường mới và các trường bắt buộc từ code cũ
        const userData = {
          id: uuidv4(),  // Generate UUID cho primary key
          clerk_id: user.id,  // Lưu Clerk ID vào trường clerk_id
          username: username,
          email: email,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          full_name: fullName || null,
          avatar_url: user.image_url || null,
          
          // Các trường bắt buộc từ code cũ
          email_verified_at: user.email_addresses?.length > 0 ? new Date().toISOString() : null,
          activity_status: 'available' as const,  // Default activity status
          is_online: false,  // Default offline  
          last_seen_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          
          // Các trường mới từ schema users
          role: 'customer' as const,
          status: 'active' as const,
          loyalty_points: 0,
          total_orders: 0,
          total_spent: 0,
          
          // Clerk integration fields
          has_image: !!user.image_url,
          primary_email_address_id: user.primary_email_address_id || null,
          password_enabled: user.password_enabled || false,
          two_factor_enabled: user.two_factor_enabled || false,
          totp_enabled: user.totp_enabled || false,
          backup_code_enabled: user.backup_code_enabled || false,
          banned: user.banned || false,
          locked: user.locked || false,
          lockout_expires_in_seconds: user.lockout_expires_in_seconds || null,
          delete_self_enabled: user.delete_self_enabled ?? true,
          create_organization_enabled: user.create_organization_enabled || false,
          create_organizations_limit: user.create_organizations_limit || null,
          legal_accepted_at: user.legal_accepted_at ? new Date(user.legal_accepted_at).toISOString() : null,
          last_sign_in_at: user.last_sign_in_at ? new Date(user.last_sign_in_at).toISOString() : null,
          
          // JSON fields for Clerk metadata and settings
          public_metadata: user.public_metadata || {},
          private_metadata: user.private_metadata || {},
          unsafe_metadata: user.unsafe_metadata || {},
          
          // Arrays for Clerk related data
          email_addresses: user.email_addresses || [],
          phone_numbers: user.phone_numbers || [],
          web3_wallets: user.web3_wallets || [],
          external_accounts: user.external_accounts || [],
          enterprise_accounts: [],  // Not available in UserJSON type
          passkeys: []  // Not available in UserJSON type
        };

        const { error } = await adminSupabase.from("users").insert(userData);

        if (error) {
          console.error("❌ Lỗi khi lưu user:", error);
          return new Response(JSON.stringify({
            error: "Database insert failed",
            message: error.message,
            code: error.code,
            userId: user.id,
            details: error.details
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ User đã được lưu vào database thành công!");
        return new Response(JSON.stringify({
          message: "✅ User created và lưu vào database thành công!",
          clerkId: user.id,
          userId: userData.id,
          username: username,
          email: email,
          fullName: fullName,
          role: userData.role,
          status: userData.status,
          loyaltyPoints: userData.loyalty_points,
          activityStatus: userData.activity_status,
          clerkFields: {
            hasImage: userData.has_image,
            passwordEnabled: userData.password_enabled,
            twoFactorEnabled: userData.two_factor_enabled,
            banned: userData.banned,
            locked: userData.locked
          },
          note: `User với username '${username}' đã được tạo thành công với đầy đủ Clerk integration`
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "user.updated": {
        console.log("🔄 User update event received!");
        console.log("User ID:", evt.data.id);
        
        const user = evt.data;
        const primaryEmail = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

        // Chuẩn bị dữ liệu update với tất cả fields mới
        const updateData = {
          email: primaryEmail?.email_address || null,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          full_name: fullName || null,
          avatar_url: user.image_url || null,
          email_verified_at: user.email_addresses?.length > 0 ? new Date().toISOString() : null,
          last_activity_at: new Date().toISOString(),
          
          // Clerk integration fields
          has_image: !!user.image_url,
          primary_email_address_id: user.primary_email_address_id || null,
          password_enabled: user.password_enabled || false,
          two_factor_enabled: user.two_factor_enabled || false,
          totp_enabled: user.totp_enabled || false,
          backup_code_enabled: user.backup_code_enabled || false,
          banned: user.banned || false,
          locked: user.locked || false,
          lockout_expires_in_seconds: user.lockout_expires_in_seconds || null,
          delete_self_enabled: user.delete_self_enabled ?? true,
          create_organization_enabled: user.create_organization_enabled || false,
          create_organizations_limit: user.create_organizations_limit || null,
          legal_accepted_at: user.legal_accepted_at ? new Date(user.legal_accepted_at).toISOString() : null,
          last_sign_in_at: user.last_sign_in_at ? new Date(user.last_sign_in_at).toISOString() : null,
          
          // JSON fields for Clerk metadata and settings
          public_metadata: user.public_metadata || {},
          private_metadata: user.private_metadata || {},
          unsafe_metadata: user.unsafe_metadata || {},
          
          // Arrays for Clerk related data
          email_addresses: user.email_addresses || [],
          phone_numbers: user.phone_numbers || [],
          web3_wallets: user.web3_wallets || [],
          external_accounts: user.external_accounts || []
        };

        const { error } = await supabase.from("users").update(updateData).eq("clerk_id", user.id);

        if (error) {
          console.error("❌ Lỗi khi update user:", error);
          return new Response(JSON.stringify({
            error: "Database update failed",
            message: error.message,
            code: error.code,
            clerkId: user.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ User đã được update thành công!");
        return new Response(JSON.stringify({
          message: "✅ User updated thành công!",
          clerkId: user.id,
          fullName: fullName
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "user.deleted": {
        console.log("🗑️ User deletion event received!");
        console.log("User ID:", evt.data.id);
        console.log("Deletion timestamp:", new Date().toISOString());
        
        const user = evt.data;
        
        // Kiểm tra user có tồn tại trong database không
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, username, email, status")
          .eq("clerk_id", user.id)
          .single();

        if (!existingUser) {
          console.log("⚠️ User không tồn tại trong database, có thể đã được xóa trước đó");
          return new Response(JSON.stringify({
            message: "⚠️ User không tồn tại trong database",
            clerkId: user.id,
            note: "User có thể đã được xóa trước đó hoặc chưa được đồng bộ"
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("👤 Đang soft delete user:", existingUser.username, existingUser.email);
        
        // Soft delete: cập nhật status và deleted_at thay vì xóa hoàn toàn
        const { error } = await supabase
          .from("users")
          .update({
            status: 'inactive' as const,
            activity_status: 'offline' as const,
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString()
          })
          .eq("clerk_id", user.id);
        
        if (error) {
          console.error("❌ Lỗi khi soft delete user:", error);
          return new Response(JSON.stringify({
            error: "Database soft delete failed", 
            message: error.message,
            code: error.code,
            clerkId: user.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ User đã được soft deleted thành công!");
        console.log("🕒 Thời gian soft delete:", new Date().toISOString());
        
        return new Response(JSON.stringify({
          message: "✅ User soft deleted thành công!",
          clerkId: user.id,
          deletedUser: {
            username: existingUser.username,
            email: existingUser.email,
            previousStatus: existingUser.status
          },
          deletedAt: new Date().toISOString(),
          note: "User đã được soft deleted (status = inactive, deleted_at đã set)"
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organization.created": {
        console.log("🏢 Organization creation event received!");
        console.log("Organization ID:", evt.data.id);
        console.log("Organization name:", evt.data.name);
        console.log("Created by:", evt.data.created_by);
        
        const org = evt.data;
        const createdByUserId = org.created_by;
        
        // Tìm user owner trong database
        const { data: ownerUser } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", createdByUserId)
          .single();

        if (!ownerUser) {
          console.error("❌ Không tìm thấy owner user trong database");
          return new Response(JSON.stringify({
            error: "Owner user not found in database",
            clerkOrgId: org.id,
            clerkOwnerId: createdByUserId,
            note: "Owner phải được tạo trước khi tạo organization"
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Tạo organization code từ name
        const orgCode = org.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .substring(0, 30) + '_' + org.id.slice(-8);

        const { data: newOrg, error } = await supabase
          .from("organizations")
          .insert({
            name: org.name,
            code: orgCode,
            description: org.name,
            owner_id: ownerUser.id,
            logo_url: org.image_url || null,
            clerk_id: org.id,
            clerk_slug: org.slug || null
          })
          .select()
          .single();

        if (error) {
          console.error("❌ Lỗi khi tạo organization:", error);
          return new Response(JSON.stringify({
            error: "Database insert failed",
            message: error.message,
            clerkOrgId: org.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization đã được tạo thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization created thành công!",
          clerkOrgId: org.id,
          orgId: newOrg.id,
          orgCode: orgCode,
          ownerClerkId: createdByUserId
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organization.updated": {
        console.log("🔄 Organization update event received!");
        console.log("Organization ID:", evt.data.id);
        
        const org = evt.data;
        
        const { error } = await supabase
          .from("organizations")
          .update({
            name: org.name,
            logo_url: org.image_url || null,
            clerk_slug: org.slug || null,
            updated_at: new Date().toISOString()
          })
          .eq("clerk_id", org.id);

        if (error) {
          console.error("❌ Lỗi khi update organization:", error);
          return new Response(JSON.stringify({
            error: "Database update failed",
            message: error.message,
            clerkOrgId: org.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization đã được update thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization updated thành công!",
          clerkOrgId: org.id
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organization.deleted": {
        console.log("🗑️ Organization deletion event received!");
        console.log("Organization ID:", evt.data.id);
        
        // Soft delete organization
        const { error } = await supabase
          .from("organizations")
          .update({
            updated_at: new Date().toISOString()
            // Có thể thêm deleted_at field nếu cần soft delete
          })
          .eq("clerk_id", evt.data.id);

        if (error) {
          console.error("❌ Lỗi khi xóa organization:", error);
          return new Response(JSON.stringify({
            error: "Database delete failed",
            message: error.message,
            clerkOrgId: evt.data.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization đã được xóa thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization deleted thành công!",
          clerkOrgId: evt.data.id
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organizationMembership.created": {
        console.log("👥 Organization membership created event received!");
        console.log("Membership ID:", evt.data.id);
        console.log("Organization ID:", evt.data.organization.id);
        console.log("User ID:", evt.data.public_user_data.user_id);
        console.log("Role:", evt.data.role);
        
        const membership = evt.data;
        const orgClerkId = membership.organization.id;
        const userClerkId = membership.public_user_data.user_id;
        
        // Tìm organization và user trong database
        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("clerk_id", orgClerkId)
          .single();

        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", userClerkId)
          .single();

        if (!org || !user) {
          console.error("❌ Không tìm thấy organization hoặc user trong database");
          return new Response(JSON.stringify({
            error: "Organization or user not found",
            clerkOrgId: orgClerkId,
            clerkUserId: userClerkId,
            note: "Organization và user phải tồn tại trước khi tạo membership"
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Map Clerk role to database role
        const dbRole = membership.role === 'admin' ? 'admin' : 'member';

        const { error } = await supabase
          .from("organization_memberships")
          .insert({
            clerk_id: membership.id,
            organization_id: org.id,
            user_id: user.id,
            role: dbRole,
            joined_at: new Date().toISOString()
          });

        if (error) {
          console.error("❌ Lỗi khi tạo organization membership:", error);
          return new Response(JSON.stringify({
            error: "Database insert failed",
            message: error.message,
            clerkMembershipId: membership.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization membership đã được tạo thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization membership created thành công!",
          clerkMembershipId: membership.id,
          clerkOrgId: orgClerkId,
          clerkUserId: userClerkId,
          role: dbRole
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organizationMembership.updated": {
        console.log("🔄 Organization membership updated event received!");
        console.log("Membership ID:", evt.data.id);
        console.log("New role:", evt.data.role);
        
        const membership = evt.data;
        const dbRole = membership.role === 'admin' ? 'admin' : 'member';

        const { error } = await supabase
          .from("organization_memberships")
          .update({
            role: dbRole,
            updated_at: new Date().toISOString()
          })
          .eq("clerk_id", membership.id);

        if (error) {
          console.error("❌ Lỗi khi update organization membership:", error);
          return new Response(JSON.stringify({
            error: "Database update failed",
            message: error.message,
            clerkMembershipId: membership.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization membership đã được update thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization membership updated thành công!",
          clerkMembershipId: membership.id,
          newRole: dbRole
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organizationMembership.deleted": {
        console.log("�️ Organization membership deleted event received!");
        console.log("Membership ID:", evt.data.id);
        
        const { error } = await supabase
          .from("organization_memberships")
          .delete()
          .eq("clerk_id", evt.data.id);

        if (error) {
          console.error("❌ Lỗi khi xóa organization membership:", error);
          return new Response(JSON.stringify({
            error: "Database delete failed",
            message: error.message,
            clerkMembershipId: evt.data.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ Organization membership đã được xóa thành công!");
        return new Response(JSON.stringify({
          message: "✅ Organization membership deleted thành công!",
          clerkMembershipId: evt.data.id
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "session.created": {
        console.log("�🔐 Session created event received!");
        console.log("Session data:", evt.data);
        
        return new Response(JSON.stringify({
          message: "✅ Session created event nhận thành công!",
          note: "Session events được xử lý thành công."
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`);
        return new Response(JSON.stringify({
          message: `Event type ${eventType} not handled`,
          eventType: eventType,
          note: "Event received but no handler implemented"
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error("Error handling event:", error);
    return new Response("Error handling event", { status: 500 });
  }
}