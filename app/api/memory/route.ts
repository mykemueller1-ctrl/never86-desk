import { NextResponse } from "next/server";

type MemoryLine = {
  id: string;
  houseId: string;
  line: string;
  status: "proposed" | "approved" | "rejected";
};

const mem = globalThis as unknown as { n86mem?: MemoryLine[] };
if (!mem.n86mem) mem.n86mem = [];

export async function GET(req: Request) {
  const houseId = new URL(req.url).searchParams.get("houseId");
  return NextResponse.json({
    lines: mem.n86mem!.filter((l) => !houseId || l.houseId === houseId),
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<MemoryLine>;
  if (!body.houseId || !body.line) {
    return NextResponse.json({ error: "Need a line." }, { status: 400 });
  }
  const row: MemoryLine = {
    id: crypto.randomUUID(),
    houseId: body.houseId,
    line: body.line,
    status: "proposed",
  };
  mem.n86mem!.unshift(row);
  return NextResponse.json({ ok: true, line: row });
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as { id?: string; status?: MemoryLine["status"] };
  const row = mem.n86mem!.find((l) => l.id === body.id);
  if (!row) return NextResponse.json({ error: "Missing." }, { status: 404 });
  row.status = body.status || row.status;
  return NextResponse.json({ ok: true, line: row });
}
