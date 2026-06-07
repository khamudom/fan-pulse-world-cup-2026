import { DataSourceBadge } from "@/components/DataSourceBadge";
import styles from "./DataSourceLegend.module.css";

const items = [
  {
    source: "api" as const,
    description: "Teams, matches, standings, and stadiums from worldcup26.ir",
  },
  {
    source: "mock" as const,
    description: "Fallback tournament data when the World Cup API is unavailable",
  },
  {
    source: "local" as const,
    description:
      "Demo content from src/data/api/ — stories, players, polls, comparisons, and AI routes",
  },
];

export function DataSourceLegend() {
  return (
    <div className={styles.legend} aria-label="Data source legend">
      <p className={styles.title}>Data sources</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.source}>
            <DataSourceBadge source={item.source} />
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
