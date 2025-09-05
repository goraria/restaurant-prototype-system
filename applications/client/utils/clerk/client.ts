import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function createClerkSupabaseClient() {
  const { getToken } = await auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      global: {
        // headers: {
        //   Authorization: `Bearer ${data.supabase_id}`,
        // },
        fetch: async (url, options) => {
          const token = await getToken({
            template: "supabase"
          });

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${token}`);

          return fetch(url, { ...options, headers });
        }
      },
    }
  );
}