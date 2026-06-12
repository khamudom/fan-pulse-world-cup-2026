"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@khamudom/lumen-ui-react";
import { searchUsers, sendFriendRequest } from "@/actions/social";
import type { FriendSummary } from "@/lib/social";
import styles from "./FriendSearch.module.css";

function displayName(user: FriendSummary): string {
  return user.displayName ?? user.username ?? "Fan";
}

export function FriendSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [isSending, startSend] = useTransition();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    startSearch(async () => {
      const response = await searchUsers(query);
      if (response.error) {
        setError(response.error);
        setResults([]);
        return;
      }
      setResults(response.results);
    });
  }

  function handleAdd(userId: string) {
    setError(null);
    setSuccess(null);
    startSend(async () => {
      const result = await sendFriendRequest(userId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(result.success ?? "Request sent.");
      router.refresh();
    });
  }

  return (
    <div className={styles.search}>
      <form onSubmit={handleSearch} className={styles.row}>
        <Input
          className={styles.input}
          label="Search by username or display name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Baloo710 or footiefan42"
        />
        <Button type="submit" variant="primary" loading={isSearching}>
          Search
        </Button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}
      {success ? <p className={styles.success}>{success}</p> : null}

      {results.length > 0 ? (
        <ul className={styles.results}>
          {results.map((user) => (
            <li key={user.id} className={styles.resultRow}>
              <div className={styles.info}>
                <p className={styles.name}>{displayName(user)}</p>
                {user.username ? (
                  <p className={styles.meta}>@{user.username}</p>
                ) : null}
                {user.favoriteCountry ? (
                  <p className={styles.meta}>
                    Standing behind {user.favoriteCountry}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                loading={isSending}
                onClick={() => handleAdd(user.id)}
              >
                Add friend
              </Button>
            </li>
          ))}
        </ul>
      ) : query.length >= 2 && !isSearching && results.length === 0 && !error ? (
        <p className={styles.empty}>No fans found. Try a different username.</p>
      ) : null}
    </div>
  );
}
