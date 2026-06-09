"use client";

import Link from "next/link";
import Image, { type ImageLoaderProps } from "next/image";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "@khamudom/lumen-ui-react";
import type { Match } from "@/types";
import { getStatusLabel, getStatusBadgeVariant } from "@/services/worldCupApi";
import styles from "./MatchCard.module.css";

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

const passthroughLoader = ({ src }: ImageLoaderProps) => src;

function getDateTimeValue(date: string, time: string): string {
  const dateMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!dateMatch || !timeMatch) return `${date} ${time}`;

  const [, month, day, year] = dateMatch;
  const [, hourPart, minute, period] = timeMatch;
  const hour = parseInt(hourPart, 10);
  const normalizedHour =
    period.toUpperCase() === "PM" && hour !== 12
      ? hour + 12
      : period.toUpperCase() === "AM" && hour === 12
        ? 0
        : hour;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${String(normalizedHour).padStart(2, "0")}:${minute}`;
}

function TeamFlag({ name, flag }: { name: string; flag?: string }) {
  return (
    <div className={styles.teamFlag}>
      {flag ? (
        <Image
          loader={passthroughLoader}
          unoptimized
          src={flag}
          alt={`${name} flag`}
          className={styles.flag}
          width={140}
          height={94}
        />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden="true" />
      )}
    </div>
  );
}

function TeamInfo({
  name,
  score,
}: {
  name: string;
  score?: number;
}) {
  return (
    <div className={styles.teamInfo}>
      <span className={styles.teamName}>{name}</span>
      {score !== undefined && (
        <span className={styles.score} aria-label={`Score ${score}`}>
          {score}
        </span>
      )}
      {score !== undefined && (
        <span className="sr-only">Score {score}</span>
      )}
    </div>
  );
}

export function MatchCard({ match, featured = false }: MatchCardProps) {
  const showScore =
    match.status === "live" ||
    match.status === "finished" ||
    match.status === "halftime";

  return (
    <Card className={featured ? styles.featured : undefined}>
      <CardHeader className={styles.header}>
        <div className={styles.meta}>
          {match.group && (
            <Badge variant="outline">Group {match.group}</Badge>
          )}
          <Badge variant={getStatusBadgeVariant(match.status)}>
            {match.status === "live" && (
              <span className={styles.liveDot} aria-hidden="true" />
            )}
            {getStatusLabel(match.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.matchup}>
          <div className={styles.flagsRow}>
            <TeamFlag name={match.homeTeam.name} flag={match.homeTeam.flag} />
            <span className={styles.vs}>vs</span>
            <TeamFlag name={match.awayTeam.name} flag={match.awayTeam.flag} />
          </div>
          <div className={styles.teamsRow}>
            <TeamInfo
              name={match.homeTeam.name}
              score={showScore ? match.homeScore : undefined}
            />
            <TeamInfo
              name={match.awayTeam.name}
              score={showScore ? match.awayScore : undefined}
            />
          </div>
        </div>
        <div className={styles.details}>
          <time dateTime={getDateTimeValue(match.date, match.time)}>
            {match.date} · {match.time}
          </time>
          {match.stadiumName && (
            <span>
              {match.stadiumName}
              {match.city ? `, ${match.city}` : ""}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/matches/${match.id}`} className={styles.link}>
          <Button variant="primary">
            View Match
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
