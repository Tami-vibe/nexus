import { NextResponse } from "next/server";
import { z } from "zod";
import { loginMerchant } from "@/lib/auth/jwt";

const bodySchema = z.object({
  vat_number: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await loginMerchant(parsed.data);
  if (!result) {
    return NextResponse.json({ error: "Unknown VAT" }, { status: 404 });
  }

  return NextResponse.json({
    access_token: result.token,
    token_type: "bearer",
    vat_number: result.vat_number,
    claim_shape: { vat_number: result.vat_number },
  });
}
