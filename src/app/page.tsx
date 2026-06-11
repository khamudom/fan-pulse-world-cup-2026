import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorldCupCountdown } from "@/components/WorldCupCountdown";
import { SectionHeader } from "@/components/SectionHeader";
import { HomeFeatures } from "@/components/HomeFeatures";
import { ViewAllLink } from "@/components/ViewAllLink";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { BeginYourJourney } from "@/components/BeginYourJourney";
import { StoryToday } from "@/components/StoryToday";
import { WelcomeBackHero } from "@/components/WelcomeBackHero";
import { FanJourneyCard } from "@/components/FanJourneyCard";
import { FanAccoladesBoard } from "@/components/FanAccoladesBoard";
import { AiCompanionCard } from "@/components/AiCompanionCard";
import { BriefingSection } from "@/components/BriefingContent";
import { ProgrammeSchedule } from "@/components/ProgrammeSchedule";
import { getAuthContext } from "@/lib/auth";
import { getCachedBriefing } from "@/actions/briefing";
import { getFanJourney } from "@/lib/fanJourney";
import { toIsoDate } from "@/lib/matchDate";
import { getTodaysStory } from "@/lib/todaysStory";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import { getMatches, getTeams, getTodaysMatches } from "@/services/worldCupApi";
import type { Match } from "@/types";
import styles from "./page.module.css";

function getUpcomingProgrammeMatches(matches: Match[], limit = 12): Match[] {
  const todayIso = new Date().toISOString().slice(0, 10);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  const endIso = endDate.toISOString().slice(0, 10);

  return [...matches]
    .filter(
      (match) =>
        match.status === "scheduled" ||
        match.status === "notstarted" ||
        match.status === "live",
    )
    .sort((a, b) => {
      const dateCompare = toIsoDate(a.date).localeCompare(toIsoDate(b.date));
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .filter((match) => {
      const matchDate = toIsoDate(match.date);
      return matchDate >= todayIso && matchDate <= endIso;
    })
    .slice(0, limit);
}

export default async function HomePage() {
  const { user, profile, stats } = await getAuthContext();

  const [todaysResult, matchesResult, teamsResult] = await Promise.all([
    getTodaysMatches(),
    getMatches(),
    getTeams(),
  ]);

  const todaysStory = getTodaysStory();
  const programmeMatches = getUpcomingProgrammeMatches(matchesResult.data);

  if (user && profile?.onboarding_complete) {
    const briefing = await getCachedBriefing();
    const journey = getFanJourney(matchesResult.data, profile);

    return (
      <div className={`page ${styles.homePage}`}>
        <WelcomeBackHero profile={profile} stats={stats} journey={journey} />

        <StoryToday story={todaysStory} />

        <section className={styles.briefingSection} id="briefing">
          <div className="container">
            <div className={styles.briefingPanel}>
              <div className={styles.briefingHeader}>
                <h2 className={styles.briefingTitle}>Morning Briefing</h2>
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
              <p>
                <em>Tomorrow it changes.</em> Every day is a new chapter.
              </p>
            </footer>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`page ${styles.homePage}`}>
      <Hero
        title="The World Is Gathering."
        stats={["48 Nations.", "104 Matches.", "39 Days."]}
        tagline="One World Cup Journey."
        subtitle="Choose the nation you'll stand behind and begin your journey to the Final."
        backgroundImage="/images/soccer-background-vector.avif"
        actions={[
          {
            label: "Choose My Nation",
            href: user ? "/my-world-cup" : "/login",
            variant: "primary",
          },
          {
            label: "Explore The Tournament",
            href: "/matches",
            variant: "outline",
          },
        ]}
        aside={<WorldCupCountdown />}
      />

      {!profile?.onboarding_complete ? (
        <BeginYourJourney
          teams={teamsResult.data}
          teamsSource={teamsResult.source}
        />
      ) : null}

      <StoryToday story={todaysStory} />

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

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Everything you need for World Cup 2026"
            subtitle="One destination for schedules, predictions, insights, and fan engagement."
          />
          <HomeFeatures />
          {!user ? (
            <p className={styles.cta}>
              <Link href="/login">Sign in</Link> to unlock your personalized
              World Cup journey.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
