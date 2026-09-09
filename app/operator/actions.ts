"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getHouse } from "@/lib/houses";
import { SESSION_COOKIE, type Session } from "@/lib/session";

export async function openDemo(houseId: string) {
  const house = getHouse(houseId);
  if (!house) redirect("/");
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
  redirect("/operator");
}
