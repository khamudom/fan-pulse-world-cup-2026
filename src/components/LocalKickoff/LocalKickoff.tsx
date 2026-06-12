"use client";

import { useSyncExternalStore } from "react";
import { formatKickoffInUserTz } from "@/lib/timezone";

function subscribeNoop() {
  return () => {};
}

function getClientHydrated() {
  return true;
}

function getServerHydrated() {
  return false;
}

function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, getClientHydrated, getServerHydrated);
}

export interface LocalKickoffProps {
  kickoffUtc?: string;
  fallbackDate: string;
  fallbackTime?: string;
  mode?: "dateTime" | "time";
  className?: string;
}

export function LocalKickoff({
  kickoffUtc,
  fallbackDate,
  fallbackTime,
  mode = "dateTime",
  className,
}: LocalKickoffProps) {
  const hydrated = useIsHydrated();

  if (!kickoffUtc || !hydrated) {
    const fallback =
      mode === "time"
        ? (fallbackTime ?? fallbackDate)
        : fallbackTime
          ? `${fallbackDate} · ${fallbackTime}`
          : fallbackDate;

    return <span className={className}>{fallback}</span>;
  }

  const formatted = formatKickoffInUserTz(kickoffUtc);
  const content =
    mode === "time" ? formatted.time : `${formatted.date} · ${formatted.time}`;

  return (
    <time className={className} dateTime={formatted.dateTime}>
      {content}
    </time>
  );
}

export function getKickoffDateTimeValue(
  kickoffUtc?: string,
  fallbackDate?: string,
  fallbackTime?: string,
): string {
  if (kickoffUtc) return kickoffUtc;
  if (!fallbackDate) return "";
  if (!fallbackTime) return fallbackDate;
  return `${fallbackDate} ${fallbackTime}`;
}
