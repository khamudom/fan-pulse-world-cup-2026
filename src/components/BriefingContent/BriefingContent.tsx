"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@khamudom/lumen-ui-react";
import { markBriefingRead } from "@/actions/checkin";
import styles from "./BriefingContent.module.css";

interface BriefingContentProps {
  content: string;
}

export function BriefingContent({ content }: BriefingContentProps) {
  const [read, setRead] = useState(false);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);

  const handleMarkRead = useCallback(async () => {
    if (inFlight.current || read) return;
    inFlight.current = true;
    setSaving(true);
    try {
      const result = await markBriefingRead();
      if (!("error" in result)) {
        setRead(true);
      }
    } finally {
      setSaving(false);
      inFlight.current = false;
    }
  }, [read]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void handleMarkRead();
    }, 3000);
    return () => clearTimeout(timer);
  }, [handleMarkRead]);

  return (
    <article className={styles.article}>
      <div className={styles.body}>
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <Button
        type="button"
        variant="primary"
        className={read ? styles.readButton : undefined}
        onClick={() => void handleMarkRead()}
        disabled={read}
        loading={saving}
      >
        {read ? "Briefing read \u2713 (+15 pts earned)" : "Mark briefing read (+15 pts)"}
      </Button>
    </article>
  );
}
