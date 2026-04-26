import { create } from "zustand";
import { api, setAccessToken, getAccessToken } from "./api";

// Lightweight cookie the middleware can read (path "/", not httpOnly)
function setSessionCookie() {
  document.cookie = "logged_in=1;path=/;max-age=604800;SameSite=Strict";
}
function clearSessionCookie() {
  document.cookie = "logged_in=;path=/;max-age=0;SameSite=Strict";
}

export type Role = "STARTUP" | "MENTOR" | "PARTNER" | "ADMIN";
export type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  subscriptionActive: boolean;
  emailVerified: boolean;
  isActive: boolean;
  isSuperAdmin: boolean;
  receiveIntroNotifications: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    const data = await api<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    await get().fetchUser();
    setSessionCookie();
  },

  logout: async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      // proceed even if logout call fails
    }
    setAccessToken(null);
    clearSessionCookie();
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const user = await api<User>("/auth/me");
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  initAuth: async () => {
    set({ isLoading: true });
    // Try to refresh token from cookie on app load
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        await get().fetchUser();
        setSessionCookie();
      } else {
        clearSessionCookie();
      }
    } catch {
      clearSessionCookie();
      // not authenticated
    }
    set({ isLoading: false });
  },
}));

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MENTOR":
      return "/mentor/dashboard";
    case "PARTNER":
      return "/partner/dashboard";
    case "STARTUP":
      return "/dashboard";
    default:
      return "/login";
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
