import type { PlayerStoryline } from "@/types";

export const mockGoldenBootRace: PlayerStoryline[] = [
  { id: "1", name: "Kylian Mbappé", team: "France", stat: "Goals", value: 4 },
  { id: "2", name: "Erling Haaland", team: "Norway", stat: "Goals", value: 3 },
  { id: "3", name: "Vinícius Júnior", team: "Brazil", stat: "Goals", value: 3 },
  { id: "4", name: "Harry Kane", team: "England", stat: "Goals", value: 2 },
];

export const mockTopScorers: PlayerStoryline[] = [
  { id: "1", name: "Kylian Mbappé", team: "France", stat: "Goals", value: 4 },
  { id: "2", name: "Lamine Yamal", team: "Spain", stat: "Goals", value: 3 },
  { id: "3", name: "Lionel Messi", team: "Argentina", stat: "Goals", value: 3 },
];

export const mockMostAssists: PlayerStoryline[] = [
  { id: "1", name: "Kevin De Bruyne", team: "Belgium", stat: "Assists", value: 4 },
  { id: "2", name: "Pedri", team: "Spain", stat: "Assists", value: 3 },
  { id: "3", name: "Bruno Fernandes", team: "Portugal", stat: "Assists", value: 3 },
];

export const mockDiscussedPlayers: PlayerStoryline[] = [
  { id: "1", name: "Lamine Yamal", team: "Spain", stat: "Mentions", value: "12.4K" },
  { id: "2", name: "Lionel Messi", team: "Argentina", stat: "Mentions", value: "11.8K" },
  { id: "3", name: "Christian Pulisic", team: "USA", stat: "Mentions", value: "9.2K" },
];
