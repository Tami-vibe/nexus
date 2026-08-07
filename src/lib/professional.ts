import type { Practitioner, Sector } from "@/types";
import type { MultiProfessionalDossier } from "@/types/professional";
import { categoryFromSector } from "@/types/professional";

/** Resolve stored multi-industry dossier or synthesize from sector + legacy fields. */
export function resolveProfessionalDossier(
  practitioner: Practitioner,
  vatTaxId: string,
  sector: Sector,
): MultiProfessionalDossier {
  if (practitioner.professional) {
    return {
      ...practitioner.professional,
      vatTaxId: practitioner.professional.vatTaxId || vatTaxId,
    };
  }

  const category = categoryFromSector(sector);
  const primaryLicense = practitioner.licenses[0];

  return {
    category,
    vatTaxId,
    accreditationBadge: {
      title:
        primaryLicense?.authorityName ||
        practitioner.credential ||
        "Professional credential",
      registrationNumber:
        primaryLicense?.licenseNumber ||
        practitioner.certifications[0] ||
        "On file",
      verificationUrl: primaryLicense?.officialRegistryUrl,
    },
    specialties: [
      ...new Set([
        ...practitioner.specialties,
        ...practitioner.dossier.subSpecialties,
      ]),
    ],
    careerHistory: practitioner.dossier.careerHistory,
    deliverablesSummary: practitioner.certifications.slice(0, 4),
  };
}
