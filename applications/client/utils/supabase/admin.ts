import { createClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  console.log("🔑 Creating admin client with URL:", supabaseUrl);
  console.log("🔑 Service role key present:", !!serviceRoleKey);
  console.log("🔑 Anon key present:", !!anonKey);
  
  // Thử với anon key vì RLS đã disable
  if (!serviceRoleKey || serviceRoleKey.length < 100) {
    console.log("⚠️ Service role key có vấn đề, dùng anon key vì RLS đã disable");
    return createClient(supabaseUrl, anonKey);
  }
  
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
