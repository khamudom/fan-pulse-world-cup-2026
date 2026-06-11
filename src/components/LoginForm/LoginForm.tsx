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
import {
  requestPasswordReset,
  signIn,
  signUp,
  type AuthActionState,
} from "@/actions/auth";
import styles from "./LoginForm.module.css";

const initialState: AuthActionState = {};

interface LoginFormProps {
  pendingCountry?: string;
  embedded?: boolean;
  initialMode?: "signin" | "signup";
}

export function LoginForm({
  pendingCountry,
  embedded = false,
  initialMode = "signin",
}: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  const state =
    mode === "signin"
      ? signInState
      : mode === "signup"
        ? signUpState
        : resetState;
  const pending =
    mode === "signin"
      ? signInPending
      : mode === "signup"
        ? signUpPending
        : resetPending;
  const title =
    mode === "signin"
      ? "Sign in"
      : mode === "signup"
        ? "Create account"
        : "Reset password";

  const header = (
    <div className={styles.header}>
      <CardTitle as="h2" id={embedded ? "auth-modal-title" : undefined}>
        {title}
      </CardTitle>
      {pendingCountry ? (
        <p className={styles.pendingNation}>
          You chose <strong>{pendingCountry}</strong> — sign in to follow their
          journey.
        </p>
      ) : null}
    </div>
  );

  const tabs =
    mode === "forgot" ? null : (
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
    );

  const formAction =
    mode === "signin"
      ? signInAction
      : mode === "signup"
        ? signUpAction
        : resetAction;

  const form = (
    <form action={formAction} className={styles.form}>
      {pendingCountry && mode !== "forgot" ? (
        <input type="hidden" name="pendingCountry" value={pendingCountry} />
      ) : null}
      {mode === "signup" ? (
        <Input
          label="Display name"
          name="displayName"
          placeholder="Your fan name"
        />
      ) : null}
      {mode === "forgot" ? (
        <p className={styles.forgotHint}>
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      ) : null}
      <Input
        label="Email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
      />
      {mode !== "forgot" ? (
        <>
          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="At least 8 characters"
          />
          {mode === "signin" ? (
            <button
              type="button"
              className={styles.textLink}
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
          ) : null}
        </>
      ) : null}
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      {state.success ? <p className={styles.success}>{state.success}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending
          ? "Please wait…"
          : mode === "signin"
            ? "Sign in"
            : mode === "signup"
              ? "Create account"
              : "Send reset link"}
      </Button>
      {mode === "forgot" ? (
        <button
          type="button"
          className={styles.textLink}
          onClick={() => setMode("signin")}
        >
          Back to sign in
        </button>
      ) : null}
    </form>
  );

  if (embedded) {
    return (
      <div className={styles.embedded}>
        {header}
        {tabs}
        {form}
      </div>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader>{header}</CardHeader>
      <CardContent>
        {tabs}
        {form}
      </CardContent>
    </Card>
  );
}
