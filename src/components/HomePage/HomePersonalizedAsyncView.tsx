import { getCachedBriefing } from "@/actions/briefing";
import { getAuthContext } from "@/lib/auth";
import { getMatches, getTodaysMatches } from "@/services/worldCupApi";
import { HomePersonalizedView } from "./HomePersonalizedView";

export async function HomePersonalizedAsyncView() {
  const [{ user, profile, stats }, matchesResult, todaysResult, briefing] =
    await Promise.all([
      getAuthContext(),
      getMatches(),
      getTodaysMatches(),
      getCachedBriefing(),
    ]);

  if (!user || !profile?.onboarding_complete) {
    return null;
  }

  return (
    <HomePersonalizedView
      profile={profile}
      stats={stats}
      matchesResult={matchesResult}
      todaysResult={todaysResult}
      briefing={briefing}
    />
  );
}
