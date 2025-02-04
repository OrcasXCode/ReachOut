import { create } from "zustand";

interface AuthState {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: true, 
  setIsSignedIn: (value) => set({ isSignedIn: value }),
}));
