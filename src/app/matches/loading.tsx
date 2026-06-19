import {
  MatchesGroupStandingsSkeleton,
  MatchesScheduleSkeleton,
} from "@/features/matches/components/MatchesPageSkeletons/MatchesPageSkeletons";

export default function Loading() {
  return (
    <>
      <MatchesScheduleSkeleton />
      <MatchesGroupStandingsSkeleton />
    </>
  );
}
