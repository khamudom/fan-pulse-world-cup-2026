import { BeginYourJourney } from "@/components/BeginYourJourney";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { ProgrammeSchedule } from "@/components/ProgrammeSchedule";
import { ViewAllLink } from "@/components/ViewAllLink";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import type { ApiResult, Match, Team } from "@/types";
import styles from "@/app/page.module.css";
import { getUpcomingProgrammeMatches } from "./utils";

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
  const programmeMatches = getUpcomingProgrammeMatches(matchesResult.data);

  return (
    <>
      {showBeginJourney ? (
        <BeginYourJourney
          teams={teamsResult.data}
          teamsSource={teamsResult.source}
        />
      ) : null}

      <section className={styles.fixturesSection}>
        <div className="container">
          <div className={styles.fixturesHeader}>
            <div>
              <h2 className={styles.fixturesTitle}>Fixtures</h2>
              <p className={styles.fixturesSubtitle}>
                Upcoming fixtures from the tournament
              </p>
            </div>
            <div className={styles.sectionActions}>
              <DataSourceBadge
                source={toDataSourceBadge(
                  todaysResult.source,
                  programmeMatches.length > 0,
                )}
              />
              <ViewAllLink href="/matches" label="View all matches" />
            </div>
          </div>

          {programmeMatches.length > 0 ? (
            <ProgrammeSchedule matches={programmeMatches} />
          ) : (
            <EmptyState
              title="No matches to show"
              message={
                todaysResult.error ?? "No upcoming fixtures from the API."
              }
              actionLabel="Browse all matches"
              actionHref="/matches"
            />
          )}
        </div>
      </section>
    </>
  );
}
