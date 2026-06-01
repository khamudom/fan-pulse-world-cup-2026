import { Hero } from "@/components/Hero";
import { MatchesSection } from "@/components/MatchesSection";
import { EmptyState } from "@/components/EmptyState";
import { getMatches } from "@/services/worldCupApi";

export const metadata = {
  title: "Matches",
};

export default async function MatchesPage() {
  const { data: matches, source } = await getMatches();

  const groups = [...new Set(matches.map((m) => m.group).filter(Boolean))].sort() as string[];
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
              groups={groups}
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
    </div>
  );
}
