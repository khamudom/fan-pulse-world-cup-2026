"use client";

import { Badge } from "@lumen-ui/react";
import styles from "./DataSourceBadge.module.css";

type DataSourceBadgeProps = {
  source: "api" | "mock" | "prototype" | "unavailable";
  label?: string;
};

const defaults: Record<DataSourceBadgeProps["source"], string> = {
  api: "Live API",
  mock: "Mock fallback",
  prototype: "Prototype data",
  unavailable: "No data",
};

const variants: Record<
  DataSourceBadgeProps["source"],
  "success" | "warning" | "secondary" | "outline"
> = {
  api: "success",
  mock: "warning",
  prototype: "secondary",
  unavailable: "outline",
};

export function DataSourceBadge({ source, label }: DataSourceBadgeProps) {
  return (
    <Badge variant={variants[source]} className={styles.badge}>
      {label ?? defaults[source]}
    </Badge>
  );
}
