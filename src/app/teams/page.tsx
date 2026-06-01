import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamFilters } from "@/components/TeamFilters";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { getTeams } from "@/services/worldCupApi";

export const metadata = {
  title: "Teams",
};

export default async function TeamsPage() {
  const { data: teams, source } = await getTeams();
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const groups = [...new Set(teams.map((t) => t.group).filter(Boolean))].sort() as string[];

  return (
    <div className="page">
      <Hero
        title="World Cup Teams"
        subtitle="All 48 nations competing at FIFA World Cup 2026."
        compact
      />
      <section className="section">
        <div className="container">
          <SectionHeader
            title="All Teams"
            subtitle={`${teams.length} teams${source === "mock" ? " (fallback data)" : ""}`}
            action={
              <DataSourceBadge
                source={
                  teams.length === 0
                    ? "unavailable"
                    : source === "mock"
                      ? "mock"
                      : "api"
                }
              />
            }
          />
          {sortedTeams.length > 0 ? (
            <TeamFilters teams={sortedTeams} groups={groups} />
          ) : (
            <EmptyState
              title="No teams available"
              message="The World Cup API returned no team data."
            />
          )}
        </div>
      </section>
    </div>
  );
}
