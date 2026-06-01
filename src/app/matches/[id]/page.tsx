import { notFound } from "next/navigation";
import { MatchDetailView } from "@/components/MatchDetailView";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getMatchById } from "@/services/worldCupApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { data: match } = await getMatchById(id);
  if (!match) return { title: "Match Not Found" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: match, source } = await getMatchById(id);

  if (!match) notFound();

  return (
    <div className="page">
      <MatchDetailView
        match={match}
        matchSource={source}
        showPrototypeData={USE_PROTOTYPE_DATA}
      />
    </div>
  );
}
