"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type PremiumOfferCardWrapperProps = {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

/**
 * Apple-grade offer card shell: soft emerald depth when active, no hard stroke
 * outlines. Bottom footers must use `rounded-b-2xl`; flush top headers must use
 * `rounded-t-2xl`. DatePicker portals out — `overflow-hidden` is safe here.
 */
export const PremiumOfferCardWrapper = forwardRef<
  HTMLDivElement,
  PremiumOfferCardWrapperProps
>(function PremiumOfferCardWrapper(
  { children, isActive = false, className = "", ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-2xl transition-all duration-300 ${
        isActive
          ? "border border-emerald-500/40 bg-white shadow-[0_10px_35px_-5px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20"
          : "border border-zinc-200/80 bg-zinc-50/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-300 hover:bg-white hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)]"
      } ${className}`}
      {...rest}
    >
      {isActive ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/5"
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
});

export default PremiumOfferCardWrapper;
