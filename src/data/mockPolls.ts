import type { Poll } from "@/types";

export const worldCupWinnerPoll: Poll = {
  id: "wc-winner",
  question: "Who will win the World Cup?",
  totalVotes: 12847,
  options: [
    { id: "usa", label: "USA", votes: 1927, percentage: 15 },
    { id: "brazil", label: "Brazil", votes: 4368, percentage: 34 },
    { id: "argentina", label: "Argentina", votes: 3212, percentage: 25 },
    { id: "france", label: "France", votes: 1927, percentage: 15 },
    { id: "england", label: "England", votes: 1413, percentage: 11 },
  ],
};
