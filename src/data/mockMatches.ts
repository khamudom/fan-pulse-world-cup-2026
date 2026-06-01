import type { Group, Match, Stadium, Team } from "@/types";

export const mockTeams: Team[] = [
  { id: "1", name: "USA", flag: "https://flagcdn.com/w80/us.png", group: "D", fifaCode: "USA" },
  { id: "2", name: "England", flag: "https://flagcdn.com/w80/gb.png", group: "B", fifaCode: "ENG" },
  { id: "3", name: "Brazil", flag: "https://flagcdn.com/w80/br.png", group: "C", fifaCode: "BRA" },
  { id: "4", name: "Argentina", flag: "https://flagcdn.com/w80/ar.png", group: "J", fifaCode: "ARG" },
  { id: "5", name: "France", flag: "https://flagcdn.com/w80/fr.png", group: "I", fifaCode: "FRA" },
  { id: "6", name: "Germany", flag: "https://flagcdn.com/w80/de.png", group: "E", fifaCode: "GER" },
  { id: "7", name: "Spain", flag: "https://flagcdn.com/w80/es.png", group: "H", fifaCode: "ESP" },
  { id: "8", name: "Mexico", flag: "https://flagcdn.com/w80/mx.png", group: "A", fifaCode: "MEX" },
];

export const mockMatches: Match[] = [
  {
    id: "featured-1",
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    group: "D",
    matchday: "3",
    date: "06-28-2026",
    time: "8:00 PM",
    stadiumName: "SoFi Stadium",
    city: "Los Angeles",
    status: "scheduled",
    type: "group",
  },
  {
    id: "featured-2",
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    homeScore: 2,
    awayScore: 1,
    group: "C",
    matchday: "2",
    date: "06-20-2026",
    time: "6:00 PM",
    stadiumName: "MetLife Stadium",
    city: "New York",
    status: "finished",
    type: "group",
  },
  {
    id: "featured-3",
    homeTeam: mockTeams[4],
    awayTeam: mockTeams[5],
    homeScore: 1,
    awayScore: 1,
    group: "E",
    matchday: "1",
    date: "06-15-2026",
    time: "3:00 PM",
    stadiumName: "AT&T Stadium",
    city: "Dallas",
    status: "live",
    type: "group",
  },
];

export const mockGroups: Group[] = [
  {
    name: "A",
    standings: [
      { teamId: "1", teamName: "Mexico", flag: "https://flagcdn.com/w80/mx.png", played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 6 },
      { teamId: "2", teamName: "South Africa", flag: "https://flagcdn.com/w80/za.png", played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 2, goalsAgainst: 2, goalDifference: 0, points: 3 },
      { teamId: "3", teamName: "South Korea", flag: "https://flagcdn.com/w80/kr.png", played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 1 },
      { teamId: "4", teamName: "UEFA Playoff D", played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 1, goalsAgainst: 3, goalDifference: -2, points: 1 },
    ],
  },
  {
    name: "C",
    standings: [
      { teamId: "5", teamName: "Brazil", flag: "https://flagcdn.com/w80/br.png", played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, points: 6 },
      { teamId: "6", teamName: "Morocco", flag: "https://flagcdn.com/w80/ma.png", played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 3 },
      { teamId: "7", teamName: "Haiti", played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 1 },
      { teamId: "8", teamName: "Scotland", flag: "https://flagcdn.com/w80/gb-sct.png", played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 1, goalsAgainst: 3, goalDifference: -2, points: 1 },
    ],
  },
];

export const mockStadiums: Stadium[] = [
  {
    id: "1",
    name: "Estadio Azteca",
    fifaName: "Mexico City Stadium",
    city: "Mexico City",
    country: "Mexico",
    capacity: 83000,
    matchCount: 5,
  },
  {
    id: "2",
    name: "MetLife Stadium",
    fifaName: "New York New Jersey Stadium",
    city: "East Rutherford",
    country: "United States",
    capacity: 82500,
    matchCount: 8,
  },
  {
    id: "3",
    name: "SoFi Stadium",
    fifaName: "Los Angeles Stadium",
    city: "Inglewood",
    country: "United States",
    capacity: 70000,
    matchCount: 6,
  },
];
