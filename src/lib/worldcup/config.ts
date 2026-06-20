export const WORLD_CUP_API_ORIGIN = "https://worldcup26.ir";
export const WORLD_CUP_API_BASE = `${WORLD_CUP_API_ORIGIN}/get`;

export const WORLD_CUP_API_UNAVAILABLE =
  "We couldn't reach the World Cup data service (worldcup26.ir). Live schedules and standings are temporarily unavailable — please try again shortly.";

export const WORLD_CUP_API_AUTH_REQUIRED =
  "The World Cup API requires authentication. Register at worldcup26.ir/api-docs, then add WORLD_CUP_API_TOKEN or WORLD_CUP_API_EMAIL and WORLD_CUP_API_PASSWORD to your environment.";

/** Stable tournament metadata: teams, groups, stadiums. */
export const WORLD_CUP_STABLE_REVALIDATE_SECONDS = 300;

/** Live scores and match status. */
export const WORLD_CUP_LIVE_REVALIDATE_SECONDS = 60;

export const WORLD_CUP_REQUEST_TIMEOUT_MS = 10_000;
export const WORLD_CUP_MAX_RETRIES = 2;
export const WORLD_CUP_RETRY_DELAY_MS = 250;
