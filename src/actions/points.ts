"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { Json } from "@/types/database";
import {
  computeLevel,
  POINT_VALUES,
  type PointEventType,
} from "@/lib/points";

export async function awardPoints(
  type: PointEventType,
  points?: number,
  metadata: Json = {}
) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const pointValue = points ?? POINT_VALUES[type as keyof typeof POINT_VALUES] ?? 0;
  if (pointValue <= 0) return { error: "Invalid point value." };

  const supabase = await createClient();

  const { error: eventError } = await supabase.from("point_events").insert({
    user_id: user.id,
    type,
    points: pointValue,
    metadata,
  });

  if (eventError) return { error: eventError.message };

  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const newPoints = (stats?.points ?? 0) + pointValue;
  const newLevel = computeLevel(newPoints);

  const { error: statsError } = await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      points: newPoints,
      level: newLevel,
      current_streak: stats?.current_streak ?? 0,
      last_check_in: stats?.last_check_in ?? null,
      prediction_accuracy: stats?.prediction_accuracy ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (statsError) return { error: statsError.message };

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  return { success: true, points: pointValue, total: newPoints, level: newLevel };
}

export async function savePrediction(
  matchId: string,
  predictedHome: number,
  predictedAway: number
) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("predictions")
      .update({ predicted_home: predictedHome, predicted_away: predictedAway })
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath("/predictor");
    return { success: true, isNew: false };
  }

  const { error } = await supabase.from("predictions").insert({
    user_id: user.id,
    match_id: matchId,
    predicted_home: predictedHome,
    predicted_away: predictedAway,
  });

  if (error) return { error: error.message };

  await awardPoints("prediction", POINT_VALUES.prediction, { matchId });
  revalidatePath("/predictor");
  revalidatePath("/challenges");
  return { success: true, isNew: true };
}

export async function recalculateAccuracy() {
  const user = await getSessionUser();
  if (!user) return;

  const supabase = await createClient();
  const { data: predictions } = await supabase
    .from("predictions")
    .select("correct")
    .eq("user_id", user.id)
    .eq("resolved", true);

  const resolved = predictions ?? [];
  const correct = resolved.filter((p) => p.correct).length;
  const accuracy =
    resolved.length === 0 ? 0 : Math.round((correct / resolved.length) * 1000) / 10;

  await supabase
    .from("user_stats")
    .update({ prediction_accuracy: accuracy, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
}
