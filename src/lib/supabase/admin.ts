import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdmin: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient | null {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    if (!supabaseUrl) console.error("❌ [admin.ts] NEXT_PUBLIC_SUPABASE_URL is missing.");
    if (!serviceRoleKey) console.error("❌ [admin.ts] SUPABASE_SERVICE_ROLE_KEY is missing.");
    return null;
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  return supabaseAdmin;
}
