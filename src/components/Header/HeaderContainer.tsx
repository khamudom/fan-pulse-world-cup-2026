import { getAuthContext } from "@/lib/auth";
import { getThemeState } from "@/lib/theme-request";
import { Header } from "./Header";

export async function HeaderContainer() {
  const [{ user, profile }, { resolvedTheme }] = await Promise.all([
    getAuthContext(),
    getThemeState(),
  ]);

  return (
    <Header
      signedIn={Boolean(user)}
      displayName={profile?.display_name ?? user?.email?.split("@")[0]}
      resolvedTheme={resolvedTheme}
    />
  );
}
