import { createClient } from "@/lib/supabase/server";
import { applyPoints } from "@/lib/apply-points";
import { POINT_VALUES } from "@/lib/points";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export type DailyCheckInStatus = {
  justCheckedIn: boolean;
  alreadyCheckedIn: boolean;
  streak: number;
  pointsEarned: number;
};

export async function ensureDailyCheckIn(
  userId: string,
): Promise<DailyCheckInStatus> {
  const supabase = await createClient();
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const today = todayIso();
  const currentStreak = stats?.current_streak ?? 0;

  if (stats?.last_check_in === today) {
    return {
      justCheckedIn: false,
      alreadyCheckedIn: true,
      streak: currentStreak,
      pointsEarned: 0,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);

  let newStreak = 1;
  if (stats?.last_check_in === yesterdayIso) {
    newStreak = currentStreak + 1;
  }

  await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      points: stats?.points ?? 0,
      level: stats?.level ?? 1,
      current_streak: newStreak,
      last_check_in: today,
      prediction_accuracy: stats?.prediction_accuracy ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  await applyPoints(userId, "daily_check_in", POINT_VALUES.daily_check_in);

  const { data: checkInChallenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("slug", "daily-check-in")
    .maybeSingle();

  if (checkInChallenge) {
    await supabase.from("challenge_completions").upsert(
      {
        user_id: userId,
        challenge_id: checkInChallenge.id,
        completed_date: today,
      },
      { onConflict: "user_id,challenge_id,completed_date" },
    );
  }

  return {
    justCheckedIn: true,
    alreadyCheckedIn: false,
    streak: newStreak,
    pointsEarned: POINT_VALUES.daily_check_in,
  };
}
