import { useInternetIdentity } from "./useInternetIdentity";

export function useAuth() {
  const { identity, login, clear, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isLoggedIn ? identity!.getPrincipal().toString() : null;

  return {
    isLoggedIn,
    isInitializing,
    principal,
    login, // triggers Internet Identity popup
    logout: clear,
  };
}
