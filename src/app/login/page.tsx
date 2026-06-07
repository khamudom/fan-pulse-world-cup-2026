import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser, isSupabaseConfigured } from "@/lib/auth";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const { country } = await searchParams;

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        {!isSupabaseConfigured() ? (
          <div className={styles.notice}>
            <h1>Supabase not configured</h1>
            <p>
              Copy <code>.env.example</code> to <code>.env.local</code> and add your Supabase
              project URL and anon key.
            </p>
          </div>
        ) : null}
        <LoginForm pendingCountry={country?.trim() || undefined} />
      </div>
    </div>
  );
}
