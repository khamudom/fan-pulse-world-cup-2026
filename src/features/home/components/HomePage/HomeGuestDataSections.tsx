import { getTeams, getMatches, getTodaysMatches } from "@/services/worldCupApi";
import { HomeGuestAsyncSections } from "./HomeGuestAsyncSections";

type HomeGuestDataSectionsProps = {
  showBeginJourney: boolean;
};

export async function HomeGuestDataSections({
  showBeginJourney,
}: HomeGuestDataSectionsProps) {
  const [matchesResult, todaysResult, teamsResult] = await Promise.all([
    getMatches(),
    getTodaysMatches(),
    getTeams(),
  ]);

  return (
    <HomeGuestAsyncSections
      showBeginJourney={showBeginJourney}
      teamsResult={teamsResult}
      matchesResult={matchesResult}
      todaysResult={todaysResult}
    />
  );
}
