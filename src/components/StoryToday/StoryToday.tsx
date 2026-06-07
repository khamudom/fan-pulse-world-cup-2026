import Link from "next/link";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { WorldCupStory } from "@/data/worldCupStories";
import { formatStoryDate } from "@/lib/todaysStory";
import styles from "./StoryToday.module.css";

interface StoryTodayProps {
  story: WorldCupStory;
}

export function StoryToday({ story }: StoryTodayProps) {
  const storyDate = formatStoryDate();

  return (
    <section
      className={styles.section}
      id="story-today"
      aria-labelledby="story-today-title"
    >
      <div className={styles.inner}>
        <header className={styles.preamble}>
          <p className={styles.beat}>Before matches.</p>
          <p className={styles.beat}>Before standings.</p>
          <p className={styles.beat}>Before statistics.</p>
          <div className={styles.divider} aria-hidden="true" />
        </header>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <div>
              <p className={styles.chapter}>
                Chapter {story.chapter} · {storyDate}
              </p>
              <h2 id="story-today-title" className={styles.sectionTitle}>
                Today&apos;s World Cup Story
              </h2>
            </div>
            <DataSourceBadge source="local" />
          </div>

          <article className={styles.card} aria-labelledby="story-headline">
            <div className={styles.cardShine} aria-hidden="true" />
            <p className={styles.cardLabel}>Today&apos;s tale</p>
            <h3 id="story-headline" className={styles.headline}>
              {story.headline}
            </h3>
            <p className={styles.teaser}>{story.teaser}</p>
            <p className={styles.hook}>{story.hook}</p>
          </article>

          <div className={styles.actions}>
            <Link href="/story" className={styles.readStory}>
              Read Story
            </Link>
          </div>

          <footer className={styles.epilogue}>
            <p className={styles.epilogueLine}>Tomorrow it changes.</p>
            <p className={styles.epilogueLineAccent}>
              Every day is a new chapter.
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}
