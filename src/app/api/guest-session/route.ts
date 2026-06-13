import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeThemeSelection } from "@/lib/default-theme";
import {
  claimGuestSession,
  GUEST_SESSION_COOKIE,
  GUEST_TRIAL_MINUTES,
  getGuestExpiry,
  getRemainingSeconds,
} from "@/lib/guest-session-server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const createGuestSessionSchema = z.object({
  groomName: z.string().trim().max(100).optional(),
  brideName: z.string().trim().max(100).optional(),
  themeId: z.string().trim().nullable().optional(),
  invitationData: z.record(z.string(), z.unknown()).default({}),
});

const updateGuestSessionSchema = z.object({
  themeId: z.string().trim().nullable().optional(),
  invitationData: z.record(z.string(), z.unknown()).optional(),
});

type GuestSessionRow = {
  id: string;
  session_token: string;
  slug: string;
  status: string;
  expires_at: string;
  invitation_data: Record<string, unknown>;
  theme_id: string | null;
};

function responseError(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({ data: null, error: { code, message, details } }, { status });
}

function readName(data: Record<string, unknown>, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24) || "mempelai";
}

function createSlug(groomName: string, brideName: string) {
  return `${slugPart(groomName)}-${slugPart(brideName)}-${randomUUID().replace(/-/g, "").slice(0, 5)}`;
}

function setGuestCookie(response: NextResponse, token: string, maxAge: number) {
  response.cookies.set(GUEST_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function POST(request: NextRequest) {
  const parsed = createGuestSessionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return responseError("VALIDATION_ERROR", "Data undangan tidak valid.", 400, parsed.error.flatten().fieldErrors);
  }

  const admin = getAdminClient();
  if (!admin) return responseError("DATABASE_ERROR", "Database client tidak tersedia.", 500);

  const invitationData = parsed.data.invitationData;
  const groomName =
    parsed.data.groomName ??
    readName(invitationData, ["groom_nickname", "groomNickname", "groom_full_name", "groomFullName"], "pria");
  const brideName =
    parsed.data.brideName ??
    readName(invitationData, ["bride_nickname", "brideNickname", "bride_full_name", "brideFullName"], "wanita");

  let slug = createSlug(groomName, brideName);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: guestMatch } = await admin.from("guest_sessions").select("id").eq("slug", slug).maybeSingle();
    const { data: invitationMatch } = await admin.from("invitations").select("id").eq("slug", slug).maybeSingle();
    if (!guestMatch && !invitationMatch) break;
    slug = createSlug(groomName, brideName);
  }

  const sessionToken = randomUUID();
  const expiresAt = getGuestExpiry();
  const { data, error } = await admin
    .from("guest_sessions")
    .insert({
      session_token: sessionToken,
      slug,
      invitation_data: invitationData,
      theme_id: normalizeThemeSelection(parsed.data.themeId),
      expires_at: expiresAt,
      status: "preview",
    })
    .select("id, session_token, slug, expires_at")
    .single();

  if (error || !data) {
    console.error("[POST /api/guest-session] Insert failed:", error);
    return responseError("INSERT_FAILED", "Gagal membuat undangan sementara.", 500, error?.message);
  }

  const response = NextResponse.json(
    {
      data: {
        sessionId: data.session_token,
        slug: data.slug,
        expiresAt: data.expires_at,
      },
      error: null,
    },
    { status: 201 },
  );
  setGuestCookie(response, sessionToken, GUEST_TRIAL_MINUTES * 60);
  return response;
}

export async function PATCH(request: NextRequest) {
  const patchBody = updateGuestSessionSchema.safeParse(await request.json().catch(() => ({})));
  if (!patchBody.success) {
    return responseError("VALIDATION_ERROR", "Perubahan undangan tidak valid.", 400, patchBody.error.flatten().fieldErrors);
  }

  const token = request.cookies.get(GUEST_SESSION_COOKIE)?.value;
  if (!token) return responseError("SESSION_NOT_FOUND", "Sesi undangan tidak ditemukan.", 404);

  const supabase = await createServerSupabaseClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const adminAuth = getAdminClient();
      const {
        data: { user: bearerUser },
      } = adminAuth ? await adminAuth.auth.getUser(authHeader.slice(7)) : { data: { user: null } };
      user = bearerUser;
    }
  }
  if (!user) return responseError("UNAUTHORIZED", "Silakan masuk terlebih dahulu.", 401);

  const admin = getAdminClient();
  if (!admin) return responseError("DATABASE_ERROR", "Database client tidak tersedia.", 500);

  const result = await claimGuestSession(admin, token, user.id);
  if (result.error) {
    return responseError(result.error.code, result.error.message, result.error.code === "SESSION_EXPIRED" ? 410 : 404);
  }

  if (patchBody.data.invitationData || patchBody.data.themeId !== undefined) {
    const updates: Record<string, unknown> = {};
    if (patchBody.data.invitationData) updates.invitation_data = patchBody.data.invitationData;
    if (patchBody.data.themeId !== undefined) updates.theme_id = normalizeThemeSelection(patchBody.data.themeId);

    const { error: updateError } = await admin
      .from("guest_sessions")
      .update(updates)
      .eq("session_token", token)
      .eq("user_id", user.id)
      .eq("status", "claimed");

    if (updateError) {
      console.error("[PATCH /api/guest-session] Draft update failed:", updateError);
      return responseError("UPDATE_FAILED", "Gagal memperbarui undangan sementara.", 500);
    }
  }

  const response = NextResponse.json({ data: result.data, error: null });
  setGuestCookie(response, token, result.data.remainingSeconds);
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(GUEST_SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ data: { status: "none" }, error: null });

  const admin = getAdminClient();
  if (!admin) return responseError("DATABASE_ERROR", "Database client tidak tersedia.", 500);

  const { data, error } = await admin
    .from("guest_sessions")
    .select("id, session_token, slug, status, expires_at, invitation_data, theme_id")
    .eq("session_token", token)
    .maybeSingle();
  const session = data as GuestSessionRow | null;

  if (error || !session || getRemainingSeconds(session.expires_at) <= 0) {
    if (session?.status === "preview") {
      await admin.from("guest_sessions").update({ status: "expired" }).eq("id", session.id);
    }
    const response = NextResponse.json({ data: { status: "none" }, error: null });
    response.cookies.delete(GUEST_SESSION_COOKIE);
    return response;
  }

  return NextResponse.json({
    data: {
      status: session.status,
      expiresAt: session.expires_at,
      remainingSeconds: getRemainingSeconds(session.expires_at),
      slug: session.slug,
      invitationData: session.invitation_data,
      themeId: session.theme_id,
    },
    error: null,
  });
}
