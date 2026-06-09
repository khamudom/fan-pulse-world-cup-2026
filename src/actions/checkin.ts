"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { awardPoints } from "@/actions/points";
import { ensureDailyCheckIn } from "@/lib/checkin";

export type { DailyCheckInStatus } from "@/lib/checkin";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function revalidateCheckInPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/challenges");
}

export async function performDailyCheckIn() {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const result = await ensureDailyCheckIn(user.id);
  if (result.justCheckedIn) {
    revalidateCheckInPaths();
  }

  return {
    success: true as const,
    alreadyCheckedIn: result.alreadyCheckedIn,
    streak: result.streak,
  };
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
