import { Hero } from "@/components/Hero";
import { WorldCupCountdown } from "@/components/WorldCupCountdown";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { HomeFeatures } from "@/components/HomeFeatures";
import { ViewAllLink } from "@/components/ViewAllLink";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  getFeaturedMatch,
  getTodaysMatches,
} from "@/services/worldCupApi";
import styles from "./page.module.css";

function getBadgeSource(source: "api" | "mock", hasData: boolean) {
  if (!hasData) return "unavailable" as const;
  return source === "mock" ? "mock" : "api";
}

function isMatchOnDate(date: string, targetIsoDate: string): boolean {
  if (!date) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date === targetIsoDate;

  const match = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return false;
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` === targetIsoDate;
}

export default async function HomePage() {
  const [featuredResult, todaysResult] = await Promise.all([
    getFeaturedMatch(),
    getTodaysMatches(),
  ]);

  const featured = featuredResult.data;
  const todays = todaysResult.data.slice(0, 4);
  const todayIsoDate = new Date().toISOString().slice(0, 10);
  const hasActualTodayMatches = todays.some((m) => isMatchOnDate(m.date, todayIsoDate));
  const matchSectionTitle = hasActualTodayMatches ? "Today's Matches" : "Upcoming Matches";
  const matchSectionSubtitle = hasActualTodayMatches
    ? "Catch up on what's happening today."
    : "No fixtures today — showing the next scheduled matches.";

  return (
    <div className="page">
      <Hero
        title="World Cup FanPulse"
        subtitle="Your companion experience for the FIFA World Cup 2026."
        actions={[
          { label: "Explore FanPulse", href: "/fanpulse", variant: "primary" },
          { label: "View Insights", href: "/insights", variant: "outline" },
        ]}
        aside={<WorldCupCountdown />}
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Featured Match"
            subtitle="Don't miss the biggest fixture on the schedule."
            action={
              <DataSourceBadge
                source={getBadgeSource(featuredResult.source, Boolean(featured))}
              />
            }
          />
          {featured ? (
            <div className={styles.featuredWrap}>
              <MatchCard match={featured} featured />
            </div>
          ) : (
            <EmptyState
              title="No featured match"
              message={
                featuredResult.error ??
                "The World Cup API returned no match data."
              }
            />
          )}
          {featuredResult.source === "mock" && (
            <p className={styles.dataNote}>
              Showing fallback data — live API unavailable.
            </p>
          )}
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
                  source={getBadgeSource(todaysResult.source, todays.length > 0)}
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
        </div>
      </section>
    </div>
  );
}
