/**
 * @deprecated Domain-shaped exports kept for backward compatibility.
 * Source of truth: src/data/api/worldcup/ (raw API responses).
 */
import { mapMockGroups, mapMockMatches, mapMockStadiums, mapMockTeams } from "@/services/worldCupApi";

export const mockTeams = mapMockTeams();
export const mockMatches = mapMockMatches();
export const mockGroups = mapMockGroups();
export const mockStadiums = mapMockStadiums();
