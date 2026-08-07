"use client";

import type {
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
} from "react";
import { CheckCircle2, Scale, Sparkles, type LucideIcon } from "lucide-react";

export type CheckoutStepId = 1 | 2 | 3;

export type CheckoutStepItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

export type CheckoutStepHeaderProps = {
  /** Numeric step API (1–3). Prefer `steps` + `currentStepId` for AdaptiveContainer. */
  currentStep?: CheckoutStepId;
  onStepChange?: (step: CheckoutStepId) => void;
  /** Generic string-id steps (used by AdaptiveContainer / PDP). */
  steps?: CheckoutStepItem[];
  currentStepId?: string;
  onStepIdChange?: (id: string) => void;
  /** Optional per-tab button refs (roving tabindex / arrows). */
  tabRefs?: MutableRefObject<Array<HTMLButtonElement | null>>;
  onTabKeyDown?: (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  tabIdPrefix?: string;
  panelIdPrefix?: string;
  className?: string;
  "aria-label"?: string;
};

const DEFAULT_STEPS: Array<{
  id: CheckoutStepId;
  label: string;
  Icon: LucideIcon;
}> = [
  { id: 1, label: "1. Select Service", Icon: Sparkles },
  { id: 2, label: "2. Treatment Details", Icon: CheckCircle2 },
  { id: 3, label: "3. Aftercare & Policy", Icon: Scale },
];

/**
 * Apple HIG segmented step tracker. Top shell uses `rounded-t-2xl` so the
 * header fill respects parent card curvature (pair with `overflow-hidden` on
 * the card when popovers are portaled).
 */
export function CheckoutStepHeader({
  currentStep = 1,
  onStepChange,
  steps: customSteps,
  currentStepId,
  onStepIdChange,
  tabRefs,
  onTabKeyDown,
  tabIdPrefix,
  panelIdPrefix,
  className = "",
  "aria-label": ariaLabel = "Checkout steps",
}: CheckoutStepHeaderProps) {
  const useGeneric = Array.isArray(customSteps) && customSteps.length > 0;

  const items: CheckoutStepItem[] = useGeneric
    ? customSteps!
    : DEFAULT_STEPS.map((s) => ({
        id: String(s.id),
        label: s.label,
        icon: <s.Icon className="h-3.5 w-3.5" aria-hidden />,
      }));

  const activeId = useGeneric
    ? (currentStepId ?? items[0]?.id ?? "")
    : String(currentStep);

  return (
    <div
      className={`rounded-t-2xl border-b border-zinc-200/80 bg-zinc-50/60 p-3 sm:p-4 ${className}`}
    >
      <div
        className="flex items-center justify-between gap-1 rounded-xl bg-zinc-200/50 p-1"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((step, index) => {
          const isActive = activeId === step.id;
          const numericId = Number(step.id) as CheckoutStepId;
          const defaultIcon = DEFAULT_STEPS.find(
            (d) => String(d.id) === step.id,
          );
          const Icon = defaultIcon?.Icon;

          return (
            <button
              key={step.id}
              ref={(el) => {
                if (tabRefs) tabRefs.current[index] = el;
              }}
              id={tabIdPrefix ? `${tabIdPrefix}${step.id}` : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={
                panelIdPrefix ? `${panelIdPrefix}${step.id}` : undefined
              }
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                if (useGeneric) {
                  onStepIdChange?.(step.id);
                } else if (
                  numericId === 1 ||
                  numericId === 2 ||
                  numericId === 3
                ) {
                  onStepChange?.(numericId);
                }
              }}
              onKeyDown={(e) => onTabKeyDown?.(e, index)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs transition-all ${
                isActive
                  ? "bg-white font-bold text-zinc-900 shadow-sm ring-1 ring-black/5"
                  : "font-medium text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {step.icon ? (
                <span
                  className={`shrink-0 ${
                    isActive ? "text-emerald-600" : "text-zinc-400"
                  }`}
                  aria-hidden
                >
                  {step.icon}
                </span>
              ) : Icon ? (
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? "text-emerald-600" : "text-zinc-400"
                  }`}
                  aria-hidden
                />
              ) : null}
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CheckoutStepHeader;
