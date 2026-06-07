"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@khamudom/lumen-ui-react";
import { performDailyCheckIn } from "@/actions/checkin";
import styles from "./DailyCheckIn.module.css";

interface DailyCheckInProps {
  lastCheckIn: string | null;
  currentStreak: number;
}

export function DailyCheckIn({ lastCheckIn, currentStreak }: DailyCheckInProps) {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkedIn, setCheckedIn] = useState(lastCheckIn === today);
  const [streak, setStreak] = useState(currentStreak);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCheckedIn(lastCheckIn === today);
    setStreak(currentStreak);
  }, [lastCheckIn, currentStreak, today]);

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage(null);
    const result = await performDailyCheckIn();
    setLoading(false);

    if ("error" in result && result.error) {
      setMessage(result.error);
      return;
    }

    setCheckedIn(true);
    if ("streak" in result && result.streak) setStreak(result.streak);
    setMessage(
      result.alreadyCheckedIn
        ? "Already checked in today!"
        : `+10 points · ${result.streak}-day streak`
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.row}>
          <Badge variant="secondary">{streak}-day streak</Badge>
          <Button
            type="button"
            variant={checkedIn ? "outline" : "primary"}
            onClick={handleCheckIn}
            disabled={loading || checkedIn}
          >
            {checkedIn ? "Checked in" : loading ? "Checking in…" : "Check in (+10)"}
          </Button>
        </div>
        {message ? <p className={styles.message}>{message}</p> : null}
      </CardContent>
    </Card>
  );
}
