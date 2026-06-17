import styles from "./MatchDetailSkeleton.module.css";

export function MatchDetailSkeleton() {
  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading match"
    >
      <span className="sr-only">Loading match…</span>
      <div className={styles.matchup} aria-hidden="true">
        <div className={styles.team}>
          <div className={styles.flag} />
          <div className={styles.teamName} />
        </div>
        <div className={styles.vs} />
        <div className={styles.team}>
          <div className={styles.flag} />
          <div className={styles.teamName} />
        </div>
      </div>
      <div className={styles.meta} />
      <div className={styles.sections} aria-hidden="true">
        <div className={styles.section} />
        <div className={styles.section} />
      </div>
    </div>
  );
}
