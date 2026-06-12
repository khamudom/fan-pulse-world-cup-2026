"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { UserMenu } from "@/components/UserMenu";
import type { ResolvedTheme } from "@/lib/theme";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Today" },
  { href: "/my-world-cup", label: "My World Cup", requiresAuth: true },
  { href: "/friends", label: "Friends", requiresAuth: true },
  { href: "/challenges", label: "Challenges", requiresAuth: true },
  { href: "/matches", label: "Matches" },
  { href: "/predictor", label: "Predictor" },
  { href: "/teams", label: "Teams" },
  { href: "/stadiums", label: "Stadiums" },
];

interface HeaderProps {
  signedIn?: boolean;
  displayName?: string | null;
  resolvedTheme: ResolvedTheme;
}

export function Header({
  signedIn = false,
  displayName,
  resolvedTheme,
}: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || signedIn,
  );

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.logo}
          aria-label="World Cup FanPulse home"
        >
          <span className={styles.logoMark} aria-hidden="true">
            ⚽
          </span>
          <span className={styles.logoText}>
            Fan<span className={styles.logoAccent}>Pulse</span>
          </span>
        </Link>

        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Main navigation"
        >
          <ul className={styles.navList}>
            {visibleNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    pathname === item.href
                      ? styles.navLinkActive
                      : styles.navLink
                  }
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          <UserMenu
            signedIn={signedIn}
            displayName={displayName}
            resolvedTheme={resolvedTheme}
          />
          <div className={styles.menuToggleWrap}>
            <Button
              type="button"
              variant="ghost"
              className={styles.menuToggle}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
