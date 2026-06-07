export type ApiDataSource = "api" | "mock";

export type DataSourceBadgeValue =
  | "api"
  | "mock"
  | "local"
  | "unavailable";

/** Badge source for data served from src/data/api/ or local app routes. */
export const LOCAL_API_SOURCE = "local" as const;

export function toDataSourceBadge(
  source: ApiDataSource,
  hasData = true,
): DataSourceBadgeValue {
  if (!hasData) return "unavailable";
  return source === "mock" ? "mock" : "api";
}
