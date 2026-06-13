"use client";

import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import { LocalKickoff } from "@/components/LocalKickoff";
import { toIsoDate } from "@/lib/matchDate";
import type { Match, Stadium } from "@/types";
import styles from "./StadiumCard.module.css";

interface StadiumCardProps {
  stadium: Stadium;
  matches?: Match[];
  featured?: boolean;
}

function sortMatchesByKickoff(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const aKey = a.kickoffUtc ?? `${toIsoDate(a.date)}T${a.time ?? ""}`;
    const bKey = b.kickoffUtc ?? `${toIsoDate(b.date)}T${b.time ?? ""}`;
    return aKey.localeCompare(bKey);
  });
}

export function StadiumCard({
  stadium,
  matches = [],
  featured = false,
}: StadiumCardProps) {
  const sortedMatches = sortMatchesByKickoff(matches);
  const matchCount = sortedMatches.length || stadium.matchCount;

  return (
    <Card className={featured ? styles.featured : undefined}>
      <CardHeader>
        {featured && (
          <Badge className={styles.featuredBadge}>Featured Venue</Badge>
        )}
        <CardTitle as="h3">{stadium.name}</CardTitle>
        {stadium.fifaName && stadium.fifaName !== stadium.name && (
          <p className={styles.fifaName}>{stadium.fifaName}</p>
        )}
      </CardHeader>
      <CardContent>
        <dl className={styles.details}>
          <div>
            <dt>City</dt>
            <dd>
              {stadium.city}, {stadium.country}
            </dd>
          </div>
          {stadium.capacity && (
            <div>
              <dt>Capacity</dt>
              <dd>{stadium.capacity.toLocaleString()}</dd>
            </div>
          )}
          {matchCount !== undefined && matchCount > 0 && sortedMatches.length === 0 && (
            <div>
              <dt>Matches</dt>
              <dd>{matchCount}</dd>
            </div>
          )}
          {stadium.region && (
            <div>
              <dt>Region</dt>
              <dd>{stadium.region}</dd>
            </div>
          )}
        </dl>

        {sortedMatches.length > 0 && (
          <div className={styles.matchesSection}>
            <h4 className={styles.matchesHeading}>
              Matches
              <span className={styles.matchesCount}>{sortedMatches.length}</span>
            </h4>
            <ul className={styles.matchList}>
              {sortedMatches.map((match) => (
                <li key={match.id}>
                  <Link href={`/matches/${match.id}`} className={styles.matchLink}>
                    <LocalKickoff
                      className={styles.matchDate}
                      kickoffUtc={match.kickoffUtc}
                      venueTimeZone={match.venueTimeZone}
                      fallbackDate={match.date}
                      fallbackTime={match.time}
                      showVenueTime={false}
                    />
                    <span className={styles.matchTeams}>
                      {match.homeTeam.name}
                      <span className={styles.vs}>vs</span>
                      {match.awayTeam.name}
                    </span>
                    {match.group && (
                      <span className={styles.matchGroup}>Group {match.group}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
