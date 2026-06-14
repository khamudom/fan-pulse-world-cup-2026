"use client";

import { useMemo } from "react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { ProgrammeSchedule } from "@/components/ProgrammeSchedule";
import { ViewAllLink } from "@/components/ViewAllLink";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import { useClientTime } from "@/lib/useClientOnly";
import type { Match } from "@/types";
import styles from "@/app/page.module.css";
import { getUpcomingProgrammeMatches } from "./utils";

type HomeFixturesSectionProps = {
  matches: Match[];
  source: "api" | "mock";
  sourceError?: string;
  subtitle: string;
  favoriteCountry?: string | null;
  showSignoff?: boolean;
};

export function HomeFixturesSection({
  matches,
  source,
  sourceError,
  subtitle,
  favoriteCountry,
  showSignoff = false,
}: HomeFixturesSectionProps) {
  const { now, isReady } = useClientTime();

  const programmeMatches = useMemo(() => {
    if (!isReady) return [];
    return getUpcomingProgrammeMatches(matches, 12, now);
  }, [isReady, matches, now]);

  return (
    <section className={styles.fixturesSection}>
      <div className="container">
        <div className={styles.fixturesHeader}>
          <div>
            <h2 className={styles.fixturesTitle}>Fixtures</h2>
            <p className={styles.fixturesSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.sectionActions}>
            <DataSourceBadge
              source={toDataSourceBadge(
                source,
                isReady && programmeMatches.length > 0,
              )}
            />
            <ViewAllLink href="/matches" label="View all matches" />
          </div>
        </div>

        {!isReady ? (
          <LoadingState label="Loading fixtures…" rows={3} />
        ) : programmeMatches.length > 0 ? (
          <ProgrammeSchedule
            matches={programmeMatches}
            favoriteCountry={favoriteCountry}
          />
        ) : (
          <EmptyState
            title="No matches to show"
            message={sourceError ?? "No upcoming fixtures from the API."}
            actionLabel="Browse all matches"
            actionHref="/matches"
          />
        )}

        {showSignoff ? (
          <footer className={styles.fixturesSignoff}>
            <p>Every day is a new chapter.</p>
          </footer>
        ) : null}
      </div>
    </section>
  );
}
