import Link from "next/link";
import { redirect } from "next/navigation";
import { SocketPane } from "@/components/SocketPane";
import { WinClock } from "@/components/WinClock";
import { money, pct } from "@/lib/houses";
import { loadDesk } from "@/lib/session";
import { groundedReply } from "@/lib/socket";
import { WAVES, type Pain } from "@/lib/suck-in";
import { openDemo } from "./actions";

export default async function OperatorPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const q = await searchParams;
  if (q.demo) {
    await openDemo(q.demo);
  }

  const desk = await loadDesk();
  if (!desk) redirect("/claim?house=grill&pain=labor");

  const { session, house, seat } = desk;
  const pain = session.pain as Pain;
  const win = house.findings.find((f) => f.severity === "now") ?? house.findings[0];
  const opener = groundedReply(house, "start", pain);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-[var(--ink)] pb-3">
        <div>
          <p className="stamp text-[10px]">
            {house.fridayReady ? "Friday seat" : "Lab seat"} · {seat.label}
          </p>
          <h1 className="text-3xl italic">{house.name}</h1>
          <p className="text-sm text-[var(--mute)]">
            {session.name} · {house.city} · houses never mix
          </p>
        </div>
        <div className="text-right">
          <WinClock />
          <Link href="/" className="text-xs underline">
            Back to the paper
          </Link>
        </div>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="ticket p-5">
          <p className="stamp text-[10px]">The 10-minute win</p>
          <h2 className="mt-2 text-3xl leading-tight">{win.title}</h2>
          <p className="mt-2 font-mono text-2xl text-[var(--stamp)]">{win.dollars}</p>
          <p className="mt-3 text-lg">{win.move}</p>
          <p className="mt-4 text-sm text-[var(--mute)]">Receipt: {win.receipt}</p>
          {house.toastDay ? (
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <Stat k="Net" v={money(house.toastDay.net)} />
              <Stat k="Labor" v={pct(house.toastDay.laborPct)} hot />
              <Stat k="SPLH" v={money(house.toastDay.splh)} />
              <Stat k="Guests" v={String(house.toastDay.guests)} />
            </dl>
          ) : null}
        </article>
        <SocketPane houseId={house.id} pain={pain} opener={opener} />
      </section>

      {house.toastDay && house.toastWeek ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="ticket p-4">
            <p className="stamp text-[10px]">Toast IQ · then more</p>
            <h3 className="text-xl">Day {house.toastDay.date}</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Discounts {money(house.toastDay.discounts)}</li>
              <li>
                Voids {money(house.toastDay.voids)} · {house.toastDay.voidOrders} tickets
              </li>
              <li>Tips {money(house.toastDay.tips)}</li>
              <li>Avg / guest {money(house.toastDay.avgGuest)}</li>
            </ul>
            <p className="mt-3 text-xs text-[var(--mute)]">{house.toastDay.source}</p>
          </article>
          <article className="ticket p-4">
            <p className="stamp text-[10px]">Week mix · do not blend windows</p>
            <h3 className="text-xl">{house.toastWeek.range}</h3>
            <p className="mt-1 text-sm">
              {money(house.toastWeek.net)} · {house.toastWeek.skuCount} SKUs
            </p>
            <ul className="mt-2 text-sm">
              {house.toastWeek.mix.slice(0, 6).map((row) => (
                <li key={`${row.sku}-${row.menu}`} className="flex justify-between gap-2">
                  <span>
                    {row.sku}
                    <span className="text-[var(--mute)]"> {row.menu}</span>
                  </span>
                  <span className="mono">{money(row.net)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[var(--mute)]">{house.toastWeek.note}</p>
          </article>
          <article className="ticket p-4">
            <p className="stamp text-[10px]">Hours · 8/31</p>
            <ul className="mt-2 space-y-1 text-sm">
              {(house.hours ?? []).map((h) => (
                <li key={h.hour} className="flex items-center gap-2">
                  <span className="mono w-10">{h.hour}:00</span>
                  <span
                    className="h-2 bg-[var(--ink)]"
                    style={{ width: `${Math.max(8, (h.net / 1303) * 100)}%` }}
                  />
                  <span className="mono text-xs">{money(h.net)}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      ) : (
        <section className="ticket mt-6 p-4 text-sm">
          Paper house. Wins are invoice + labor-card drift until a POS email lands.
        </section>
      )}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="ticket p-4">
          <p className="stamp text-[10px]">Missing chips · Waves 0–4</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
            {WAVES.map((w) => (
              <li key={w.id}>
                <strong>{w.missing}.</strong> {w.ask}
              </li>
            ))}
          </ol>
        </article>
        <article className="ticket p-4">
          <p className="stamp text-[10px]">Evidence already in · Kristen / lab</p>
          <ul className="mt-2 space-y-2 text-sm">
            {house.evidence.map((e) => (
              <li key={e.name}>
                <span className="italic">{e.name}</span>
                <span className="block text-[var(--mute)]">
                  {e.kind} · {e.when} · {e.note}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {house.findings.map((f) => (
          <article key={f.id} className="ticket p-4">
            <p className="stamp text-[10px]">{f.kind}</p>
            <h3 className="mt-1 text-lg">{f.title}</h3>
            <p className="mono text-sm text-[var(--stamp)]">{f.dollars}</p>
            <p className="mt-2 text-sm">{f.move}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function Stat({ k, v, hot }: { k: string; v: string; hot?: boolean }) {
  return (
    <div>
      <dt className="text-[var(--mute)]">{k}</dt>
      <dd className={`mono text-lg ${hot ? "text-[var(--stamp)]" : ""}`}>{v}</dd>
    </div>
  );
}
