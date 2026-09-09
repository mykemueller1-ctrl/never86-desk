import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getHouse } from "@/lib/houses";
import { resolveLogin, SESSION_COOKIE, type Session } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string;
    who?: string;
    house?: string;
    pain?: string;
  };
  const who = (body.who || body.name || "").trim();
  if (!who) {
    return NextResponse.json({ error: "Need a name." }, { status: 400 });
  }

  const hit = resolveLogin(who, body.house);
  const house = hit?.house ?? getHouse(body.house || "grill");
  if (!house) {
    return NextResponse.json({ error: "Unknown house." }, { status: 400 });
  }
  const seat =
    hit?.seat ??
    house.seats.find((s) => s.role === "owner") ??
    house.seats[0];

  const session: Session = {
    houseId: house.id,
    loginId: seat.loginId,
    name: body.name?.trim() || seat.name,
    pain: body.pain || "",
  };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return NextResponse.json({ ok: true, session });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
