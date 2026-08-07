import type {
  CredentialLicense,
  PractitionerDossier,
} from "@/types/practitioner";
import type {
  InsuranceNetwork,
  IntroPassCoupon,
  MultiProfessionalDossier,
} from "@/types/professional";
import type { TravelingProfessional } from "@/types/location";

export type {
  CredentialLicense,
  LicenseStatus,
  PractitionerDossier,
} from "@/types/practitioner";
export type {
  InsuranceNetwork,
  IntroPassCoupon,
  MultiProfessionalDossier,
  ProfessionalCategory,
} from "@/types/professional";
export type {
  PracticeLocation,
  TravelingProfessional,
} from "@/types/location";
export type { ExtendedFilterState } from "@/types/search";

export type Sector =
  | "GYM"
  | "SALON"
  | "CLINIC"
  | "POOL"
  | "RETAIL"
  | "ARTISAN"
  | "DIGITAL"
  | "CONSULTING";

export type SignalSource = "POS_WEBHOOK" | "WIFI_PROBE" | "ML_PREDICTIVE";

export type LifecycleStage = "PROSPECT" | "HOT_LEAD" | "ACTIVE_MEMBER";

export type HoldStatus = "HELD" | "CONFIRMED" | "EXPIRED" | "RELEASED";

export type AgentState =
  | "IDLE"
  | "QUALIFYING"
  | "SLOT_SEARCH"
  | "HOLDING"
  | "CHECKOUT_MOCK"
  | "DONE"
  | "FAILED";

export type CrmEventType =
  | "PAGE_VIEW"
  | "LEAD_CAPTURE"
  | "CHAT_OPEN"
  | "CHAT_MESSAGE"
  | "CART_ADD"
  | "CART_DROP"
  | "ORDER_PLACED"
  | "APPOINTMENT_BOOKED"
  | "HOLD"
  | "CHECKOUT_MOCK"
  | "CHECKOUT_PAID"
  | "SLOT_ASK";

export type ProductKind = "PHYSICAL" | "DIGITAL" | "HANDCRAFT";

export interface Tenant {
  id: string;
  vat_number: string;
  business_name: string;
  sector: Sector;
  max_capacity: number;
  walk_in_enabled: boolean;
  tagline: string | null;
  hero_image_url: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  created_at: Date;
}

export interface TenantProfile {
  tenant_id: string;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  hours_json: Record<string, string>;
  image_url: string | null;
  rating: number | null;
  review_count: number;
  latitude: number | null;
  longitude: number | null;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  kind: ProductKind;
  image_url: string | null;
  in_stock: boolean;
  sort_order: number;
}

export interface ServiceOffer {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  image_url: string | null;
  sort_order: number;
}

export interface Practitioner {
  id: string;
  tenant_id: string;
  slug: string;
  full_name: string;
  credential: string;
  title: string | null;
  specialties: string[];
  bio: string | null;
  certifications: string[];
  /** Structured government / professional licenses — prefer over plain certifications */
  licenses: CredentialLicense[];
  /** Complete professional dossier (philosophy, career, education, languages) */
  dossier: PractitionerDossier;
  /** Multi-industry bento layout payload (artisan / trainer / legal / …) */
  professional: MultiProfessionalDossier | null;
  /** Multi-location practice nodes for traveling professionals */
  traveling: TravelingProfessional | null;
  /** Accepted insurance networks */
  insuranceNetworks: InsuranceNetwork[];
  /** First-time / off-peak intro pass vouchers */
  introPasses: IntroPassCoupon[];
  /** Facility wheelchair / step-free access */
  hasWheelchairAccess: boolean;
  headshot_url: string | null;
  video_url: string | null;
  rating: number | null;
  review_count: number;
  client_count: number;
  client_label: string;
  sort_order: number;
}

export interface TenantBundle extends Tenant {
  profile: TenantProfile | null;
  products: Product[];
  services: ServiceOffer[];
  practitioners: Practitioner[];
}

export interface LiveOccupancy {
  tenant_id: string;
  current_occupancy: number;
  last_signal_timestamp: Date;
  signal_source: SignalSource;
}

export interface CapacitySnapshot {
  tenant_id: string;
  vat_number: string;
  max_capacity: number;
  current_occupancy: number;
  spots_open: number;
  signal_source: SignalSource;
  is_estimated: boolean;
  badge_label: string;
  last_signal_timestamp: string | null;
}

export interface LeadProfile {
  id: string;
  tenant_id: string;
  phone: string;
  intent_score: number;
  lifecycle_stage: LifecycleStage;
  last_engagement: Date;
}

export interface CapacityHold {
  id: string;
  tenant_id: string;
  lead_id: string | null;
  status: HoldStatus;
  expires_at: Date;
  created_at: Date;
}

export interface CrmEvent {
  id: string;
  tenant_id: string;
  lead_id: string | null;
  event_type: CrmEventType;
  title: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}
