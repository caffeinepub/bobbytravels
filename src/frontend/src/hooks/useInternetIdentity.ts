// Stub — Internet Identity removed. App uses email/password auth via backend.
import { createContext, createElement, useContext } from "react";
import type { ReactNode } from "react";

export type InternetIdentityContext = {
  identity: undefined;
  login: () => void;
  clear: () => void;
  loginStatus: string;
  isInitializing: boolean;
  isLoginIdle: boolean;
  isLoggingIn: boolean;
  isLoginSuccess: boolean;
  isLoginError: boolean;
  loginError: undefined;
};

const ctx = createContext<InternetIdentityContext>({
  identity: undefined,
  login: () => {},
  clear: () => {},
  loginStatus: "idle",
  isInitializing: false,
  isLoginIdle: true,
  isLoggingIn: false,
  isLoginSuccess: false,
  isLoginError: false,
  loginError: undefined,
});

export const useInternetIdentity = () => useContext(ctx);

export function InternetIdentityProvider({
  children,
}: { children: ReactNode }) {
  return createElement(
    ctx.Provider,
    {
      value: {
        identity: undefined,
        login: () => {},
        clear: () => {},
        loginStatus: "idle",
        isInitializing: false,
        isLoginIdle: true,
        isLoggingIn: false,
        isLoginSuccess: false,
        isLoginError: false,
        loginError: undefined,
      },
    },
    children,
  );
}
