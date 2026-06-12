import { toIsoDate } from "@/lib/matchDate";
import type { Match } from "@/types";

export function getUpcomingProgrammeMatches(
  matches: Match[],
  limit = 12,
): Match[] {
  const todayIso = new Date().toISOString().slice(0, 10);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  const endIso = endDate.toISOString().slice(0, 10);

  return [...matches]
    .filter(
      (match) =>
        match.status === "scheduled" ||
        match.status === "notstarted" ||
        match.status === "live",
    )
    .sort((a, b) => {
      const dateCompare = toIsoDate(a.date).localeCompare(toIsoDate(b.date));
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .filter((match) => {
      const matchDate = toIsoDate(match.date);
      return matchDate >= todayIso && matchDate <= endIso;
    })
    .slice(0, limit);
}
