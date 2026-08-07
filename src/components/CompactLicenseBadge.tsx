"use client";

import type { CredentialLicense } from "@/types/practitioner";

type Props = {
  license: CredentialLicense;
  /** Optional proof drawer trigger — keep ribbon to one line */
  onOpenProof?: () => void;
};

/**
 * Stockholm ultra-compact license ribbon — one line, light, shadowless.
 * Government licenses render EXACTLY ONCE per profile via this badge.
 */
export function CompactLicenseBadge({ license, onOpenProof }: Props) {
  const verified = license.status === "VERIFIED";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-4 py-2.5 text-xs text-zinc-700 shadow-none">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm" aria-hidden>
          🛡️
        </span>
        <span className="font-medium text-zinc-900">
          {license.authorityName}
        </span>
        <span className="text-zinc-400" aria-hidden>
          •
        </span>
        <span className="font-mono text-zinc-600">{license.licenseNumber}</span>
        {verified ? (
          <button
            type="button"
            onClick={onOpenProof}
            className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
          >
            Verified
          </button>
        ) : (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
            {license.status === "PENDING_REVIEW" ? "Pending" : "Unverified"}
          </span>
        )}
      </div>
      <a
        href={license.officialRegistryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
      >
        Verify Registry
      </a>
    </div>
  );
}
