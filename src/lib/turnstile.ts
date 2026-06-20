interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
}

interface CloudflareTurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Turnstile] Secret not set; bypassing in dev");
      return { success: true };
    }

    console.error("[Turnstile] Secret missing in production");
    return { success: false, errorCodes: ["missing-secret"] };
  }

  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as CloudflareTurnstileResponse;

    if (!data.success) {
      return {
        success: false,
        errorCodes: data["error-codes"] ?? ["unknown"],
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Turnstile] Siteverify request failed:", error);
    return { success: true };
  }
}
