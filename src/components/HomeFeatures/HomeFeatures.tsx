"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import styles from "./HomeFeatures.module.css";

const features = [
  {
    title: "Live Match Center",
    description:
      "Follow every kickoff, score, and match status across the tournament.",
    href: "/matches",
  },
  {
    title: "Prediction Challenge",
    description: "Pick your champion and build your World Cup bracket.",
    href: "/predictor",
  },
  {
    title: "Fan Polls",
    description: "Vote on the biggest questions and see how fans are leaning.",
    href: "/predictor",
  },
  {
    title: "Group Standings",
    description: "Track every group from A through L with live standings.",
    href: "/matches",
  },
];

export function HomeFeatures() {
  return (
    <div className={styles.featureGrid}>
      {features.map((feature) => (
        <Link
          key={feature.title}
          href={feature.href}
          className={styles.featureLink}
        >
          <Card className={styles.featureCard} interactive>
            <CardHeader>
              <Badge variant="secondary" className={styles.featureBadge}>
                Feature
              </Badge>
              <CardTitle as="h3">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.featureDesc}>{feature.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Explore →</Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
