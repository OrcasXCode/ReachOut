'use client'

import { createContext,useEffect, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../lib/useAuthStore";

interface MediaUrls {
  type: string;
  url: string;
}
interface ProfilePhoto {
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
  businessType: string,
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
  profilePhoto?: ProfilePhoto,
  businesses?: BusinessData;
  userDomains?: string;
}

interface SignupContextType {
  signupData: SignupData;
  businessData: BusinessData;
  updateSignupData: (data: Partial<SignupData>) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  submitSignup: (data: SignupData) => Promise<void>
  submitCreateBusiness: (data: BusinessData) => Promise<void>;
  mediaUrls: MediaUrls[]
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const { setIsSignedIn } = useAuthStore();
  
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "", 
    userDomains: "",
    profilePhoto: { type: "", url: "" },
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
    businessType:"",
    mediaUrls: [],
    businessHours: [],
  });

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => {
      const updatedData = { ...prev, ...data };
      console.log("updated signup data:", updatedData);
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
  useEffect(() => {
    console.log("Updated signupData:", signupData);
  }, [signupData]);
  

  const submitSignup = async (data: SignupData) => {
    try {
        console.log("Sending Signup data:", data);
    
        const response = await axios.post("http://localhost:8787/api/v1/auth/signup", data, {
            withCredentials: true,
        });

        if (!response.data || !response.data.accessToken) {
          throw new Error("Invalid response from server");
          alert("Invalid response from server");
        }

       
        if(response.status===200){
          Cookies.set("accessToken", response.data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: "Strict",
          });
          setIsSignedIn();
          console.log("Signup successful");
          alert("Signup successful");

          // setTimeout(() => {
          //   window.location.href="/sigin"
          // }, 500);
        }

       
    } catch (err: any) {
        console.error(err.response?.data?.error || err.message || "Something Went Wrong");
        alert("Something Went Wrong");
    }
};

  const submitCreateBusiness = async (data: BusinessData) => {
    try {
      const formData = new FormData();
  
      formData.append("name", data.name);
      formData.append("verified", data.verified.toString());
      formData.append("address", data.address);
      formData.append("businessEmail", data.businessEmail);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("categoryId", data.categoryId || "");
      formData.append("totalRating", data.totalRating.toString());
      formData.append("website", data.website);
      formData.append("about", data.about);
      formData.append("businessType", data.businessType);
      formData.append("subCategoryIds", JSON.stringify(data.subCategoryIds || []));
      formData.append("businessHours", JSON.stringify(data.businessHours || []));
  
      if (data.mediaUrls) {
        for (const media of data.mediaUrls) {
          const response = await fetch(media.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch media: ${media.url}`);
          }
          const blob = await response.blob();
          formData.append("mediaFiles", blob, `media-${Date.now()}.${blob.type.split("/")[1]}`);
        }
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }      
  
      const response = await axios.post(
        "http://localhost:8787/api/v1/business/create",
        formData,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Explicitly set this
          }, 
        }
      );
  
      if (!response || !response.data) {
        throw new Error("Something went wrong while creating business");
      }
  
      if(response.status===200){
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        
        setIsSignedIn();
        console.log("Business Created successfully");
        alert("Account Created Successfully With Business");
        
        setTimeout(() => {
          window.location.href = "/business";
        }, 500);
    
        console.log("Business created successfully:", response.data);
      }
    } catch (error: any) {
      console.error(error?.response?.data?.error || error.message || "Something Went Wrong");
    }
  };
  

  return (
    <SignupContext.Provider
      value={{
        signupData,
        businessData,
        updateSignupData,
        updateBusinessData,
        submitSignup,
        submitCreateBusiness,
        mediaUrls: businessData.mediaUrls || [],
      }}
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
