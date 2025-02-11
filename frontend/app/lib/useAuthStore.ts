import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 

interface AuthState {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  checkTokenExpiration: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const checkTokenExpiration = () => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) return false;

        try {
          const decodedToken = jwtDecode<{ exp: number }>(accessToken); 
          const currentTime = Date.now() / 1000;
          return decodedToken.exp > currentTime;
        } catch (error) {
          console.error("Error decoding token:", error);
          return false; 
        }
      };

      return {
        isSignedIn: !!Cookies.get("accessToken") && checkTokenExpiration(),
        setIsSignedIn: (value) => set({ isSignedIn: value }),
        checkTokenExpiration, 
      };
    },
    { name: "auth-store" }
  )
);
