"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchPredictionForm } from "@/components/MatchPredictionForm";
import { AiInsightCard } from "@/components/AiInsightCard";
import { ArticleCard } from "@/components/ArticleCard";
import { getLiveMatch } from "@/actions/liveMatch";
import { contentData, getMatchComparison } from "@/services/contentApi";
import { getStatusLabel, getStatusBadgeVariant } from "@/services/worldCupApi";
import type { Match } from "@/types";
import styles from "./MatchDetailView.module.css";

const LIVE_POLL_INTERVAL_MS = 60000;

function formatInterval(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? "1 min" : `${minutes} mins`;
  }
  return `${seconds}s`;
}

function isLiveStatus(status: Match["status"]): boolean {
  return status === "live" || status === "halftime";
}

function formatUpdatedTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

const mockMatchInsights = contentData.matchInsights;
const mockArticles = contentData.articles;

interface MatchDetailViewProps {
  match: Match;
  matchSource?: "api" | "mock";
  showPrototypeData?: boolean;
  isSignedIn?: boolean;
  userPrediction?: { home: number; away: number } | null;
}

export function MatchDetailView({
  match: initialMatch,
  matchSource = "api",
  showPrototypeData = true,
  isSignedIn = false,
  userPrediction = null,
}: MatchDetailViewProps) {
  const [match, setMatch] = useState(initialMatch);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isLive = isLiveStatus(match.status);
  const showScore =
    match.status === "live" ||
    match.status === "finished" ||
    match.status === "halftime";

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const latest = await getLiveMatch(initialMatch.id);
      if (latest) {
        setMatch(latest);
        setLastUpdated(new Date());
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [initialMatch.id]);

  useEffect(() => {
    if (!isLive) return;

    let timer: number | undefined;

    const startPolling = () => {
      if (timer === undefined) {
        timer = window.setInterval(refresh, LIVE_POLL_INTERVAL_MS);
      }
    };

    const stopPolling = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Pull the latest immediately on return, then resume polling.
        void refresh();
        startPolling();
      } else {
        stopPolling();
      }
    };

    if (document.visibilityState === "visible") {
      startPolling();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopPolling();
    };
  }, [isLive, refresh]);

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
            <p
              className={styles.scoreline}
              aria-label={`Score: ${match.homeTeam.name} ${match.homeScore}, ${match.awayTeam.name} ${match.awayScore}`}
            >
              <span className={styles.scoreSide}>
                <span className={styles.scoreTeam}>{match.homeTeam.name}</span>
                <span className={styles.scoreValue}>{match.homeScore}</span>
              </span>
              <span className={styles.scoreDash} aria-hidden="true">
                –
              </span>
              <span className={styles.scoreSide}>
                <span className={styles.scoreValue}>{match.awayScore}</span>
                <span className={styles.scoreTeam}>{match.awayTeam.name}</span>
              </span>
            </p>
          )}
          {match.group && <Badge variant="outline">Group {match.group}</Badge>}
        </div>

        {isLive && (
          <div className={styles.liveBar}>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} aria-hidden="true" />
              Live
            </span>
            <Button
              variant="outline"
              loading={isRefreshing}
              onClick={refresh}
              aria-label="Get the latest score"
            >
              Get latest
            </Button>
            <span className={styles.updatedAt} aria-live="polite">
              {lastUpdated
                ? `Updated ${formatUpdatedTime(lastUpdated)}`
                : `Auto-updating every ${formatInterval(LIVE_POLL_INTERVAL_MS)}`}
            </span>
          </div>
        )}
      </Hero>

      {showPrototypeData ? (
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
      ) : null}

      {isSignedIn || showPrototypeData ? (
        <section className="section sectionAlt">
          <div className="container">
            <SectionHeader
              title="Predictions & AI"
              action={<DataSourceBadge source="local" />}
            />
            <div className={styles.twoCol}>
              <MatchPredictionForm
                match={match}
                isSignedIn={isSignedIn}
                initialPrediction={userPrediction}
              />
              {showPrototypeData ? (
                <AiInsightCard
                  title="AI Match Explainer"
                  prompts={Object.keys(mockMatchInsights)}
                  matchId={match.id}
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {showPrototypeData ? (
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
      ) : null}
    </>
  );
}
