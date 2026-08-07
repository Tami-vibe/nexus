import { query } from "@/lib/db";
import type {
  Practitioner,
  Product,
  ServiceOffer,
  Tenant,
  TenantBundle,
  TenantProfile,
} from "@/types";
import type {
  CredentialLicense,
  PractitionerDossier,
} from "@/types/practitioner";
import { EMPTY_DOSSIER } from "@/types/practitioner";
import type {
  InsuranceNetwork,
  IntroPassCoupon,
  MultiProfessionalDossier,
} from "@/types/professional";
import { isMultiProfessionalDossier } from "@/types/professional";
import type { TravelingProfessional } from "@/types/location";
import { isTravelingProfessional } from "@/types/location";

type BenefitsPayload = {
  insuranceNetworks?: InsuranceNetwork[];
  introPasses?: IntroPassCoupon[];
  hasWheelchairAccess?: boolean;
};

interface TenantRow {
  id: string;
  vat_number: string;
  business_name: string;
  sector: Tenant["sector"];
  max_capacity: number;
  walk_in_enabled: boolean;
  tagline: string | null;
  hero_image_url: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  created_at: Date;
  profile_tenant_id: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  hours_json: Record<string, string> | null;
  image_url: string | null;
  rating: string | null;
  review_count: number | null;
  latitude: string | number | null;
  longitude: string | number | null;
}

interface PractitionerRow {
  id: string;
  tenant_id: string;
  slug: string;
  full_name: string;
  credential: string;
  title: string | null;
  specialties: string[] | null;
  bio: string | null;
  certifications: string[] | null;
  licenses_json: CredentialLicense[] | string | null;
  dossier_json: PractitionerDossier | string | null;
  professional_json: MultiProfessionalDossier | string | null;
  traveling_json: TravelingProfessional | string | null;
  benefits_json: BenefitsPayload | string | null;
  headshot_url: string | null;
  video_url: string | null;
  rating: string | number | null;
  review_count: number;
  client_count: number;
  client_label: string;
  sort_order: number;
}

function parseLicenses(
  raw: PractitionerRow["licenses_json"],
): CredentialLicense[] {
  if (!raw) return [];
  const list = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (item): item is CredentialLicense =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as CredentialLicense).licenseNumber === "string" &&
      typeof (item as CredentialLicense).authorityName === "string",
  );
}

function parseDossier(
  raw: PractitionerRow["dossier_json"],
): PractitionerDossier {
  if (!raw) return { ...EMPTY_DOSSIER };
  const obj =
    typeof raw === "string"
      ? (JSON.parse(raw) as Partial<PractitionerDossier>)
      : raw;
  if (!obj || typeof obj !== "object") return { ...EMPTY_DOSSIER };
  return {
    bioHeader: typeof obj.bioHeader === "string" ? obj.bioHeader : "",
    careerHistory: Array.isArray(obj.careerHistory) ? obj.careerHistory : [],
    subSpecialties: Array.isArray(obj.subSpecialties) ? obj.subSpecialties : [],
    languagesSpoken: Array.isArray(obj.languagesSpoken)
      ? obj.languagesSpoken
      : [],
    educationHistory: Array.isArray(obj.educationHistory)
      ? obj.educationHistory
      : [],
  };
}

function mapProfile(row: TenantRow): TenantProfile | null {
  if (!row.profile_tenant_id) return null;
  return {
    tenant_id: row.profile_tenant_id,
    description: row.description,
    address: row.address,
    city: row.city,
    phone: row.phone,
    website: row.website,
    hours_json: row.hours_json ?? {},
    image_url: row.image_url,
    rating: row.rating == null ? null : Number(row.rating),
    review_count: row.review_count ?? 0,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
  };
}

function mapTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    vat_number: row.vat_number,
    business_name: row.business_name,
    sector: row.sector,
    max_capacity: row.max_capacity,
    walk_in_enabled: Boolean(row.walk_in_enabled),
    tagline: row.tagline,
    hero_image_url: row.hero_image_url,
    testimonial_quote: row.testimonial_quote,
    testimonial_author: row.testimonial_author,
    created_at: row.created_at,
  };
}

function parseProfessional(
  raw: PractitionerRow["professional_json"],
): MultiProfessionalDossier | null {
  if (!raw) return null;
  const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
  return isMultiProfessionalDossier(obj) ? obj : null;
}

function parseTraveling(
  raw: PractitionerRow["traveling_json"],
): TravelingProfessional | null {
  if (!raw) return null;
  const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
  return isTravelingProfessional(obj) ? obj : null;
}

function parseBenefits(raw: PractitionerRow["benefits_json"]): {
  insuranceNetworks: InsuranceNetwork[];
  introPasses: IntroPassCoupon[];
  hasWheelchairAccess: boolean;
} {
  if (!raw) {
    return {
      insuranceNetworks: [],
      introPasses: [],
      hasWheelchairAccess: false,
    };
  }
  const obj = (
    typeof raw === "string" ? JSON.parse(raw) : raw
  ) as BenefitsPayload;
  return {
    insuranceNetworks: Array.isArray(obj.insuranceNetworks)
      ? obj.insuranceNetworks.filter(
          (n) => n && typeof n.providerName === "string",
        )
      : [],
    introPasses: Array.isArray(obj.introPasses)
      ? obj.introPasses.filter(
          (c) =>
            c &&
            typeof c.id === "string" &&
            typeof c.title === "string" &&
            typeof c.discountPrice === "number",
        )
      : [],
    hasWheelchairAccess: Boolean(obj.hasWheelchairAccess),
  };
}

function mapPractitioner(row: PractitionerRow): Practitioner {
  const benefits = parseBenefits(row.benefits_json);
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    slug: row.slug,
    full_name: row.full_name,
    credential: row.credential,
    title: row.title,
    specialties: row.specialties ?? [],
    bio: row.bio,
    certifications: row.certifications ?? [],
    licenses: parseLicenses(row.licenses_json),
    dossier: parseDossier(row.dossier_json),
    professional: parseProfessional(row.professional_json),
    traveling: parseTraveling(row.traveling_json),
    insuranceNetworks: benefits.insuranceNetworks,
    introPasses: benefits.introPasses,
    hasWheelchairAccess: benefits.hasWheelchairAccess,
    headshot_url: row.headshot_url,
    video_url: row.video_url,
    rating: row.rating == null ? null : Number(row.rating),
    review_count: row.review_count ?? 0,
    client_count: row.client_count ?? 0,
    client_label: row.client_label || "Clients",
    sort_order: row.sort_order,
  };
}

async function loadOffers(tenantId: string): Promise<{
  products: Product[];
  services: ServiceOffer[];
  practitioners: Practitioner[];
}> {
  const [products, services, practitioners] = await Promise.all([
    query<Product>(
      `SELECT * FROM products WHERE tenant_id = $1 ORDER BY sort_order, name`,
      [tenantId],
    ),
    query<ServiceOffer>(
      `SELECT * FROM services WHERE tenant_id = $1 ORDER BY sort_order, name`,
      [tenantId],
    ),
    query<PractitionerRow>(
      `SELECT * FROM practitioners WHERE tenant_id = $1 ORDER BY sort_order, full_name`,
      [tenantId],
    ),
  ]);
  return {
    products: products.rows,
    services: services.rows,
    practitioners: practitioners.rows.map(mapPractitioner),
  };
}

const TENANT_SELECT = `SELECT t.*,
            p.tenant_id AS profile_tenant_id,
            p.description, p.address, p.city, p.phone, p.website,
            p.hours_json, p.image_url, p.rating, p.review_count,
            p.latitude, p.longitude
     FROM tenants t
     LEFT JOIN tenant_profiles p ON p.tenant_id = t.id`;

export async function getTenantByVat(
  vat: string,
): Promise<TenantBundle | null> {
  const { rows } = await query<TenantRow>(
    `${TENANT_SELECT} WHERE t.vat_number = $1`,
    [vat],
  );
  if (!rows[0]) return null;
  const offers = await loadOffers(rows[0].id);
  return {
    ...mapTenant(rows[0]),
    profile: mapProfile(rows[0]),
    ...offers,
  };
}

export async function getPractitionerBySlug(
  vat: string,
  slug: string,
): Promise<{ tenant: TenantBundle; practitioner: Practitioner } | null> {
  const tenant = await getTenantByVat(vat);
  if (!tenant) return null;
  const practitioner = tenant.practitioners.find((p) => p.slug === slug);
  if (!practitioner) return null;
  return { tenant, practitioner };
}

export async function listTenants(): Promise<TenantBundle[]> {
  const { rows } = await query<TenantRow>(
    `${TENANT_SELECT} ORDER BY t.business_name ASC`,
  );
  const bundles: TenantBundle[] = [];
  for (const row of rows) {
    const offers = await loadOffers(row.id);
    bundles.push({
      ...mapTenant(row),
      profile: mapProfile(row),
      ...offers,
    });
  }
  return bundles;
}
