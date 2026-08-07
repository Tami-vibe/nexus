import { NextResponse } from "next/server";
import { z } from "zod";
import { CONSENT_COOKIE } from "@/lib/gdpr/consent";

const bodySchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const value = encodeURIComponent(
    JSON.stringify({
      essential: true,
      analytics: parsed.data.analytics,
      marketing: parsed.data.marketing,
    }),
  );

  const res = NextResponse.json({ ok: true, consent: parsed.data });
  res.cookies.set(CONSENT_COOKIE, value, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
