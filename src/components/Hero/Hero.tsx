"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@khamudom/lumen-ui-react";
import styles from "./Hero.module.css";

interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

interface HeroProps {
  title: string;
  subtitle: string;
  tagline?: string;
  stats?: string[];
  actions?: HeroAction[];
  sponsor?: string;
  compact?: boolean;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  tagline,
  stats = [],
  actions = [],
  sponsor,
  compact = false,
  aside,
  children,
  backgroundImage,
}: HeroProps) {
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""} ${backgroundImage ? styles.hasBackground : ""}`}
      aria-labelledby="hero-title"
    >
      {backgroundImage ? (
        <div className={styles.background} aria-hidden="true">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.backgroundImage}
          />
          <div className={styles.backgroundOverlay} />
        </div>
      ) : null}
      <div className={`${styles.inner} ${aside ? styles.withAside : ""}`}>
        <div className={styles.content}>
          {sponsor && (
            <p className={styles.sponsor} aria-label={`Presented by ${sponsor}`}>
              Presented by <strong>{sponsor}</strong>
            </p>
          )}
          <h1 id="hero-title" className={styles.title}>
            {title}
          </h1>
          {stats.length > 0 && (
            <ul className={styles.stats} aria-label="Tournament scale">
              {stats.map((stat) => (
                <li key={stat}>{stat}</li>
              ))}
            </ul>
          )}
          {tagline ? <p className={styles.tagline}>{tagline}</p> : null}
          <p className={styles.subtitle}>{subtitle}</p>
          {actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button
                    variant={
                      action.variant === "outline"
                        ? "outline"
                        : action.variant === "secondary"
                          ? "secondary"
                          : "primary"
                    }
                  >
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
          {children}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
    </section>
  );
}
