"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { CheckoutStepHeader } from "@/components/checkout/CheckoutStepHeader";

export interface AdaptiveItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface AdaptiveContainerProps {
  items: AdaptiveItem[];
  defaultActiveId?: string;
  /** When true, multiple accordion panels may stay open on &lt;lg. Default: single-open. */
  allowMultipleMobile?: boolean;
  className?: string;
  /** Optional dark header slot rendered above the segmented control. */
  header?: ReactNode;
  /** Optional footer slot under panels. */
  footer?: ReactNode;
}

/** Shared fluid body scale for AdaptiveContainer panel content (PDP / legal). */
export const adaptivePanelTextClassName =
  "text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)] leading-[1.6]";

/**
 * Design-system primitive: Apple-style segmented tabs on desktop (lg+),
 * WCAG-friendly accordion on mobile/tablet (&lt;lg).
 * Parent shell uses `overflow-hidden` + `rounded-2xl`; step header applies
 * `rounded-t-2xl` so fills never square-bleed the corners.
 */
export function AdaptiveContainer({
  items,
  defaultActiveId,
  allowMultipleMobile = false,
  className = "",
  header,
  footer,
}: AdaptiveContainerProps) {
  const reactId = useId();
  const initialId = defaultActiveId || items[0]?.id || "";
  const [activeTab, setActiveTab] = useState(initialId);
  const [openAccordions, setOpenAccordions] = useState<string[]>(
    initialId ? [initialId] : [],
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const toggleAccordion = useCallback(
    (id: string) => {
      setOpenAccordions((prev) => {
        if (allowMultipleMobile) {
          return prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id];
        }
        return prev.includes(id) ? [] : [id];
      });
    },
    [allowMultipleMobile],
  );

  const focusTab = (index: number) => {
    const next = tabRefs.current[index];
    next?.focus();
  };

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!items.length) return;
    let nextIndex = index;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (index + 1) % items.length;
        setActiveTab(items[nextIndex].id);
        focusTab(nextIndex);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = (index - 1 + items.length) % items.length;
        setActiveTab(items[nextIndex].id);
        focusTab(nextIndex);
        break;
      case "Home":
        event.preventDefault();
        setActiveTab(items[0].id);
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        nextIndex = items.length - 1;
        setActiveTab(items[nextIndex].id);
        focusTab(nextIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setActiveTab(items[index].id);
        break;
      default:
        break;
    }
  };

  const onAccordionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % items.length;
      document.getElementById(`${reactId}-acc-${items[next].id}`)?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + items.length) % items.length;
      document.getElementById(`${reactId}-acc-${items[prev].id}`)?.focus();
    }
  };

  if (!items.length) return null;

  const stepItems = items.map((item) => ({
    id: item.id,
    label: item.title,
    icon: item.icon,
  }));

  return (
    <div className={`mx-auto w-full max-w-[860px] ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {header}

        {/* Desktop: Apple HIG segmented step header */}
        <div className="hidden lg:block">
          <CheckoutStepHeader
            steps={stepItems}
            currentStepId={activeTab}
            onStepIdChange={setActiveTab}
            tabRefs={tabRefs}
            onTabKeyDown={onTabKeyDown}
            tabIdPrefix={`${reactId}-tab-`}
            panelIdPrefix={`${reactId}-panel-`}
            aria-label="Section panels"
          />
        </div>

        <div className="hidden p-6 lg:block">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                id={`${reactId}-panel-${item.id}`}
                role="tabpanel"
                aria-labelledby={`${reactId}-tab-${item.id}`}
                hidden={!isActive}
                className={isActive ? "block animate-nx-fade-in" : "hidden"}
              >
                <div className={adaptivePanelTextClassName}>{item.content}</div>
              </div>
            );
          })}
        </div>

        {/* Mobile / tablet: accordion */}
        <div className="divide-y divide-zinc-200 lg:hidden">
          {items.map((item, index) => {
            const isOpen = openAccordions.includes(item.id);
            const panelId = `${reactId}-acc-panel-${item.id}`;
            return (
              <div key={item.id} className="p-4">
                <button
                  id={`${reactId}-acc-${item.id}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(item.id)}
                  onKeyDown={(e) => onAccordionKeyDown(e, index)}
                  className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 text-left text-sm font-bold text-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    {item.icon ? (
                      <span className="text-emerald-600" aria-hidden>
                        {item.icon}
                      </span>
                    ) : null}
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#FF5E1A]" : "text-zinc-500"
                    }`}
                    aria-hidden
                  />
                </button>

                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${reactId}-acc-${item.id}`}
                    className={`mt-3 animate-nx-fade-in border-t border-zinc-100 pt-3 ${adaptivePanelTextClassName}`}
                  >
                    {item.content}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {footer}
      </div>
    </div>
  );
}
