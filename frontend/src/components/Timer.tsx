import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../api/axiosClient";

interface TimerProps {
  todoId: string;
  minutes?: number;
}

const DURATION_OPTIONS = [15, 25, 30, 45, 60];

export const Timer: React.FC<TimerProps> = ({
  todoId,
  minutes = 25,
}) => {
  const initialMinutes = DURATION_OPTIONS.includes(minutes)
    ? minutes
    : 25;

  const [selectedMinutes, setSelectedMinutes] =
    useState(initialMinutes);

  const [seconds, setSeconds] = useState(
    initialMinutes * 60
  );

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const alarmPlayedRef = useRef(false);

  /* =========================================
     Alarm Sound
  ========================================= */

  const playAlarm = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext = new AudioContextClass();

      const playBeep = (
        startTime: number,
        frequency: number
      ) => {
        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(
          0.0001,
          startTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.25,
          startTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + 0.45
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      };

      const now = audioContext.currentTime;

      playBeep(now, 880);
      playBeep(now + 0.6, 880);
      playBeep(now + 1.2, 1100);

      window.setTimeout(() => {
        audioContext.close().catch(() => {});
      }, 2200);
    } catch (error) {
      console.error("Unable to play timer alarm:", error);
    }
  };

  /* =========================================
     Browser Notification
  ========================================= */

  const showNotification = () => {
    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("⏰ Time's Up!", {
        body: "Your focus session is complete.",
      });
    }
  };

  /* =========================================
     Timer
  ========================================= */

  useEffect(() => {
    if (!running) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setRunning(false);
          setFinished(true);

          if (!alarmPlayedRef.current) {
            alarmPlayedRef.current = true;

            playAlarm();
            showNotification();

            axiosClient
              .post(`/todos/${todoId}/log`, {
                event: "focus_complete",
                duration: selectedMinutes,
              })
              .catch((error) => {
                console.error(
                  "Failed to log focus session:",
                  error
                );
              });
          }

          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [running, todoId, selectedMinutes]);

  /* =========================================
     Request Notification Permission
  ========================================= */

  const requestNotificationPermission = async () => {
    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        await Notification.requestPermission();
      } catch {
        // Notification permission is optional.
      }
    }
  };

  /* =========================================
     Start Timer
  ========================================= */

  const handleStart = async () => {
    await requestNotificationPermission();

    setFinished(false);
    alarmPlayedRef.current = false;
    setRunning(true);
  };

  /* =========================================
     Pause Timer
  ========================================= */

  const handlePause = () => {
    setRunning(false);
  };

  /* =========================================
     Reset Timer
  ========================================= */

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    alarmPlayedRef.current = false;

    setSeconds(selectedMinutes * 60);
  };

  /* =========================================
     Change Duration
  ========================================= */

  const handleDurationChange = (
    newMinutes: number
  ) => {
    if (running) {
      return;
    }

    setSelectedMinutes(newMinutes);
    setSeconds(newMinutes * 60);
    setFinished(false);
    alarmPlayedRef.current = false;
  };

  /* =========================================
     Format Time
  ========================================= */

  const minutesRemaining = Math.floor(
    seconds / 60
  )
    .toString()
    .padStart(2, "0");

  const secondsRemaining = (seconds % 60)
    .toString()
    .padStart(2, "0");

  /* =========================================
     Progress
  ========================================= */

  const totalSeconds = selectedMinutes * 60;

  const progress =
    totalSeconds > 0
      ? ((totalSeconds - seconds) /
          totalSeconds) *
        100
      : 0;

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.025] p-3">
      {/* Timer Header */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Time */}

        <div className="flex items-center gap-2">
          <span className="text-sm">⏱️</span>

          <span
            className={`
              font-mono
              text-lg
              font-semibold
              tracking-wider
              ${
                finished
                  ? "text-amber-300"
                  : running
                  ? "text-purple-300"
                  : "text-slate-200"
              }
            `}
          >
            {minutesRemaining}:{secondsRemaining}
          </span>
        </div>

        {/* Status */}

        {running && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300">
            Focus mode
          </span>
        )}

        {finished && (
          <span className="animate-pulse text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Time's up!
          </span>
        )}
      </div>

      {/* Progress Bar */}

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-purple-400
            to-pink-400
            transition-all
            duration-1000
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Duration */}

      {!running && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Duration
          </p>

          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map((option) => {
              const selected =
                selectedMinutes === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    handleDurationChange(option)
                  }
                  className={`
                    rounded-lg
                    border
                    px-2.5
                    py-1.5
                    text-xs
                    font-medium
                    transition-all
                    ${
                      selected
                        ? "border-purple-400/40 bg-purple-400/20 text-purple-200"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }
                  `}
                >
                  {option}m
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}

      <div className="mt-4 flex flex-wrap gap-2">
        {!running ? (
          <button
            type="button"
            onClick={handleStart}
            className="
              rounded-lg
              bg-gradient-to-r
              from-purple-400
              to-pink-300
              px-4
              py-2
              text-xs
              font-bold
              text-black
              transition
              hover:scale-[1.02]
            "
          >
            ▶ Start
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="
              rounded-lg
              border
              border-amber-400/20
              bg-amber-400/10
              px-4
              py-2
              text-xs
              font-semibold
              text-amber-300
              transition
              hover:bg-amber-400/15
            "
          >
            ⏸ Pause
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="
            rounded-lg
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            text-xs
            font-medium
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          ↻ Reset
        </button>
      </div>

      {/* Finished Message */}

      {finished && (
        <div
          className="
            mt-4
            rounded-lg
            border
            border-amber-400/20
            bg-amber-400/5
            px-3
            py-2
            text-xs
            text-amber-200
          "
        >
          🔔 Your focus session is complete.
        </div>
      )}
    </div>
  );
};