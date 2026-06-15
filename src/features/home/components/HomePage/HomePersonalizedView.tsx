import { AiCompanionCard } from "../AiCompanionCard";
import { BriefingSection } from "../BriefingContent";
import { BriefingTimeZoneSync } from "../BriefingContent/BriefingTimeZoneSync";
import { LocalTodayDate } from "@/components/display/LocalTodayDate";
import { EmptyState } from "@/components/feedback/EmptyState";
import { FanAccoladesBoard } from "@/components/FanAccoladesBoard";
import { FanJourneyCard } from "../FanJourneyCard";
import { WelcomeBackHero } from "../WelcomeBackHero";
import { getFanJourney } from "@/lib/fanJourney";
import type { ApiResult, Match } from "@/types";
import type { Profile, UserStats } from "@/types/database";
import styles from "@/app/page.module.css";
import { HomeFixturesSection } from "./HomeFixturesSection";

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

  return (
    <>
      <WelcomeBackHero profile={profile} stats={stats} journey={journey} />

      <section className={styles.briefingSection} id="briefing">
        <BriefingTimeZoneSync />
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

      <HomeFixturesSection
        matches={matchesResult.data}
        source={todaysResult.source}
        subtitle="Upcoming fixtures on your watchlist"
        favoriteCountry={profile.favorite_country}
        showSignoff
      />
    </>
  );
}
