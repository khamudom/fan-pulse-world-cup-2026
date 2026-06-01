import { Hero } from "@/components/Hero";
import { SponsorBadge } from "@/components/SponsorBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { PollCard } from "@/components/PollCard";
import { PredictionCard } from "@/components/PredictionCard";
import { AiInsightCard } from "@/components/AiInsightCard";
import { FanConfidenceMeter } from "@/components/FanConfidenceMeter";
import { GroupStandings } from "@/components/GroupStandings";
import { ArticleCard } from "@/components/ArticleCard";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { worldCupWinnerPoll } from "@/data/mockPolls";
import { mockFanSentiment } from "@/data/mockAnalytics";
import { mockArticles } from "@/data/mockArticles";
import {
  getTodaysMatches,
  getGroups,
} from "@/services/worldCupApi";
import styles from "./page.module.css";

export const metadata = {
  title: "FanPulse Hub",
};

function getApiBadgeSource(
  source: "api" | "mock",
  hasData: boolean
): "api" | "mock" | "unavailable" {
  if (!hasData) return "unavailable";
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

export default async function FanPulsePage() {
  const [matchesResult, groupsResult] = await Promise.all([
    getTodaysMatches(),
    getGroups(),
  ]);

  const matches = matchesResult.data.slice(0, 6);
  const groups = groupsResult.data;
  const todayIsoDate = new Date().toISOString().slice(0, 10);
  const hasActualTodayMatches = matches.some((m) => isMatchOnDate(m.date, todayIsoDate));
  const matchSectionTitle = hasActualTodayMatches ? "Today's Matches" : "Upcoming Matches";

  return (
    <div className="page">
      <Hero
        title="World Cup FanPulse"
        subtitle="Your live fan dashboard for matches, polls, predictions, and tournament pulse."
        compact
      >
        <SponsorBadge sponsor="Global Connect" />
      </Hero>

      <section className="section">
        <div className="container">
          <SectionHeader
            title={matchSectionTitle}
            action={
              <DataSourceBadge
                source={getApiBadgeSource(matchesResult.source, matches.length > 0)}
              />
            }
          />
          {matches.length > 0 ? (
            <div className={styles.matchGrid}>
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matches available"
              message="The World Cup API returned no match data."
            />
          )}
        </div>
      </section>

      {USE_PROTOTYPE_DATA ? (
        <section className="section sectionAlt">
          <div className="container">
            <SectionHeader
              title="Fan Engagement"
              action={<DataSourceBadge source="prototype" />}
            />
            <div className={styles.dashboardGrid}>
              <PollCard poll={worldCupWinnerPoll} />
              <PredictionCard />
              <AiInsightCard />
              <FanConfidenceMeter items={mockFanSentiment} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Group Standings"
            action={
              <DataSourceBadge
                source={getApiBadgeSource(groupsResult.source, groups.length > 0)}
              />
            }
          />
          {groups.length > 0 ? (
            <GroupStandings groups={groups} />
          ) : (
            <EmptyState
              title="No group standings available"
              message="The World Cup API returned no group data."
            />
          )}
        </div>
      </section>

      {USE_PROTOTYPE_DATA ? (
        <section className="section sectionAlt">
          <div className="container">
            <SectionHeader
              title="Latest Stories"
              action={<DataSourceBadge source="prototype" />}
            />
            <div className={styles.storyGrid}>
              {mockArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
