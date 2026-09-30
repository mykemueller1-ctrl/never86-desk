"use client";

import { useEffect, useMemo, useState } from "react";

type Evidence = { name: string; kind: string; when: string; note: string };
type Bucket = "Sales" | "Labor & Schedules" | "Invoices & Vendors" | "Menu & Recipes" | "Order Guides" | "Operations & SOPs" | "People & Managers" | "Delivery & 3P" | "Needs a look";

type IntakeFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  bucket: Bucket;
  status: "ready" | "needs-look";
  addedAt: number;
};

const BUCKETS: Bucket[] = [
  "Sales",
  "Labor & Schedules",
  "Invoices & Vendors",
  "Menu & Recipes",
  "Order Guides",
  "Operations & SOPs",
  "People & Managers",
  "Delivery & 3P",
  "Needs a look",
];

function classify(name: string, type: string): Bucket {
  const q = `${name} ${type}`.toLowerCase();
  if (/doordash|uber|grubhub|delivery|third.?party|3p/.test(q)) return "Delivery & 3P";
  if (/schedule|labor|payroll|clock|time.?card|punch|shift/.test(q)) return "Labor & Schedules";
  if (/invoice|vendor|sysco|performance|pfg|food.?service|receipt|statement/.test(q)) return "Invoices & Vendors";
  if (/sales|close|z.?report|pos|daily.?report|revenue/.test(q)) return "Sales";
  if (/menu|recipe|plate|costing/.test(q)) return "Menu & Recipes";
  if (/order.?guide|par|purchasing|order.?sheet/.test(q)) return "Order Guides";
  if (/sop|checklist|opening|closing|receiving|training/.test(q)) return "Operations & SOPs";
  if (/employee|manager|staff|people|roster/.test(q)) return "People & Managers";
  return "Needs a look";
}

function evidenceBucket(e: Evidence): Bucket {
  return classify(`${e.name} ${e.kind} ${e.note}`, "");
}

export function ProjectIntake({
  houseId,
  evidence,
}: {
  houseId: string;
  evidence: Evidence[];
}) {
  const key = `n86:intake:${houseId}`;
  const [files, setFiles] = useState<IntakeFile[]>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setFiles(JSON.parse(raw));
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(files));
    } catch {}
  }, [files, key]);

  function add(list: FileList | File[]) {
    const incoming = Array.from(list);
    setFiles((current) => {
      const seen = new Set(current.map((f) => `${f.name}:${f.size}`));
      const next = [...current];
      for (const file of incoming) {
        const sig = `${file.name}:${file.size}`;
        if (seen.has(sig)) continue;
        seen.add(sig);
        const bucket = classify(file.name, file.type);
        next.unshift({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type || "unknown",
          bucket,
          status: bucket === "Needs a look" ? "needs-look" : "ready",
          addedAt: Date.now(),
        });
      }
      return next;
    });
  }

  const counts = useMemo(() => {
    const map = new Map<Bucket, number>();
    for (const b of BUCKETS) map.set(b, 0);
    for (const e of evidence) map.set(evidenceBucket(e), (map.get(evidenceBucket(e)) || 0) + 1);
    for (const f of files) map.set(f.bucket, (map.get(f.bucket) || 0) + 1);
    return map;
  }, [evidence, files]);

  const missing = BUCKETS.filter((b) => b !== "Needs a look" && (counts.get(b) || 0) === 0);

  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="ticket p-4">
        <p className="stamp text-[10px]">Restaurant project</p>
        <h2 className="mt-1 text-xl italic">What&apos;s in / what&apos;s missing</h2>
        <div className="mt-4 space-y-2 text-sm">
          {BUCKETS.filter((b) => b !== "Needs a look").map((bucket) => {
            const n = counts.get(bucket) || 0;
            return (
              <div key={bucket} className="flex items-center justify-between gap-2 border-b border-[var(--rule)] pb-2">
                <span>{bucket}</span>
                <span className={n ? "text-[var(--good)]" : "text-[var(--stamp)]"}>
                  {n ? `${n} in` : "missing"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded border border-[var(--rule)] p-3 text-xs">
          <strong>Needs a look:</strong> {counts.get("Needs a look") || 0}
        </div>
      </aside>

      <div className="space-y-4">
        <label
          className={`ticket block cursor-pointer p-6 text-center ${dragging ? "outline outline-2 outline-[var(--stamp)]" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(e.dataTransfer.files);
          }}
        >
          <p className="stamp text-[10px]">One drop. We sort it.</p>
          <h2 className="mt-2 text-2xl">Add your restaurant stuff</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--mute)]">
            Sales, schedules, invoices, menus, photos, PDFs, spreadsheets — throw them in together. You do not have to file them first.
          </p>
          <input
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.csv,.txt,.xlsx,.xls,.doc,.docx,image/*"
            onChange={(e) => {
              if (e.target.files) add(e.target.files);
              e.currentTarget.value = "";
            }}
          />
          <span className="mt-4 inline-block bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]">
            Choose files
          </span>
        </label>

        <div className="ticket p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="stamp text-[10px]">Already in this restaurant brain</p>
              <h3 className="text-xl">Use what we have. Ask for only what&apos;s actually missing.</h3>
            </div>
            <p className="mono text-xs">{evidence.length + files.length} source items</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {evidence.map((e) => (
              <li key={e.name} className="rounded border border-[var(--rule)] p-3">
                <strong>{e.name}</strong>
                <span className="ml-2 text-[var(--good)]">received</span>
                <span className="block text-[var(--mute)]">{evidenceBucket(e)} · {e.when} · {e.note}</span>
              </li>
            ))}
            {files.slice(0, 12).map((f) => (
              <li key={f.id} className="rounded border border-[var(--rule)] p-3">
                <strong>{f.name}</strong>
                <span className={`ml-2 ${f.status === "ready" ? "text-[var(--good)]" : "text-[var(--stamp)]"}`}>
                  {f.status === "ready" ? "sorted" : "needs a look"}
                </span>
                <span className="block text-[var(--mute)]">{f.bucket} · {Math.max(1, Math.round(f.size / 1024))} KB</span>
              </li>
            ))}
          </ul>
          {missing.length ? (
            <p className="mt-4 text-sm"><strong>Still missing:</strong> {missing.join(", ")}.</p>
          ) : (
            <p className="mt-4 text-sm text-[var(--good)]">Core folders have coverage. Start asking questions.</p>
          )}
        </div>
      </div>
    </section>
  );
}
