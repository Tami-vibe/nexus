import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getTenantByVat } from "@/lib/tenants";

const bodySchema = z.object({
  vat_number: z.string().min(3).max(50),
  business_name: z.string().min(2).max(255).optional(),
  sector: z
    .enum([
      "GYM",
      "SALON",
      "CLINIC",
      "POOL",
      "RETAIL",
      "ARTISAN",
      "DIGITAL",
      "CONSULTING",
    ])
    .optional(),
});

/** Magic VAT onboarding preview — creates a lightweight merchant shell. */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid VAT payload" }, { status: 400 });
  }

  const existing = await getTenantByVat(parsed.data.vat_number);
  if (existing) {
    return NextResponse.json({
      ok: true,
      created: false,
      vat_number: existing.vat_number,
      storefront_url: `/${existing.vat_number}`,
      business_name: existing.business_name,
    });
  }

  const name =
    parsed.data.business_name ??
    `Business ${parsed.data.vat_number.replace(/[^a-zA-Z0-9]/g, "").slice(-4)}`;
  const sector = parsed.data.sector ?? "RETAIL";
  const walkIn = ["GYM", "SALON", "POOL"].includes(sector);

  const { rows } = await query<{ id: string; vat_number: string }>(
    `INSERT INTO tenants (
       vat_number, business_name, sector, max_capacity, walk_in_enabled, tagline, hero_image_url
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, vat_number`,
    [
      parsed.data.vat_number,
      name,
      sector,
      walkIn ? 20 : 0,
      walkIn,
      "Your autonomous storefront is live.",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80",
    ],
  );

  await query(
    `INSERT INTO tenant_profiles (tenant_id, description, city, hours_json, rating, review_count)
     VALUES ($1, $2, 'Tel Aviv', '{}'::jsonb, 5.0, 0)`,
    [rows[0].id, "Generated in under a minute by Nexus OS Magic VAT Onboarding."],
  );

  return NextResponse.json({
    ok: true,
    created: true,
    vat_number: rows[0].vat_number,
    storefront_url: `/${rows[0].vat_number}`,
    business_name: name,
  });
}
