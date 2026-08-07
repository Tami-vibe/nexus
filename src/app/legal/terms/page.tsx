import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Sale | Nexus",
  description:
    "Nexus OS End User Terms of Sale, voucher value rules, and platform disclosures.",
};

export default function LegalTermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Link
          href="/offers"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800"
        >
          ← Back to Offers
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          End User Terms of Sale
        </h1>
        <p className="text-sm text-zinc-600">
          Platform Protection & Consumer Standard v2026.1
        </p>
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-700 shadow-sm">
          <p>
            Nexus OS operates a marketplace that facilitates the sale of
            promotional vouchers for goods and services fulfilled by independent
            merchants. Except where required by law, Nexus is not the provider of
            the underlying goods or services.
          </p>
          <p>
            <strong>Merchant responsibility.</strong> The merchant named on each
            offer is solely responsible to purchasers for the care, quality,
            execution, and legal fulfillment of advertised goods and services.
          </p>
          <p>
            <strong>Two-part voucher value.</strong> Unless a longer period is
            required by applicable law: (1) promotional / discount value expires
            on the date stated on the offer (commonly 90–180 days after
            purchase); (2) the amount paid never expires and remains redeemable
            toward merchant services of equal or greater value.
          </p>
          <p>
            <strong>Reference pricing.</strong> Strike-through and “savings”
            figures are based on merchant-provided regular list prices for the
            same or substantially similar offerings and are subject to
            marketplace compliance review.
          </p>
          <p>
            Offer-specific cancellation, redemption limits, transferability, and
            booking rules appear on each product detail page and control in the
            event of conflict with this summary.
          </p>
        </div>
      </div>
    </div>
  );
}
