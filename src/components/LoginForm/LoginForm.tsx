"use client";

import { useActionState, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@khamudom/lumen-ui-react";
import { signIn, signUp, type AuthActionState } from "@/actions/auth";
import styles from "./LoginForm.module.css";

const initialState: AuthActionState = {};

interface LoginFormProps {
  pendingCountry?: string;
}

export function LoginForm({ pendingCountry }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle as="h2">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
        {pendingCountry ? (
          <p className={styles.pendingNation}>
            You chose <strong>{pendingCountry}</strong> — sign in to follow their journey.
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className={styles.tabs} role="tablist">
          <Button
            type="button"
            variant={mode === "signin" ? "primary" : "outline"}
            onClick={() => setMode("signin")}
          >
            Sign in
          </Button>
          <Button
            type="button"
            variant={mode === "signup" ? "primary" : "outline"}
            onClick={() => setMode("signup")}
          >
            Sign up
          </Button>
        </div>

        <form action={mode === "signin" ? signInAction : signUpAction} className={styles.form}>
          {pendingCountry ? (
            <input type="hidden" name="pendingCountry" value={pendingCountry} />
          ) : null}
          {mode === "signup" ? (
            <Input label="Display name" name="displayName" placeholder="Your fan name" />
          ) : null}
          <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="At least 8 characters"
          />
          {state.error ? <p className={styles.error}>{state.error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
