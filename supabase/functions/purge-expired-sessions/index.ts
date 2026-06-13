import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ ok: false, error: "Konfigurasi Supabase belum lengkap." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = new Date().toISOString();

  const { error: markError } = await supabase
    .from("guest_sessions")
    .update({ status: "expired" })
    .lt("expires_at", now)
    .eq("status", "preview");

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { error: deleteError } = await supabase
    .from("guest_sessions")
    .delete()
    .lt("expires_at", cutoff)
    .in("status", ["preview", "expired"])
    .is("converted_to_invitation_id", null);

  const error = markError ?? deleteError;
  return new Response(JSON.stringify({ ok: !error, error: error?.message ?? null }), {
    status: error ? 500 : 200,
    headers: { "Content-Type": "application/json" },
  });
});
