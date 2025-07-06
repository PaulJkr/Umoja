import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "farmer" | "buyer" | "admin" | "supplier";
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
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
    const stored = localStorage.getItem("user");
    if (stored) set({ user: JSON.parse(stored) });
  },
}));
