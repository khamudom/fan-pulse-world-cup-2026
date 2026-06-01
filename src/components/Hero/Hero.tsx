"use client";

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
  actions?: HeroAction[];
  sponsor?: string;
  compact?: boolean;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

export function Hero({
  title,
  subtitle,
  actions = [],
  sponsor,
  compact = false,
  aside,
  children,
}: HeroProps) {
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""}`}
      aria-labelledby="hero-title"
    >
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
