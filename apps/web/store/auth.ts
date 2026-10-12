import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const tokenKey = "codesign_access_token";
const userKey = "codesign_user";
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  accessToken: typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null,
  isAuthenticated: typeof window !== "undefined" ? Boolean(localStorage.getItem(tokenKey)) : false,
  login: (accessToken, user) => {
    const secureAttr = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
    localStorage.setItem(tokenKey, accessToken);
    localStorage.setItem(userKey, JSON.stringify(user));
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secureAttr}`;
    set({ accessToken, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    document.cookie = "accessToken=; path=/; max-age=0";
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));
