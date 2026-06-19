import { MatchesGroupStandingsSection } from "../MatchesGroupStandingsSection/MatchesGroupStandingsSection";
import { getGroups } from "@/services/worldCupApi";

interface MatchesGroupStandingsAsyncProps {
  initialSection?: string;
}

export async function MatchesGroupStandingsAsync({
  initialSection,
}: MatchesGroupStandingsAsyncProps) {
  const { data: groups, source } = await getGroups();

  return (
    <MatchesGroupStandingsSection
      groups={groups}
      groupsSource={source}
      initialSection={initialSection}
    />
  );
}
