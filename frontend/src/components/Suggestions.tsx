import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface Suggestion { title: string; reason: string; }

export const Suggestions: React.FC<{ query?: string; onPick: (title: string) => void }> = ({ query = "", onPick }) => {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosClient.get("/todos/suggestions", { params: { q: query } })
      .then((r) => {
        if (!active) return;
        setItems(r.data.suggestions || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    return () => { active = false; }
  }, [query]);

  if (loading) return <div className="text-sm text-slate-400">Loading suggestions…</div>;
  if (!items.length) return null;

  return (
    <div className="mt-2 grid gap-2">
      {items.map((s, i) => (
        <div key={i} className="flex items-center justify-between bg-[#071427]/60 border border-white/4 p-2 rounded-md">
          <div>
            <div className="text-sm text-slate-100">{s.title} <span className="text-xs text-slate-400">• {s.reason}</span></div>
          </div>
          <div>
            <button onClick={() => onPick(s.title)} className="px-2 py-1 rounded bg-slate-200/6 text-slate-100">Use</button>
          </div>
        </div>
      ))}
    </div>
  );
};
