"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Input,
  Button,
} from "@lumen-ui/react";
import type { Match } from "@/types";
import styles from "./MatchPredictionForm.module.css";

interface MatchPredictionFormProps {
  match: Match;
}

export function MatchPredictionForm({ match }: MatchPredictionFormProps) {
  const [winner, setWinner] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const teams = [match.homeTeam.name, match.awayTeam.name, "Draw"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (winner) setSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Match Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Select
              label="Winner"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              options={[
                { value: "", label: "Select winner" },
                ...teams.map((t) => ({ value: t, label: t })),
              ]}
              required
            />
          </div>
          <div className={styles.scoreRow}>
            <Input
              label={`${match.homeTeam.name} score`}
              type="number"
              min={0}
              max={20}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
            />
            <Input
              label={`${match.awayTeam.name} score`}
              type="number"
              min={0}
              max={20}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
            />
          </div>
          <Button type="submit">Submit Prediction</Button>
          {submitted && (
            <p className={styles.success} role="status">
              Prediction saved: {winner}
              {homeScore && awayScore
                ? ` (${homeScore}-${awayScore})`
                : ""}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
