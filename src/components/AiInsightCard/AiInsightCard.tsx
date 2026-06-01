"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@khamudom/lumen-ui-react";
import { mockAiPrompts, mockAiResponses } from "@/data/mockInsights";
import styles from "./AiInsightCard.module.css";

interface AiInsightCardProps {
  title?: string;
  prompts?: string[];
  responses?: Record<string, string>;
}

export function AiInsightCard({
  title = "AI Match Insights",
  prompts = mockAiPrompts,
  responses = mockAiResponses,
}: AiInsightCardProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.prompts} role="group" aria-label="Insight prompts">
          {prompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant={activePrompt === prompt ? "primary" : "outline"}
              onClick={() => setActivePrompt(prompt)}
              aria-pressed={activePrompt === prompt}
            >
              {prompt}
            </Button>
          ))}
        </div>
        {activePrompt && (
          <div className={styles.response} role="region" aria-live="polite">
            <p className={styles.responseLabel}>FanPulse AI</p>
            <p>{responses[activePrompt] ?? "Analysis coming soon for this question."}</p>
          </div>
        )}
        {!activePrompt && (
          <p className={styles.hint}>Tap a question to explore AI-style tournament insights.</p>
        )}
      </CardContent>
    </Card>
  );
}
