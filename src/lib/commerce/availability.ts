/** Deterministic availability masks for slot filtering demos. */

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Returns true if an offer/practitioner is available for the given slot ISO. */
export function isAvailableAtSlot(entityId: string, slotIso: string | null): boolean {
  if (!slotIso) return true;
  const slotIndex = new Date(slotIso).getHours() + new Date(slotIso).getMinutes();
  const mask = hash(`${entityId}:${slotIndex % 7}`);
  // ~75% available so filtering is visible but not empty
  return mask % 4 !== 0;
}
