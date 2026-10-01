"use client";

import { useEffect, useState } from "react";

export default function VisitCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const key = "paarth-visit-count";
    const stored = localStorage.getItem(key);
    const current = stored ? parseInt(stored, 10) : 0;
    const next = current + 1;
    localStorage.setItem(key, String(next));
    setCount(next);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-2 text-text-dim">
      <img
        src="/assets/view.png"
        alt=""
        width={14}
        height={14}
        className="block"
        draggable={false}
        style={{ filter: "brightness(0) invert(1)", opacity: 0.6 }}
      />
      <span className="font-mono text-[10px] tracking-wider">
        {count.toLocaleString()}
      </span>
    </div>
  );
}
