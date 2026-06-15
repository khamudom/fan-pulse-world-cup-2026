import { redirect } from "next/navigation";
import { Hero } from "@/components/display/Hero";
import { FriendsExperience } from "@/features/friends";
import {
  getFriendFeed,
  getFriendLeaderboard,
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
} from "@/actions/social";
import { getAuthContext } from "@/lib/auth";

export const metadata = {
  title: "Friends",
};

export default async function FriendsPage() {
  const { user, profile } = await getAuthContext();
  if (!user) redirect("/login?next=/friends");

  const [feed, friends, incoming, outgoing, leaderboard] = await Promise.all([
    getFriendFeed(),
    listFriends(),
    listIncomingRequests(),
    listOutgoingRequests(),
    getFriendLeaderboard(),
  ]);

  return (
    <div className="page">
      <Hero
        title="Friends"
        subtitle="Connect with fellow fans, compare standings, and see who's backing which nation."
        compact
      />
      <section className="section">
        <div className="container">
          <FriendsExperience
            feed={feed}
            friends={friends}
            incoming={incoming}
            outgoing={outgoing}
            leaderboard={leaderboard}
            needsUsername={!profile?.username}
          />
        </div>
      </section>
    </div>
  );
}
