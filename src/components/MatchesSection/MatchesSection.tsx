"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchDateTimeline } from "@/components/MatchDateTimeline";
import { MatchFilters } from "@/components/MatchFilters";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import {
  formatSelectedDateLabel,
  getDefaultSelectedDate,
  getUniqueMatchDates,
  isMatchOnDate,
} from "@/lib/matchDate";
import type { Match } from "@/types";

interface MatchesSectionProps {
  matches: Match[];
  groups: string[];
  teams: string[];
  stadiums: string[];
  source: "api" | "mock";
}

export function MatchesSection({
  matches,
  groups,
  teams,
  stadiums,
  source,
}: MatchesSectionProps) {
  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);
  const [selectedDate, setSelectedDate] = useState(() =>
    getDefaultSelectedDate(dates)
  );

  const matchesOnDate = useMemo(
    () => matches.filter((match) => isMatchOnDate(match.date, selectedDate)),
    [matches, selectedDate]
  );

  const subtitle = selectedDate
    ? `${matchesOnDate.length} match${matchesOnDate.length === 1 ? "" : "es"} · ${formatSelectedDateLabel(selectedDate)}${source === "mock" ? " (fallback data)" : ""}`
    : `${matches.length} matches${source === "mock" ? " (fallback data)" : ""}`;

  return (
    <>
      <MatchDateTimeline
        dates={dates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <SectionHeader
        title="All Matches"
        subtitle={subtitle}
        action={
          <DataSourceBadge
            source={
              matches.length === 0
                ? "unavailable"
                : source === "mock"
                  ? "mock"
                  : "api"
            }
          />
        }
      />
      <MatchFilters
        matches={matches}
        groups={groups}
        teams={teams}
        stadiums={stadiums}
        selectedDate={selectedDate}
      />
    </>
  );
}
