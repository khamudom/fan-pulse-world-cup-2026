"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import type { Team } from "@/types";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        {team.flag ? (
          <img
            src={team.flag}
            alt=""
            className={styles.flag}
            width={48}
            height={36}
          />
        ) : (
          <span className={styles.flagPlaceholder} aria-hidden="true" />
        )}
        <div>
          <CardTitle as="h3">{team.name}</CardTitle>
          {team.fifaCode && (
            <span className={styles.code}>{team.fifaCode}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {team.group && (
          <Badge variant="outline">Group {team.group}</Badge>
        )}
      </CardContent>
    </Card>
  );
}
