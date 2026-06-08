"use client";

import { Dialog } from "@khamudom/lumen-ui-react";
import type { RefObject } from "react";
import { LoginForm } from "@/components/LoginForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  pendingCountry?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "signin",
  pendingCountry,
  returnFocusRef,
}: AuthModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      returnFocusRef={returnFocusRef}
      aria-labelledby="auth-modal-title"
    >
      <LoginForm
        key={`${open}-${initialMode}-${pendingCountry ?? ""}`}
        embedded
        initialMode={initialMode}
        pendingCountry={pendingCountry}
      />
    </Dialog>
  );
}
