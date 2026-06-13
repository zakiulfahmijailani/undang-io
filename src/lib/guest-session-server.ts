import type { SupabaseClient } from "@supabase/supabase-js";

export const GUEST_SESSION_COOKIE = "guest_session_token";
export const GUEST_TRIAL_MINUTES = 5;
export const CLAIMED_TRIAL_TOTAL_MINUTES = 15;

type GuestSessionRow = {
  id: string;
  session_token: string;
  slug: string;
  status: string;
  user_id: string | null;
  created_at: string;
  expires_at: string;
  invitation_data: Record<string, unknown>;
  converted_to_invitation_id: string | null;
};

export type ClaimedGuestSession = {
  slug: string;
  expiresAt: string;
  remainingSeconds: number;
};

export type ClaimGuestSessionResult =
  | { data: ClaimedGuestSession; error: null }
  | { data: null; error: { code: string; message: string } };

export function getRemainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function getClaimedExpiry(createdAt: string): string {
  return new Date(new Date(createdAt).getTime() + CLAIMED_TRIAL_TOTAL_MINUTES * 60 * 1000).toISOString();
}

export function getGuestExpiry(): string {
  return new Date(Date.now() + GUEST_TRIAL_MINUTES * 60 * 1000).toISOString();
}

export async function claimGuestSession(
  admin: SupabaseClient,
  sessionToken: string,
  userId: string,
): Promise<ClaimGuestSessionResult> {
  const { data, error } = await admin
    .from("guest_sessions")
    .select(
      "id, session_token, slug, status, user_id, created_at, expires_at, invitation_data, converted_to_invitation_id",
    )
    .eq("session_token", sessionToken)
    .maybeSingle();

  const session = data as GuestSessionRow | null;

  if (error || !session) {
    return {
      data: null,
      error: { code: "SESSION_NOT_FOUND", message: "Sesi undangan tidak ditemukan." },
    };
  }

  if (session.converted_to_invitation_id || session.status === "converted") {
    return {
      data: null,
      error: { code: "ALREADY_CONVERTED", message: "Undangan ini sudah menjadi permanen." },
    };
  }

  if (session.status === "claimed" && session.user_id === userId && getRemainingSeconds(session.expires_at) > 0) {
    return {
      data: {
        slug: session.slug,
        expiresAt: session.expires_at,
        remainingSeconds: getRemainingSeconds(session.expires_at),
      },
      error: null,
    };
  }

  if (session.status !== "preview" || getRemainingSeconds(session.expires_at) <= 0) {
    if (session.status === "preview") {
      await admin.from("guest_sessions").update({ status: "expired" }).eq("id", session.id);
    }

    return {
      data: null,
      error: { code: "SESSION_EXPIRED", message: "Waktu undangan sementara sudah habis." },
    };
  }

  const expiresAt = getClaimedExpiry(session.created_at);
  if (getRemainingSeconds(expiresAt) <= 0) {
    await admin.from("guest_sessions").update({ status: "expired" }).eq("id", session.id);
    return {
      data: null,
      error: { code: "SESSION_EXPIRED", message: "Waktu undangan sementara sudah habis." },
    };
  }

  const { data: updated, error: updateError } = await admin
    .from("guest_sessions")
    .update({
      user_id: userId,
      status: "claimed",
      expires_at: expiresAt,
    })
    .eq("id", session.id)
    .eq("status", "preview")
    .select("slug, expires_at")
    .single();

  if (updateError || !updated) {
    console.error("[claimGuestSession] Update failed:", updateError);
    return {
      data: null,
      error: { code: "CLAIM_FAILED", message: "Gagal menyimpan undangan sementara." },
    };
  }

  return {
    data: {
      slug: updated.slug as string,
      expiresAt: updated.expires_at as string,
      remainingSeconds: getRemainingSeconds(updated.expires_at as string),
    },
    error: null,
  };
}
