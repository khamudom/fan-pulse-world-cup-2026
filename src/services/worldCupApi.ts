import { cache } from "react";
import {
  parseLocalDateTimeString,
  zonedLocalToUtcIso,
} from "@/lib/timezone";
import { getVenueTimeZone } from "@/lib/venueTimeZones";
import type {
  ApiResult,
  Group,
  Match,
  MatchStatus,
  Stadium,
  Team,
} from "@/types";

const API_BASE = "https://worldcup26.ir/get";
const REVALIDATE_SECONDS = 300;
const FETCH_RETRIES = 3;
const RETRY_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * "cached" uses the 5-minute ISR cache (good for static-ish data).
 * "fresh" bypasses the cache entirely for live data like in-progress scores.
 */
export type FetchMode = "cached" | "fresh";

interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  matchday: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
  home_team_name_en: string;
  away_team_name_en: string;
}

interface ApiTeam {
  id: string;
  name_en: string;
  name_fa?: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

interface ApiStadium {
  id: string;
  name_en: string;
  fifa_name: string;
  city_en: string;
  country_en: string;
  capacity: number;
  region: string;
}

interface ApiGroupTeam {
  team_id: string;
  mp: string;
  w: string;
  d: string;
  l: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

interface ApiGroup {
  name: string;
  teams: ApiGroupTeam[];
}

async function fetchJson<T>(
  path: string,
  mode: FetchMode = "cached",
): Promise<T | null> {
  for (let attempt = 0; attempt < FETCH_RETRIES; attempt++) {
    try {
      const res = await fetch(
        `${API_BASE}/${path}`,
        mode === "fresh"
          ? { cache: "no-store" }
          : { next: { revalidate: REVALIDATE_SECONDS } },
      );
      if (res.ok) return (await res.json()) as T;
    } catch {
      // Retry on network errors.
    }

    if (attempt < FETCH_RETRIES - 1) {
      await delay(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  return null;
}

const fetchTeamsJson = cache(async () =>
  fetchJson<{ teams: ApiTeam[] }>("teams"),
);

function parseStatus(finished: string, timeElapsed: string): MatchStatus {
  const finishedUpper = finished?.toUpperCase();
  if (finishedUpper === "TRUE") return "finished";
  if (timeElapsed === "notstarted") return "scheduled";
  if (timeElapsed === "halftime") return "halftime";
  if (timeElapsed && timeElapsed !== "notstarted") return "live";
  return "scheduled";
}

function formatDisplayTime(timePart: string): string {
  const [hourPart, minutePart = "00"] = timePart.split(":");
  const hour = parseInt(hourPart, 10);

  if (Number.isNaN(hour)) return timePart;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutePart.padStart(2, "0")} ${period}`;
}

function parseDateTime(localDate: string): { date: string; time: string } {
  const parts = localDate?.split(" ") ?? [];
  const datePart = parts[0] ?? "";
  const timePart = parts[1] ?? "";
  const [month, day, year] = datePart.split("/");
  const displayDate =
    year && month && day
      ? `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`
      : datePart;
  return { date: displayDate, time: formatDisplayTime(timePart) };
}

function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function mapApiTeam(
  id: string,
  name: string,
  flag?: string,
  group?: string,
  fifaCode?: string
): Team {
  return { id, name, flag, group, fifaCode };
}

function mapGameToMatch(game: ApiGame, teamMap: Map<string, ApiTeam>, stadiumMap: Map<string, ApiStadium>): Match {
  const homeApi = teamMap.get(game.home_team_id);
  const awayApi = teamMap.get(game.away_team_id);
  const stadium = stadiumMap.get(game.stadium_id);
  const { date, time } = parseDateTime(game.local_date);
  const venueTimeZone = getVenueTimeZone(stadium?.city_en, stadium?.country_en);
  const localDateTime = parseLocalDateTimeString(game.local_date);
  const kickoffUtc = localDateTime
    ? zonedLocalToUtcIso(localDateTime, venueTimeZone)
    : undefined;

  return {
    id: game.id,
    homeTeam: mapApiTeam(
      game.home_team_id,
      game.home_team_name_en || homeApi?.name_en || "TBD",
      homeApi?.flag,
      game.group,
      homeApi?.fifa_code
    ),
    awayTeam: mapApiTeam(
      game.away_team_id,
      game.away_team_name_en || awayApi?.name_en || "TBD",
      awayApi?.flag,
      game.group,
      awayApi?.fifa_code
    ),
    homeScore: parseInt(game.home_score, 10) || 0,
    awayScore: parseInt(game.away_score, 10) || 0,
    group: game.group,
    matchday: game.matchday,
    date,
    time,
    kickoffUtc,
    venueTimeZone,
    stadiumId: game.stadium_id,
    stadiumName: stadium?.name_en,
    city: stadium?.city_en,
    status: parseStatus(game.finished, game.time_elapsed),
    type: game.type,
  };
}

async function getTeamsUncached(): Promise<ApiResult<Team[]>> {
  const response = await fetchTeamsJson();
  if (!response?.teams?.length) {
    return { data: [], source: "api", error: "World Cup API unavailable" };
  }
  const teams = response.teams.map((t) => ({
    id: t.id,
    name: t.name_en,
    nameFa: t.name_fa,
    flag: t.flag,
    fifaCode: t.fifa_code,
    iso2: t.iso2,
    group: t.groups,
  }));
  return { data: teams, source: "api" };
}

async function getMatchesUncached(
  mode: FetchMode = "cached",
): Promise<ApiResult<Match[]>> {
  // Only the games feed carries volatile data (scores, status, minute),
  // so teams/stadiums always stay on the standard cache.
  const [gamesRes, teamsRes, stadiumsRes] = await Promise.all([
    fetchJson<{ games: ApiGame[] }>("games", mode),
    fetchTeamsJson(),
    fetchJson<{ stadiums: ApiStadium[] }>("stadiums"),
  ]);

  if (!gamesRes?.games?.length) {
    return { data: [], source: "api", error: "World Cup API unavailable" };
  }

  const teamMap = new Map(
    (teamsRes?.teams ?? []).map((t) => [t.id, t])
  );
  const stadiumMap = new Map(
    (stadiumsRes?.stadiums ?? []).map((s) => [s.id, s])
  );

  const matches = gamesRes.games.map((g) =>
    mapGameToMatch(g, teamMap, stadiumMap)
  );
  return { data: matches, source: "api" };
}

export const getTeams = cache(getTeamsUncached);
export const getMatches = cache(getMatchesUncached);

export async function getMatchById(
  id: string,
  mode: FetchMode = "cached",
): Promise<ApiResult<Match | null>> {
  const modes: FetchMode[] =
    mode === "fresh" ? ["fresh", "cached"] : ["cached", "fresh"];

  let lastResult: ApiResult<Match[]> | null = null;

  for (const fetchMode of modes) {
    const result = await getMatches(fetchMode);
    lastResult = result;
    const match = result.data.find((m) => m.id === id) ?? null;
    if (match) {
      return { data: match, source: result.source, error: result.error };
    }
  }

  return {
    data: null,
    source: "api",
    error:
      lastResult?.data.length === 0
        ? (lastResult.error ?? "World Cup API unavailable")
        : (lastResult?.error ?? "Match not found"),
  };
}

async function getGroupsUncached(): Promise<ApiResult<Group[]>> {
  const [groupsRes, teamsRes] = await Promise.all([
    fetchJson<{ groups: ApiGroup[] }>("groups"),
    fetchJson<{ teams: ApiTeam[] }>("teams"),
  ]);

  if (!groupsRes?.groups?.length) {
    return { data: [], source: "api", error: "World Cup API unavailable" };
  }

  const teamMap = new Map(
    (teamsRes?.teams ?? []).map((t) => [t.id, t])
  );

  const groups: Group[] = groupsRes.groups.map((g) => ({
    name: g.name,
    standings: g.teams.map((s) => {
      const team = teamMap.get(s.team_id);
      return {
        teamId: s.team_id,
        teamName: team?.name_en ?? `Team ${s.team_id}`,
        flag: team?.flag,
        played: parseInt(s.mp, 10) || 0,
        won: parseInt(s.w, 10) || 0,
        drawn: parseInt(s.d, 10) || 0,
        lost: parseInt(s.l, 10) || 0,
        goalsFor: parseInt(s.gf, 10) || 0,
        goalsAgainst: parseInt(s.ga, 10) || 0,
        goalDifference: parseInt(s.gd, 10) || 0,
        points: parseInt(s.pts, 10) || 0,
      };
    }),
  }));

  return { data: groups.sort((a, b) => a.name.localeCompare(b.name)), source: "api" };
}

async function getStadiumsUncached(): Promise<ApiResult<Stadium[]>> {
  const [stadiumsRes, gamesRes] = await Promise.all([
    fetchJson<{ stadiums: ApiStadium[] }>("stadiums"),
    fetchJson<{ games: ApiGame[] }>("games"),
  ]);

  if (!stadiumsRes?.stadiums?.length) {
    return { data: [], source: "api", error: "World Cup API unavailable" };
  }

  const matchCountByStadium = new Map<string, number>();
  for (const game of gamesRes?.games ?? []) {
    const count = matchCountByStadium.get(game.stadium_id) ?? 0;
    matchCountByStadium.set(game.stadium_id, count + 1);
  }

  const stadiums: Stadium[] = stadiumsRes.stadiums.map((s) => ({
    id: s.id,
    name: s.name_en,
    fifaName: s.fifa_name,
    city: s.city_en,
    country: s.country_en,
    capacity: s.capacity,
    region: s.region,
    matchCount: matchCountByStadium.get(s.id) ?? 0,
  }));

  return { data: stadiums, source: "api" };
}

export const getGroups = cache(getGroupsUncached);
export const getStadiums = cache(getStadiumsUncached);

export async function getTodaysMatches(): Promise<ApiResult<Match[]>> {
  const { data: matches, source, error } = await getMatches();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const todays = matches.filter((m) => {
    const isoDate = toIsoDate(m.date);
    if (isoDate === todayStr) return true;
    const matchDate = new Date(isoDate);
    return (
      !Number.isNaN(matchDate.getTime()) &&
      matchDate.toDateString() === today.toDateString()
    );
  });

  if (todays.length === 0) {
    const upcoming = [...matches]
      .filter((m) => m.status === "scheduled" || m.status === "notstarted")
      .slice(0, 6);
    return { data: upcoming, source, error };
  }

  return { data: todays.slice(0, 8), source, error };
}

export async function getFeaturedMatch(): Promise<ApiResult<Match | null>> {
  const { data: matches, source, error } = await getMatches();
  const live = matches.find((m) => m.status === "live");
  if (live) return { data: live, source, error };
  const scheduled = matches.find(
    (m) => m.status === "scheduled" || m.status === "notstarted"
  );
  if (scheduled) return { data: scheduled, source, error };
  if (matches[0]) return { data: matches[0], source, error };
  return { data: null, source, error };
}

export function getStatusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    scheduled: "Scheduled",
    notstarted: "Not Started",
    live: "Live",
    finished: "Full Time",
    halftime: "Half Time",
    postponed: "Postponed",
  };
  return labels[status] ?? status;
}

export function getStatusBadgeVariant(
  status: MatchStatus
): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "live":
      return "danger";
    case "finished":
      return "default";
    case "halftime":
      return "warning";
    default:
      return "default";
  }
}
