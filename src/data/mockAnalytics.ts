import type {
  AnalyticsMetric,
  TrendingTeam,
  TimelineEvent,
} from "@/types";

export const mockDashboardMetrics: AnalyticsMetric[] = [
  { id: "matches-played", label: "Matches Played", value: 42 },
  { id: "goals-scored", label: "Goals Scored", value: 118 },
  { id: "teams-remaining", label: "Teams Remaining", value: 24 },
  { id: "predictions", label: "Total Fan Predictions", value: "48.2K" },
  { id: "poll-votes", label: "Total Poll Votes", value: "12.8K" },
  { id: "discussed", label: "Most Discussed Team", value: "France" },
];

export const mockFanSentiment = [
  { team: "Brazil", confidence: 82 },
  { team: "Argentina", confidence: 79 },
  { team: "France", confidence: 74 },
  { team: "England", confidence: 68 },
  { team: "USA", confidence: 61 },
];

export const mockTrendingTeams: TrendingTeam[] = [
  {
    id: "1",
    name: "USA",
    popularityChange: "+18%",
    fanConfidence: 61,
    predictionPercentage: 15,
  },
  {
    id: "2",
    name: "Brazil",
    popularityChange: "+8%",
    fanConfidence: 82,
    predictionPercentage: 34,
  },
  {
    id: "3",
    name: "Morocco",
    popularityChange: "+14%",
    fanConfidence: 55,
    predictionPercentage: 19,
  },
  {
    id: "4",
    name: "Argentina",
    popularityChange: "+12%",
    fanConfidence: 79,
    predictionPercentage: 25,
  },
];

export const mockGroupAnalysis = {
  leaders: [
    { group: "A", leader: "Mexico" },
    { group: "B", leader: "England" },
    { group: "C", leader: "Brazil" },
    { group: "D", leader: "France" },
  ],
  mostCompetitive: "Group E",
  highestScoring: "Group C",
  mostSurprising: "Group H",
};

export const mockMatchInsights = {
  mostViewed: "USA vs Mexico",
  highestScoring: "Germany vs Japan (4-3)",
  biggestUpset: "Morocco 2-1 Spain",
  closestMatch: "Portugal 0-0 France (penalties)",
};

export const mockHostCityInsights = {
  mostActiveCity: "Mexico City",
  featuredStadium: "Estadio Azteca",
  highestScoringStadium: "AT&T Stadium",
  upcomingVenue: "MetLife Stadium — Final",
};

export const mockTimeline: TimelineEvent[] = [
  {
    id: "1",
    title: "Opening Match",
    date: "June 11, 2026",
    description: "Mexico City kicks off the 48-team tournament.",
    status: "completed",
  },
  {
    id: "2",
    title: "Group Stage",
    date: "June 11 – July 1, 2026",
    description: "104 matches across 12 groups A through L.",
    status: "current",
  },
  {
    id: "3",
    title: "Knockout Stage",
    date: "July 4, 2026",
    description: "Round of 32 begins with expanded bracket.",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Quarterfinals",
    date: "July 10–11, 2026",
    description: "Eight teams remain in the hunt.",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Semifinals",
    date: "July 14–15, 2026",
    description: "The final four battle for a place in the final.",
    status: "upcoming",
  },
  {
    id: "6",
    title: "Final",
    date: "July 19, 2026",
    description: "MetLife Stadium, New Jersey — crowning a champion.",
    status: "upcoming",
  },
];

export const tournamentOverview = {
  stage: "Group Stage",
  matchesPlayed: 42,
  teamsRemaining: 48,
  totalPredictions: 48200,
};
