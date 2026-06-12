"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AuthModal } from "./AuthModal";
import { ResetPasswordModal } from "./ResetPasswordModal";

type AuthModalMode = "signin" | "signup";

interface OpenAuthModalOptions {
  mode?: AuthModalMode;
  pendingCountry?: string;
  nextPath?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

interface AuthModalContextValue {
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
  openResetPasswordModal: () => void;
  closeResetPasswordModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("signin");
  const [pendingCountry, setPendingCountry] = useState<string | undefined>();
  const [nextPath, setNextPath] = useState<string | undefined>();
  const [returnFocusRef, setReturnFocusRef] = useState<
    RefObject<HTMLElement | null> | undefined
  >();

  const openAuthModal = useCallback((options?: OpenAuthModalOptions) => {
    setReturnFocusRef(options?.returnFocusRef);
    setMode(options?.mode ?? "signin");
    setPendingCountry(options?.pendingCountry);
    setNextPath(options?.nextPath);
    setOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setOpen(false);
  }, []);

  const openResetPasswordModal = useCallback(() => {
    setResetPasswordOpen(true);
  }, []);

  const closeResetPasswordModal = useCallback(() => {
    setResetPasswordOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
      openResetPasswordModal,
      closeResetPasswordModal,
    }),
    [
      openAuthModal,
      closeAuthModal,
      openResetPasswordModal,
      closeResetPasswordModal,
    ],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        initialMode={mode}
        pendingCountry={pendingCountry}
        nextPath={nextPath}
        returnFocusRef={returnFocusRef}
      />
      <ResetPasswordModal
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
