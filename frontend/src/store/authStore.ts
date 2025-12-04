import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  loadFromStorage: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // Save user + token
  setAuth: (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
  },

  // Load user + token on refresh
  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      set({ user: parsedUser, token });
    }
  },

  // Remove everything and logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  }
}));
