import "server-only";

import {
  WORLD_CUP_API_ORIGIN,
  WORLD_CUP_REQUEST_TIMEOUT_MS,
} from "./config";

type AuthResponse = {
  token?: string;
};

let cachedToken: string | null = null;

function getStaticToken(): string | null {
  const token = process.env.WORLD_CUP_API_TOKEN?.trim();
  return token || null;
}

function hasLoginCredentials(): boolean {
  return Boolean(
    process.env.WORLD_CUP_API_EMAIL?.trim() &&
      process.env.WORLD_CUP_API_PASSWORD,
  );
}

async function loginForToken(): Promise<string> {
  const email = process.env.WORLD_CUP_API_EMAIL?.trim();
  const password = process.env.WORLD_CUP_API_PASSWORD;

  if (!email || !password) {
    throw new Error("WORLD_CUP_API_NOT_CONFIGURED");
  }

  const response = await fetch(`${WORLD_CUP_API_ORIGIN}/auth/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    signal: AbortSignal.timeout(WORLD_CUP_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`World Cup API auth failed (${response.status})`);
  }

  const data = (await response.json()) as AuthResponse;
  if (!data.token) {
    throw new Error("World Cup API auth response missing token");
  }

  return data.token;
}

export function clearWorldCupApiToken(): void {
  cachedToken = null;
}

export async function getWorldCupApiToken(
  forceRefresh = false,
): Promise<string | null> {
  const staticToken = getStaticToken();
  if (staticToken) return staticToken;

  if (!hasLoginCredentials()) return null;
  if (!forceRefresh && cachedToken) return cachedToken;

  cachedToken = await loginForToken();
  return cachedToken;
}

export function hasWorldCupApiCredentials(): boolean {
  return Boolean(getStaticToken() || hasLoginCredentials());
}
