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
    
    // Test insert với admin client
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
        activity_status: 'available',
        is_online: false,
        last_seen_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
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

        const { error } = await adminSupabase.from("users").insert({
          id: uuidv4(),  // Generate UUID cho primary key bằng uuid package
          clerk_id: user.id,  // Lưu Clerk ID vào trường clerk_id
          username: username,
          email: email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          full_name: fullName,
          avatar_url: user.image_url || null,
          email_verified_at: user.email_addresses?.length > 0 ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),  // Phải thêm vì @updatedAt chỉ hoạt động với Prisma Client
          activity_status: 'available',  // Default activity status
          is_online: false,  // Default offline
          last_seen_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        });

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
          username: username,
          email: email,
          fullName: fullName,
          note: `Username được tạo: ${username}`
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

        // Tạo admin client với service role để bypass RLS
        const adminSupabase = createAdminSupabaseClient();

        const { error } = await adminSupabase.from("users").update({
          email: primaryEmail?.email_address || null,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          full_name: fullName || null,
          avatar_url: user.image_url || null,
          updated_at: new Date().toISOString(),  // Phải thêm manual khi dùng Supabase client
          last_activity_at: new Date().toISOString()
        }).eq("clerk_id", user.id);  // Sử dụng clerk_id để tìm user

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
          .select("id, username, email")
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

        console.log("👤 Đang xóa user:", existingUser.username, existingUser.email);
        
        // Hard delete: xóa hoàn toàn user khỏi database
        const { error } = await supabase.from("users").delete().eq("clerk_id", user.id);
        
        if (error) {
          console.error("❌ Lỗi khi xóa user:", error);
          return new Response(JSON.stringify({
            error: "Database delete failed", 
            message: error.message,
            code: error.code,
            clerkId: user.id
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log("✅ User đã được xóa khỏi database thành công!");
        console.log("🕒 Thời gian xóa:", new Date().toISOString());
        
        return new Response(JSON.stringify({
          message: "✅ User deleted thành công!",
          clerkId: user.id,
          deletedUser: {
            username: existingUser.username,
            email: existingUser.email
          },
          deletedAt: new Date().toISOString(),
          note: "User đã được xóa hoàn toàn khỏi database"
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
        return new Response("Event type not handled", { status: 200 });
    }
  } catch (error) {
    console.error("Error handling event:", error);
    return new Response("Error handling event", { status: 500 });
  }
}