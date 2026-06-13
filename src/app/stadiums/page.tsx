import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { StadiumCard } from "@/components/StadiumCard";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { getMatches, getStadiums } from "@/services/worldCupApi";
import type { Match } from "@/types";
import styles from "./page.module.css";

function groupMatchesByStadium(matches: Match[]): Map<string, Match[]> {
  const byStadium = new Map<string, Match[]>();
  for (const match of matches) {
    if (!match.stadiumId) continue;
    const list = byStadium.get(match.stadiumId) ?? [];
    list.push(match);
    byStadium.set(match.stadiumId, list);
  }
  return byStadium;
}

export const metadata = {
  title: "Stadiums",
};

export default async function StadiumsPage() {
  const [{ data: stadiums, source }, { data: matches }] = await Promise.all([
    getStadiums(),
    getMatches(),
  ]);
  const matchesByStadium = groupMatchesByStadium(matches);

  return (
    <div className="page">
      <Hero
        title="Host Stadiums"
        subtitle="Explore World Cup 2026 venues across USA, Mexico, and Canada."
        compact
      />

      {stadiums.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="All Stadiums"
              subtitle={`${stadiums.length} venues${source === "mock" ? " (fallback data)" : ""}`}
              action={<DataSourceBadge source={source === "mock" ? "mock" : "api"} />}
            />
            <div className={styles.grid}>
              {stadiums.map((stadium) => (
                <StadiumCard
                  key={stadium.id}
                  stadium={stadium}
                  matches={matchesByStadium.get(stadium.id) ?? []}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="All Stadiums"
              action={<DataSourceBadge source="unavailable" />}
            />
            <EmptyState
              title="No stadiums available"
              message="The World Cup API returned no stadium data."
            />
          </div>
        </section>
      )}
    </div>
  );
}
