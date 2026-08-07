"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LOCATION,
  readOnboarded,
  writeLocation,
  writeOnboarded,
  type OnboardingLocation,
} from "@/lib/onboarding";

const COUNTRIES = ["Italy", "Israel", "France", "United States"];
const LANGUAGES = ["Italiano", "English", "Hebrew", "Français"];

type Props = {
  /** Force open (e.g. Change location from /offers) */
  forceOpen?: boolean;
  onCompleted?: (loc: OnboardingLocation) => void;
  onClose?: () => void;
};

/**
 * First-visit 2-step onboarding — location, then email unlock.
 * Skips when localStorage nexus_onboarded_v1 is set.
 */
export function OnboardingModal({
  forceOpen = false,
  onCompleted,
  onClose,
}: Props) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [country, setCountry] = useState(DEFAULT_LOCATION.country);
  const [language, setLanguage] = useState(DEFAULT_LOCATION.language);
  const [city, setCity] = useState(DEFAULT_LOCATION.city);
  const [email, setEmail] = useState("");

  const [locationOnly, setLocationOnly] = useState(false);

  useEffect(() => {
    const onboarded = readOnboarded();
    setReady(true);
    if (forceOpen || !onboarded) {
      setOpen(true);
      setStep(1);
      setLocationOnly(Boolean(forceOpen && onboarded));
    }
  }, [forceOpen]);

  if (!ready || !open) return null;

  const finish = (loc: OnboardingLocation) => {
    writeLocation(loc);
    writeOnboarded();
    setOpen(false);
    onCompleted?.(loc);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nexus-onboard-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-none md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Step {step} of 2
        </p>
        <h2
          id="nexus-onboard-title"
          className="mt-2 text-2xl font-semibold text-zinc-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {step === 1 ? "Where should we show rates?" : "Unlock local rates"}
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          {step === 1
            ? "Choose your country, language, and city so first-visit rates match your area."
            : "Add your email to unlock introductory rates from clinics and studios nearby."}
        </p>

        {step === 1 ? (
          <div className="mt-6 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Country
              </span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-900"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Language
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-900"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                City
              </span>
              <input
                type="search"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Milano, Tel Aviv, Paris…"
                className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                const loc = { country, language, city };
                writeLocation(loc);
                if (locationOnly) {
                  finish(loc);
                  return;
                }
                setStep(2);
              }}
              disabled={!city.trim()}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55013] disabled:opacity-50"
            >
              {locationOnly ? "Update location" : "Continue"}
            </button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim() || !email.includes("@")) return;
              finish({ country, language, city });
            }}
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55013]"
            >
              Unlock Local Rates
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm font-medium text-zinc-600 underline-offset-2 hover:underline"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
