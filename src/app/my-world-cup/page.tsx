import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { MyWorldCupForm } from "@/components/MyWorldCupForm";
import { getAuthContext } from "@/lib/auth";
import { getTeams } from "@/services/worldCupApi";
import styles from "./page.module.css";

export const metadata = {
  title: "My World Cup",
};

export default async function MyWorldCupPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const { user, profile } = await getAuthContext();
  if (!user) redirect("/login");

  const { country } = await searchParams;
  const teamsResult = await getTeams();

  return (
    <div className="page">
      <Hero
        title="My World Cup"
        subtitle="Pick your teams and players — FanPulse becomes your personalized companion."
        compact
      />
      <section className="section">
        <div className={`container ${styles.narrow}`}>
          <MyWorldCupForm
            teams={teamsResult.data}
            teamsSource={teamsResult.source}
            profile={profile}
            initialCountry={country?.trim() || profile?.favorite_country || undefined}
          />
        </div>
      </section>
    </div>
  );
}
