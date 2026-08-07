/** Realistic business-hour appointment slots: 09:00, 11:30, 14:00, 16:30. */
const BUSINESS_SLOTS = [
  { hour: 9, minute: 0 },
  { hour: 11, minute: 30 },
  { hour: 14, minute: 0 },
  { hour: 16, minute: 30 },
] as const;

/**
 * Next bookable slots. Pass `from` for deterministic SSR/tests.
 * When omitted, uses wall clock (client-only callers preferred).
 */
export function nextAppointmentSlots(count = 4, from?: Date): string[] {
  const slots: string[] = [];
  const now = from ? new Date(from) : new Date();
  // Stabilize to minute precision to reduce hydration drift when used on both sides
  now.setSeconds(0, 0);
  let dayOffset = 0;

  while (slots.length < count && dayOffset < 14) {
    for (const { hour, minute } of BUSINESS_SLOTS) {
      if (slots.length >= count) break;
      const d = new Date(now);
      d.setDate(now.getDate() + dayOffset);
      d.setHours(hour, minute, 0, 0);
      const weekday = d.getDay();
      if (weekday === 0 || weekday === 6) continue;
      if (d.getTime() <= now.getTime() + 30 * 60 * 1000) continue;
      slots.push(d.toISOString());
    }
    dayOffset += 1;
  }

  return slots;
}

export function formatSlotLabel(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString(undefined, { weekday: "short" });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${weekday} ${time}`;
}
