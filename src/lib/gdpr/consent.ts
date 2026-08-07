export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  essential: true;
}

export const CONSENT_COOKIE = "nexus_consent";

export function parseConsentCookie(value: string | undefined): ConsentState {
  if (!value) {
    return { analytics: false, marketing: false, essential: true };
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentState>;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return { analytics: false, marketing: false, essential: true };
  }
}
