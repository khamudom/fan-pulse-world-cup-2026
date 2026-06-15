"use client";

import { Badge } from "@khamudom/lumen-ui-react";
import styles from "./DataSourceBadge.module.css";

export type DataSourceBadgeSource =
  | "api"
  | "mock"
  | "local"
  | "unavailable";

type DataSourceBadgeProps = {
  source: DataSourceBadgeSource;
  label?: string;
};

const defaults: Record<DataSourceBadgeSource, string> = {
  api: "Live API",
  mock: "Mock API",
  local: "Local API",
  unavailable: "No data",
};

const variants: Record<
  DataSourceBadgeSource,
  "success" | "warning" | "secondary" | "outline"
> = {
  api: "success",
  mock: "warning",
  local: "secondary",
  unavailable: "outline",
};

export function DataSourceBadge({ source, label }: DataSourceBadgeProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Badge
      variant={variants[source]}
      className={`${styles.badge} ${styles[source]}`}
    >
      {label ?? defaults[source]}
    </Badge>
  );
}
