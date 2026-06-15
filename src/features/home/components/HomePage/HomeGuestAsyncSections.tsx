import { BeginYourJourney } from "../BeginYourJourney";
import type { ApiResult, Match, Team } from "@/types";
import { HomeFixturesSection } from "./HomeFixturesSection";

type HomeGuestAsyncSectionsProps = {
  showBeginJourney: boolean;
  teamsResult: ApiResult<Team[]>;
  matchesResult: ApiResult<Match[]>;
  todaysResult: ApiResult<Match[]>;
};

export function HomeGuestAsyncSections({
  showBeginJourney,
  teamsResult,
  matchesResult,
  todaysResult,
}: HomeGuestAsyncSectionsProps) {
  return (
    <>
      {showBeginJourney ? (
        <BeginYourJourney
          teams={teamsResult.data}
          teamsSource={teamsResult.source}
        />
      ) : null}

      <HomeFixturesSection
        matches={matchesResult.data}
        source={todaysResult.source}
        sourceError={todaysResult.error}
        subtitle="Upcoming fixtures from the tournament"
      />
    </>
  );
}
