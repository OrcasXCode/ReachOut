import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isSignedIn: boolean;
  setIsSignedIn: () => void;
  checkTokenExpiration: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const checkTokenExpiration = () => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) return false;

        try {
          const decodedToken = jwtDecode<{ exp: number }>(accessToken);
          console.log(decodedToken);
          return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
          console.error("Error decoding token:", error);
          return false;
        }
      };

      return {
        isSignedIn: checkTokenExpiration(),
        // setIsSignedIn: () => {
        //   set({ isSignedIn: checkTokenExpiration() });
        //   window.dispatchEvent(new Event("authChange")); // 🔹 Force reactivity
        // },
        setIsSignedIn: () => {
          set({ isSignedIn: true }); 
          window.dispatchEvent(new Event("authChange")); 
        },
        checkTokenExpiration,
      };
    },
    { name: "auth-store" }
  )
);
