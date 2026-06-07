"use client";

import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Checkbox,
} from "@khamudom/lumen-ui-react";
import { saveMyWorldCup, type ProfileActionState } from "@/actions/profile";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { followablePlayers } from "@/data/followablePlayers";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { Team } from "@/types";
import type { Profile } from "@/types/database";
import styles from "./MyWorldCupForm.module.css";

const initialState: ProfileActionState = {};

interface MyWorldCupFormProps {
  teams: Team[];
  teamsSource?: ApiDataSource;
  profile: Profile | null;
  initialCountry?: string;
}

export function MyWorldCupForm({
  teams,
  teamsSource = "api",
  profile,
  initialCountry,
}: MyWorldCupFormProps) {
  const [state, formAction, pending] = useActionState(saveMyWorldCup, initialState);

  const teamOptions = [
    { value: "", label: "Select country" },
    ...teams.map((t) => ({ value: t.name, label: t.name })),
  ];

  const favoriteCountry =
    profile?.favorite_country ?? initialCountry ?? "";
  const filteredPlayers = favoriteCountry
    ? followablePlayers.filter((p) => p.team === favoriteCountry)
    : followablePlayers;

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Build your World Cup</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className={styles.form}>
          <Input
            label="Display name"
            name="displayName"
            defaultValue={profile?.display_name ?? ""}
            placeholder="How should we greet you?"
          />
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>
              <span>Countries</span>
              <DataSourceBadge
                source={toDataSourceBadge(teamsSource, teams.length > 0)}
              />
            </div>
            <Select
              label="Favorite country"
              name="favoriteCountry"
              defaultValue={profile?.favorite_country ?? ""}
              options={teamOptions}
              required
            />
            <Select
              label="Secondary country (optional)"
              name="secondaryCountry"
              defaultValue={profile?.secondary_country ?? ""}
              options={teamOptions}
            />
          </div>

          <fieldset className={styles.players}>
            <legend className={styles.legend}>
              <span>Favorite players</span>
              <DataSourceBadge source="local" />
            </legend>
            <div className={styles.playerGrid}>
              {filteredPlayers.map((player) => (
                <Checkbox
                  key={player.id}
                  name="favoritePlayers"
                  value={player.id}
                  label={`${player.name} (${player.team})`}
                  defaultChecked={profile?.favorite_player_ids?.includes(player.id)}
                />
              ))}
            </div>
          </fieldset>

          {state.error ? <p className={styles.error}>{state.error}</p> : null}
          {state.success ? <p className={styles.success}>{state.success}</p> : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save My World Cup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
