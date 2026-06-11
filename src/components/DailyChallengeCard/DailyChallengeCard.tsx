"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@khamudom/lumen-ui-react";
import { completeChallenge } from "@/actions/checkin";
import type { Challenge } from "@/types/database";
import styles from "./DailyChallengeCard.module.css";

interface DailyChallengeCardProps {
  challenge: Challenge;
  completed: boolean;
}

export function DailyChallengeCard({
  challenge,
  completed,
}: DailyChallengeCardProps) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleComplete = async () => {
    setLoading(true);
    const result = await completeChallenge(challenge.slug);
    setLoading(false);

    if ("error" in result && result.error) {
      setMessage(result.error);
      return;
    }

    setDone(true);
    setMessage(
      result.alreadyCompleted
        ? "Already completed today."
        : `+${result.points ?? challenge.points} points earned!`,
    );
  };

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.headerRow}>
          <CardTitle as="h3">{challenge.title}</CardTitle>
          <Badge variant="outline">+{challenge.points} pts</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={styles.description}>{challenge.description}</p>
        {challenge.slug === "daily-check-in" ? (
          <p className={styles.note}>
            {done
              ? "Welcome back reward claimed — see you tomorrow!"
              : "Completes automatically when you visit FanPulse each day."}
          </p>
        ) : challenge.slug === "read-briefing" ? (
          <p className={styles.note}>
            Read today&apos;s briefing to complete this challenge.
          </p>
        ) : (
          <Button
            type="button"
            variant={done ? "outline" : "primary"}
            onClick={handleComplete}
            disabled={loading || done}
          >
            {done ? "Completed" : loading ? "Saving…" : "Mark complete"}
          </Button>
        )}
        {message ? <p className={styles.message}>{message}</p> : null}
      </CardContent>
    </Card>
  );
}
