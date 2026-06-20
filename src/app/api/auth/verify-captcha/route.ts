import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/turnstile";

const verifyCaptchaSchema = z.object({
  token: z.string().trim().min(1).nullable().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = verifyCaptchaSchema.safeParse(await req.json().catch(() => ({})));
  const token = parsed.success ? parsed.data.token : undefined;
  const ip = req.headers.get("x-client-ip") ?? undefined;
  const result = await verifyTurnstileToken(token, ip);

  if (!result.success) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "TURNSTILE_FAILED", message: "Verifikasi keamanan gagal." },
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}
