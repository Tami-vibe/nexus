"use client";

import type { IntroPassCoupon } from "@/types/professional";
import { formatMoney } from "@/lib/commerce/money";

type Props = {
  coupon: IntroPassCoupon;
  onBook?: () => void;
};

/**
 * New-patient / first-visit rate card — clinical language only.
 * Exactly ONE Clementine CTA. Regulated offers MUST show refund clause.
 */
export function NewPatientOfferCard({ coupon, onBook }: Props) {
  const currency = coupon.currency ?? "ils";
  const original = formatMoney(coupon.originalPrice, currency);
  const discount = formatMoney(coupon.discountPrice, currency);
  const days =
    coupon.validDays.length > 0
      ? coupon.validDays.join(" · ")
      : "Weekday availability";
  const slots = coupon.remainingQuantity;

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          New Patient Offer
        </p>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-medium text-zinc-700">
          {days}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-zinc-900">
        {coupon.title}
      </h3>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="text-sm text-zinc-400 line-through">{original}</span>
        <span className="text-2xl font-semibold text-zinc-900">{discount}</span>
        <span className="text-xs font-medium text-zinc-500">
          First visit rate
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-800">
        📅 {slots} appointment slot{slots === 1 ? "" : "s"} open this week
      </p>

      <p className="mt-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-2.5 text-xs leading-relaxed text-zinc-700">
        🛡️ {coupon.refundGuaranteeNote}
      </p>

      <button
        type="button"
        onClick={onBook}
        disabled={slots <= 0}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55013] disabled:opacity-50"
      >
        Book Consultation — {discount}
      </button>
    </article>
  );
}

/** @deprecated Use NewPatientOfferCard — kept for import compatibility */
export { NewPatientOfferCard as IntroPassCard };
