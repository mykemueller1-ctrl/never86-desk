import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getHouse } from "@/lib/houses";
import { SESSION_COOKIE, type Session } from "@/lib/session";

export async function GET(req: Request) {
  const houseId = new URL(req.url).searchParams.get("house") || "grill";
  const house = getHouse(houseId);
  if (!house) return NextResponse.json({ error: "No house" }, { status: 404 });
  const seat = house.seats.find((s) => s.role === "owner") ?? house.seats[0];
  const session: Session = {
    houseId: house.id,
    loginId: seat.loginId,
    name: seat.name,
    pain: "labor",
  };
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return NextResponse.redirect(new URL("/operator", req.url));
}
