import { getAuthContext } from "@/lib/auth";
import { getMatches } from "@/services/worldCupApi";
import { HomeFixturesSection } from "./HomeFixturesSection";

type HomeFixturesAsyncProps = {
  subtitle: string;
  showSignoff?: boolean;
  personalized?: boolean;
};

export async function HomeFixturesAsync({
  subtitle,
  showSignoff = false,
  personalized = false,
}: HomeFixturesAsyncProps) {
  const matchesResult = await getMatches();

  let favoriteCountry: string | null | undefined;
  if (personalized) {
    const { profile } = await getAuthContext();
    favoriteCountry = profile?.favorite_country;
  }

  return (
    <HomeFixturesSection
      matches={matchesResult.data}
      source={matchesResult.source}
      sourceError={matchesResult.error}
      subtitle={subtitle}
      favoriteCountry={favoriteCountry}
      showSignoff={showSignoff}
    />
  );
}
