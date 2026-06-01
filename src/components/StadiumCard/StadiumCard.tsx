"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import type { Stadium } from "@/types";
import styles from "./StadiumCard.module.css";

interface StadiumCardProps {
  stadium: Stadium;
  featured?: boolean;
}

export function StadiumCard({ stadium, featured = false }: StadiumCardProps) {
  return (
    <Card className={featured ? styles.featured : undefined}>
      <CardHeader>
        {featured && (
          <Badge className={styles.featuredBadge}>Featured Venue</Badge>
        )}
        <CardTitle as="h3">{stadium.name}</CardTitle>
        {stadium.fifaName && stadium.fifaName !== stadium.name && (
          <p className={styles.fifaName}>{stadium.fifaName}</p>
        )}
      </CardHeader>
      <CardContent>
        <dl className={styles.details}>
          <div>
            <dt>City</dt>
            <dd>
              {stadium.city}, {stadium.country}
            </dd>
          </div>
          {stadium.capacity && (
            <div>
              <dt>Capacity</dt>
              <dd>{stadium.capacity.toLocaleString()}</dd>
            </div>
          )}
          {stadium.matchCount !== undefined && (
            <div>
              <dt>Matches</dt>
              <dd>{stadium.matchCount}</dd>
            </div>
          )}
          {stadium.region && (
            <div>
              <dt>Region</dt>
              <dd>{stadium.region}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
