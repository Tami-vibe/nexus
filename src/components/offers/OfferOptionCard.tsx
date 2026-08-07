"use client";

import { useEffect, useMemo, useState } from "react";
import {
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

export type OfferOptionPromo = {
  code: string;
  discountPercent: number;
};

export type OfferOptionCardProps = {
  id: string | number;
  title: string;
  duration: string;
  capacity?: string;
  totalBought?: string;
  inclusions: string[];
  /** List / reference price (strikethrough). */
  originalPrice: number;
  /** Deal price before promo code. */
  salePrice: number;
  promoCode?: OfferOptionPromo | null;
  selected?: boolean;
  onSelect?: () => void;
  /** Fires when qty / gift / totals change (for sticky checkout sync). */
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
  className?: string;
};

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/**
 * High-converting option card: multi-price anchors, qty volume bonus, self/gift mode.
 */
export function OfferOptionCard({
  title,
  duration,
  capacity = "1 Person",
  totalBought = "1,000+",
  inclusions,
  originalPrice,
  salePrice,
  promoCode = null,
  selected = false,
  onSelect,
  onStateChange,
  className = "",
}: OfferOptionCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>("open_voucher");
  const [slotDate, setSlotDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [giftRecipient, setGiftRecipient] = useState({
    name: "",
    message: "",
  });
  const [giftDate, setGiftDate] = useState<Date | null>(null);

  const pricing = useMemo(() => {
    const volumeMultiplier = quantity >= 2 ? 0.9 : 1;
    const discountPct = promoCode?.discountPercent ?? 0;
    const basePromo =
      discountPct > 0 ? salePrice * (1 - discountPct / 100) : salePrice;
    const unitPrice = basePromo * volumeMultiplier;
    const totalPrice = unitPrice * quantity;
    const totalOriginal = originalPrice * quantity;
    const totalSale = salePrice * quantity;
    const totalSavings = Math.max(0, totalOriginal - totalPrice);
    const savingsPercent =
      totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;

    return {
      unitPrice,
      totalPrice,
      totalOriginal,
      totalSale,
      totalSavings,
      savingsPercent,
      volumeBonus: quantity >= 2,
    };
  }, [quantity, originalPrice, salePrice, promoCode]);

  useEffect(() => {
    if (!selected) return;
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
    selected,
    quantity,
    isGiftMode,
    bookingMode,
    selectedSlot,
    slotDate,
    pricing.unitPrice,
    pricing.totalPrice,
    pricing.totalSavings,
    onStateChange,
  ]);

  return (
    <PremiumOfferCardWrapper
      isActive={selected}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={className}
    >
      <div className="space-y-3 p-5">
        <h3 className="text-base font-bold leading-snug text-zinc-900 sm:text-lg">
          {title}
        </h3>

        <div
          className={`flex flex-wrap items-center gap-2 font-medium text-zinc-500 ${adaptivePanelTextClassName}`}
        >
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {duration}
          </span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            {capacity.toLowerCase().includes("2") ||
            capacity.toLowerCase().includes("couple") ? (
              <Users className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <User className="h-3.5 w-3.5" aria-hidden />
            )}
            {capacity}
          </span>
          <span aria-hidden>•</span>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
            {totalBought} bought
          </span>
        </div>

        {inclusions.length > 0 ? (
          <OfferInclusionsGrid inclusions={inclusions} />
        ) : null}
      </div>

      <div
        className="mt-auto space-y-4 rounded-b-2xl border-t border-zinc-200/60 bg-zinc-50/80 p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Self vs Gift */}
        <div className="flex rounded-xl bg-zinc-200/70 p-1 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)] font-bold">
          <button
            type="button"
            onClick={() => setIsGiftMode(false)}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              !isGiftMode
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            For Myself
          </button>
          <button
            type="button"
            onClick={() => setIsGiftMode(true)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
              isGiftMode
                ? "bg-pink-600 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Gift className="h-3.5 w-3.5" aria-hidden />
            <span>Buy as a Gift</span>
          </button>
        </div>

        {isGiftMode ? (
          <div className="animate-nx-fade-in space-y-2 rounded-xl border border-pink-200 bg-pink-50/80 p-3">
            <span className="flex items-center gap-1.5 font-bold text-pink-900 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
              <Gift className="h-3.5 w-3.5" aria-hidden />
              Gift Personalization
            </span>
            <input
              type="text"
              placeholder="Recipient Name (optional)"
              value={giftRecipient.name}
              onChange={(e) =>
                setGiftRecipient({ ...giftRecipient, name: e.target.value })
              }
              className={`w-full rounded-lg border border-pink-200 bg-white p-2 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-pink-500 ${adaptivePanelTextClassName}`}
            />
            <textarea
              placeholder="Gift message (optional)"
              value={giftRecipient.message}
              rows={2}
              onChange={(e) =>
                setGiftRecipient({ ...giftRecipient, message: e.target.value })
              }
              className={`w-full resize-none rounded-lg border border-pink-200 bg-white p-2 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-pink-500 ${adaptivePanelTextClassName}`}
            />
            <div className="space-y-1">
              <label className="block font-bold text-pink-900 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                Delivery Date (Optional)
              </label>
              <DatePicker
                selectedDate={giftDate}
                onChange={setGiftDate}
                accentColor="pink"
                placeholder="Send immediately or pick a date"
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

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono text-zinc-400 line-through ${adaptivePanelTextClassName}`}
              >
                {formatMoney(pricing.totalOriginal)}
              </span>
              <span
                className={`text-zinc-500 line-through ${adaptivePanelTextClassName}`}
              >
                {formatMoney(pricing.totalSale)}
              </span>
              <span className="rounded bg-red-100 px-1.5 py-0.5 font-extrabold text-red-700 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                SAVE {formatMoney(pricing.totalSavings)} ({pricing.savingsPercent}
                %)
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-black text-[#FF5E1A] sm:text-3xl">
                {formatMoney(pricing.totalPrice)}
              </span>
              {promoCode ? (
                <span className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 font-bold text-[#E04E0E] text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                  <Tag className="h-3 w-3" aria-hidden />
                  code {promoCode.code} applied
                </span>
              ) : null}
            </div>

            {pricing.volumeBonus ? (
              <p className="flex items-center gap-1 font-bold text-emerald-700 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
                <Sparkles className="h-3 w-3" aria-hidden />
                Multi-Pack Bonus Applied! Extra 10% off
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-zinc-300 bg-white p-1 shadow-sm">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-zinc-100"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-zinc-100"
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
                  ? "bg-pink-600 shadow-pink-200 hover:bg-pink-700"
                  : "bg-[#FF5E1A] shadow-orange-200 hover:bg-[#E04E0E]"
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
    </PremiumOfferCardWrapper>
  );
}

export default OfferOptionCard;
