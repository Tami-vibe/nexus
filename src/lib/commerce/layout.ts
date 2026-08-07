/** Adaptive catalog layout modes by offer count. */

export type CatalogLayoutMode = "spotlight" | "split" | "grid";

export function catalogLayoutMode(count: number): CatalogLayoutMode {
  if (count <= 1) return "spotlight";
  if (count === 2) return "split";
  return "grid";
}

export function catalogShellClass(mode: CatalogLayoutMode): string {
  if (mode === "spotlight") return "mt-10";
  if (mode === "split") return "mt-10 grid gap-6 md:grid-cols-2";
  // 3+: horizontal snap carousel on small screens, 3-col grid from lg up
  return "mt-10 flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0";
}

export function catalogItemClass(mode: CatalogLayoutMode): string {
  if (mode === "spotlight") return "w-full";
  if (mode === "split") return "min-w-0";
  return "min-w-[280px] max-w-[340px] shrink-0 snap-start lg:min-w-0 lg:max-w-none";
}
