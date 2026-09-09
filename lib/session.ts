import { cookies } from "next/headers";
import { findSeat, getHouse } from "./houses";
import type { House, Seat } from "./types";

export const SESSION_COOKIE = "n86_seat";

export type Session = {
  houseId: string;
  loginId: string;
  name: string;
  pain: string;
};

export async function readSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.houseId || !parsed.loginId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loadDesk(): Promise<{
  session: Session;
  house: House;
  seat: Seat;
} | null> {
  const session = await readSession();
  if (!session) return null;
  const house = getHouse(session.houseId);
  const seat = house?.seats.find((s) => s.loginId === session.loginId);
  if (!house || !seat) return null;
  return { session, house, seat };
}

export function resolveLogin(query: string, houseHint?: string) {
  const hit = findSeat(query);
  if (hit) return hit;
  if (houseHint) {
    const house = getHouse(houseHint);
    if (house) {
      const owner = house.seats.find((s) => s.role === "owner") ?? house.seats[0];
      return { house, seat: owner };
    }
  }
  return null;
}
