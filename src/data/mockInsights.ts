import type { Insight } from "@/types";

export const mockTournamentInsights: Insight[] = [
  {
    id: "ti-1",
    title: "Champion Predictions",
    body: "Brazil is currently the most predicted champion with 34% of all fan submissions.",
    category: "Predictions",
  },
  {
    id: "ti-2",
    title: "Argentina Momentum",
    body: "Argentina fan confidence increased 12% after their latest victory.",
    category: "Sentiment",
  },
  {
    id: "ti-3",
    title: "USA Engagement",
    body: "USA engagement is growing faster than any other team on FanPulse.",
    category: "Trending",
  },
  {
    id: "ti-4",
    title: "Most Discussed",
    body: "France is currently the most discussed team among fans this week.",
    category: "Discussion",
  },
];

export const mockMatchInsights: Record<string, string> = {
  "Why does this match matter?":
    "This fixture could decide who tops the group and avoids a tougher knockout path.",
  "Who has the tactical advantage?":
    "The team with stronger recent form and midfield control has the edge in tight matches.",
  "What would an upset look like?":
    "An early goal and disciplined defending could flip expectations in a high-stakes clash.",
};

export const mockAiPrompts = [
  "Who has the easiest path?",
  "Who is most likely to win?",
  "Which match should I watch today?",
  "What team is trending?",
];

export const mockAiResponses: Record<string, string> = {
  "Who has the easiest path?":
    "Based on group composition and bracket positioning, teams in Groups A and F appear to have a clearer route to the quarterfinals.",
  "Who is most likely to win?":
    "Brazil and Argentina lead fan predictions, with France close behind in overall tournament confidence.",
  "Which match should I watch today?":
    "Today's featured clash has knockout implications — expect high intensity from the opening whistle.",
  "What team is trending?":
    "USA fan engagement is surging, with prediction volume up 18% over the last 48 hours.",
};
