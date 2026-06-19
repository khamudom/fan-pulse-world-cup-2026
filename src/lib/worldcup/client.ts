import "server-only";
import {
  WORLD_CUP_API_BASE,
  WORLD_CUP_LIVE_REVALIDATE_SECONDS,
  WORLD_CUP_MAX_RETRIES,
  WORLD_CUP_REQUEST_TIMEOUT_MS,
  WORLD_CUP_RETRY_DELAY_MS,
  WORLD_CUP_STABLE_REVALIDATE_SECONDS,
} from "./config";
import { worldCupCacheTags, type WorldCupCacheTag } from "./tags";

export type WorldCupResource = "teams" | "games" | "groups" | "stadiums";

export type WorldCupFetchMode = "cached" | "fresh";

type WorldCupFetchOptions = {
  mode?: WorldCupFetchMode;
};

export class WorldCupFetchError extends Error {
  readonly resource: WorldCupResource;
  readonly cause?: unknown;

  constructor(resource: WorldCupResource, message: string, cause?: unknown) {
    super(message);
    this.name = "WorldCupFetchError";
    this.resource = resource;
    this.cause = cause;
  }
}

const resourceTags: Record<WorldCupResource, WorldCupCacheTag> = {
  teams: worldCupCacheTags.teams,
  games: worldCupCacheTags.games,
  groups: worldCupCacheTags.groups,
  stadiums: worldCupCacheTags.stadiums,
};

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const code = (error as NodeJS.ErrnoException).code;
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    error.name === "TimeoutError" ||
    error.name === "AbortError"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCacheConfig(resource: WorldCupResource, mode: WorldCupFetchMode) {
  if (mode === "fresh") {
    return { cache: "no-store" as const };
  }

  const revalidate =
    resource === "games"
      ? WORLD_CUP_LIVE_REVALIDATE_SECONDS
      : WORLD_CUP_STABLE_REVALIDATE_SECONDS;

  return {
    next: {
      revalidate,
      tags: [worldCupCacheTags.all, resourceTags[resource]],
    },
  };
}

async function fetchWorldCupOnce<T>(
  resource: WorldCupResource,
  mode: WorldCupFetchMode,
): Promise<T> {
  const response = await fetch(`${WORLD_CUP_API_BASE}/${resource}`, {
    ...getCacheConfig(resource, mode),
    signal: AbortSignal.timeout(WORLD_CUP_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new WorldCupFetchError(
      resource,
      `World Cup API responded with ${response.status}`,
    );
  }

  return (await response.json()) as T;
}

export async function fetchWorldCupResource<T>(
  resource: WorldCupResource,
  options: WorldCupFetchOptions = {},
): Promise<T> {
  const mode = options.mode ?? "cached";
  let lastError: unknown;

  for (let attempt = 0; attempt <= WORLD_CUP_MAX_RETRIES; attempt += 1) {
    try {
      return await fetchWorldCupOnce<T>(resource, mode);
    } catch (error) {
      lastError = error;
      if (attempt === WORLD_CUP_MAX_RETRIES || !isRetryable(error)) {
        break;
      }
      await sleep(WORLD_CUP_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "World Cup API request failed";

  throw new WorldCupFetchError(resource, message, lastError);
}
