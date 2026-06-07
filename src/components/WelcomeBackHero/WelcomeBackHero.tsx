"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@khamudom/lumen-ui-react";
import { getLevelTitle } from "@/lib/points";
import type { Profile, UserStats } from "@/types/database";
import styles from "./WelcomeBackHero.module.css";

interface WelcomeBackHeroProps {
  profile: Profile;
  stats: UserStats | null;
  greeting?: string;
}

export function WelcomeBackHero({
  profile,
  stats,
  greeting,
}: WelcomeBackHeroProps) {
  const levelTitle = getLevelTitle(stats?.level ?? 1, profile.favorite_country);

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h1 className={styles.title}>{profile.display_name ?? "Fan"}</h1>
        {greeting ? <p className={styles.greeting}>{greeting}</p> : null}

        <div className={styles.stats}>
          {profile.favorite_country ? (
            <div className={styles.stat}>
              <span className={styles.statLabel}>My Team</span>
              <span className={styles.statValue}>{profile.favorite_country}</span>
            </div>
          ) : null}
          {stats ? (
            <>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Level</span>
                <span className={styles.statValue}>
                  {stats.level} · {levelTitle}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Accuracy</span>
                <span className={styles.statValue}>
                  {Number(stats.prediction_accuracy)}%
                </span>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Link href="/#briefing">
            <Button variant="primary">Today&apos;s Briefing</Button>
          </Link>
          <Link href="/challenges">
            <Button variant="outline">Daily Challenges</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
