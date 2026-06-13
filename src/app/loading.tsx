import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div
      className={`page ${styles.loading}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="container">
        <div className={styles.heroBlock} aria-hidden="true" />
        <div className={styles.contentRows} aria-hidden="true">
          <div className={styles.row} />
          <div className={styles.row} />
          <div className={styles.rowShort} />
        </div>
      </div>
    </div>
  );
}
