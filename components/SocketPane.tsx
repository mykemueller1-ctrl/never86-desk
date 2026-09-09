"use client";

import { useEffect, useRef, useState } from "react";
import { WAVES } from "@/lib/suck-in";

type Msg = { role: "you" | "desk"; text: string };

export function SocketPane({
  houseId,
  pain,
  opener,
}: {
  houseId: string;
  pain: string;
  opener: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "desk", text: opener }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "you", text: q }, { role: "desk", text: "" }]);
    setBusy(true);
    const res = await fetch("/api/socket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: q, houseId, pain }),
    });
    if (!res.body) {
      setBusy(false);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      const copy = acc;
      setMsgs((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "desk", text: copy };
        return next;
      });
    }
    setBusy(false);
  }

  return (
    <section className="ticket flex min-h-[28rem] flex-col">
      <header className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-3">
        <div>
          <p className="stamp text-[10px]">LLM socket</p>
          <h2 className="text-xl italic">Talk like an owner</h2>
        </div>
        <p className="mono text-[10px] text-[var(--mute)]">Grounded · this house only</p>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
        {msgs.map((m, i) => (
          <p key={`${m.role}-${i}`} className={m.role === "you" ? "text-right" : ""}>
            <span className="stamp mr-2 text-[9px]">{m.role}</span>
            <span className="whitespace-pre-wrap">{m.text}</span>
          </p>
        ))}
        <div ref={end} />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[var(--rule)] px-4 py-2">
        {["labor", "6pm", "burger", "voids", "trucks"].map((chip) => (
          <button
            key={chip}
            type="button"
            className="border border-[var(--rule)] px-2 py-1 text-xs"
            onClick={() => send(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
      <form
        className="flex border-t border-[var(--rule)]"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={WAVES[1].ask}
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
        />
        <button className="bg-[var(--ink)] px-4 text-sm text-[var(--paper)]" disabled={busy}>
          Send
        </button>
      </form>
    </section>
  );
}
