import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "bt_session";
const USERS_DB_KEY = "bt_users_db";
const ADMIN_EMAIL = "adityabholath@gmail.com";

export interface Session {
  email: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
}

interface StoredUser {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
  registeredAt: number;
}

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  });

  // Keep session in sync with storage changes (multiple tabs)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        try {
          setSession(e.newValue ? (JSON.parse(e.newValue) as Session) : null);
        } catch {
          setSession(null);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ ok: true } | { err: string }> => {
      const hash = await hashPassword(password);
      const users = getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return { err: "No account found with this email. Please register." };
      }
      if (user.passwordHash !== hash) {
        return { err: "Incorrect password. Please try again." };
      }

      const sess: Session = {
        email: user.email,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      setSession(sess);
      return { ok: true };
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      phone?: string,
    ): Promise<{ ok: true } | { err: string }> => {
      if (!email || !password || !name) {
        return { err: "Name, email and password are required." };
      }
      if (password.length < 6) {
        return { err: "Password must be at least 6 characters." };
      }

      const users = getUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          err: "An account with this email already exists. Please sign in.",
        };
      }

      const hash = await hashPassword(password);
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const newUser: StoredUser = {
        email,
        passwordHash: hash,
        name,
        phone: phone || undefined,
        isAdmin,
        registeredAt: Date.now(),
      };

      saveUsers([...users, newUser]);

      const sess: Session = {
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      setSession(sess);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const updateProfile = useCallback(
    (name: string, phone?: string) => {
      if (!session) return;
      const updated: Session = { ...session, name, phone };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setSession(updated);

      // Also update in users DB
      const users = getUsers();
      const idx = users.findIndex(
        (u) => u.email.toLowerCase() === session.email.toLowerCase(),
      );
      if (idx !== -1) {
        users[idx].name = name;
        users[idx].phone = phone;
        saveUsers(users);
      }
    },
    [session],
  );

  const getAllUsers = useCallback((): StoredUser[] => {
    return getUsers();
  }, []);

  return {
    session,
    isLoggedIn: !!session,
    login,
    register,
    logout,
    updateProfile,
    getAllUsers,
  };
}
