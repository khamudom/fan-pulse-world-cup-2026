import { notFound } from "next/navigation";
import { MatchDetailView } from "@/features/matches";
import { EmptyState } from "@/components/feedback/EmptyState";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getSessionUser } from "@/lib/auth";
import { getMyMatchPrediction } from "@/actions/points";
import { getMatchById, getMatches } from "@/services/worldCupApi";

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

  if (!match) {
    const { data: matches } = await getMatches();
    if (matches.length === 0) notFound();

    return (
      <div className="page">
        <EmptyState
          title="Match not found"
          message="We couldn't find this match in the schedule. It may have been rescheduled or removed."
          actionLabel="Browse matches"
          actionHref="/matches"
        />
      </div>
    );
  }

  const user = await getSessionUser();
  const userPrediction = user ? await getMyMatchPrediction(id) : null;

  return (
    <div className="page">
      <MatchDetailView
        match={match}
        matchSource={source}
        showPrototypeData={USE_PROTOTYPE_DATA}
        isSignedIn={Boolean(user)}
        userPrediction={userPrediction}
      />
    </div>
  );
}
