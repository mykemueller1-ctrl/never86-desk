export type StoreBand = "1" | "2-3" | "4" | "5+";

export const STORE_BANDS: { value: StoreBand; label: string }[] = [
  { value: "1", label: "1 house" },
  { value: "2-3", label: "2–3 houses" },
  { value: "4", label: "4 houses" },
  { value: "5+", label: "5 or more" },
];

export function parseStoreBand(raw?: string | null): StoreBand {
  if (raw === "2-3" || raw === "4" || raw === "5+") return raw;
  return "1";
}

/** How many stores that band means for the gate. 2–3 counts as 3. */
export function storesCount(band: StoreBand): number {
  if (band === "5+") return 5;
  if (band === "4") return 4;
  if (band === "2-3") return 3;
  return 1;
}

/** ≤3 houses: Command is never the product. */
export function neverCommand(band: StoreBand): boolean {
  return storesCount(band) <= 3;
}

/** 5+ is the first time Command is even a maybe. */
export function commandMaybe(band: StoreBand): boolean {
  return storesCount(band) >= 5;
}

export function productStamp(band: StoreBand): string {
  if (neverCommand(band)) {
    return "Pulse · Action Shift · never Command";
  }
  if (band === "4") {
    return "Pulse · still the close · Command not this seat";
  }
  return "Pulse this week · Command is a maybe";
}

export function productLine(band: StoreBand): string {
  if (neverCommand(band)) {
    return "Under four houses, Command is never the product. Pulse is the Action Shift — weekly prime cost from what you already send.";
  }
  if (band === "4") {
    return "Four houses is still Pulse. Command is a maybe at five. This week is one house, one close, one number.";
  }
  return "Five houses is when Command might matter. Not today. This seat is still Pulse — one house, one week, one number.";
}

export function commandAskReply(band: StoreBand): string {
  if (neverCommand(band)) {
    return "Command is never this seat. You don’t own more than three houses. Pulse is the Action Shift — forward the POS email, photo the ticket, drop the Z-out. Weekly prime cost. That’s the product.";
  }
  if (band === "4") {
    return "Four houses is still Pulse. Command is a maybe at five. Don’t open a multi-store board on a Friday close. One house. One week. One number.";
  }
  return "Five houses — Command is a maybe later. This seat is still Pulse. We don’t open a 16-store board on a Friday close. One house. One week. One number.";
}
