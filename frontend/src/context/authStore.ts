import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "farmer" | "buyer" | "admin" | "supplier";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
  loadUserFromStorage: () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        set({ user: JSON.parse(stored), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to parse user from storage", error);
      set({ isLoading: false });
    }
  },
}));
