"use client";

import { useState } from "react";
import type { CredentialLicense } from "@/types/practitioner";
import { expandCredentialLabel } from "@/lib/professionalLanguage";
import { CompactLicenseBadge } from "@/components/CompactLicenseBadge";
import { LicenseProofDrawer } from "@/components/LicenseProofDrawer";

type Props = {
  practitionerName: string;
  licenses: CredentialLicense[];
  /** Legacy plain-text certs — only if no structured licenses */
  fallbackCertifications?: string[];
  /** Kept for API compat — compact ribbon omits bulky section headings */
  credentialsHeading?: string;
};

/**
 * License trust strip — renders each government license ONCE as CompactLicenseBadge.
 * No dark cards, no duplicate seals, no 400px credential containers.
 */
export function VerifiedCredentials({
  practitionerName,
  licenses,
  fallbackCertifications = [],
}: Props) {
  const [proofLicense, setProofLicense] = useState<CredentialLicense | null>(
    null,
  );

  if (licenses.length > 0) {
    return (
      <div className="space-y-2">
        {licenses.map((license) => (
          <CompactLicenseBadge
            key={`${license.authorityName}-${license.licenseNumber}`}
            license={license}
            onOpenProof={
              license.status === "VERIFIED"
                ? () => setProofLicense(license)
                : undefined
            }
          />
        ))}
        <LicenseProofDrawer
          open={proofLicense != null}
          license={proofLicense}
          practitionerName={practitionerName}
          onClose={() => setProofLicense(null)}
        />
      </div>
    );
  }

  if (!fallbackCertifications.length) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-2.5 text-xs text-zinc-500">
        No government license on file yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {fallbackCertifications.map((c) => (
        <div
          key={c}
          className="flex items-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-4 py-2.5 text-xs text-amber-950 shadow-none"
        >
          <span aria-hidden>⚠️</span>
          <span className="font-medium">{expandCredentialLabel(c)}</span>
          <span className="text-amber-700">· Review in progress</span>
        </div>
      ))}
    </div>
  );
}
