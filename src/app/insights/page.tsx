import { InsightsDashboard } from "@/components/InsightsDashboard";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import {
  getFeaturedStadiumIdFromCookies,
  resolveFeaturedStadium,
} from "@/lib/featuredStadium";
import { getStadiums } from "@/services/worldCupApi";

export const metadata = {
  title: "World Cup Insights",
};

export default async function InsightsPage() {
  const [{ data: stadiums, source }, preferredId] = await Promise.all([
    getStadiums(),
    getFeaturedStadiumIdFromCookies(),
  ]);
  const featuredStadium = resolveFeaturedStadium(stadiums, preferredId);

  return (
    <div className="page">
      <InsightsDashboard
        featuredStadium={featuredStadium}
        stadiumSource={source}
        showPrototypeData={USE_PROTOTYPE_DATA}
      />
    </div>
  );
}
