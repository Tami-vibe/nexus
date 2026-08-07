export type ProfessionalCategory =
  | "medical"
  | "artisan"
  | "trainer"
  | "legal"
  | "educator";

/** Insurance plan accepted by the practitioner / clinic. */
export interface InsuranceNetwork {
  providerName: string; // e.g., 'Generali', 'Allianz', 'AXA', 'Medicare'
  directBilling: boolean; // true = Zero out of pocket, false = Invoice provided
}

/**
 * First-time / off-peak discovery voucher.
 * Medical & regulated professions MUST include refundGuaranteeNote.
 */
export interface IntroPassCoupon {
  id: string;
  title: string; // e.g., 'First-Time Podology & Gait Analysis Pass'
  originalPrice: number; // cents (minor units)
  discountPrice: number; // cents
  currency?: string; // default ils
  remainingQuantity: number;
  validDays: string[]; // e.g., ['Mon', 'Tue']
  refundGuaranteeNote: string; // 'Full refund if evaluated as non-candidate'
}

export interface MultiProfessionalDossier {
  category: ProfessionalCategory;
  vatTaxId: string;
  accreditationBadge: {
    title: string; // e.g., 'Albo Artigiani Firenze', 'Bar Association Milano', 'NSCA Certified'
    registrationNumber: string;
    verificationUrl?: string;
  };
  specialties: string[];
  careerHistory: Array<{ role: string; institution: string; years: string }>;
  deliverablesSummary: string[]; // e.g., 'Custom Walnut Restorations', '45-Min M&A Strategy'
}

/** Industry-matched trust language — marketing authority, not bureaucracy. */
export const CATEGORY_TRUST_COPY: Record<
  ProfessionalCategory,
  {
    credentialsHeading: string;
    philosophyLabel: string;
    focusLabel: string;
    sealLabel: string;
    verifyCta: string;
    bookingHint: string;
    outcomesLabel: string;
  }
> = {
  medical: {
    credentialsHeading: "Official Registry & Accreditations",
    philosophyLabel: "Care philosophy",
    focusLabel: "Specialties & sub-focus",
    sealLabel: "Active Public License",
    verifyCta: "Verify Official Public Entry",
    bookingHint: "Same-day consults when capacity allows",
    outcomesLabel: "Patient outcomes",
  },
  artisan: {
    credentialsHeading: "Camera di Commercio & Albo Artigiani",
    philosophyLabel: "Heritage philosophy",
    focusLabel: "Materials & craft focus",
    sealLabel: "Guild registration",
    verifyCta: "Verify Guild / Registry Entry",
    bookingHint: "Workshop visits by appointment",
    outcomesLabel: "Collector outcomes",
  },
  trainer: {
    credentialsHeading: "Certified Specialist & Credentials",
    philosophyLabel: "Biomechanical methodology",
    focusLabel: "Training specialties",
    sealLabel: "Certified Specialist",
    verifyCta: "Verify Specialist Credential",
    bookingHint: "Trial sessions when the floor is open",
    outcomesLabel: "Athlete outcomes",
  },
  legal: {
    credentialsHeading: "Bar Association Accreditation",
    philosophyLabel: "Practice philosophy",
    focusLabel: "Legal practice areas",
    sealLabel: "Bar Association Admission",
    verifyCta: "Verify Bar Registry Entry",
    bookingHint: "Confidential strategy consults",
    outcomesLabel: "Client outcomes",
  },
  educator: {
    credentialsHeading: "Teaching Credentials & Accreditations",
    philosophyLabel: "Teaching philosophy",
    focusLabel: "Subjects & focus",
    sealLabel: "Teaching credential",
    verifyCta: "Verify Credential Entry",
    bookingHint: "Sessions by appointment",
    outcomesLabel: "Learner outcomes",
  },
};

/** Map merchant sector → professional profile layout. */
export function categoryFromSector(
  sector:
    | "GYM"
    | "SALON"
    | "CLINIC"
    | "POOL"
    | "RETAIL"
    | "ARTISAN"
    | "DIGITAL"
    | "CONSULTING"
    | string,
): ProfessionalCategory {
  switch (sector) {
    case "CLINIC":
      return "medical";
    case "ARTISAN":
    case "SALON":
    case "RETAIL":
      return "artisan";
    case "GYM":
    case "POOL":
      return "trainer";
    case "CONSULTING":
      return "legal";
    case "DIGITAL":
      return "educator";
    default:
      return "educator";
  }
}

export function isMultiProfessionalDossier(
  value: unknown,
): value is MultiProfessionalDossier {
  if (!value || typeof value !== "object") return false;
  const v = value as MultiProfessionalDossier;
  return (
    typeof v.category === "string" &&
    typeof v.vatTaxId === "string" &&
    Boolean(v.accreditationBadge) &&
    typeof v.accreditationBadge.title === "string" &&
    typeof v.accreditationBadge.registrationNumber === "string" &&
    Array.isArray(v.specialties) &&
    Array.isArray(v.careerHistory) &&
    Array.isArray(v.deliverablesSummary)
  );
}
