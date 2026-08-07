"use client";

import { useMemo } from "react";
import { CalendarClock, Info, Ticket, Clock } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { adaptivePanelTextClassName } from "@/components/ui/AdaptiveContainer";

export type BookingMode = "open_voucher" | "reserve_slot";

export type DualBookingEngineProps = {
  mode: BookingMode;
  onModeChange: (mode: BookingMode) => void;
  slotDate: Date | null;
  onSlotDateChange: (date: Date | null) => void;
  selectedSlot: string | null;
  onSelectSlot: (slot: string | null) => void;
  /** Optional merchant-specific slot labels; defaults to mock morning/afternoon grid. */
  availableSlots?: string[];
  className?: string;
};

export const BOOKING_POLICY_COPY =
  "Free rescheduling up to 24h prior. Late cancellations under 12h forfeit voucher to protect merchant time.";

/** Deterministic mock availability from a calendar day (swap for live merchant API later). */
export function getMockSlotsForDate(date: Date | null): string[] {
  if (!date) return [];
  const seed = date.getDate() + date.getMonth() * 31;
  const morning = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoon = ["13:00", "13:30", "14:00", "14:30", "15:00", "16:00", "17:00"];
  const pool = [...morning, ...afternoon];
  return pool.filter((_, i) => (seed + i) % 3 !== 0);
}

export function BookingPolicyNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-600 ${adaptivePanelTextClassName} ${className}`}
      role="note"
    >
      <Info
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500"
        aria-hidden
      />
      <span>{BOOKING_POLICY_COPY}</span>
    </p>
  );
}

/**
 * Dual-engine checkout for "For Myself":
 * 1) Buy Open Voucher — zero friction, book later from dashboard
 * 2) Reserve Time Slot Now — date + live slot grid
 */
export function DualBookingEngine({
  mode,
  onModeChange,
  slotDate,
  onSlotDateChange,
  selectedSlot,
  onSelectSlot,
  availableSlots,
  className = "",
}: DualBookingEngineProps) {
  const slots = useMemo(() => {
    if (availableSlots) return availableSlots;
    return getMockSlotsForDate(slotDate);
  }, [availableSlots, slotDate]);

  return (
    <div className={`space-y-3 ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
        How do you want to book?
      </span>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            onModeChange("open_voucher");
            onSelectSlot(null);
            onSlotDateChange(null);
          }}
          className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
            mode === "open_voucher"
              ? "border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600/20"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
            <Ticket className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
            Buy Open Voucher
          </span>
          <span className={`text-zinc-500 ${adaptivePanelTextClassName}`}>
            Instant purchase — schedule your slot later from your dashboard.
          </span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("reserve_slot")}
          className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
            mode === "reserve_slot"
              ? "border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600/20"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
            <CalendarClock className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
            Reserve Time Slot Now
          </span>
          <span className={`text-zinc-500 ${adaptivePanelTextClassName}`}>
            Lock a live merchant availability window at checkout.
          </span>
        </button>
      </div>

      {mode === "reserve_slot" ? (
        <div className="animate-nx-fade-in space-y-3 rounded-xl border border-zinc-200 bg-white p-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-zinc-800">
              Preferred date
            </label>
            <DatePicker
              selectedDate={slotDate}
              onChange={(d) => {
                onSlotDateChange(d);
                onSelectSlot(null);
              }}
              accentColor="emerald"
              placeholder="Pick a day to see open slots"
              minDate={new Date()}
            />
          </div>

          {slotDate ? (
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Available slots
              </span>
              {slots.length ? (
                <div
                  className="grid grid-cols-3 gap-2 sm:grid-cols-4"
                  role="listbox"
                  aria-label="Available time slots"
                >
                  {slots.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => onSelectSlot(slot)}
                        className={`rounded-lg border px-2 py-2 text-center text-xs font-bold transition-all ${
                          active
                            ? "border-emerald-600 bg-emerald-700 text-white"
                            : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-emerald-400"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className={`text-zinc-500 ${adaptivePanelTextClassName}`}>
                  No open slots this day — try another date.
                </p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <BookingPolicyNotice />
    </div>
  );
}

export default DualBookingEngine;
