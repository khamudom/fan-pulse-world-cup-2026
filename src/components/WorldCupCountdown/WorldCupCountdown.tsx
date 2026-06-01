"use client";

import { useEffect, useState } from "react";
import { WORLD_CUP_2026 } from "@/config/tournament";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";
import styles from "./WorldCupCountdown.module.css";

type CountdownPhase = "countdown" | "live" | "complete";

function getCountdownPhase(now: Date): CountdownPhase {
  if (now >= WORLD_CUP_2026.end) return "complete";
  if (now >= WORLD_CUP_2026.kickoff) return "live";
  return "countdown";
}

const countdownUnits: { key: keyof CountdownParts; label: string }[] = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "mins" },
  { key: "seconds", label: "secs" },
];

export function WorldCupCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const phase = now ? getCountdownPhase(now) : "countdown";
  const countdown = now ? getCountdownParts(WORLD_CUP_2026.kickoff, now) : null;

  return (
    <div className={styles.wrap} aria-label="FIFA World Cup 2026 countdown">
      <p className={styles.eyebrow}>{WORLD_CUP_2026.dateRangeLabel}</p>

      {phase === "countdown" && countdown ? (
        <div
          className={styles.countdown}
          role="timer"
          aria-live="polite"
          aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds until kickoff`}
        >
          {countdownUnits.map(({ key, label }) => (
            <div key={key} className={styles.unit}>
              <span className={styles.value}>
                {String(countdown[key]).padStart(2, "0")}
              </span>
              <span className={styles.label}>{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.status}>
          {phase === "live" ? "Tournament underway" : "Tournament complete"}
        </p>
      )}
    </div>
  );
}
