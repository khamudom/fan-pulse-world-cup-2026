"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthModal } from "./AuthModalProvider";

interface LoginPageOpenerProps {
  country?: string;
}

export function LoginPageOpener({ country }: LoginPageOpenerProps) {
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    openAuthModal({ pendingCountry: country });
    router.replace("/");
  }, [country, openAuthModal, router]);

  return null;
}
