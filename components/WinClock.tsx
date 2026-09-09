"use client";

import { useEffect, useState } from "react";

export function WinClock() {
  const [left, setLeft] = useState(10 * 60);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, "0");
  const hot = left <= 120;

  return (
    <p className={`mono text-sm ${hot ? "text-[var(--stamp)]" : ""}`}>
      {m}:{s} to win
    </p>
  );
}
