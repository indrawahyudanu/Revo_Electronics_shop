"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Bentuk user yang disimpan setelah login/register (lihat LoginForm & RegisterForm)
export interface AuthUser {
  id: number | string;
  username?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoggedIn: boolean;
  // true setelah sesi dipulihkan dari localStorage (hindari flicker/guard salah)
  ready: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // Pulihkan sesi saat mount dari localStorage ('user' diisi oleh Login/Register)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {
      // abaikan JSON rusak
    } finally {
      setReady(true);
    }
  }, []);

  function login(user: AuthUser) {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoggedIn: currentUser !== null, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
