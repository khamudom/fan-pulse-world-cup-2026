import { Hero } from "@/components/Hero";
import { EmptyState } from "@/components/EmptyState";
import { PredictorExperience } from "@/components/PredictorExperience";
import { getMyBracketPrediction } from "@/actions/bracketPredictions";
import { getAuthContext } from "@/lib/auth";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getGroups, getMatches, getTeams } from "@/services/worldCupApi";

export const metadata = {
  title: "World Cup Predictor",
};

export default async function PredictorPage() {
  const [{ user }, matchesResult, groupsResult, teamsResult, savedBracket] =
    await Promise.all([
      getAuthContext(),
      getMatches(),
      getGroups(),
      getTeams(),
      getMyBracketPrediction(),
    ]);

  return (
    <div className="page">
      <Hero
        title="World Cup Predictor"
        subtitle="Build your World Cup picks and choose your champion."
        compact
      />
      <section className="section">
        <div className="container">
          {USE_PROTOTYPE_DATA ? (
            <PredictorExperience
              matches={matchesResult.data}
              groups={groupsResult.data}
              teams={teamsResult.data}
              matchSource={matchesResult.source}
              isSignedIn={Boolean(user)}
              savedBracket={savedBracket?.payload ?? null}
            />
          ) : (
            <EmptyState
              title="Predictor uses prototype data"
              message="Enable USE_PROTOTYPE_DATA in src/config/dataSource.ts to preview polls and bracket picks. Match, team, and stadium pages show live API data."
              actionLabel="View matches"
              actionHref="/matches"
            />
          )}
        </div>
      </section>
    </div>
  );
}
