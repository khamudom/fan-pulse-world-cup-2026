"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthModal } from "./AuthModalProvider";

export function ResetPasswordPageOpener() {
  const router = useRouter();
  const { openResetPasswordModal } = useAuthModal();

  useEffect(() => {
    openResetPasswordModal();
    router.replace("/");
  }, [openResetPasswordModal, router]);

  return null;
}
