"use client";

import type { ExtendedFilterState } from "@/types/search";
import {
  DIRECTORY_INSURANCE_PROVIDERS,
  DIRECTORY_LANGUAGES,
} from "@/types/search";

type Props = {
  value: ExtendedFilterState;
  onChange: (next: ExtendedFilterState) => void;
  /** Available insurance names from the current result set (optional enrich) */
  insuranceOptions?: string[];
  languageOptions?: string[];
};

/**
 * Yellow Pages extended filters — insurance, intro passes, languages, accessibility.
 */
export function DirectoryFilterBar({
  value,
  onChange,
  insuranceOptions,
  languageOptions,
}: Props) {
  const insurers = insuranceOptions?.length
    ? insuranceOptions
    : [...DIRECTORY_INSURANCE_PROVIDERS];
  const languages = languageOptions?.length
    ? languageOptions
    : [...DIRECTORY_LANGUAGES];

  const selectedLangs = value.languagesSpoken ?? [];

  const toggleLang = (lang: string) => {
    const set = new Set(selectedLangs);
    if (set.has(lang)) set.delete(lang);
    else set.add(lang);
    onChange({ ...value, languagesSpoken: [...set] });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-none">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Insurance
          </span>
          <select
            className="rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-900"
            value={value.insuranceProvider ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                insuranceProvider: e.target.value || undefined,
              })
            }
          >
            <option value="">All providers</option>
            {insurers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value.hasIntroPassesOnly)}
          onClick={() =>
            onChange({
              ...value,
              hasIntroPassesOnly: !value.hasIntroPassesOnly,
            })
          }
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
            value.hasIntroPassesOnly
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          New patient rates
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={value.hasWheelchairAccess === true}
          onClick={() =>
            onChange({
              ...value,
              hasWheelchairAccess:
                value.hasWheelchairAccess === true ? undefined : true,
            })
          }
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
            value.hasWheelchairAccess === true
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          ♿ Wheelchair access
        </button>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Languages
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {languages.map((lang) => {
            const on = selectedLangs.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLang(lang)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  on
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
