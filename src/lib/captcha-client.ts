type CaptchaVerifyResponse = {
  data: { success: boolean } | null;
  error: { code: string; message: string } | null;
};

type CaptchaVerifyResult =
  | { success: true; code: null; message: null }
  | { success: false; code: string; message: string };

export async function verifyCaptchaToken(token: string | null): Promise<CaptchaVerifyResult> {
  const response = await fetch("/api/auth/verify-captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const json = (await response.json()) as CaptchaVerifyResponse;

  if (response.status === 403 && json.error?.code === "TURNSTILE_FAILED") {
    return {
      success: false,
      code: json.error.code,
      message: "Verifikasi keamanan gagal. Silakan refresh halaman lalu coba lagi.",
    };
  }

  if (!response.ok || !json.data?.success) {
    return {
      success: false,
      code: json.error?.code ?? "CAPTCHA_VERIFY_FAILED",
      message: json.error?.message ?? "Verifikasi keamanan gagal. Silakan coba lagi.",
    };
  }

  return { success: true, code: null, message: null };
}
