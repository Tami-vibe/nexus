"use client";

import { useEffect, useState } from "react";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes("nexus_consent=")) {
      setVisible(true);
    }
    const open = () => setVisible(true);
    window.addEventListener("nexus:open-consent", open);
    return () => window.removeEventListener("nexus:open-consent", open);
  }, []);

  if (!visible) return null;

  const save = async (analytics: boolean, marketing: boolean) => {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics, marketing }),
    });
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--line)] bg-white/95 p-4 backdrop-blur"
      role="dialog"
      aria-label="Privacy consent"
    >
      <p className="max-w-md text-sm text-[var(--muted)]">
        Essential cookies power booking and checkout. Analytics stay off until
        you opt in.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="nx-btn nx-btn-ghost !py-2 text-sm"
          onClick={() => save(false, false)}
        >
          Essential only
        </button>
        <button
          type="button"
          className="nx-btn nx-btn-secondary !py-2 text-sm"
          onClick={() => save(true, true)}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
