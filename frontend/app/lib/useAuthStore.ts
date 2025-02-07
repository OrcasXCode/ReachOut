import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie"; // Import js-cookie to check for cookies

interface AuthState {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initialize isSignedIn based on the presence of the accessToken cookie
      isSignedIn: !!Cookies.get("accessToken"),
      setIsSignedIn: (value) => set({ isSignedIn: value }),
    }),
    { name: "auth-store" } // LocalStorage key
  )
);