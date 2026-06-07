import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { DailyChallengeCard } from "@/components/DailyChallengeCard";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { SectionHeader } from "@/components/SectionHeader";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = {
  title: "Daily Challenges",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function ChallengesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const today = todayIso();

  const [{ data: challenges }, { data: completions }, { data: stats }] =
    await Promise.all([
      supabase.from("challenges").select("*").eq("active", true).order("points"),
      supabase
        .from("challenge_completions")
        .select("challenge_id")
        .eq("user_id", user.id)
        .eq("completed_date", today),
      supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

  const completedIds = new Set(completions?.map((c) => c.challenge_id) ?? []);

  return (
    <div className="page">
      <Hero
        title="Daily Challenges"
        subtitle="Build your fan habit — complete challenges to earn points and level up."
        compact
      />
      <section className="section">
        <div className="container">
          <div className={styles.topGrid}>
            <DailyCheckIn
              lastCheckIn={stats?.last_check_in ?? null}
              currentStreak={stats?.current_streak ?? 0}
            />
          </div>
        </div>
      </section>
      <section className="section sectionAlt">
        <div className="container">
          <SectionHeader title="Today's Challenges" subtitle="Resets every day at midnight." />
          <div className={styles.grid}>
            {(challenges ?? []).map((challenge) => (
              <DailyChallengeCard
                key={challenge.id}
                challenge={challenge}
                completed={completedIds.has(challenge.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
