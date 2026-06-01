import { ADMIN_MODE } from "@/config/admin";
import {
  getFeaturedStadiumIdFromCookies,
  resolveFeaturedStadium,
} from "@/lib/featuredStadium";
import { getStadiums } from "@/services/worldCupApi";
import { AdminDrawerPanel } from "./AdminDrawerPanel";

export async function AdminDrawer() {
  if (!ADMIN_MODE) return null;

  const [{ data: stadiums }, preferredId] = await Promise.all([
    getStadiums(),
    getFeaturedStadiumIdFromCookies(),
  ]);

  const featured = resolveFeaturedStadium(stadiums, preferredId);

  return (
    <AdminDrawerPanel
      stadiums={stadiums}
      currentId={preferredId}
      resolvedName={featured?.name}
    />
  );
}
