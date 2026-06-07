"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { awardPoints } from "@/actions/points";
import { POINT_VALUES } from "@/lib/points";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function performDailyCheckIn() {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const today = todayIso();
  if (stats?.last_check_in === today) {
    return {
      success: true,
      alreadyCheckedIn: true,
      streak: stats.current_streak,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);

  let newStreak = 1;
  if (stats?.last_check_in === yesterdayIso) {
    newStreak = (stats.current_streak ?? 0) + 1;
  }

  await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      points: stats?.points ?? 0,
      level: stats?.level ?? 1,
      current_streak: newStreak,
      last_check_in: today,
      prediction_accuracy: stats?.prediction_accuracy ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  await awardPoints("daily_check_in", POINT_VALUES.daily_check_in);

  const { data: checkInChallenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("slug", "daily-check-in")
    .maybeSingle();

  if (checkInChallenge) {
    await supabase.from("challenge_completions").upsert(
      {
        user_id: user.id,
        challenge_id: checkInChallenge.id,
        completed_date: today,
      },
      { onConflict: "user_id,challenge_id,completed_date" }
    );
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/challenges");

  return { success: true, alreadyCheckedIn: false, streak: newStreak };
}

export async function completeChallenge(slug: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!challenge) return { error: "Challenge not found." };

  const today = todayIso();
  const { data: existing } = await supabase
    .from("challenge_completions")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_id", challenge.id)
    .eq("completed_date", today)
    .maybeSingle();

  if (existing) {
    return { success: true, alreadyCompleted: true };
  }

  const { error } = await supabase.from("challenge_completions").insert({
    user_id: user.id,
    challenge_id: challenge.id,
    completed_date: today,
  });

  if (error) return { error: error.message };

  await awardPoints("challenge", challenge.points, { slug });

  revalidatePath("/challenges");
  revalidatePath("/profile");
  return { success: true, alreadyCompleted: false, points: challenge.points };
}

export async function markBriefingRead() {
  return completeChallenge("read-briefing");
}
