import { cookies, headers } from "next/headers";
import {
  parseThemePreference,
  prefersDarkFromHeaders,
  resolveTheme,
  THEME_COOKIE_NAME,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

export type ThemeState = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
};

export async function getThemeState(): Promise<ThemeState> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const preference =
    parseThemePreference(cookieStore.get(THEME_COOKIE_NAME)?.value) ?? "system";
  const resolvedTheme = resolveTheme(
    preference,
    prefersDarkFromHeaders(headerStore)
  );
  return { preference, resolvedTheme };
}
