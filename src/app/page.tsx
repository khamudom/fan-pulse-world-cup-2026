import Link from "next/link";
import { homeHeroBackground } from "@/assets/homeHero";
import { Hero } from "@/components/Hero";
import { WorldCupCountdown } from "@/components/WorldCupCountdown";
import { SectionHeader } from "@/components/SectionHeader";
import { HomeFeatures } from "@/components/HomeFeatures";
import {
  HomeGuestAsyncSections,
  HomePersonalizedView,
} from "@/components/HomePage";
import { getCachedBriefing } from "@/actions/briefing";
import { getAuthContext } from "@/lib/auth";
import { getMatches, getTeams, getTodaysMatches } from "@/services/worldCupApi";
import styles from "./page.module.css";

export default async function HomePage() {
  const [
    { user, profile, stats },
    matchesResult,
    todaysResult,
    teamsResult,
    briefing,
  ] = await Promise.all([
    getAuthContext(),
    getMatches(),
    getTodaysMatches(),
    getTeams(),
    getCachedBriefing(),
  ]);

  if (user && profile?.onboarding_complete) {
    return (
      <div className={`page ${styles.homePage}`}>
        <HomePersonalizedView
          profile={profile}
          stats={stats}
          matchesResult={matchesResult}
          todaysResult={todaysResult}
          briefing={briefing}
        />
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
        backgroundImage={homeHeroBackground}
        actions={
          user
            ? [
                {
                  label: "Choose My Nation",
                  href: "/my-world-cup",
                  variant: "primary",
                },
                {
                  label: "Explore The Tournament",
                  href: "/matches",
                  variant: "outline",
                },
              ]
            : []
        }
        aside={<WorldCupCountdown />}
      />

      <HomeGuestAsyncSections
        showBeginJourney={!profile?.onboarding_complete}
        teamsResult={teamsResult}
        matchesResult={matchesResult}
        todaysResult={todaysResult}
      />

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
