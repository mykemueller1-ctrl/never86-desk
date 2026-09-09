"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ClaimForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [who, setWho] = useState(params.get("who") ?? "");
  const [house, setHouse] = useState(params.get("house") ?? "grill");
  const [pain, setPain] = useState(params.get("pain") ?? "labor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, who: who || name, house, pain }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Couldn’t seat you.");
      return;
    }
    router.push("/operator");
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="stamp text-[11px]">Seat 1 is free · no password</p>
      <h1 className="mt-3 text-4xl italic">Sit down. Ten minutes.</h1>
      <p className="mt-3 text-[var(--mute)]">
        Friends first. Tell us the pain. We’ll open the house we already loaded —
        Max’s Grill is ready Friday.
      </p>
      <form onSubmit={onSubmit} className="ticket mt-8 space-y-4 p-5">
        <label className="block text-sm">
          What do they call you
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2"
            placeholder="Max"
          />
        </label>
        <label className="block text-sm">
          Email or login if you have one
          <input
            value={who}
            onChange={(e) => setWho(e.target.value)}
            className="mt-1 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2"
            placeholder="max · kristen · myke · kenzy · tom"
          />
        </label>
        <label className="block text-sm">
          House
          <select
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            className="mt-1 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2"
          >
            <option value="grill">The New American Grill · Friday</option>
            <option value="community-tap">Community Tap & Pizza · lab</option>
          </select>
        </label>
        <fieldset className="text-sm">
          <legend className="mb-2">What problem</legend>
          {[
            ["labor", "Labor"],
            ["cash", "Cash flow"],
            ["fragmented", "Fragmented data / guessing"],
          ].map(([value, label]) => (
            <label key={value} className="mr-4">
              <input
                type="radio"
                name="pain"
                value={value}
                checked={pain === value}
                onChange={() => setPain(value)}
              />{" "}
              {label}
            </label>
          ))}
        </fieldset>
        {error ? <p className="text-sm text-[var(--stamp)]">{error}</p> : null}
        <button
          disabled={busy}
          className="w-full bg-[var(--ink)] py-3 text-[var(--paper)]"
        >
          {busy ? "Seating…" : "Open the desk"}
        </button>
      </form>
    </main>
  );
}

export default function ClaimPage() {
  return (
    <Suspense>
      <ClaimForm />
    </Suspense>
  );
}
