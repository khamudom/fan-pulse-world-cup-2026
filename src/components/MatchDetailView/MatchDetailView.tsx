"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@lumen-ui/react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { AiInsightCard } from "@/components/AiInsightCard";
import { ArticleCard } from "@/components/ArticleCard";
import { mockMatchInsights } from "@/data/mockInsights";
import { mockArticles } from "@/data/mockArticles";
import { getStatusLabel, getStatusBadgeVariant } from "@/services/worldCupApi";
import type { Match } from "@/types";
import styles from "./MatchDetailView.module.css";

const mockComparison = {
  form: ["W", "W", "D", "W", "L"],
  goalsScored: 8,
  fanConfidence: 72,
  keyPlayer: "Star Forward",
};

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
                action={<DataSourceBadge source="prototype" />}
              />
              <div className={styles.comparisonGrid}>
                {[match.homeTeam, match.awayTeam].map((team, i) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle as="h3">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className={styles.stats}>
                        <div>
                          <dt>Recent form</dt>
                          <dd>
                            <span className={styles.form}>
                              {mockComparison.form.map((r, idx) => (
                                <span key={idx} className={styles[`form_${r}`]}>
                                  {r}
                                </span>
                              ))}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt>Goals scored (tournament)</dt>
                          <dd>{mockComparison.goalsScored - i}</dd>
                        </div>
                        <div>
                          <dt>Fan confidence</dt>
                          <dd>{mockComparison.fanConfidence - i * 5}%</dd>
                        </div>
                        <div>
                          <dt>Key player</dt>
                          <dd>{mockComparison.keyPlayer}</dd>
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
                action={<DataSourceBadge source="prototype" />}
              />
              <div className={styles.twoCol}>
                <MatchPredictionForm match={match} />
                <AiInsightCard
                  title="AI Match Explainer"
                  prompts={Object.keys(mockMatchInsights)}
                  responses={mockMatchInsights}
                />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHeader
                title="Related Stories"
                action={<DataSourceBadge source="prototype" />}
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
