type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

type ClaimResult = {
  slug: string;
  expiresAt: string;
  remainingSeconds: number;
};

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
