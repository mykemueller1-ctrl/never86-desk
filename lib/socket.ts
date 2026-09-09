import { getHouse, money, pct } from "./houses";
import { openLine, WAVES, type Pain } from "./suck-in";
import type { House } from "./types";

export function systemGrounding(house: House, pain: Pain): string {
  const win = house.findings.find((f) => f.severity === "now") ?? house.findings[0];
  return [
    `House: ${house.name}. Never mix another restaurant into this answer.`,
    `Voice: short. Iowa plain. Pain first. One ask. Receipt attached.`,
    `Never invent food cost without a count. Invoice ≠ COGS. Punch ≠ schedule.`,
    `No portal passwords. No EIN. No bank routing.`,
    `Track A only. Do not mention Taco Bamba, Rik, or Command.`,
    win
      ? `First win: ${win.title}. ${win.dollars}. Move: ${win.move} Receipt: ${win.receipt}`
      : "",
    `If they wander, pull them back to the missing chip, then one Wave 0–4 ask.`,
    `Pain they sat with: ${pain || "unknown"}. ${openLine(pain)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function score(text: string, keys: string[]): number {
  const q = text.toLowerCase();
  return keys.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0);
}

export function groundedReply(house: House, text: string, pain: Pain): string {
  const q = text.trim();
  const low = q.toLowerCase();

  if (!q || score(low, ["hey", "hello", "hi", "start", "help", "what is this"]) > 0) {
    const win = house.findings.find((f) => f.severity === "now") ?? house.findings[0];
    return [
      openLine(pain),
      "",
      win
        ? `“Here’s one move from the book we already have — ${win.title}. ${win.dollars}.`
        : "Drop last night’s close and I’ll label the first leak.",
      win ? win.move : "",
      win ? `Receipt: ${win.receipt}` : "",
      "",
      WAVES[1].ask,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const ranked = [...house.findings]
    .map((f) => ({
      f,
      n: score(low, [
        f.kind,
        ...f.title.toLowerCase().split(/\s+/),
        f.id.replace(/^[a-z]+-/, ""),
      ]),
    }))
    .sort((a, b) => b.n - a.n);

  if (
    score(low, ["labor", "payroll", "schedule", "punch", "staff", "cook", "splh", "hour"]) >
    0
  ) {
    const f = house.findings.find((x) => x.kind === "payroll") ?? ranked[0]?.f;
    const day = house.toastDay;
    const extra = day
      ? `Toast day ${day.date}: net ${money(day.net)}, labor ${money(day.laborCost)} = ${pct(day.laborPct)}, SPLH ${money(day.splh)}. A 30% floor would have been about ${money(day.net * 0.3)} — that day ran ~${money(day.laborCost - day.net * 0.3)} heavy.`
      : "";
    return [
      extra,
      f ? `${f.title}. ${f.move}` : "",
      f ? `Receipt: ${f.receipt}` : "",
      "",
      "Missing still: picture of the schedules. Punch ≠ schedule until that lands.",
      WAVES[2].ask,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (score(low, ["burger", "menu", "sku", "price", "plate", "mix", "sell"]) > 0) {
    const mix = house.toastWeek?.mix.slice(0, 5) ?? [];
    const lines = mix.map((m) => `${m.sku} · ${m.menu} · qty ${m.qty} · ${money(m.net)}`);
    return [
      house.toastWeek
        ? `Week ${house.toastWeek.range}: ${money(house.toastWeek.net)} across ${house.toastWeek.skuCount} SKUs. ${house.toastWeek.note}`
        : "No mix file on this house yet.",
      ...lines,
      "",
      house.findings.find((f) => f.id.includes("burger"))?.move ??
        WAVES[5].ask,
      house.findings.find((f) => f.id.includes("burger"))
        ? `Receipt: ${house.findings.find((f) => f.id.includes("burger"))?.receipt}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (score(low, ["void", "comp", "discount", "promo"]) > 0) {
    const f = house.findings.find((x) => x.id.includes("discount") || x.id.includes("void"));
    const day = house.toastDay;
    return [
      day
        ? `Discounts ${money(day.discounts)}. Voids ${money(day.voids)} on ${day.voidOrders} tickets. Voids are not the leak.`
        : "",
      f ? f.move : "",
      f ? `Receipt: ${f.receipt}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (score(low, ["truck", "sysco", "performance", "vendor", "invoice", "oil"]) > 0) {
    const f = house.findings.find((x) => x.kind === "prices");
    return [
      f ? `${f.title}. ${f.dollars}. ${f.move}` : WAVES[4].ask,
      f ? `Receipt: ${f.receipt}` : "",
      "",
      WAVES[4].ask,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (score(low, ["6pm", "dinner", "lunch", "hour", "peak", "guest"]) > 0) {
    const f = house.findings.find((x) => x.id.includes("peak"));
    const hours = (house.hours ?? [])
      .slice()
      .sort((a, b) => b.net - a.net)
      .slice(0, 3)
      .map((h) => `${h.hour}:00 · ${money(h.net)} · ${h.orders} tickets`);
    return [
      f ? `${f.title}. ${f.move}` : "Peak hours tell you who to send home.",
      ...hours,
      f ? `Receipt: ${f.receipt}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const best = ranked[0]?.f;
  if (best && ranked[0].n > 0) {
    return [
      `${best.title}. ${best.dollars}.`,
      best.move,
      `Receipt: ${best.receipt}`,
      "",
      "One more thing I still don’t have on this house:",
      WAVES[Math.min(3, best.kind === "payroll" ? 2 : 4)].ask,
    ].join("\n");
  }

  return [
    "I only answer from this house’s book. Say labor, burger, 6pm, voids, or trucks.",
    getHouse(house.id)?.findings[0]
      ? `Or stay on the win: ${house.findings[0].title}.`
      : "",
    WAVES[1].ask,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function streamText(text: string): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const word of text.split(/(\s+)/)) {
        controller.enqueue(encoder.encode(word));
        await new Promise((r) => setTimeout(r, word.trim() ? 12 : 4));
      }
      controller.close();
    },
  });
}
