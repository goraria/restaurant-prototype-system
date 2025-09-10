/**
 * Clerk Webhook API - Đồng bộ Users & Organizations với Supabase
 * 
 * API này xử lý các webhook events từ Clerk để đồng bộ hóa dữ liệu
 * users và organizations với database Supabase.
 * 
 * Supported Events:
 * - user.created: Tạo user mới từ Clerk vào database
 * - user.updated: Cập nhật thông tin user từ Clerk
 * - user.deleted: Hard delete user khỏi database
 * - organization.created: Tạo organization mới
 * - organization.updated: Cập nhật thông tin organization
 * - organization.deleted: Hard delete organization (schema không hỗ trợ soft delete)  
 * - session.created: Log session events
 * 
 * Features:
 * - Comprehensive Clerk field mapping
 * - Soft delete for data integrity
 * - Error handling với detailed responses
 * - Admin client để bypass RLS
 * - Duplicate event protection
 * - Unique username generation
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
        activity_status: 'available',
        is_online: false,
        loyalty_points: 0,
        total_orders: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      })
      .select();

    if (insertError) {
      console.error("❌ Insert test failed:", insertError);
      return Response.json({
        status: "error",
        message: "Database insert test failed",
        error: insertError,
        timestamp: new Date().toISOString()
      });
    }

    console.log("✅ Insert test successful:", insertData);

    // Cleanup test data
    await supabase.from('users').delete().eq('id', testUserId);

    return Response.json({
      status: "success",
      message: "✅ Clerk webhook API is ready!",
      features: [
        "User sync (created/updated/deleted)",
        "Organization sync (created/updated/deleted)",
        "Unique username generation",
        "Comprehensive Clerk field mapping",
        "Admin client with RLS bypass",
        "Detailed error handling"
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ API test failed:", error);
    return Response.json({
      status: "error", 
      message: "API test failed",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Get webhook signature headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Check for required headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.text();
  const body = payload;

  // Create new Svix instance với webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET || "");

  let evt: WebhookEvent;

  // Verify webhook signature
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

        // Tạo unique username nếu đã tồn tại
        let uniqueUsername = baseUsername;
        let counter = 1;
        while (true) {
          const { data: existingUsername } = await supabase
            .from("users")
            .select("username")
            .eq("username", uniqueUsername)
            .single();

          if (!existingUsername) {
            break; // Username này chưa tồn tại, dùng được
          }
          
          uniqueUsername = `${baseUsername}_${counter}`;
          counter++;
          
          // Giới hạn để tránh vòng lặp vô tận
          if (counter > 100) {
            uniqueUsername = `${baseUsername}_${Date.now()}`;
            break;
          }
        }

        console.log("📝 Final unique username:", uniqueUsername);

        // Kiểm tra xem user với clerk_id này đã tồn tại chưa 
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, username, email, created_at")
          .eq("clerk_id", user.id)
          .single();

        if (existingUser) {
          console.log("⚠️ User với clerk_id này đã tồn tại trong database");
          console.log("📋 Existing user info:", existingUser);
          
          console.log("� User đã tồn tại, bỏ qua event user.created này");
          return new Response(JSON.stringify({
            message: "⚠️ User đã tồn tại trong database",
            clerkId: user.id,
            existingUser: existingUser,
            note: "Bỏ qua event user.created - có thể là duplicate event"
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
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

        // Sử dụng unique username đã tạo
        const username = uniqueUsername;

        // Tạo admin client với service role để bypass RLS
        const adminSupabase = createAdminSupabaseClient();

        // Chuẩn bị dữ liệu user với đầy đủ trường mới và các trường bắt buộc từ code cũ
        const currentTime = new Date().toISOString();
        
        const userData = {
          id: uuidv4(),  // Generate UUID cho primary key
          clerk_id: user.id,  // Lưu Clerk ID vào trường clerk_id
          username: username,
          email: email,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          full_name: fullName || null,
          avatar_url: user.image_url || null,
          
          // Timestamps bắt buộc
          created_at: currentTime,
          updated_at: currentTime,
          
          // Các trường bắt buộc từ code cũ
          email_verified_at: user.email_addresses?.length > 0 ? currentTime : null,
          activity_status: 'available' as const,  // Default activity status
          is_online: false,  // Default offline  
          last_seen_at: currentTime,
          last_activity_at: currentTime,
          
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
          message: "✅ User created thành công!",
          clerkId: user.id,
          username: username,
          email: email,
          fullName: fullName,
          note: "User data đã được sync từ Clerk sang Supabase"
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
        const email = primaryEmail?.email_address || '';
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

        const updateData = {
          email: email,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          full_name: fullName || null,
          avatar_url: user.image_url || null,
          updated_at: new Date().toISOString(),
          
          // Update Clerk integration fields
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
          
          // Update JSON fields
          public_metadata: user.public_metadata || {},
          private_metadata: user.private_metadata || {},
          unsafe_metadata: user.unsafe_metadata || {},
          
          // Update arrays
          email_addresses: user.email_addresses || [],
          phone_numbers: user.phone_numbers || [],
          web3_wallets: user.web3_wallets || [],
          external_accounts: user.external_accounts || []
        };

        const { error } = await supabase
          .from("users")
          .update(updateData)
          .eq("clerk_id", user.id);

        if (error) {
          console.error("❌ Lỗi khi update user:", error);
          return new Response(JSON.stringify({
            error: "Database update failed",
            message: error.message,
            userId: user.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ User đã được update thành công!");
        return new Response(JSON.stringify({
          message: "✅ User updated thành công!",
          clerkId: user.id,
          email: email,
          fullName: fullName
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "user.deleted": {
        console.log("🗑️ User delete event received!");
        console.log("User ID:", evt.data.id);
        
        try {
          // Kiểm tra user có tồn tại không trước khi xóa
          const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("id, username, email")
            .eq("clerk_id", evt.data.id)
            .single();

          if (checkError || !existingUser) {
            console.log("⚠️ User không tồn tại trong database với clerk_id:", evt.data.id);
            console.log("Check error:", checkError);
            return new Response(JSON.stringify({
              message: "⚠️ User not found in database",
              clerkId: evt.data.id,
              error: checkError?.message
            }), { 
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          console.log("📋 User sẽ bị xóa:", existingUser);

          // Hard delete user khỏi database
          const { error } = await supabase
            .from("users")
            .delete()
            .eq("clerk_id", evt.data.id);

          if (error) {
            console.error("❌ Lỗi khi xóa user:", error);
            return new Response(JSON.stringify({
              error: "Database delete failed",
              message: error.message,
              userId: evt.data.id
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          console.log("✅ User đã được xóa thành công khỏi database!");
          
          return new Response(JSON.stringify({
            message: "✅ User deleted successfully!",
            clerkId: evt.data.id,
            deletedUser: existingUser,
            note: "User đã được xóa hoàn toàn khỏi database"
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });

        } catch (error) {
          console.error("❌ Lỗi khi xử lý user deletion:", error);
          return new Response(JSON.stringify({
            error: "Internal server error",
            message: error instanceof Error ? error.message : 'Unknown error',
            userId: evt.data.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      case "organization.created": {
        console.log("🏢 Organization created event received!");
        console.log("Organization ID:", evt.data.id);
        console.log("Organization name:", evt.data.name);
        
        const org = evt.data;
        const currentTime = new Date().toISOString();

        // Tìm user đầu tiên để làm owner (có thể cần logic khác)
        const { data: firstUser } = await supabase
          .from("users")
          .select("id")
          .limit(1)
          .single();

        if (!firstUser) {
          console.error("❌ Không tìm thấy user nào để làm owner cho organization");
          return new Response(JSON.stringify({
            error: "No user found to be organization owner",
            clerkOrgId: org.id,
            note: "Cần có ít nhất 1 user trong database để tạo organization"
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const orgData = {
          id: uuidv4(),  // Generate UUID cho primary key
          name: org.name,
          code: org.slug || `org_${Date.now()}`, // Tạo code từ slug hoặc timestamp
          description: null,
          owner_id: firstUser.id, // Sử dụng user đầu tiên làm owner
          clerk_id: org.id,
          clerk_slug: org.slug,
          logo_url: org.image_url || null,
          created_at: currentTime,
          updated_at: currentTime
        };

        const { error } = await supabase.from("organizations").insert(orgData);

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
          name: org.name,
          code: orgData.code
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organization.updated": {
        console.log("🔄 Organization updated event received!");
        console.log("Organization ID:", evt.data.id);
        
        const org = evt.data;

        const updateData = {
          name: org.name,
          clerk_slug: org.slug,
          logo_url: org.image_url || null,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from("organizations")
          .update(updateData)
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
          clerkOrgId: org.id,
          name: org.name
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "organization.deleted": {
        console.log("🗑️ Organization deleted event received!");
        console.log("Organization ID:", evt.data.id);
        
        try {
          // Hard delete organization từ database vì schema không hỗ trợ soft delete
          const { error } = await supabase
            .from('organizations')
            .delete()
            .eq('clerk_id', evt.data.id);

          if (error) {
            console.error('❌ Lỗi khi xóa organization:', error);
            throw error;
          } else {
            console.log('✅ Organization đã được xóa thành công khỏi database!');
          }

          return new Response(JSON.stringify({
            message: "✅ Organization deleted successfully!",
            clerkOrgId: evt.data.id
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });

        } catch (error) {
          console.error('❌ Lỗi khi xử lý organization deletion:', error);
          
          return new Response(JSON.stringify({
            message: "❌ Error deleting organization",
            clerkOrgId: evt.data.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      case "organizationMembership.created":
      case "organizationMembership.updated":
      case "organizationMembership.deleted": {
        console.log(`👥 Organization membership event received: ${eventType}`);
        console.log("Event data:", evt.data);
        
        return new Response(JSON.stringify({
          message: `✅ ${eventType} event received and logged!`,
          eventType: eventType,
          note: "Organization membership events are logged but not processed per request"
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "session.created": {
        console.log("🔐 Session created event received!");
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
