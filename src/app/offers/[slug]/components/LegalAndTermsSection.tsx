"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  FileText,
  Info,
  Scale,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  AdaptiveContainer,
  adaptivePanelTextClassName,
  type AdaptiveItem,
} from "@/components/ui/AdaptiveContainer";
import type { OfferTerms } from "@/lib/offerDetail";

type Props = {
  merchantName: string;
  offerPrice: number;
  originalPrice: number;
  terms: OfferTerms;
};

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function VoucherValuePanel({
  merchantName,
  offerPrice,
  promoValue,
  promoExpiryDays,
  booking,
  addOnBadge,
  additionalInfo,
}: {
  merchantName: string;
  offerPrice: number;
  promoValue: number;
  promoExpiryDays: number;
  booking: string;
  addOnBadge: string | null;
  additionalInfo: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-amber-950">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          aria-hidden
        />
        <div className="max-w-prose space-y-1.5 text-left">
          <span className="mb-1 block font-bold">Two-Part Voucher Value</span>
          <p>
            <strong>Promotional Discount ({formatMoney(promoValue)}):</strong>{" "}
            Promotional value expires {promoExpiryDays} days after purchase
            date.
          </p>
          <p>
            <strong>Amount Paid ({formatMoney(offerPrice)}):</strong> Never
            expires under applicable law and remains redeemable toward services
            with {merchantName}.
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
          <CalendarCheck className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
          <span>Booking Mandate</span>
        </div>
        <p className="max-w-prose text-zinc-700">{booking}</p>
        {additionalInfo ? (
          <div className="space-y-1 border-t border-orange-100/60 pt-2">
            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              {addOnBadge ?? "Optional Add-on"}
            </span>
            <p className="max-w-prose text-zinc-700">{additionalInfo}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TermsPanel({ terms }: { terms: OfferTerms }) {
  const items = [
    { label: "Cancellation Policy", body: terms.cancellationPolicy },
    { label: "Redemption Limit", body: terms.redemptionLimits },
    { label: "Transferability", body: terms.transferability },
    { label: "Appointment Requirement", body: terms.appointmentRequirement },
  ];

  return (
    <ul className="max-w-prose space-y-2.5 text-zinc-700">
      {items.map((item) => (
        <li key={item.label} className="flex items-start gap-2 text-left">
          <span className="font-bold text-[#FF5E1A]" aria-hidden>
            •
          </span>
          <span>
            <strong>{item.label}:</strong> {item.body}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LegalPanel({
  merchantName,
  onOpenPricing,
}: {
  merchantName: string;
  onOpenPricing: () => void;
}) {
  return (
    <div className="max-w-prose space-y-4 text-zinc-700">
      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-left">
        <div className="mb-1 flex items-center gap-2 font-bold text-zinc-900">
          <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
          Merchant Performance Shield
        </div>
        <p>
          {merchantName} is solely responsible to purchasers for the care,
          quality, execution, and legal fulfillment of all advertised goods and
          services.
        </p>
      </div>
      <p className="text-left">
        Vouchers cannot be combined with other third-party promotions,
        discounts, or institutional coupons unless explicitly authorized by{" "}
        {merchantName}.
      </p>

      <div className="flex items-start justify-start gap-2 pt-1 text-left">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5E1A]"
          aria-hidden
        />
        <button
          type="button"
          onClick={onOpenPricing}
          className="cursor-pointer text-left text-xs font-bold text-[#FF5E1A] hover:underline"
        >
          How Strike-Through Pricing & Reference Savings Work
        </button>
      </div>
    </div>
  );
}

export function LegalAndTermsSection({
  merchantName,
  offerPrice,
  originalPrice,
  terms,
}: Props) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const promoValue = Math.max(0, originalPrice - offerPrice);

  const items: AdaptiveItem[] = useMemo(
    () => [
      {
        id: "rules",
        title: "Voucher & Booking",
        icon: <AlertCircle className="h-4 w-4" aria-hidden />,
        content: (
          <VoucherValuePanel
            merchantName={merchantName}
            offerPrice={offerPrice}
            promoValue={promoValue}
            promoExpiryDays={terms.promoExpiryDays}
            booking={terms.booking}
            addOnBadge={terms.addOnBadge}
            additionalInfo={terms.additionalInfo}
          />
        ),
      },
      {
        id: "terms",
        title: "Terms & Conditions",
        icon: <FileText className="h-4 w-4" aria-hidden />,
        content: <TermsPanel terms={terms} />,
      },
      {
        id: "legal",
        title: "Merchant Disclosures",
        icon: <ShieldCheck className="h-4 w-4" aria-hidden />,
        content: (
          <LegalPanel
            merchantName={merchantName}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        ),
      },
    ],
    [merchantName, offerPrice, promoValue, terms],
  );

  return (
    <section className="my-2 w-full">
      <AdaptiveContainer
        defaultActiveId="rules"
        items={items}
        header={
          <div className="flex items-center justify-between gap-3 bg-zinc-900 p-4 text-white sm:p-5">
            <div className="flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-[#FF5E1A]" aria-hidden />
              <h2 className="text-sm font-bold tracking-tight sm:text-base">
                Legal & Terms
              </h2>
            </div>
            <span className="font-mono text-[11px] text-zinc-400">
              Standard v2026.1
            </span>
          </div>
        }
        footer={
          <div className="flex flex-col items-start justify-between gap-2 border-t border-zinc-100 px-4 py-3 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:px-6">
            <span>
              NEXUS OS · End User Terms of Sale apply to all redemptions.
            </span>
            <Link
              href="/legal/terms"
              className="font-semibold underline hover:text-zinc-900"
            >
              Full Terms of Sale
            </Link>
          </div>
        }
      />

      {isPricingModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Reference pricing policy"
          onClick={() => setIsPricingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
              aria-label="Close disclosure"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="pr-10 text-base font-black text-zinc-900">
              Reference Pricing & Savings Policy
            </h3>
            <p
              className={`max-w-prose text-left text-zinc-600 ${adaptivePanelTextClassName}`}
            >
              The reference list price of{" "}
              <strong>{formatMoney(originalPrice)}</strong> reflects the regular
              rate charged by {merchantName} for standalone bookings of the same
              or substantially similar offering. Discounts are verified against
              standard merchant menu pricing. Nexus does not invent reference
              prices.
            </p>
            <p
              className={`max-w-prose text-left text-zinc-600 ${adaptivePanelTextClassName}`}
            >
              Amount paid of <strong>{formatMoney(offerPrice)}</strong> is cash
              consideration for this voucher. The promotional difference of{" "}
              <strong>{formatMoney(promoValue)}</strong> is the promotional
              value portion described above.
            </p>
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(false)}
              className="w-full rounded-xl bg-zinc-900 py-2.5 text-xs font-bold text-white"
            >
              Close Disclosure
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
