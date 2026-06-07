"use client";

import { useEffect } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { markBriefingRead } from "@/actions/checkin";
import styles from "./BriefingContent.module.css";

interface BriefingContentProps {
  content: string;
}

export function BriefingContent({ content }: BriefingContentProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      void markBriefingRead();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <article className={styles.article}>
      <div className={styles.body}>{content}</div>
      <Button
        type="button"
        variant="outline"
        onClick={() => void markBriefingRead()}
      >
        Mark briefing read (+15 pts)
      </Button>
    </article>
  );
}
