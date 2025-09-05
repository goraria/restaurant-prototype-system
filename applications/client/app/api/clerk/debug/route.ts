import { createAdminSupabaseClient } from "@/utils/supabase/admin";
import { NextRequest } from 'next/server';

// Debug endpoint để kiểm tra trạng thái users
export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  const searchParams = request.nextUrl.searchParams;
  const clerkId = searchParams.get('clerk_id');
  
  try {
    if (clerkId) {
      // Kiểm tra user cụ thể theo clerk_id
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

      return new Response(JSON.stringify({
        message: "Debug user by clerk_id",
        clerkId,
        user: user || null,
        exists: !!user,
        error: error?.message || null,
        timestamp: new Date().toISOString()
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Lấy danh sách tất cả users gần đây
    const { data: users, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);

    return new Response(JSON.stringify({
      message: "Debug all users (latest 10)",
      total_users: count,
      users: users || [],
      error: error?.message || null,
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      message: "Debug endpoint error",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Debug POST để simulate webhook events và test logic
export async function POST(request: Request) {
  const body = await request.json();
  const { action, clerk_id } = body;

  const supabase = createAdminSupabaseClient();

  try {
    switch (action) {
      case "check_user": {
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerk_id)
          .single();

        return new Response(JSON.stringify({
          action: "check_user",
          clerk_id,
          user: user || null,
          exists: !!user,
          timestamp: new Date().toISOString()
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "force_delete": {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('clerk_id', clerk_id);

        return new Response(JSON.stringify({
          action: "force_delete",
          clerk_id,
          success: !error,
          error: error?.message || null,
          timestamp: new Date().toISOString()
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case "list_recent_events": {
        // Giả lập log events (trong thực tế bạn có thể lưu webhook events vào table riêng)
        return new Response(JSON.stringify({
          action: "list_recent_events",
          note: "Để track events tốt hơn, hãy tạo bảng webhook_events để lưu lại lịch sử",
          suggestion: "CREATE TABLE webhook_events (id UUID PRIMARY KEY, event_type VARCHAR, clerk_id VARCHAR, payload JSONB, created_at TIMESTAMP)",
          timestamp: new Date().toISOString()
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          error: "Unknown action",
          available_actions: ["check_user", "force_delete", "list_recent_events"],
          timestamp: new Date().toISOString()
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Debug action failed",
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
