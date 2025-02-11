'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface MediaUrls {
  type: string;
  url: string;
}

interface BusinessHours {
  dayofWeek: string;
  openingTime: string;
  closingTime: string;
  specialNote?: string;
}

interface BusinessData {
  name: string;
  verified: boolean;
  address: string;
  businessEmail: string;
  phoneNumber: string;
  categoryId?: string;
  subCategoryIds?: string[];
  totalRating: number;
  website: string;
  about: string;
  mediaUrls?: MediaUrls[];
  businessHours?: BusinessHours[];
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  businesses?: BusinessData;
}

interface SignupContextType {
  signupData: SignupData;
  businessData: BusinessData;
  updateSignupData: (data: Partial<SignupData>) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  submitSignup: (data: SignupData) => Promise<void>
  submitCreateBusiness: (data: BusinessData) => Promise<void>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "USER", // Default to USER or BUSINESS
  });

  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    verified: false,
    address: "",
    businessEmail: "",
    phoneNumber: "",
    categoryId: "",
    subCategoryIds: [],
    totalRating: 0,
    website: "",
    about: "",
    mediaUrls: [],
    businessHours: [],
  });

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => {
      const updatedData = { ...prev, ...data };
      console.log("Signup Data Updated:", updatedData);
      return updatedData;
    });
  };

  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessData((prev) => {
      const updatedBusinessData = { ...prev, ...data };
      console.log("Business Data Updated:", updatedBusinessData);
      return updatedBusinessData;
    });
  };

  const submitSignup = async (data: SignupData) => {
    try {
      console.log("Sending Signup data:", data);
  
      const response = await axios.post("http://localhost:8787/api/v1/user/signup", data, {
        withCredentials: true,
      });
  
      Cookies.set("accessToken", response.data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
  
      console.log("Signup successful");
    } catch (err: any) {
      console.error(err.response?.data?.error || "Something Went Wrong");
    }
  };
  

  const submitCreateBusiness = async (data:BusinessData) => {
    try {
      console.log("Sending Business Data:",data);
      const response = await axios.post("http://localhost:8787/api/v1/business/create",data, {
        withCredentials: true,
      });

      Cookies.set("accessToken", response.data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      console.log("Business Created successfully");
      alert("Account Created Successfully With Business");
    } catch (err: any) {
      console.error(err.response?.data?.error || "Something Went Wrong");
    }
  };

  return (
    <SignupContext.Provider
      value={{ signupData, businessData, updateSignupData, updateBusinessData, submitSignup, submitCreateBusiness }}
    >
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
