import { AiCompanionCard } from "@/components/AiCompanionCard";
import { BriefingSection } from "@/components/BriefingContent";
import { LocalTodayDate } from "@/components/LocalTodayDate";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { FanAccoladesBoard } from "@/components/FanAccoladesBoard";
import { FanJourneyCard } from "@/components/FanJourneyCard";
import { ProgrammeSchedule } from "@/components/ProgrammeSchedule";
import { ViewAllLink } from "@/components/ViewAllLink";
import { WelcomeBackHero } from "@/components/WelcomeBackHero";
import { getFanJourney } from "@/lib/fanJourney";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import type { ApiResult, Match } from "@/types";
import type { Profile, UserStats } from "@/types/database";
import styles from "@/app/page.module.css";
import { getUpcomingProgrammeMatches } from "./utils";

type HomePersonalizedViewProps = {
  profile: Profile;
  stats: UserStats | null;
  matchesResult: ApiResult<Match[]>;
  todaysResult: ApiResult<Match[]>;
  briefing: { content: string | null; error?: string };
};

export function HomePersonalizedView({
  profile,
  stats,
  matchesResult,
  todaysResult,
  briefing,
}: HomePersonalizedViewProps) {
  const journey = getFanJourney(matchesResult.data, profile);
  const programmeMatches = getUpcomingProgrammeMatches(matchesResult.data);

  return (
    <>
      <WelcomeBackHero profile={profile} stats={stats} journey={journey} />

      <section className={styles.briefingSection} id="briefing">
        <div className="container">
          <div className={styles.briefingPanel}>
            <div className={styles.briefingHeader}>
              <h2 className={styles.briefingTitle}>
                Morning Briefing for <LocalTodayDate />
              </h2>
              <p className={styles.briefingSubtitle}>
                Your personalized 3-minute read — yesterday&apos;s results,
                today&apos;s storylines, and what matters for your team.
              </p>
            </div>
            {briefing.error ? (
              <EmptyState
                title="Briefing unavailable"
                message={briefing.error}
                actionLabel="Set up My World Cup"
                actionHref="/my-world-cup"
              />
            ) : (
              <BriefingSection initialContent={briefing.content} />
            )}
          </div>
        </div>
      </section>

      <section className={styles.personalSection}>
        <div className="container">
          <div className={styles.personalGrid}>
            <FanJourneyCard
              journey={journey}
              favoriteCountry={profile.favorite_country}
              matchesSource={matchesResult.source}
            />
            <FanAccoladesBoard stats={stats} variant="compact" />
            <AiCompanionCard title="Your World Cup companion" />
          </div>
        </div>
      </section>

      <section className={styles.fixturesSection}>
        <div className="container">
          <div className={styles.fixturesHeader}>
            <div>
              <h2 className={styles.fixturesTitle}>Fixtures</h2>
              <p className={styles.fixturesSubtitle}>
                Upcoming fixtures on your watchlist
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
            <ProgrammeSchedule
              matches={programmeMatches}
              favoriteCountry={profile.favorite_country}
            />
          ) : (
            <EmptyState
              title="No matches to show"
              message="No upcoming fixtures from the API."
              actionLabel="Browse all matches"
              actionHref="/matches"
            />
          )}

          <footer className={styles.fixturesSignoff}>
            <p>Every day is a new chapter.</p>
          </footer>
        </div>
      </section>
    </>
  );
}
