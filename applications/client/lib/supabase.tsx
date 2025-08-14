"use client";

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSession } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContextType>({
  supabase: null,
  isLoaded: false,
});

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!session) return

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        accessToken: () => session?.getToken(),
        // auth: {
        //   autoRefreshToken: false,
        //   persistSession: false,
        //   detectSessionInUrl: false,
        // }
    })

    setSupabase(client);
    setIsLoaded(true);
  }, [session]);

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {isLoaded ? <>Loading ...</> : children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}