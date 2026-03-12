import { type ReactNode, createElement } from "react";

// Stub — no @dfinity imports. App uses email/password auth via backend.
export type Status =
  | "idle"
  | "logging-in"
  | "success"
  | "loginError"
  | "initializing";

export type InternetIdentityContext = {
  identity: undefined;
  login: () => void;
  clear: () => void;
  loginStatus: Status;
  isInitializing: boolean;
  isLoginIdle: boolean;
  isLoggingIn: boolean;
  isLoginSuccess: boolean;
  isLoginError: boolean;
  loginError?: Error;
};

export function useInternetIdentity(): InternetIdentityContext {
  return {
    identity: undefined,
    login: () => {},
    clear: () => {},
    loginStatus: "idle",
    isInitializing: false,
    isLoginIdle: true,
    isLoggingIn: false,
    isLoginSuccess: false,
    isLoginError: false,
  };
}

export function InternetIdentityProvider({
  children,
}: { children: ReactNode }) {
  return createElement("div", { style: { display: "contents" } }, children);
}
