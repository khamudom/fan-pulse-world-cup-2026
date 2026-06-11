"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@khamudom/lumen-ui-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { FanJourneyResult } from "@/lib/fanJourney";
import { formatCountdownLabel } from "@/lib/fanJourney";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import styles from "./FanJourneyCard.module.css";

interface FanJourneyCardProps {
  journey: FanJourneyResult;
  favoriteCountry?: string | null;
  matchesSource?: ApiDataSource;
}

function CardSourceBadge({
  matchesSource,
  hasMatch,
}: {
  matchesSource: ApiDataSource;
  hasMatch: boolean;
}) {
  return (
    <DataSourceBadge source={toDataSourceBadge(matchesSource, hasMatch)} />
  );
}

export function FanJourneyCard({
  journey,
  favoriteCountry,
  matchesSource = "api",
}: FanJourneyCardProps) {
  if (!favoriteCountry) {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle as="h2">Your Fan Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.message}>
            Pick your favorite country to get a personalized countdown to your team&apos;s
            next match.
          </p>
          <Link href="/my-world-cup">
            <Button variant="primary">Set up My World Cup</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!journey.nextMatch || !journey.countdown) {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle as="h2">Your Fan Journey</CardTitle>
          <CardSourceBadge matchesSource={matchesSource} hasMatch={false} />
        </CardHeader>
        <CardContent>
          <p className={styles.team}>{favoriteCountry}</p>
          <p className={styles.message}>{journey.label}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle as="h2">Live Data</CardTitle>
        <CardSourceBadge matchesSource={matchesSource} hasMatch />
      </CardHeader>
      <CardContent>
        <p className={styles.countdown} aria-live="polite">
          {formatCountdownLabel(journey.countdown)}
        </p>
        <p className={styles.matchLabel}>{journey.label}</p>
        <p className={styles.meta}>
          {journey.nextMatch.date} · {journey.nextMatch.time}
          {journey.nextMatch.stadiumName ? ` · ${journey.nextMatch.stadiumName}` : ""}
        </p>
        <Link href={`/matches/${journey.nextMatch.id}`}>
          <Button variant="primary">Open match centre</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
