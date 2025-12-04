import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export const Timer: React.FC<{ todoId: string; minutes?: number }> = ({ todoId, minutes = 25 }) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          // finished
          axiosClient.post(`/todos/${todoId}/log`, { event: "focus_complete", duration: minutes }).catch(()=>{});
          setRunning(false);
          return minutes * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, todoId, minutes]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-slate-200">{mm}:{ss}</div>
      {!running ? (
        <button onClick={() => setRunning(true)} className="px-2 py-1 rounded bg-sky-400/20 text-sky-300">Start</button>
      ) : (
        <button onClick={() => setRunning(false)} className="px-2 py-1 rounded bg-rose-400/10 text-rose-300">Stop</button>
      )}
    </div>
  );
};
