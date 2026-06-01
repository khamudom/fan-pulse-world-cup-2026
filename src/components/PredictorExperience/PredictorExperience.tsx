"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
  Badge,
} from "@khamudom/lumen-ui-react";
import { championOptions, mockMostPickedChampion } from "@/data/mockPredictions";
import styles from "./PredictorExperience.module.css";

const mockGroups = ["A", "B", "C", "D", "E", "F", "G", "H"];
const mockAdvanceTeams: Record<string, string[]> = {
  A: ["Mexico", "South Korea"],
  B: ["England", "Senegal"],
  C: ["Brazil", "Morocco"],
  D: ["France", "Turkey"],
};

const knockoutRounds = [
  { round: "Round of 32", matchups: ["1A vs 3C", "2B vs 2D"] },
  { round: "Round of 16", matchups: ["Winner R32-1 vs Winner R32-2"] },
  { round: "Quarterfinals", matchups: ["QF1", "QF2"] },
  { round: "Semifinals", matchups: ["SF1", "SF2"] },
  { round: "Final", matchups: ["Champion"] },
];

export function PredictorExperience() {
  const [champion, setChampion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [groupPicks, setGroupPicks] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (champion) setSubmitted(true);
  };

  return (
    <div className={styles.wrapper}>
      <section aria-labelledby="group-predictions">
        <h2 id="group-predictions" className={styles.sectionTitle}>
          Group Stage Predictions
        </h2>
        <p className={styles.sectionDesc}>
          Pick two teams to advance from each group (prototype).
        </p>
        <div className={styles.groupGrid}>
          {mockGroups.slice(0, 4).map((group) => (
            <Card key={group}>
              <CardHeader>
                <CardTitle as="h3">Group {group}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  label={`Advancing team 1`}
                  value={groupPicks[`${group}-1`] ?? ""}
                  onChange={(e) =>
                    setGroupPicks((p) => ({ ...p, [`${group}-1`]: e.target.value }))
                  }
                  options={[
                    { value: "", label: "Select team" },
                    ...(mockAdvanceTeams[group] ?? ["Team 1", "Team 2"]).map(
                      (t) => ({ value: t, label: t })
                    ),
                  ]}
                />
                <div className={styles.secondSelect}>
                  <Select
                    label="Advancing team 2"
                    value={groupPicks[`${group}-2`] ?? ""}
                    onChange={(e) =>
                      setGroupPicks((p) => ({ ...p, [`${group}-2`]: e.target.value }))
                    }
                    options={[
                      { value: "", label: "Select team" },
                      ...(mockAdvanceTeams[group] ?? ["Team 1", "Team 2"]).map(
                        (t) => ({ value: t, label: t })
                      ),
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.bracketSection} aria-labelledby="bracket-preview">
        <h2 id="bracket-preview" className={styles.sectionTitle}>
          Knockout Bracket Preview
        </h2>
        <div className={styles.bracket}>
          {knockoutRounds.map((round) => (
            <div key={round.round} className={styles.bracketRound}>
              <h3>{round.round}</h3>
              <ul>
                {round.matchups.map((m) => (
                  <li key={m}>
                    <Badge variant="outline">{m}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="champion-select">
        <Card>
          <CardHeader>
            <CardTitle as="h2" id="champion-select">
              Champion Selection
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.championSection}>
            <Select
              label="Your World Cup champion"
              value={champion}
              onChange={(e) => setChampion(e.target.value)}
              options={[
                { value: "", label: "Select champion" },
                ...championOptions.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Button onClick={handleSubmit} disabled={!champion}>
              Submit Prediction
            </Button>
          </CardContent>
        </Card>
      </section>

      {submitted && (
        <Card className={styles.confirmation} role="status">
          <CardContent>
            <h2 className={styles.confirmTitle}>Your prediction is saved</h2>
            <p>
              Champion selected: <strong>{champion}</strong>
            </p>
            <div className={styles.confirmActions}>
              <Button variant="outline" type="button">
                Share (mock)
              </Button>
              <p className={styles.stat}>
                Most picked champion: {mockMostPickedChampion.team} (
                {mockMostPickedChampion.percentage}%)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
