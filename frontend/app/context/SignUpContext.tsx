'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";


interface mediaurls{
    type: string;
    url: string;
}

interface businessHours{
    dayofWeek: string;
    openingTime: string;
    closingTime: string;
    specialNote?: string;
}

interface BusinessDetails {
    name: string;
    verified: boolean;
    address: string;
    businessEmail: string;
    phoneNumber: string;
    categoryId?: string;
    subCategoryIds?: string[];
    totalRating: string;
    website: string;
    about: string;
    mediaUrls?: mediaurls[];
    businessHours?: businessHours[];
}

interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
    businesses?: BusinessDetails;
}

interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  submitSignup: () => Promise<void>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
  };

  const submitSignup = async () => {
    try {
      const response = await axios.post("http://localhost:8787/api/v1/user/signup", signupData, {
        withCredentials: true,
      });

      Cookies.set("accessToken", response.data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      console.log("Signup successful");
      alert("Account Created Successfully");
    } catch (err: any) {
      console.error(err.response?.data?.error || "Something Went Wrong");
    }
  };

  return (
    <SignupContext.Provider value={{ signupData, updateSignupData, submitSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
