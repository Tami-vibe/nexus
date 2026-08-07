"use client";

import { useEffect, useId, useState } from "react";

export function CheckoutModal({
  open,
  title,
  subtitle,
  confirmLabel,
  pending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  pending?: boolean;
  onClose: () => void;
  onConfirm: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("+972500000100");
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="nx-eyebrow">1-tap checkout</p>
        <h3 id={titleId} className="mt-2 text-2xl font-semibold text-[var(--ink)]">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
        ) : null}
        <label className="mt-5 block text-sm font-medium text-[var(--ink)]">
          Mobile number
          <input
            autoFocus
            className="mt-2 w-full rounded-2xl border border-[var(--line)] px-4 py-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+972…"
            inputMode="tel"
          />
        </label>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className="nx-btn nx-btn-ghost flex-1"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="nx-btn nx-btn-accent flex-1"
            disabled={pending || phone.trim().length < 5}
            onClick={() => onConfirm(phone.trim())}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
