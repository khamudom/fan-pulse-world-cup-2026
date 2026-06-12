import { getCountdownParts } from "@/lib/countdown";
import type { Match } from "@/types";
import type { Profile } from "@/types/database";

function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parseMatchDateTime(match: Match): Date | null {
  if (match.kickoffUtc) {
    const kickoff = new Date(match.kickoffUtc);
    return Number.isNaN(kickoff.getTime()) ? null : kickoff;
  }

  const iso = toIsoDate(match.date);
  const timeMatch = match.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!timeMatch) return new Date(`${iso}T12:00:00`);

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const period = timeMatch[3]?.toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const d = new Date(`${iso}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function teamMatchesProfile(match: Match, profile: Profile): boolean {
  const teams = [profile.favorite_country, profile.secondary_country].filter(Boolean);
  if (teams.length === 0) return false;
  return teams.some(
    (t) => match.homeTeam.name === t || match.awayTeam.name === t
  );
}

export interface FanJourneyResult {
  nextMatch: Match | null;
  kickoff: Date | null;
  countdown: ReturnType<typeof getCountdownParts> | null;
  label: string;
  opponent: string | null;
}

export function getFanJourney(
  matches: Match[],
  profile: Profile | null,
  now = new Date()
): FanJourneyResult {
  if (!profile?.favorite_country) {
    return {
      nextMatch: null,
      kickoff: null,
      countdown: null,
      label: "Set up My World Cup",
      opponent: null,
    };
  }

  const upcoming = matches
    .filter(
      (m) =>
        (m.status === "scheduled" || m.status === "notstarted") &&
        teamMatchesProfile(m, profile)
    )
    .map((m) => ({ match: m, kickoff: parseMatchDateTime(m) }))
    .filter((item): item is { match: Match; kickoff: Date } => {
      if (!item.kickoff) return false;
      return item.kickoff.getTime() > now.getTime();
    })
    .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());

  const next = upcoming[0];
  if (!next) {
    return {
      nextMatch: null,
      kickoff: null,
      countdown: null,
      label: `${profile.favorite_country} has no upcoming matches`,
      opponent: null,
    };
  }

  const favorite = profile.favorite_country;
  const opponent =
    next.match.homeTeam.name === favorite
      ? next.match.awayTeam.name
      : next.match.homeTeam.name;

  return {
    nextMatch: next.match,
    kickoff: next.kickoff,
    countdown: getCountdownParts(next.kickoff, now),
    label: `${favorite} vs ${opponent}`,
    opponent,
  };
}

export function getMatchesForDate(matches: Match[], targetDate: Date): Match[] {
  const targetIso = targetDate.toISOString().slice(0, 10);
  return matches.filter((m) => toIsoDate(m.date) === targetIso);
}

export function getYesterdayFinishedMatches(
  matches: Match[],
  now = new Date()
): Match[] {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);

  return matches.filter(
    (m) => m.status === "finished" && toIsoDate(m.date) === yesterdayIso
  );
}

export function getRelevantYesterdayMatches(
  matches: Match[],
  profile: Profile | null,
  now = new Date()
): Match[] {
  const yesterday = getYesterdayFinishedMatches(matches, now);
  if (!profile?.favorite_country && !profile?.secondary_country) {
    return yesterday;
  }
  const relevant = yesterday.filter((m) => teamMatchesProfile(m, profile));
  return relevant.length > 0 ? relevant : yesterday.slice(0, 5);
}

export function formatCountdownLabel(
  countdown: ReturnType<typeof getCountdownParts>
): string {
  const parts: string[] = [];
  if (countdown.days > 0) parts.push(`${countdown.days}d`);
  if (countdown.hours > 0 || countdown.days > 0) parts.push(`${countdown.hours}h`);
  parts.push(`${countdown.minutes}m`);
  return parts.join(" ");
}
