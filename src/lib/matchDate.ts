import type { Match } from "@/types";

export function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function isMatchOnDate(date: string, targetIsoDate: string): boolean {
  if (!date || !targetIsoDate) return false;
  return toIsoDate(date) === targetIsoDate;
}

export function getUniqueMatchDates(matches: Match[]): string[] {
  const dates = new Set<string>();
  for (const match of matches) {
    dates.add(toIsoDate(match.date));
  }
  return [...dates].sort();
}

export function getDefaultSelectedDate(dates: string[]): string {
  if (dates.length === 0) return "";

  const today = new Date().toISOString().slice(0, 10);
  if (dates.includes(today)) return today;

  const upcoming = dates.find((date) => date >= today);
  return upcoming ?? dates[0];
}

export function formatTimelineDay(isoDate: string): {
  weekday: string;
  label: string;
} {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    label: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
  };
}

export function formatSelectedDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
