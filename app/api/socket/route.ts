import { getHouse } from "@/lib/houses";
import { readSession } from "@/lib/session";
import { groundedReply, streamText } from "@/lib/socket";
import type { Pain } from "@/lib/suck-in";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    text?: string;
    houseId?: string;
    pain?: Pain;
  };
  const session = await readSession();
  const house = getHouse(body.houseId || session?.houseId || "grill");
  if (!house) {
    return new Response("No house.", { status: 400 });
  }
  const pain = (body.pain || session?.pain || "") as Pain;
  const reply = groundedReply(house, body.text || "", pain);
  return new Response(await streamText(reply), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
