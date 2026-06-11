import Image from "next/image";
import Link from "next/link";
import { toIsoDate } from "@/lib/matchDate";
import type { Match } from "@/types";
import styles from "./ProgrammeSchedule.module.css";

function formatProgrammeDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();
}

function groupMatchesByDate(matches: Match[]): Map<string, Match[]> {
  const groups = new Map<string, Match[]>();

  for (const match of matches) {
    const iso = toIsoDate(match.date);
    const existing = groups.get(iso) ?? [];
    existing.push(match);
    groups.set(iso, existing);
  }

  return new Map(
    [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
}

function isUserTeamMatch(match: Match, favoriteCountry?: string | null): boolean {
  if (!favoriteCountry) return false;
  return (
    match.homeTeam.name === favoriteCountry ||
    match.awayTeam.name === favoriteCountry
  );
}

interface ProgrammeScheduleProps {
  matches: Match[];
  favoriteCountry?: string | null;
}

export function ProgrammeSchedule({
  matches,
  favoriteCountry,
}: ProgrammeScheduleProps) {
  const grouped = groupMatchesByDate(matches);

  if (grouped.size === 0) return null;

  return (
    <div className={styles.schedule}>
      {[...grouped.entries()].map(([isoDate, dayMatches]) => (
        <section key={isoDate} className={styles.dayGroup}>
          <h3 className={styles.dayDivider}>{formatProgrammeDay(isoDate)}</h3>
          <ul className={styles.matchList}>
            {dayMatches.map((match) => {
              const isYourTeam = isUserTeamMatch(match, favoriteCountry);

              return (
                <li key={match.id}>
                  <article
                    className={`${styles.matchRow} ${
                      isYourTeam ? styles.matchRowHighlight : ""
                    }`}
                  >
                    <time className={styles.matchTime} dateTime={match.time}>
                      {match.time}
                    </time>

                    <div className={styles.matchTeams}>
                      <div className={styles.team}>
                        {match.homeTeam.flag ? (
                          <Image
                            unoptimized
                            src={match.homeTeam.flag}
                            alt=""
                            width={28}
                            height={19}
                            className={styles.flag}
                          />
                        ) : (
                          <span className={styles.flagPlaceholder} aria-hidden />
                        )}
                        <span className={styles.teamName}>
                          {match.homeTeam.name}
                        </span>
                        {isYourTeam &&
                        match.homeTeam.name === favoriteCountry ? (
                          <span className={styles.yourTeamTag}>Your Team</span>
                        ) : null}
                      </div>

                      <span className={styles.vs}>vs</span>

                      <div className={styles.team}>
                        {match.awayTeam.flag ? (
                          <Image
                            unoptimized
                            src={match.awayTeam.flag}
                            alt=""
                            width={28}
                            height={19}
                            className={styles.flag}
                          />
                        ) : (
                          <span className={styles.flagPlaceholder} aria-hidden />
                        )}
                        <span className={styles.teamName}>
                          {match.awayTeam.name}
                        </span>
                        {isYourTeam &&
                        match.awayTeam.name === favoriteCountry ? (
                          <span className={styles.yourTeamTag}>Your Team</span>
                        ) : null}
                      </div>
                    </div>

                    <p className={styles.venue}>
                      {match.stadiumName}
                      {match.city ? `, ${match.city}` : ""}
                    </p>

                    <Link href={`/matches/${match.id}`} className={styles.preview}>
                      Preview
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
