"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function beginJourneyWithNation(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const country = String(formData.get("country") ?? "").trim();
  if (!country) {
    return { error: "Choose a nation first." };
  }

  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?country=${encodeURIComponent(country)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: user.email?.split("@")[0] || "Fan",
    favorite_country: country,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(`/my-world-cup?country=${encodeURIComponent(country)}`);
}

export async function saveMyWorldCup(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const favoriteCountry = String(formData.get("favoriteCountry") ?? "").trim();
  const secondaryCountry = String(formData.get("secondaryCountry") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const playerIds = formData.getAll("favoritePlayers").map(String);

  if (!favoriteCountry) {
    return { error: "Please select your favorite country." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: displayName || user.email?.split("@")[0] || "Fan",
      favorite_country: favoriteCountry,
      secondary_country: secondaryCountry || null,
      favorite_player_ids: playerIds,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/my-world-cup");
  return { success: "Your World Cup profile is saved!" };
}

export async function updateDisplayName(displayName: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: true };
}
