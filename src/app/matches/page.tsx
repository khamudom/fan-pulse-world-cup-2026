import { MatchesExperience } from "@/components/MatchesExperience";
import { EmptyState } from "@/components/EmptyState";
import { getMatches, getGroups } from "@/services/worldCupApi";

export const metadata = {
  title: "Matches",
  description: "World Cup 2026 match schedule and group standings.",
};

export default async function MatchesPage() {
  const [matchesResult, groupsResult] = await Promise.all([
    getMatches(),
    getGroups(),
  ]);

  const { data: matches, source: matchesSource } = matchesResult;
  const { data: groups, source: groupsSource } = groupsResult;

  const groupCount = [
    ...new Set(matches.map((m) => m.group).filter(Boolean)),
  ].length;

  if (matches.length === 0 && groups.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="No matches available"
          message="No match or group data is available yet."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <MatchesExperience
        matches={matches}
        groups={groups}
        groupCount={groupCount || groups.length}
        matchesSource={matchesSource}
        groupsSource={groupsSource}
      />
    </div>
  );
}
