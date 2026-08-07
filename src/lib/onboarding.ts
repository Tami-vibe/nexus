export const ONBOARDING_KEY = "nexus_onboarded_v1";
export const ONBOARDING_LOCATION_KEY = "nexus_location_v1";

export type OnboardingLocation = {
  country: string;
  language: string;
  city: string;
};

export const DEFAULT_LOCATION: OnboardingLocation = {
  country: "Italy",
  language: "Italiano",
  city: "Milan",
};

export function readOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return true;
  }
}

export function writeOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // private mode — ignore
  }
}

export function readLocation(): OnboardingLocation {
  if (typeof window === "undefined") return DEFAULT_LOCATION;
  try {
    const raw = localStorage.getItem(ONBOARDING_LOCATION_KEY);
    if (!raw) return DEFAULT_LOCATION;
    const parsed = JSON.parse(raw) as Partial<OnboardingLocation>;
    return {
      country: parsed.country || DEFAULT_LOCATION.country,
      language: parsed.language || DEFAULT_LOCATION.language,
      city: parsed.city || DEFAULT_LOCATION.city,
    };
  } catch {
    return DEFAULT_LOCATION;
  }
}

export function writeLocation(loc: OnboardingLocation): void {
  try {
    localStorage.setItem(ONBOARDING_LOCATION_KEY, JSON.stringify(loc));
  } catch {
    // ignore
  }
}
