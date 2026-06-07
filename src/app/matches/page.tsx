import { Hero } from "@/components/Hero";
import { MatchesSection } from "@/components/MatchesSection";
import { SectionHeader } from "@/components/SectionHeader";
import { GroupStandings } from "@/components/GroupStandings";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { getMatches, getGroups } from "@/services/worldCupApi";

export const metadata = {
  title: "Matches",
};

function getApiBadgeSource(
  source: "api" | "mock",
  hasData: boolean
): "api" | "mock" | "unavailable" {
  if (!hasData) return "unavailable";
  return source === "mock" ? "mock" : "api";
}

export default async function MatchesPage() {
  const [matchesResult, groupsResult] = await Promise.all([
    getMatches(),
    getGroups(),
  ]);

  const { data: matches, source } = matchesResult;
  const groups = groupsResult.data;

  const groupNames = [...new Set(matches.map((m) => m.group).filter(Boolean))].sort() as string[];
  const teams = [
    ...new Set(
      matches.flatMap((m) => [m.homeTeam.name, m.awayTeam.name])
    ),
  ].sort();
  const stadiums = [
    ...new Set(matches.map((m) => m.stadiumName).filter(Boolean)),
  ].sort() as string[];

  return (
    <div className="page">
      <Hero
        title="Match Schedule"
        subtitle="Search and filter every World Cup 2026 fixture."
        compact
      />
      <section className="section">
        <div className="container">
          {matches.length > 0 ? (
            <MatchesSection
              matches={matches}
              groups={groupNames}
              teams={teams}
              stadiums={stadiums}
              source={source}
            />
          ) : (
            <EmptyState
              title="No matches available"
              message="The World Cup API returned no match data."
            />
          )}
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <SectionHeader
            title="Group Standings"
            subtitle="Track every group from A through L."
            action={
              <DataSourceBadge
                source={getApiBadgeSource(groupsResult.source, groups.length > 0)}
              />
            }
          />
          {groups.length > 0 ? (
            <GroupStandings groups={groups} />
          ) : (
            <EmptyState
              title="No group standings available"
              message="The World Cup API returned no group data."
            />
          )}
        </div>
      </section>
    </div>
  );
}
