/** Extended Yellow Pages directory filters. */

export interface ExtendedFilterState {
  insuranceProvider?: string;
  languagesSpoken?: string[];
  hasWheelchairAccess?: boolean;
  hasIntroPassesOnly?: boolean;
}

export const DIRECTORY_INSURANCE_PROVIDERS = [
  "Generali",
  "Allianz",
  "AXA",
  "Unipol",
  "Medicare",
  "Clalit",
  "Maccabi",
] as const;

export const DIRECTORY_LANGUAGES = [
  "English",
  "Hebrew",
  "Italiano",
  "Français",
  "Arabic",
] as const;

export const EMPTY_FILTER_STATE: ExtendedFilterState = {
  insuranceProvider: undefined,
  languagesSpoken: [],
  hasWheelchairAccess: undefined,
  hasIntroPassesOnly: undefined,
};
