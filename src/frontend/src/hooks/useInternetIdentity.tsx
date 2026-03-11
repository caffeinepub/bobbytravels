// Internet Identity is not used in this app.
// This stub exists to satisfy any remaining imports without crashing.
export function useInternetIdentity() {
  return {
    identity: undefined,
    login: () => {},
    clear: () => {},
    loginStatus: "idle" as const,
    isInitializing: false,
    isLoginIdle: true,
    isLoggingIn: false,
    isLoginSuccess: false,
    isLoginError: false,
    loginError: undefined,
  };
}

export function InternetIdentityProvider({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
