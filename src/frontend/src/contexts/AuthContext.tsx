import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "../backend.d";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "bt_session_token";

interface AuthContextValue {
  sessionToken: string | null;
  currentUser: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  sessionToken: null,
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [sessionToken, setSessionToken] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing session on mount / actor ready
  useEffect(() => {
    if (isFetching || !actor) return;
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = actor as unknown as Record<string, any>;
    if (typeof a.validateSession === "function") {
      a.validateSession(token)
        .then((user: User | null) => {
          if (user) {
            setCurrentUser(user);
            setSessionToken(token);
          } else {
            localStorage.removeItem(SESSION_KEY);
            setSessionToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem(SESSION_KEY);
          setSessionToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [actor, isFetching]);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem(SESSION_KEY, token);
    setSessionToken(token);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionToken(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sessionToken,
        currentUser,
        isLoading,
        login,
        logout,
        isAdmin: currentUser?.isAdmin === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
