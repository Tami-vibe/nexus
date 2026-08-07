"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Clock,
  Gift,
  Minus,
  Plus,
  Sparkles,
  Tag,
  User,
  Users,
} from "lucide-react";
import { adaptivePanelTextClassName } from "@/components/ui/AdaptiveContainer";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  DualBookingEngine,
  type BookingMode,
} from "@/components/offers/DualBookingEngine";
import { OfferInclusionsGrid } from "@/components/offers/OfferInclusionsGrid";
import { PremiumOfferCardWrapper } from "@/components/offers/PremiumOfferCardWrapper";
import type { OfferOptionPromo } from "@/components/offers/OfferOptionCard";

export type AccordionOfferOption = {
  id: string;
  title: string;
  duration: string;
  capacity: string;
  totalBought: string;
  inclusions: string[];
  originalPrice: number;
  salePrice: number;
  promoCode?: OfferOptionPromo | null;
  badgeTag?: string;
  perkPills?: string[];
};

export type OfferOptionsAccordionProps = {
  options: AccordionOfferOption[];
  /** Controlled selected option id (string form of package id). */
  selectedId?: string;
  onSelect?: (id: string) => void;
  headerLabel?: string;
  onStateChange?: (state: {
    quantity: number;
    isGift: boolean;
    bookingMode: BookingMode;
    selectedSlot: string | null;
    slotDate: Date | null;
    unitPrice: number;
    totalPrice: number;
    totalSavings: number;
  }) => void;
  onEnableGift?: () => void;
  className?: string;
};

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function calcPricing(
  option: AccordionOfferOption,
  quantity: number,
  applyVolume: boolean,
) {
  const promoDiscount = option.promoCode?.discountPercent ?? 0;
  const basePromo =
    promoDiscount > 0
      ? option.salePrice * (1 - promoDiscount / 100)
      : option.salePrice;
  const volumeMultiplier = applyVolume && quantity >= 2 ? 0.9 : 1;
  const unitPrice = basePromo * volumeMultiplier;
  const qty = applyVolume ? quantity : 1;
  const totalPrice = unitPrice * qty;
  const totalOriginal = option.originalPrice * qty;
  const totalSavings = Math.max(0, totalOriginal - totalPrice);
  const savingsPercent =
    totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;

  return { unitPrice, totalPrice, totalOriginal, totalSavings, savingsPercent };
}

/**
 * Single-selection accordion: collapsed cards stay informative; one expanded
 * selling engine with qty, gift mode, and DatePicker.
 */
export function OfferOptionsAccordion({
  options,
  selectedId: controlledId,
  onSelect,
  headerLabel = "Available Packages & Options",
  onStateChange,
  onEnableGift,
  className = "",
}: OfferOptionsAccordionProps) {
  const [internalId, setInternalId] = useState(options[0]?.id ?? "");
  const selectedId = controlledId ?? internalId;
  const [quantity, setQuantity] = useState(1);
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>("open_voucher");
  const [slotDate, setSlotDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [giftName, setGiftName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftDate, setGiftDate] = useState<Date | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const selectOption = (id: string) => {
    setInternalId(id);
    onSelect?.(id);
    setQuantity(1);
    setBookingMode("open_voucher");
    setSlotDate(null);
    setSelectedSlot(null);
    // Smooth scroll expanded card into view
    requestAnimationFrame(() => {
      panelRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  const activeOption = useMemo(
    () => options.find((o) => o.id === selectedId) ?? options[0],
    [options, selectedId],
  );

  useEffect(() => {
    if (!activeOption) return;
    const pricing = calcPricing(activeOption, quantity, true);
    onStateChange?.({
      quantity,
      isGift: isGiftMode,
      bookingMode: isGiftMode ? "open_voucher" : bookingMode,
      selectedSlot: isGiftMode ? null : selectedSlot,
      slotDate: isGiftMode ? null : slotDate,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      totalSavings: pricing.totalSavings,
    });
  }, [
    activeOption,
    quantity,
    isGiftMode,
    bookingMode,
    selectedSlot,
    slotDate,
    onStateChange,
  ]);

  if (!options.length) return null;

  return (
    <div className={`mx-auto w-full space-y-3 ${className}`}>
      <h3 className="text-sm font-bold uppercase tracking-tight text-zinc-900">
        {headerLabel}
      </h3>

      <div className="space-y-3" role="radiogroup" aria-label="Offer options">
        {options.map((option) => {
          const isExpanded = option.id === selectedId;
          const collapsedPricing = calcPricing(option, 1, false);
          const expandedPricing = calcPricing(option, quantity, true);
          const pricing = isExpanded ? expandedPricing : collapsedPricing;

          return (
            <PremiumOfferCardWrapper
              key={option.id}
              ref={(el) => {
                panelRefs.current[option.id] = el;
              }}
              isActive={isExpanded}
              role="radio"
              aria-checked={isExpanded}
            >
              {/* Always-visible header */}
              <button
                type="button"
                onClick={() => selectOption(option.id)}
                className="flex w-full cursor-pointer items-start justify-between gap-3 p-4 text-left select-none sm:p-5"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  {option.badgeTag ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      <Sparkles
                        className="h-3 w-3 text-emerald-600"
                        aria-hidden
                      />
                      {option.badgeTag}
                    </span>
                  ) : null}

                  <h4
                    className={`text-sm font-bold leading-snug transition-colors sm:text-base ${
                      isExpanded ? "text-zinc-900" : "text-zinc-700"
                    }`}
                  >
                    {option.title}
                  </h4>

                  <div
                    className={`flex flex-wrap items-center gap-2 font-medium text-zinc-500 ${adaptivePanelTextClassName}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden />
                      {option.duration}
                    </span>
                    <span aria-hidden>•</span>
                    <span className="inline-flex items-center gap-1">
                      {option.capacity.includes("2") ||
                      option.capacity.toLowerCase().includes("couple") ? (
                        <Users className="h-3 w-3" aria-hidden />
                      ) : (
                        <User className="h-3 w-3" aria-hidden />
                      )}
                      {option.capacity}
                    </span>
                    {(option.perkPills ?? []).map((perk) => (
                      <span
                        key={perk}
                        className="rounded-full bg-zinc-200/70 px-2 py-0.5 font-semibold text-zinc-600"
                      >
                        {perk}
                      </span>
                    ))}
                    <span aria-hidden>•</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">
                      {option.totalBought} bought
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-full p-1.5 transition-transform duration-200 ${
                    isExpanded
                      ? "rotate-180 bg-emerald-50 text-emerald-700"
                      : "bg-zinc-200/60 text-zinc-500"
                  }`}
                  aria-hidden
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {/* Collapsed compact pricing footer */}
              {!isExpanded ? (
                <div className="mt-auto flex items-center justify-between gap-3 rounded-b-2xl border-t border-zinc-200/60 bg-zinc-50/80 px-4 pb-4 pt-3 sm:px-5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xl font-black text-zinc-900">
                      {formatMoney(pricing.totalPrice)}
                    </span>
                    <span
                      className={`text-zinc-400 line-through ${adaptivePanelTextClassName}`}
                    >
                      {formatMoney(option.originalPrice)}
                    </span>
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                      -{pricing.savingsPercent}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectOption(option.id)}
                    className="rounded-xl bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800"
                  >
                    Select & View
                  </button>
                </div>
              ) : null}

              {/* Expanded selling engine */}
              {isExpanded ? (
                <div className="animate-nx-fade-in mt-auto flex flex-col border-t border-zinc-100">
                  <div className="p-4 sm:p-5">
                    <OfferInclusionsGrid
                      inclusions={option.inclusions}
                      headerLabel="What's Included in this Option"
                    />
                  </div>

                  <div className="space-y-4 rounded-b-2xl border-t border-zinc-200/60 bg-zinc-50/80 p-4 sm:p-5">
                    <div
                      className={`flex rounded-xl bg-zinc-100 p-1 font-bold ${adaptivePanelTextClassName}`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsGiftMode(false)}
                        className={`flex-1 rounded-lg py-1.5 transition-all ${
                          !isGiftMode
                            ? "bg-white text-zinc-900 shadow-sm"
                            : "text-zinc-500"
                        }`}
                      >
                        For Myself
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsGiftMode(true);
                          onEnableGift?.();
                        }}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                          isGiftMode
                            ? "bg-pink-600 text-white shadow-sm"
                            : "text-zinc-500"
                        }`}
                      >
                        <Gift className="h-3.5 w-3.5" aria-hidden />
                        Buy as a Gift
                      </button>
                    </div>

                    {isGiftMode ? (
                      <div className="animate-nx-fade-in space-y-3 rounded-xl border border-pink-200/80 bg-pink-50/60 p-3.5">
                        <span className="flex items-center gap-1.5 font-bold text-pink-900 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                          <Gift className="h-3.5 w-3.5" aria-hidden />
                          Gift Voucher Options
                        </span>
                        <input
                          type="text"
                          placeholder="Recipient Name (optional)"
                          value={giftName}
                          onChange={(e) => setGiftName(e.target.value)}
                          className={`w-full rounded-lg border border-pink-200 bg-white p-2.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-pink-500 ${adaptivePanelTextClassName}`}
                        />
                        <textarea
                          placeholder="Gift message (optional)"
                          rows={2}
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          className={`w-full resize-none rounded-lg border border-pink-200 bg-white p-2.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-pink-500 ${adaptivePanelTextClassName}`}
                        />
                        <div className="space-y-1">
                          <label className="block font-bold text-pink-900 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                            Delivery Date (Optional)
                          </label>
                          <DatePicker
                            selectedDate={giftDate}
                            onChange={setGiftDate}
                            accentColor="pink"
                            placeholder="Select instant or future delivery date"
                            minDate={new Date()}
                          />
                        </div>
                      </div>
                    ) : (
                      <DualBookingEngine
                        mode={bookingMode}
                        onModeChange={setBookingMode}
                        slotDate={slotDate}
                        onSlotDateChange={setSlotDate}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                      />
                    )}

                    <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-end">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-zinc-400 line-through ${adaptivePanelTextClassName}`}
                          >
                            {formatMoney(pricing.totalOriginal)}
                          </span>
                          <span className="rounded bg-red-100 px-1.5 py-0.5 font-extrabold text-red-700 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                            SAVE {formatMoney(pricing.totalSavings)} (
                            {pricing.savingsPercent}%)
                          </span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-2xl font-black text-[#FF5E1A] sm:text-3xl">
                            {formatMoney(pricing.totalPrice)}
                          </span>
                          {option.promoCode ? (
                            <span className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 font-bold text-[#E04E0E] text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                              <Tag className="h-3 w-3" aria-hidden />
                              code {option.promoCode.code}
                            </span>
                          ) : null}
                        </div>
                        {quantity >= 2 ? (
                          <p className="flex items-center gap-1 font-bold text-emerald-700 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                            <Sparkles className="h-3 w-3" aria-hidden />
                            Multi-Pack Bonus Applied! Extra 10% off
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-xl border border-zinc-300 bg-white p-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQuantity((q) => Math.max(1, q - 1))
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={
                            !isGiftMode &&
                            bookingMode === "reserve_slot" &&
                            (!slotDate || !selectedSlot)
                          }
                          className={`rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                            isGiftMode
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "bg-[#FF5E1A] hover:bg-[#E04E0E]"
                          }`}
                        >
                          {isGiftMode
                            ? "Send Gift Voucher"
                            : bookingMode === "reserve_slot"
                              ? "Reserve & Pay"
                              : "Buy Open Voucher"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </PremiumOfferCardWrapper>
          );
        })}
      </div>
    </div>
  );
}

export default OfferOptionsAccordion;
