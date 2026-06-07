import { createClient } from "@/lib/supabase/server";
import type { Profile, UserStats } from "@/types/database";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getAuthContext() {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, profile: null, stats: null };
  }

  const [profile, stats] = await Promise.all([
    getProfile(user.id),
    getUserStats(user.id),
  ]);

  return { user, profile, stats };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
