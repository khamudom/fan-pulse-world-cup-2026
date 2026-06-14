"use client";

import { useEffect, useMemo, useRef } from "react";
import { Hero } from "@/components/Hero";
import { MatchDateTimeline } from "@/components/MatchDateTimeline";
import { MatchCard } from "@/components/MatchCard";
import { GroupStandings } from "@/components/GroupStandings";
import { SectionHeader } from "@/components/SectionHeader";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { EmptyState } from "@/components/EmptyState";
import { toDataSourceBadge } from "@/lib/dataSourceBadge";
import {
  formatSelectedDateLabel,
  getMatchesOnDate,
  getUniqueMatchDates,
} from "@/lib/matchDate";
import { useSelectedMatchDate } from "@/lib/useSelectedMatchDate";
import type { Group, Match } from "@/types";
import styles from "./MatchesExperience.module.css";

interface MatchesExperienceProps {
  matches: Match[];
  groups: Group[];
  groupCount: number;
  matchesSource: "api" | "mock";
  groupsSource: "api" | "mock";
  initialSection?: string;
}

function getMatchesDayIntro(matchCount: number, dateLabel: string): string {
  if (matchCount === 0) {
    return `No fixtures on ${dateLabel}. Choose another date to keep following the tournament.`;
  }
  if (matchCount === 1) {
    return `One match on ${dateLabel} — a single moment in a much longer journey.`;
  }
  return `${matchCount} matches on ${dateLabel}. Scroll through the day and see who takes the stage.`;
}

export function MatchesExperience({
  matches,
  groups,
  groupCount,
  matchesSource,
  groupsSource,
  initialSection,
}: MatchesExperienceProps) {
  const groupStandingsRef = useRef<HTMLElement>(null);
  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);
  const [selectedDate, setSelectedDate, isDateReady] = useSelectedMatchDate(dates);

  const matchesOnDate = useMemo(
    () => getMatchesOnDate(matches, selectedDate),
    [matches, selectedDate]
  );

  const dateLabel = selectedDate ? formatSelectedDateLabel(selectedDate) : "";
  const sourceNote = matchesSource === "mock" ? " (fallback data)" : "";

  useEffect(() => {
    const shouldScroll =
      initialSection === "group-standings" ||
      window.location.hash === "#group-standings";
    if (!shouldScroll) return;

    const scrollToStandings = () => {
      groupStandingsRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    };

    scrollToStandings();
    const frame = requestAnimationFrame(scrollToStandings);
    return () => cancelAnimationFrame(frame);
  }, [initialSection]);

  return (
    <>
      <Hero
        title="Match Schedule"
        tagline="World Cup 2026"
        subtitle="Follow the tournament day by day — pick a date and see what unfolds."
        compact
        stats={[
          `${matches.length} matches`,
          `${groupCount} groups`,
        ]}
      />

      {matches.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Pick a day"
              subtitle="The tournament moves fast. Jump to the date you care about."
            />
            <MatchDateTimeline
              dates={dates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <SectionHeader
              title={isDateReady && dateLabel ? dateLabel : "Matches"}
              subtitle={
                isDateReady
                  ? `${matchesOnDate.length} match${matchesOnDate.length === 1 ? "" : "es"}${sourceNote}`
                  : "Loading today's matches…"
              }
              action={
                <DataSourceBadge
                  source={toDataSourceBadge(matchesSource, matches.length > 0)}
                />
              }
            />
            {isDateReady ? (
              <p className={styles.dateIntro}>
                {getMatchesDayIntro(matchesOnDate.length, dateLabel)}
              </p>
            ) : null}

            {!isDateReady ? null : matchesOnDate.length === 0 ? (
              <EmptyState
                title="No matches on this day"
                message="Try selecting another date on the timeline above."
              />
            ) : (
              <div className={styles.matchGrid}>
                {matchesOnDate.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container">
            <EmptyState
              title="No matches available"
              message="Match data isn't available yet. Check back closer to the tournament."
            />
          </div>
        </section>
      )}

      <section
        ref={groupStandingsRef}
        id="group-standings"
        className={`section sectionAlt ${styles.groupStandingsSection}`}
      >
        <div className="container">
          <SectionHeader
            title="Group Standings"
            subtitle="See who's leading the race to the knockout stage."
            action={
              <DataSourceBadge
                source={toDataSourceBadge(groupsSource, groups.length > 0)}
              />
            }
          />
          {groups.length > 0 ? (
            <GroupStandings groups={groups} />
          ) : (
            <EmptyState
              title="No group standings available"
              message="Standings will appear here once the group stage begins."
            />
          )}
        </div>
      </section>
    </>
  );
}
