import { createHash } from "crypto";

/** Anonymize WiFi / biometric-adjacent probe identifiers before persistence. */
export function anonymizeProbeId(raw: string): string {
  const salt = process.env.GDPR_PROBE_SALT || "nexus-gdpr-salt";
  return createHash("sha256").update(`${salt}:${raw}`).digest("hex").slice(0, 32);
}

export function redactPhone(phone: string): string {
  if (phone.length < 4) return "***";
  return `${"*".repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`;
}

export {
  CONSENT_COOKIE,
  parseConsentCookie,
  type ConsentState,
} from "@/lib/gdpr/consent";
