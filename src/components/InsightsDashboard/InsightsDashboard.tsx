"use client";

import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { MetricCard } from "@/components/MetricCard";
import { FanConfidenceMeter } from "@/components/FanConfidenceMeter";
import { Timeline } from "@/components/Timeline";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@lumen-ui/react";
import {
  mockDashboardMetrics,
  mockFanSentiment,
  mockTrendingTeams,
  mockGroupAnalysis,
  mockMatchInsights,
  mockHostCityInsights,
  mockTimeline,
  tournamentOverview,
} from "@/data/mockAnalytics";
import { mockTournamentInsights } from "@/data/mockInsights";
import { mockPredictionTrends } from "@/data/mockPredictions";
import {
  mockGoldenBootRace,
  mockTopScorers,
  mockMostAssists,
  mockDiscussedPlayers,
} from "@/data/mockPlayers";
import type { Stadium } from "@/types";
import styles from "./InsightsDashboard.module.css";

interface InsightsDashboardProps {
  featuredStadium?: Stadium;
  stadiumSource?: "api" | "mock";
  showPrototypeData?: boolean;
}

function PlayerSection({
  title,
  players,
}: {
  title: string;
  players: { id: string; name: string; team: string; stat: string; value: string | number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className={styles.playerList}>
          {players.map((p, i) => (
            <li key={p.id}>
              <span className={styles.rank}>{i + 1}</span>
              <span>
                <strong>{p.name}</strong> ({p.team})
              </span>
              <span className={styles.playerStat}>
                {p.stat}: {p.value}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function InsightsDashboard({
  featuredStadium,
  stadiumSource = "api",
  showPrototypeData = true,
}: InsightsDashboardProps) {
  return (
    <>
      <Hero
        title="World Cup Insights"
        subtitle="Explore trends, predictions, fan sentiment, and tournament storylines."
        compact
      >
        {showPrototypeData ? (
          <div className={styles.overviewBadges}>
            <Badge variant="outline">Stage: {tournamentOverview.stage}</Badge>
            <Badge variant="outline">
              Matches played: {tournamentOverview.matchesPlayed}
            </Badge>
            <Badge variant="outline">
              Teams remaining: {tournamentOverview.teamsRemaining}
            </Badge>
            <Badge variant="outline">
              Fan predictions: {(tournamentOverview.totalPredictions / 1000).toFixed(1)}K
            </Badge>
          </div>
        ) : null}
      </Hero>

      {showPrototypeData ? (
        <>
      <section className="section">
        <div className="container">
          <SectionHeader title="Tournament Overview" />
          <div className={styles.metricGrid}>
            {mockDashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <div className={styles.twoCol}>
            <FanConfidenceMeter title="Fan Sentiment" items={mockFanSentiment} />
            <Card>
              <CardHeader>
                <CardTitle as="h2">Trending Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={styles.trendList}>
                  {mockTrendingTeams.map((team) => (
                    <li key={team.id} className={styles.trendItem}>
                      <div>
                        <strong>{team.name}</strong>
                        <span className={styles.change}>{team.popularityChange}</span>
                      </div>
                      <div className={styles.trendMeta}>
                        <span>Confidence {team.fanConfidence}%</span>
                        <span>Picked {team.predictionPercentage}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Prediction Trends" />
          <div className={styles.insightGrid}>
            {Object.entries(mockPredictionTrends).map(([key, value]) => (
              <Card key={key}>
                <CardContent>
                  <p className={styles.insightLabel}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  </p>
                  <p className={styles.insightValue}>{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <SectionHeader title="AI Tournament Insights" />
          <div className={styles.aiGrid}>
            {mockTournamentInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <Badge variant="secondary">{insight.category}</Badge>
                  <CardTitle as="h3">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{insight.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Group Analysis" />
          <div className={styles.analysisGrid}>
            <Card>
              <CardHeader>
                <CardTitle as="h3">Group Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={styles.leaderList}>
                  {mockGroupAnalysis.leaders.map((g) => (
                    <li key={g.group}>
                      Group {g.group}: {g.leader}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p>
                  <strong>Most competitive:</strong> {mockGroupAnalysis.mostCompetitive}
                </p>
                <p>
                  <strong>Highest scoring:</strong> {mockGroupAnalysis.highestScoring}
                </p>
                <p>
                  <strong>Most surprising:</strong> {mockGroupAnalysis.mostSurprising}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <SectionHeader title="Match Insights" />
          <div className={styles.insightGrid}>
            {Object.entries(mockMatchInsights).map(([key, value]) => (
              <Card key={key}>
                <CardContent>
                  <p className={styles.insightLabel}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className={styles.insightValue}>{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Player Storylines" />
          <div className={styles.playerGrid}>
            <PlayerSection title="Golden Boot Race" players={mockGoldenBootRace} />
            <PlayerSection title="Top Scorers" players={mockTopScorers} />
            <PlayerSection title="Most Assists" players={mockMostAssists} />
            <PlayerSection title="Most Discussed" players={mockDiscussedPlayers} />
          </div>
        </div>
      </section>
        </>
      ) : null}

      <section className={showPrototypeData ? "section sectionAlt" : "section"}>
        <div className="container">
          <SectionHeader
            title="Host City Insights"
            action={
              <DataSourceBadge
                source={
                  featuredStadium
                    ? stadiumSource === "mock"
                      ? "mock"
                      : "api"
                    : "unavailable"
                }
              />
            }
          />
          {featuredStadium ? (
            <div className={styles.insightGrid}>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Featured stadium</p>
                  <p className={styles.insightValue}>{featuredStadium.name}</p>
                  <p className={styles.subtext}>
                    {featuredStadium.city}, {featuredStadium.country}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Capacity</p>
                  <p className={styles.insightValue}>
                    {featuredStadium.capacity?.toLocaleString() ?? "—"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Matches at venue</p>
                  <p className={styles.insightValue}>
                    {featuredStadium.matchCount ?? "—"}
                  </p>
                </CardContent>
              </Card>
              {featuredStadium.fifaName ? (
                <Card>
                  <CardContent>
                    <p className={styles.insightLabel}>FIFA name</p>
                    <p className={styles.insightValue}>{featuredStadium.fifaName}</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="No stadium data available"
              message="The World Cup API returned no stadium data."
            />
          )}
          {showPrototypeData ? (
            <div className={`${styles.insightGrid} ${styles.prototypeExtras}`}>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Most active host city</p>
                  <p className={styles.insightValue}>{mockHostCityInsights.mostActiveCity}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Highest scoring stadium</p>
                  <p className={styles.insightValue}>
                    {mockHostCityInsights.highestScoringStadium}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className={styles.insightLabel}>Upcoming featured venue</p>
                  <p className={styles.insightValue}>{mockHostCityInsights.upcomingVenue}</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </section>

      {showPrototypeData ? (
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Tournament Timeline"
            action={<DataSourceBadge source="prototype" />}
          />
          <Timeline events={mockTimeline} />
        </div>
      </section>
      ) : null}
    </>
  );
}
