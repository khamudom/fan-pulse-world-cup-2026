import { MatchesScheduleSection } from "../MatchesScheduleSection/MatchesScheduleSection";
import { getMatches } from "@/services/worldCupApi";

export async function MatchesScheduleAsync() {
  const { data: matches, source } = await getMatches();

  return (
    <MatchesScheduleSection matches={matches} matchesSource={source} />
  );
}
