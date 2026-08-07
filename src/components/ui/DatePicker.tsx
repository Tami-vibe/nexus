"use client";

import { useEffect, useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { adaptivePanelTextClassName } from "@/components/ui/AdaptiveContainer";

export type DatePickerAccent = "pink" | "emerald" | "orange" | "zinc";

export type DatePickerProps = {
  selectedDate?: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholder?: string;
  accentColor?: DatePickerAccent;
  className?: string;
  id?: string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const ACCENT = {
  pink: {
    selected: "bg-pink-600 text-white shadow-md shadow-pink-200",
    focus: "border-pink-500 ring-2 ring-pink-500/20",
    todayDot: "bg-pink-500",
    todayBtn: "font-bold text-pink-600 hover:underline",
  },
  emerald: {
    selected: "bg-emerald-700 text-white shadow-md shadow-emerald-200",
    focus: "border-emerald-600 ring-2 ring-emerald-600/20",
    todayDot: "bg-emerald-600",
    todayBtn: "font-bold text-emerald-700 hover:underline",
  },
  orange: {
    selected: "bg-[#FF5E1A] text-white shadow-md shadow-orange-200",
    focus: "border-[#FF5E1A] ring-2 ring-[#FF5E1A]/20",
    todayDot: "bg-[#FF5E1A]",
    todayBtn: "font-bold text-[#FF5E1A] hover:underline",
  },
  zinc: {
    selected: "bg-zinc-900 text-white shadow-md shadow-zinc-200",
    focus: "border-zinc-900 ring-2 ring-zinc-900/15",
    todayDot: "bg-zinc-900",
    todayBtn: "font-bold text-zinc-900 hover:underline",
  },
} as const;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Apple HIG-inspired date picker. Calendar renders in a Radix Portal so parent
 * overflow (accordion cards, AdaptiveContainer) cannot clip the popover.
 */
export function DatePicker({
  selectedDate = null,
  onChange,
  minDate = new Date(),
  placeholder = "Select delivery date",
  accentColor = "pink",
  className = "",
  id,
}: DatePickerProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const accent = ACCENT[accentColor];

  useEffect(() => {
    if (selectedDate) setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleSelectDay = (day: number) => {
    onChange(new Date(year, month, day));
    setOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const dateCheck = startOfDay(new Date(year, month, day));
    return dateCheck < startOfDay(minDate);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={triggerId}
          type="button"
          className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 shadow-sm transition-all ${adaptivePanelTextClassName} ${
            open
              ? accent.focus
              : "border-zinc-200 hover:border-zinc-300"
          } ${className}`}
        >
          <div className="flex min-w-0 items-center gap-2 text-zinc-700">
            <CalendarIcon
              className="h-4 w-4 shrink-0 text-zinc-400"
              aria-hidden
            />
            <span
              className={
                selectedDate
                  ? "truncate font-semibold text-zinc-900"
                  : "truncate text-zinc-400"
              }
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : placeholder}
            </span>
          </div>

          {selectedDate ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(null);
                }
              }}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="h-3 w-3" />
            </span>
          ) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          className="z-[9999] w-[290px] rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-xl animate-nx-fade-in outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-black tracking-tight text-zinc-900">
              {MONTHS[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={handlePrevMonth}
                className="rounded-lg p-1.5 text-zinc-600 transition-all hover:bg-zinc-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={handleNextMonth}
                className="rounded-lg p-1.5 text-zinc-600 transition-all hover:bg-zinc-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-[10px] font-bold uppercase text-zinc-400"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const disabled = isDisabled(dayNum);
              const active = isSelected(dayNum);
              const todayMark = isToday(dayNum);

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`relative mx-auto flex h-8 w-8 cursor-pointer flex-col items-center justify-center rounded-full text-xs transition-all ${
                    disabled
                      ? "pointer-events-none text-zinc-300 opacity-30"
                      : active
                        ? `${accent.selected} font-bold`
                        : "font-medium text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  <span>{dayNum}</span>
                  {todayMark && !active ? (
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${accent.todayDot}`}
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                if (minDate && startOfDay(now) < startOfDay(minDate)) return;
                setCurrentMonth(now);
                onChange(now);
                setOpen(false);
              }}
              className={accent.todayBtn}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800"
            >
              Clear
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default DatePicker;
