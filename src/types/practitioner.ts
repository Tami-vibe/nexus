/** Structured government / professional license verification. */

export type LicenseStatus = "VERIFIED" | "PENDING_REVIEW" | "UNVERIFIED";

export interface CredentialLicense {
  authorityName: string; // e.g., 'FNOMCeO (Italy)', 'CMS NPI (USA)', 'Israel Ministry of Health'
  licenseNumber: string; // e.g., '684920', '1982736401'
  jurisdiction: string; // e.g., 'Rome, Italy', 'National (USA)'
  status: LicenseStatus;
  lastVerifiedAt: string;
  officialRegistryUrl: string; // Direct link to government lookup portal
}

export interface PractitionerLicenseBundle {
  licenses: CredentialLicense[];
}

/** Rich professional history — complete Yellow Pages / LinkedIn-grade dossier. */
export interface PractitionerDossier {
  bioHeader: string; // Extended clinical philosophy
  careerHistory: Array<{
    role: string;
    institution: string;
    years: string;
  }>;
  subSpecialties: string[]; // Detailed list of focus areas
  languagesSpoken: string[]; // e.g., ['English', 'Hebrew', 'Italian']
  educationHistory: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

export const EMPTY_DOSSIER: PractitionerDossier = {
  bioHeader: "",
  careerHistory: [],
  subSpecialties: [],
  languagesSpoken: [],
  educationHistory: [],
};
