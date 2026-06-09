import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorldCupCountdown } from "@/components/WorldCupCountdown";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
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
import { getAuthContext } from "@/lib/auth";
import { getCompanionGreeting, getCachedBriefing } from "@/actions/briefing";
import { getFanJourney } from "@/lib/fanJourney";
import { getTodaysStory } from "@/lib/todaysStory";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import { getMatches, getTeams, getTodaysMatches } from "@/services/worldCupApi";
import styles from "./page.module.css";

function isMatchOnDate(date: string, targetIsoDate: string): boolean {
  if (!date) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date === targetIsoDate;

  const match = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return false;
  const [, month, day, year] = match;
  return (
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` ===
    targetIsoDate
  );
}

export default async function HomePage() {
  const { user, profile, stats } = await getAuthContext();

  const [todaysResult, matchesResult, teamsResult] = await Promise.all([
    getTodaysMatches(),
    getMatches(),
    getTeams(),
  ]);

  const todays = todaysResult.data.slice(0, 4);
  const todayIsoDate = new Date().toISOString().slice(0, 10);
  const hasActualTodayMatches = todays.some((m) =>
    isMatchOnDate(m.date, todayIsoDate),
  );
  const matchSectionTitle = hasActualTodayMatches
    ? "Today's Matches"
    : "Upcoming Matches";
  const matchSectionSubtitle = hasActualTodayMatches
    ? "Catch up on what's happening today."
    : "No fixtures today — showing the next scheduled matches.";

  const todaysStory = getTodaysStory();

  if (user && profile?.onboarding_complete) {
    const [greeting, briefing] = await Promise.all([
      getCompanionGreeting(),
      getCachedBriefing(),
    ]);
    const journey = getFanJourney(matchesResult.data, profile);

    return (
      <div className="page">
        <WelcomeBackHero profile={profile} stats={stats} greeting={greeting} />

        <StoryToday story={todaysStory} />

        <section className="section" id="briefing">
          <div className="container">
            <SectionHeader
              title="Morning Briefing"
              subtitle="Your personalized 3-minute read — yesterday's results, today's storylines, and what matters for your team."
              action={<DataSourceBadge source="local" />}
            />
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
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.personalGrid}>
              <FanJourneyCard
                journey={journey}
                favoriteCountry={profile.favorite_country}
                matchesSource={matchesResult.source}
              />
              <FanAccoladesBoard stats={stats} variant="compact" />
              <AiCompanionCard />
            </div>
          </div>
        </section>

        <section className="section sectionAlt">
          <div className="container">
            <SectionHeader
              title={matchSectionTitle}
              subtitle={matchSectionSubtitle}
              action={
                <div className={styles.sectionActions}>
                  <DataSourceBadge
                    source={toDataSourceBadge(
                      todaysResult.source,
                      todays.length > 0,
                    )}
                  />
                  <ViewAllLink href="/matches" label="View all matches" />
                </div>
              }
            />
            {todays.length > 0 ? (
              <div className={styles.matchGrid}>
                {todays.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matches to show"
                message="No matches scheduled for today."
                actionLabel="Browse all matches"
                actionHref="/matches"
              />
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
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

      <section className="section sectionAlt">
        <div className="container">
          <SectionHeader
            title={matchSectionTitle}
            subtitle={matchSectionSubtitle}
            action={
              <div className={styles.sectionActions}>
                <DataSourceBadge
                  source={toDataSourceBadge(
                    todaysResult.source,
                    todays.length > 0,
                  )}
                />
                <ViewAllLink href="/matches" label="View all matches" />
              </div>
            }
          />
          {todays.length > 0 ? (
            <div className={styles.matchGrid}>
              {todays.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matches to show"
              message={
                todaysResult.error ??
                "No matches scheduled for today and no upcoming fixtures from the API."
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
