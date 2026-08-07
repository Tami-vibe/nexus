import type { Sector } from "@/types";
import type { CredentialLicense } from "@/types/practitioner";
import {
  resolveSpecialistTier,
  resolveTierRank,
} from "@/lib/marketTiers";

/** Expand acronym credentials into patient-friendly labels. */
export function expandCredentialLabel(raw: string): string {
  const t = raw.trim();
  const map: Record<string, string> = {
    DPT: "Doctor of Physical Therapy (DPT)",
    CSCS: "Certified Strength & Conditioning Specialist (CSCS)",
    "Dry Needling Certification":
      "Dry Needling Therapy (Musculoskeletal Pain)",
    "Dry Needling": "Dry Needling Therapy (Musculoskeletal Pain)",
    MD: "Doctor of Medicine (MD)",
    ACLS: "Advanced Cardiovascular Life Support (ACLS)",
  };
  if (map[t]) return map[t];
  const hit = Object.entries(map).find(
    ([k]) => k.toLowerCase() === t.toLowerCase(),
  );
  return hit ? hit[1] : t;
}

/**
 * Role badge must match license type — never default every clinic pro to Attending Physician.
 */
export function resolveRoleBadge(input: {
  sector: Sector;
  credential?: string | null;
  title?: string | null;
  licenses?: CredentialLicense[];
  experienceYears?: number;
  clientsTreated?: number;
}): string {
  const licenseBlob = (input.licenses ?? [])
    .map((l) => `${l.licenseNumber} ${l.authorityName}`)
    .join(" ");
  const blob = [input.credential ?? "", input.title ?? "", licenseBlob]
    .join(" ")
    .toLowerCase();

  if (/\bpt[-–]?\d|\bphysiotherap|\bphysical therap|\bdpt\b/.test(blob)) {
    return "Licensed Senior Physiotherapist";
  }
  if (/\bpodiatr|\bpodolog/.test(blob)) {
    return "Licensed Podiatrist";
  }
  if (
    /\bbar association|\battorney|\bcounsel|\besq\b|\blawyer\b/.test(blob)
  ) {
    const years = input.experienceYears ?? 8;
    const clients = input.clientsTreated ?? 0;
    return resolveTierRank(years, clients) === "master"
      ? "Senior Counsel"
      : "Counsel";
  }
  if (/\bcscs\b|\bstrength coach|\bnsca\b/.test(blob)) {
    return resolveSpecialistTier(
      input.experienceYears ?? 7,
      input.clientsTreated ?? 0,
      "GYM",
    );
  }
  if (
    input.sector === "CLINIC" &&
    (/\bmd\b|\bphysician|\bmedical practitioner|\binternal medicine/.test(
      blob,
    ) ||
      /\b1[-–]\d{4,}/.test(blob))
  ) {
    return "Attending Physician / Specialist MD";
  }

  return resolveSpecialistTier(
    input.experienceYears ?? 8,
    input.clientsTreated ?? 0,
    input.sector,
  );
}
