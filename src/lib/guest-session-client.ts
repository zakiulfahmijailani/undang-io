type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

type ClaimResult = {
  slug: string;
  expiresAt: string;
  remainingSeconds: number;
};

export type CreateGuestSessionPayload = {
  groomName?: string;
  brideName?: string;
  themeId?: string | null;
  invitationData: Record<string, unknown>;
  website?: string;
  fingerprint?: string | null;
  cf_turnstile_token?: string | null;
};

export type CreateGuestSessionResult = {
  sessionId: string;
  slug: string;
  expiresAt: string;
};

export async function createGuestSession(payload: CreateGuestSessionPayload) {
  let fingerprint = payload.fingerprint;

  if (!fingerprint && typeof window !== "undefined") {
    try {
      fingerprint = sessionStorage.getItem("device_fp");
    } catch (error) {
      console.error("[createGuestSession] Failed to read device fingerprint:", error);
    }
  }

  const response = await fetch("/api/guest-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, fingerprint }),
  });
  const json = (await response.json()) as ApiResponse<CreateGuestSessionResult>;

  return { response, json };
}

export function getGuestTokenFromStorage(searchParams: URLSearchParams): string | null {
  try {
    const raw = localStorage.getItem("guest_session");
    if (raw) {
      const parsed = JSON.parse(raw) as { sessionToken?: string; expiresAt?: string };
      if (parsed.sessionToken) {
        if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() <= Date.now()) {
          localStorage.removeItem("guest_session");
        } else {
          return parsed.sessionToken;
        }
      }
    }

    return localStorage.getItem("pending_claim_token") ?? searchParams.get("guest_token");
  } catch (error) {
    console.error("[getGuestTokenFromStorage] Failed:", error);
    return searchParams.get("guest_token");
  }
}

export async function hasCookieGuestSession() {
  try {
    const response = await fetch("/api/guest-session", { cache: "no-store" });
    const json = (await response.json()) as ApiResponse<{ status: string }>;
    return response.ok && json.data?.status !== "none";
  } catch (error) {
    console.error("[hasCookieGuestSession] Failed:", error);
    return false;
  }
}

export async function claimCurrentGuestSession(accessToken: string, legacyToken?: string | null) {
  const currentResponse = await fetch("/api/guest-session", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const currentJson = (await currentResponse.json()) as ApiResponse<ClaimResult>;

  if (currentResponse.ok && currentJson.data) return currentJson;
  if (!legacyToken) return currentJson;

  const legacyResponse = await fetch(`/api/guest-sessions/${legacyToken}/claim`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const legacyJson = (await legacyResponse.json()) as ApiResponse<{
    slug: string;
    expiresAt: string;
    timeRemainingMs: number;
  }>;

  if (!legacyResponse.ok || !legacyJson.data) {
    return {
      data: null,
      error: legacyJson.error ?? currentJson.error ?? { code: "CLAIM_FAILED", message: "Gagal menyimpan undangan sementara." },
    };
  }

  return {
    data: {
      slug: legacyJson.data.slug,
      expiresAt: legacyJson.data.expiresAt,
      remainingSeconds: Math.max(0, Math.ceil(legacyJson.data.timeRemainingMs / 1000)),
    },
    error: null,
  } satisfies ApiResponse<ClaimResult>;
}
