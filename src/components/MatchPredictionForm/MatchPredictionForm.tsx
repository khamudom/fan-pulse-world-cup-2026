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
} from "@khamudom/lumen-ui-react";
import type { Match } from "@/types";
import { savePrediction } from "@/actions/points";
import styles from "./MatchPredictionForm.module.css";

interface MatchPredictionFormProps {
  match: Match;
}

export function MatchPredictionForm({ match }: MatchPredictionFormProps) {
  const [winner, setWinner] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const teams = [match.homeTeam.name, match.awayTeam.name, "Draw"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winner) return;

    const home = homeScore !== "" ? parseInt(homeScore, 10) : 0;
    const away = awayScore !== "" ? parseInt(awayScore, 10) : 0;

    setLoading(true);
    setMessage(null);
    const result = await savePrediction(match.id, home, away);
    setLoading(false);

    if ("error" in result && result.error) {
      setMessage(result.error);
      return;
    }

    setSubmitted(true);
    setMessage(
      result.isNew ? "Prediction saved · +25 points!" : "Prediction updated.",
    );
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
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Submit Prediction"}
          </Button>
          {submitted && message ? (
            <p className={styles.success} role="status">
              {message}: {winner}
              {homeScore && awayScore ? ` (${homeScore}-${awayScore})` : ""}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
