"use client";

import type { CredentialLicense } from "@/types/practitioner";

type Props = {
  open: boolean;
  license: CredentialLicense | null;
  practitionerName: string;
  onClose: () => void;
};

/**
 * Slide-over proof of how Nexus validates government medical / professional registers.
 */
export function LicenseProofDrawer({
  open,
  license,
  practitionerName,
  onClose,
}: Props) {
  if (!open || !license) return null;

  const verifiedAt = formatDate(license.lastVerifiedAt);

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-md"
        aria-label="Close license proof"
        onClick={onClose}
      />
      <aside className="nx-drawer-panel absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-white/20 bg-white/95 backdrop-blur-xl sm:rounded-l-3xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            Official License Verification
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-lg font-semibold text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-bold text-white">
            <span aria-hidden>🛡️</span>
            VERIFIED ✓
          </div>
          <h2 className="nx-display mt-4 text-3xl">{practitionerName}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Official registry metadata pulled from{" "}
            <strong className="text-[var(--ink)]">{license.authorityName}</strong>
          </p>

          <dl className="mt-6 space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">License number</dt>
              <dd className="font-mono font-semibold text-[var(--ink)]">
                {license.licenseNumber}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Issuing authority</dt>
              <dd className="text-right font-semibold text-[var(--ink)]">
                {license.authorityName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Jurisdiction</dt>
              <dd className="text-right font-semibold text-[var(--ink)]">
                {license.jurisdiction}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Status</dt>
              <dd className="font-bold text-emerald-700">{license.status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Last verified</dt>
              <dd className="font-semibold text-[var(--ink)]">{verifiedAt}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              How Nexus OS validates
            </p>
            <p>
              Nexus cross-checks merchant VAT / tax IDs against national business
              registries, then matches practitioner license numbers against the
              issuing government medical or professional register (e.g. Israel
              Ministry of Health, CMS NPI, FNOMCeO).
            </p>
            <p>
              A{" "}
              <strong className="text-[var(--ink)]">VERIFIED</strong> badge means
              the license number resolved in the official registry at the time of
              last check — not a self-typed claim on a profile form.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">Jurisdiction disclaimer</p>
            <p className="mt-2 leading-relaxed">
              Verification confirms identity and license status in the issuing
              authority&apos;s register. It does not expand scope of practice in
              the client&apos;s local jurisdiction. Always confirm that the
              practitioner is authorized to deliver the specific service where you
              receive care.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--line)] p-5">
          <a
            href={license.officialRegistryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nx-btn nx-btn-secondary w-full"
          >
            🔗 Verify Official Public Entry
          </a>
        </div>
      </aside>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
