import { redirect } from "next/navigation";
import { ResetPasswordPageOpener } from "@/components/AuthModal";
import { getSessionUser, isSupabaseConfigured } from "@/lib/auth";
import styles from "../page.module.css";

export const metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        {!isSupabaseConfigured() ? (
          <div className={styles.notice}>
            <h1>Supabase not configured</h1>
            <p>
              Copy <code>.env.example</code> to <code>.env.local</code> and add
              your Supabase project URL and anon key.
            </p>
          </div>
        ) : (
          <ResetPasswordPageOpener />
        )}
      </div>
    </div>
  );
}
