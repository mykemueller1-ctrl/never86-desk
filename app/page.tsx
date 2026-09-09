import Link from "next/link";
import { listHouses, money } from "@/lib/houses";

export default function Home() {
  const houses = listHouses();
  const grill = houses.find((h) => h.id === "grill");

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex items-end justify-between border-b-2 border-[var(--ink)] pb-4">
        <div>
          <p className="stamp text-[11px]">Action Shift · Track A</p>
          <h1 className="mt-1 font-serif text-5xl italic leading-none">Never 86&apos;d</h1>
        </div>
        <p className="mono text-right text-xs text-[var(--mute)]">
          First ten are friends.
          <br />
          Ten minutes to win.
        </p>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--mute)]">
            Not software. A close.
          </p>
          <h2 className="mt-3 max-w-xl text-4xl leading-tight">
            What problem — labor, cash flow, or fragmented data sitting here guessing?
          </h2>
          <p className="mt-4 max-w-lg text-lg text-[var(--mute)]">
            No worries. We got you. We don&apos;t integrate day one. Forward the POS email,
            photo the schedule, keep the receipt. One seat&apos;s free.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/claim?house=grill&pain=labor"
              className="bg-[var(--ink)] px-5 py-3 text-sm text-[var(--paper)]"
            >
              Friday seat · Max&apos;s Grill
            </Link>
            <Link href="/claim" className="border border-[var(--ink)] px-5 py-3 text-sm">
              Claim a friend seat
            </Link>
            <Link href="/api/demo?house=grill" className="px-5 py-3 text-sm underline">
              Skip the talk. Show the leak.
            </Link>
          </div>
        </div>

        <aside className="ticket p-5">
          <p className="stamp text-[10px]">Already on the blotter</p>
          <h3 className="mt-2 text-2xl italic">{grill?.name}</h3>
          <p className="mt-1 text-sm text-[var(--mute)]">
            Kristen Courser packs · Toast 8/31
          </p>
          {grill?.toastDay ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Net</dt>
                <dd className="mono">{money(grill.toastDay.net)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Labor</dt>
                <dd className="mono text-[var(--stamp)]">
                  {grill.toastDay.laborPct.toFixed(2)}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>SPLH</dt>
                <dd className="mono">{money(grill.toastDay.splh)}</dd>
              </div>
            </dl>
          ) : null}
          <p className="mt-4 text-sm">
            Toast IQ shows the number. We name the move: cut the mid-shift before 4. Keep
            5–7. Burger is the engine.
          </p>
        </aside>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        {houses.map((house) => (
          <article key={house.id} className="ticket p-5">
            <p className="stamp text-[10px]">{house.fridayReady ? "Friday" : "Lab"}</p>
            <h3 className="mt-2 text-2xl">{house.name}</h3>
            <p className="text-sm text-[var(--mute)]">
              {house.city} · {house.statusLine}
            </p>
            <ul className="mt-3 text-sm">
              {house.seats.map((seat) => (
                <li key={seat.loginId}>
                  {seat.name} — {seat.label}
                  {seat.friday ? " · try Friday" : ""}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
