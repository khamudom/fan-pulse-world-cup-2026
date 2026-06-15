import { Suspense } from "react";
import Link from "next/link";
import { homeHeroBackground } from "@/assets/homeHero";
import { Hero } from "@/components/display/Hero";
import { WorldCupCountdown } from "@/components/display/WorldCupCountdown";
import { SectionHeader } from "@/components/display/SectionHeader";
import {
  HomeFeatures,
  HomeGuestDataSections,
  HomeGuestSkeleton,
  HomePageSkeleton,
  HomePersonalizedAsyncView,
} from "@/features/home";
import { getProfile, getSessionUser } from "@/lib/auth";
import styles from "./page.module.css";

export default async function HomePage() {
  const user = await getSessionUser();
  const profile = user ? await getProfile(user.id) : null;

  if (user && profile?.onboarding_complete) {
    return (
      <div className={`page ${styles.homePage}`}>
        <Suspense fallback={<HomePageSkeleton />}>
          <HomePersonalizedAsyncView />
        </Suspense>
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

      <Suspense fallback={<HomeGuestSkeleton />}>
        <HomeGuestDataSections
          showBeginJourney={!profile?.onboarding_complete}
        />
      </Suspense>

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
