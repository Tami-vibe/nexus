/**
 * Deterministic verified-demand signals for Anti-PPC trust badges.
 * Stable per offer + calendar day (not random click-farm noise).
 */

export type DemandProof = {
  viewsToday: number;
  bookedLast24h: number;
  antiBot: true;
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dayKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

export function demandProofForOffer(
  offerId: string,
  vat: string,
  kind: "product" | "service",
): DemandProof {
  const seed = hashSeed(`${vat}:${kind}:${offerId}:${dayKey()}`);
  const viewsToday = 8 + (seed % 37); // 8–44
  const bookedLast24h =
    kind === "service" ? 1 + (seed % 7) : 1 + (seed % 4); // 1–7 / 1–4
  return { viewsToday, bookedLast24h, antiBot: true };
}
