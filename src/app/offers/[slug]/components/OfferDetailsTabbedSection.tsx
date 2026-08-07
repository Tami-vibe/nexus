"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Dumbbell,
  FileText,
  Hotel,
  Info,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Zap,
  X,
} from "lucide-react";
import {
  AdaptiveContainer,
  adaptivePanelTextClassName,
  type AdaptiveItem,
} from "@/components/ui/AdaptiveContainer";
import { OfferOptionsAccordion } from "@/components/offers/OfferOptionsAccordion";
import type { AccordionOfferOption } from "@/components/offers/OfferOptionsAccordion";
import { OfferInclusionsGrid } from "@/components/offers/OfferInclusionsGrid";
import {
  getCategoryUX,
  type CategoryUXConfig,
  type CategoryUXLookupInput,
} from "@/config/categoryUX";
import type {
  OfferTerms,
  OfferUpsell,
  PackageOption,
} from "@/lib/offerDetail";

type Props = {
  merchantName: string;
  packages: PackageOption[];
  inclusions: string[];
  upsell: OfferUpsell | null;
  terms: OfferTerms;
  selectedPlanId: number;
  onSelectPlan: (id: number) => void;
  onEnableGift?: () => void;
  /** Offer taxonomy used to resolve CATEGORY_UX_MAP copy. */
  categoryLookup: CategoryUXLookupInput;
  promoCode?: string;
  promoAmount?: number;
  redeemedLabel?: string;
  /** Sync qty / gift / booking / live totals into sticky checkout. */
  onCheckoutStateChange?: (state: {
    quantity: number;
    isGift: boolean;
    bookingMode?: "open_voucher" | "reserve_slot";
    selectedSlot?: string | null;
    slotDate?: Date | null;
    unitPrice: number;
    totalPrice: number;
    totalSavings: number;
  }) => void;
};

function CategoryAccentIcon({
  name,
  className = "h-4 w-4",
}: {
  name: CategoryUXConfig["accentIcon"];
  className?: string;
}) {
  switch (name) {
    case "sparkles":
      return <Sparkles className={className} aria-hidden />;
    case "stethoscope":
      return <Stethoscope className={className} aria-hidden />;
    case "dumbbell":
      return <Dumbbell className={className} aria-hidden />;
    case "hotel":
      return <Hotel className={className} aria-hidden />;
    case "utensils":
      return <UtensilsCrossed className={className} aria-hidden />;
    case "briefcase":
    default:
      return <Briefcase className={className} aria-hidden />;
  }
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function UpsellRow({
  upsell,
  added,
  onAdd,
  badgeText,
}: {
  upsell: OfferUpsell;
  added: boolean;
  onAdd: () => void;
  badgeText: string;
}) {
  return (
    <div className="my-3 flex flex-col items-start justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3.5 sm:flex-row sm:items-center">
      <span className={`flex items-start gap-2 text-zinc-800 ${adaptivePanelTextClassName}`}>
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
        <span>
          <strong>{badgeText}:</strong> {upsell.description}
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-3 pl-6 sm:pl-0">
        <span className="font-bold text-[#FF5E1A]">
          +{formatMoney(upsell.price)}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="font-bold text-[#FF5E1A] hover:underline"
        >
          {added ? "Added ✓" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}

function GiftBanner({
  title,
  subtitle,
  accentIcon,
  onHowItWorks,
}: {
  title: string;
  subtitle: string;
  accentIcon: CategoryUXConfig["accentIcon"];
  onHowItWorks: () => void;
}) {
  return (
    <div className="my-1 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-pink-100 bg-pink-50 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white">
          <CategoryAccentIcon name={accentIcon} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900">{title}</h4>
          <p className={`text-zinc-600 ${adaptivePanelTextClassName}`}>
            {subtitle}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onHowItWorks}
        className={`rounded-xl bg-pink-600 px-4 py-2 font-bold text-white transition-all hover:bg-pink-700 ${adaptivePanelTextClassName}`}
      >
        How it works →
      </button>
    </div>
  );
}

function SelectPlanContent({
  packages,
  selectedPlanId,
  onSelectPlan,
  upsell,
  upsellAdded,
  onAddUpsell,
  config,
  inclusions,
  promoCode,
  promoAmount = 0,
  redeemedLabel = "1,000+",
  onCheckoutStateChange,
  onEnableGift,
}: {
  packages: PackageOption[];
  selectedPlanId: number;
  onSelectPlan: (id: number) => void;
  upsell: OfferUpsell | null;
  upsellAdded: boolean;
  onAddUpsell: () => void;
  config: CategoryUXConfig;
  inclusions: string[];
  promoCode?: string;
  promoAmount?: number;
  redeemedLabel?: string;
  onCheckoutStateChange?: Props["onCheckoutStateChange"];
  onEnableGift?: () => void;
}) {
  const accordionOptions: AccordionOfferOption[] = useMemo(() => {
    return packages.map((plan, index) => {
      const salePrice = plan.price + promoAmount;
      const discountPercent =
        salePrice > 0 ? Math.round((promoAmount / salePrice) * 100) : 0;
      const savingsPct =
        plan.original > 0
          ? Math.round(((plan.original - plan.price) / plan.original) * 100)
          : 0;
      const isCouple =
        /couple|2 |two /i.test(plan.title) ||
        /couple|2 /i.test(plan.durationLabel);

      let badgeTag: string | undefined;
      if (index === 0) badgeTag = "MOST POPULAR";
      else if (savingsPct >= 40) badgeTag = `BEST VALUE (SAVE ${savingsPct}%)`;
      else if (index === 1) badgeTag = "RECOMMENDED";

      return {
        id: String(plan.id),
        title: plan.title,
        duration: plan.durationLabel,
        capacity: isCouple ? "2 People" : "1 Person",
        totalBought: redeemedLabel,
        inclusions: inclusions.slice(0, 5),
        originalPrice: plan.original,
        salePrice,
        promoCode:
          promoCode && discountPercent > 0
            ? { code: promoCode, discountPercent }
            : null,
        badgeTag,
        perkPills: isCouple ? ["Couples Suite"] : undefined,
      };
    });
  }, [packages, promoAmount, promoCode, inclusions, redeemedLabel]);

  return (
    <div className="space-y-4">
      <p className={`text-zinc-500 ${adaptivePanelTextClassName}`}>
        Select an option to update checkout
      </p>

      <OfferOptionsAccordion
        options={accordionOptions}
        selectedId={String(selectedPlanId)}
        onSelect={(id) => onSelectPlan(Number(id))}
        headerLabel={config.planHeaderLabel}
        onEnableGift={onEnableGift}
        onStateChange={(state) => {
          if (state.isGift) onEnableGift?.();
          onCheckoutStateChange?.(state);
        }}
      />

      {upsell ? (
        <UpsellRow
          upsell={upsell}
          added={upsellAdded}
          onAdd={onAddUpsell}
          badgeText={config.upsellBadgeText}
        />
      ) : null}
    </div>
  );
}

function WhatsIncludedContent({
  inclusions,
  upsell,
  upsellAdded,
  onAddUpsell,
  config,
}: {
  inclusions: string[];
  upsell: OfferUpsell | null;
  upsellAdded: boolean;
  onAddUpsell: () => void;
  config: CategoryUXConfig;
}) {
  return (
    <div className="space-y-3">
      <OfferInclusionsGrid
        inclusions={inclusions}
        headerLabel={config.inclusionsHeader}
      />

      {upsell ? (
        <UpsellRow
          upsell={upsell}
          added={upsellAdded}
          onAdd={onAddUpsell}
          badgeText={config.upsellBadgeText}
        />
      ) : null}
    </div>
  );
}

function FinePrintContent({
  merchantName,
  terms,
  offerPrice,
  originalPrice,
  onOpenPricing,
  onGiftHowItWorks,
  config,
}: {
  merchantName: string;
  terms: OfferTerms;
  offerPrice: number;
  originalPrice: number;
  onOpenPricing: () => void;
  onGiftHowItWorks: () => void;
  config: CategoryUXConfig;
}) {
  const promoValue = Math.max(0, originalPrice - offerPrice);

  return (
    <div className="space-y-5">
      <GiftBanner
        title={config.giftTitle}
        subtitle={config.giftSubtitle}
        accentIcon={config.accentIcon}
        onHowItWorks={onGiftHowItWorks}
      />

      <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
        <Scale className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
        {config.tab3Title.replace(/^\d+\.\s*/, "")}
        <span
          className={`ml-auto font-mono font-normal text-zinc-400 ${adaptivePanelTextClassName}`}
        >
          Standard v2026.1
        </span>
      </div>

      <div
        className={`flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-amber-950 ${adaptivePanelTextClassName}`}
      >
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          aria-hidden
        />
        <div className="max-w-prose space-y-1.5 text-left">
          <span className="mb-1 block font-bold">Two-Part Voucher Guarantee</span>
          <p>
            <strong>Promotional Discount ({formatMoney(promoValue)}):</strong>{" "}
            Expires {terms.promoExpiryDays} days after purchase date.
          </p>
          <p>
            <strong>Base Paid Value ({formatMoney(offerPrice)}):</strong> Never
            expires under applicable law and remains redeemable with{" "}
            {merchantName}.
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
          <CalendarCheck className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
          Booking Mandate
        </div>
        <p className={`max-w-prose text-zinc-700 ${adaptivePanelTextClassName}`}>
          {terms.booking}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 text-zinc-700 md:grid-cols-2 ${adaptivePanelTextClassName}`}
      >
        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <FileText className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
            Cancellation & Booking Rules
          </h4>
          <ul className="max-w-prose space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#FF5E1A]" aria-hidden>
                •
              </span>
              <span>
                <strong>Cancellation Policy:</strong> {terms.cancellationPolicy}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#FF5E1A]" aria-hidden>
                •
              </span>
              <span>
                <strong>Redemption Limit:</strong> {terms.redemptionLimits}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#FF5E1A]" aria-hidden>
                •
              </span>
              <span>
                <strong>Transferability:</strong> {terms.transferability}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#FF5E1A]" aria-hidden>
                •
              </span>
              <span>
                <strong>Appointment Requirement:</strong>{" "}
                {terms.appointmentRequirement}
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
            Merchant Liability Shield
          </h4>
          <p className="max-w-prose">
            {merchantName} is solely responsible to purchasers for the care,
            quality, execution, and legal fulfillment of all advertised goods and
            services.
          </p>
          <div className="flex items-start justify-start gap-2 pt-1 text-left">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5E1A]"
              aria-hidden
            />
            <button
              type="button"
              onClick={onOpenPricing}
              className="cursor-pointer text-left font-bold text-[#FF5E1A] hover:underline"
            >
              How Strike-Through Pricing & Reference Savings Work
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-2 border-t border-zinc-100 pt-3 text-zinc-500 sm:flex-row sm:items-center">
        <span className={adaptivePanelTextClassName}>
          NEXUS OS · End User Terms of Sale apply to all redemptions.
        </span>
        <Link
          href="/legal/terms"
          className={`font-semibold underline hover:text-zinc-900 ${adaptivePanelTextClassName}`}
        >
          Full Terms of Sale
        </Link>
      </div>
    </div>
  );
}

export function OfferDetailsTabbedSection({
  merchantName,
  packages,
  inclusions,
  upsell,
  terms,
  selectedPlanId,
  onSelectPlan,
  onEnableGift,
  categoryLookup,
  promoCode,
  promoAmount = 0,
  redeemedLabel,
  onCheckoutStateChange,
}: Props) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [upsellAdded, setUpsellAdded] = useState(false);
  const selected =
    packages.find((p) => p.id === selectedPlanId) ?? packages[0];
  const config = useMemo(
    () => getCategoryUX(categoryLookup),
    [categoryLookup.category, categoryLookup.id, categoryLookup.title],
  );

  const tabItems: AdaptiveItem[] = useMemo(
    () => [
      {
        id: "select-plan",
        title: config.tab1Title,
        icon: (
          <CategoryAccentIcon
            name={config.accentIcon}
            className="h-4 w-4"
          />
        ),
        content: (
          <SelectPlanContent
            packages={packages}
            selectedPlanId={selectedPlanId}
            onSelectPlan={onSelectPlan}
            upsell={upsell}
            upsellAdded={upsellAdded}
            onAddUpsell={() => setUpsellAdded(true)}
            config={config}
            inclusions={inclusions}
            promoCode={promoCode}
            promoAmount={promoAmount}
            redeemedLabel={redeemedLabel}
            onCheckoutStateChange={onCheckoutStateChange}
            onEnableGift={onEnableGift}
          />
        ),
      },
      {
        id: "whats-included",
        title: config.tab2Title,
        icon: <CheckCircle2 className="h-4 w-4" aria-hidden />,
        content: (
          <WhatsIncludedContent
            inclusions={inclusions}
            upsell={upsell}
            upsellAdded={upsellAdded}
            onAddUpsell={() => setUpsellAdded(true)}
            config={config}
          />
        ),
      },
      {
        id: "legal-terms",
        title: config.tab3Title,
        icon: <Scale className="h-4 w-4" aria-hidden />,
        content: (
          <FinePrintContent
            merchantName={merchantName}
            terms={terms}
            offerPrice={selected?.price ?? 0}
            originalPrice={selected?.original ?? 0}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onGiftHowItWorks={() => setIsGiftModalOpen(true)}
            config={config}
          />
        ),
      },
    ],
    [
      config,
      packages,
      inclusions,
      upsell,
      upsellAdded,
      terms,
      merchantName,
      selectedPlanId,
      onSelectPlan,
      selected?.price,
      selected?.original,
      promoCode,
      promoAmount,
      redeemedLabel,
      onCheckoutStateChange,
      onEnableGift,
    ],
  );

  return (
    <div className="my-2 w-full">
      <AdaptiveContainer defaultActiveId="select-plan" items={tabItems} />

      {isPricingModalOpen && selected ? (
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
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="pr-10 text-base font-black text-zinc-900">
              Reference Pricing Policy
            </h3>
            <p className={`text-zinc-600 ${adaptivePanelTextClassName}`}>
              Regular list prices reflect standard rates published by{" "}
              {merchantName} for unbundled offerings. The reference price of{" "}
              <strong>{formatMoney(selected.original)}</strong> and amount paid
              of <strong>{formatMoney(selected.price)}</strong> are used for
              savings calculations. Nexus does not invent reference prices.
            </p>
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(false)}
              className={`w-full rounded-xl bg-zinc-900 py-2.5 font-bold text-white ${adaptivePanelTextClassName}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {isGiftModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Gift how it works"
          onClick={() => setIsGiftModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsGiftModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="flex items-center gap-2 pr-10 text-base font-black text-zinc-900">
              <CategoryAccentIcon
                name={config.accentIcon}
                className="h-5 w-5 text-pink-600"
              />
              {config.giftTitle}
            </h3>
            <p className={`text-zinc-600 ${adaptivePanelTextClassName}`}>
              {config.giftSubtitle}
            </p>
            <ul
              className={`max-w-prose list-disc space-y-2 pl-5 text-zinc-600 ${adaptivePanelTextClassName}`}
            >
              <li>Add a personal message and choose a delivery date.</li>
              <li>Recipient gets an instant digital voucher by email.</li>
              <li>Easy exchange for another date or eligible option.</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                onEnableGift?.();
                setIsGiftModalOpen(false);
              }}
              className={`w-full rounded-xl bg-pink-600 py-2.5 font-bold text-white hover:bg-pink-700 ${adaptivePanelTextClassName}`}
            >
              Enable gift at checkout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
