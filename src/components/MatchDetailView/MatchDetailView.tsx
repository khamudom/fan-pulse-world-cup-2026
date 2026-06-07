"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { AiInsightCard } from "@/components/AiInsightCard";
import { ArticleCard } from "@/components/ArticleCard";
import { contentData, getMatchComparison } from "@/services/contentApi";
import { getStatusLabel, getStatusBadgeVariant } from "@/services/worldCupApi";
import type { Match } from "@/types";
import styles from "./MatchDetailView.module.css";

const mockMatchInsights = contentData.matchInsights;
const mockArticles = contentData.articles;

interface MatchDetailViewProps {
  match: Match;
  matchSource?: "api" | "mock";
  showPrototypeData?: boolean;
}

export function MatchDetailView({
  match,
  matchSource = "api",
  showPrototypeData = true,
}: MatchDetailViewProps) {
  const showScore =
    match.status === "live" ||
    match.status === "finished" ||
    match.status === "halftime";

  const comparisons = getMatchComparison(
    match.id,
    match.homeTeam.name,
    match.awayTeam.name,
  ).data;

  return (
    <>
      <Hero
        title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        subtitle={`${match.date} · ${match.time}${match.stadiumName ? ` · ${match.stadiumName}` : ""}`}
        compact
      >
        <div className={styles.heroMeta}>
          <DataSourceBadge source={matchSource === "mock" ? "mock" : "api"} />
          <Badge variant={getStatusBadgeVariant(match.status)}>
            {getStatusLabel(match.status)}
          </Badge>
          {showScore && (
            <p className={styles.scoreline} aria-label="Match score">
              {match.homeScore} – {match.awayScore}
            </p>
          )}
          {match.group && <Badge variant="outline">Group {match.group}</Badge>}
        </div>
      </Hero>

      {showPrototypeData ? (
        <>
          <section className="section">
            <div className="container">
              <SectionHeader
                title="Team Comparison"
                action={<DataSourceBadge source="local" />}
              />
              <div className={styles.comparisonGrid}>
                {comparisons.map((stats) => (
                  <Card key={stats.teamId}>
                    <CardHeader>
                      <CardTitle as="h3">{stats.teamName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className={styles.stats}>
                        <div>
                          <dt>Recent form</dt>
                          <dd>
                            <span className={styles.form}>
                              {stats.form.map((r, idx) => (
                                <span key={idx} className={styles[`form_${r}`]}>
                                  {r}
                                </span>
                              ))}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt>Goals scored (tournament)</dt>
                          <dd>{stats.goalsScored}</dd>
                        </div>
                        <div>
                          <dt>Fan confidence</dt>
                          <dd>{stats.fanConfidence}%</dd>
                        </div>
                        <div>
                          <dt>Key player</dt>
                          <dd>{stats.keyPlayer}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="section sectionAlt">
            <div className="container">
              <SectionHeader
                title="Predictions & AI"
                action={<DataSourceBadge source="local" />}
              />
              <div className={styles.twoCol}>
                <MatchPredictionForm match={match} />
                <AiInsightCard
                  title="AI Match Explainer"
                  prompts={Object.keys(mockMatchInsights)}
                />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHeader
                title="Related Stories"
                action={<DataSourceBadge source="local" />}
              />
              <div className={styles.storyGrid}>
                {mockArticles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
