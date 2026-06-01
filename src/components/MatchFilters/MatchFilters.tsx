"use client";

import { useMemo, useState } from "react";
import { Input, Select } from "@khamudom/lumen-ui-react";
import { MatchCard } from "@/components/MatchCard";
import { EmptyState } from "@/components/EmptyState";
import { isMatchOnDate } from "@/lib/matchDate";
import type { Match } from "@/types";
import styles from "./MatchFilters.module.css";

interface MatchFiltersProps {
  matches: Match[];
  groups: string[];
  teams: string[];
  stadiums: string[];
  selectedDate: string;
}

export function MatchFilters({
  matches,
  groups,
  teams,
  stadiums,
  selectedDate,
}: MatchFiltersProps) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [team, setTeam] = useState("");
  const [stadium, setStadium] = useState("");

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        m.homeTeam.name.toLowerCase().includes(searchLower) ||
        m.awayTeam.name.toLowerCase().includes(searchLower) ||
        m.stadiumName?.toLowerCase().includes(searchLower);

      const matchesGroup = !group || m.group === group;
      const matchesTeam =
        !team ||
        m.homeTeam.name === team ||
        m.awayTeam.name === team;
      const matchesStadium = !stadium || m.stadiumName === stadium;
      const matchesDate =
        !selectedDate || isMatchOnDate(m.date, selectedDate);

      return matchesSearch && matchesGroup && matchesTeam && matchesStadium && matchesDate;
    });
  }, [matches, search, group, team, stadium, selectedDate]);

  return (
    <div>
      <div className={styles.filters} role="search">
        <Input
          label="Search matches"
          placeholder="Team or stadium…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
        />
        <Select
          label="Group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          options={[
            { value: "", label: "All groups" },
            ...groups.map((g) => ({ value: g, label: `Group ${g}` })),
          ]}
        />
        <Select
          label="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          options={[
            { value: "", label: "All teams" },
            ...teams.map((t) => ({ value: t, label: t })),
          ]}
        />
        <Select
          label="Stadium"
          value={stadium}
          onChange={(e) => setStadium(e.target.value)}
          options={[
            { value: "", label: "All stadiums" },
            ...stadiums.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matches found"
          message="Try adjusting your filters or search term."
          actionLabel="Clear filters"
          actionHref="/matches"
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
