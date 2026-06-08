import { TeamsExperience } from "@/components/TeamsExperience";
import { getTeams } from "@/services/worldCupApi";

export const metadata = {
  title: "Teams",
  description: "Explore all 48 nations competing at FIFA World Cup 2026.",
};

export default async function TeamsPage() {
  const { data: teams, source } = await getTeams();
  const groups = [...new Set(teams.map((t) => t.group).filter(Boolean))].sort() as string[];

  return (
    <div className="page">
      <TeamsExperience
        teams={teams}
        groups={groups}
        teamsSource={source}
      />
    </div>
  );
}
