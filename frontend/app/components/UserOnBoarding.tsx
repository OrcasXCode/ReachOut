"use client";

import React, { useState } from "react";
import { useSignup } from "../context/SignUpContext";
import { useAuthStore } from "../lib/useAuthStore";
import axios from "axios";

const Categories = [
  { value: "businessman", label: "Businessman" },
  { value: "teacher", label: "Teacher" },
  { value: "housewife", label: "Housewife" },
  { value: "freelancer", label: "Freelancer" },
  { value: "student", label: "Student" },
  { value: "shopkeeper", label: "Shopkeeper" },
  { value: "vendor", label: "Vendor" }, // Consolidated "Street Vendor"
  { value: "cook", label: "Cook" },
  { value: "artist", label: "Artist" }, // Covers "Makeup Artist", "Tattoo Artist", "Beautician"
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "photographer", label: "Photographer" },
  { value: "fitness_trainer", label: "Fitness Trainer" },
  { value: "musician", label: "Musician" },
  { value: "tutor", label: "Tutor" },
  { value: "event_planner", label: "Event Planner" },
  { value: "tailor", label: "Tailor" },
  { value: "driver", label: "Driver" }, // Consolidated "Taxi Driver"
  { value: "mechanic", label: "Mechanic" },
  { value: "handyman", label: "Handyman" }, // Consolidated "Repair Technician"
  { value: "astrologer", label: "Astrologer" },
  { value: "pet_groomer", label: "Pet Groomer" },
  { value: "security_guard", label: "Security Guard" },
  { value: "home_maid", label: "Home Maid" },
  { value: "baby_sitter", label: "Baby Sitter" },
  { value: "laundry_service_provider", label: "Laundry Service Provider" },
  { value: "gardener", label: "Gardener" },
  { value: "carpenter", label: "Carpenter" },
  { value: "pest_control_worker", label: "Pest Control Worker" },
  { value: "delivery_agent", label: "Delivery Agent" },
  { value: "dancer", label: "Dancer" },
  { value: "yoga_instructor", label: "Yoga Instructor" }
];

export default function UserOnBoarding() {

  const {submitSignup,signupData, updateSignupData } = useSignup();
  const { setIsSignedIn } = useAuthStore();

  const [selectedUserDomain, setSelectedUserDomain] = useState<string | null>(null);

  const handleCategoryChange = (value: string) => {
    setSelectedUserDomain(value);
    updateSignupData({ userDomains: value });
  };
  


  // const handleSubmit = async () => {
  //   if (!selectedUserDomain) {
  //     alert("Please select a category.");
  //     return;
  //   }
  //   try {
  //     const updatedData = {
  //       userDomain: selectedUserDomain, // Pass a single string
  //     };
  
  //     updateSignupData(updatedData);
  
  //     await submitSignup({
  //       ...signupData,
  //       ...updatedData,
  //     });
  
  //     console.log("User Account created successfully!");
  //     alert("User Account created successfully!");
  //   } catch (error) {
  //     console.error("Error creating business:", error);
  //     alert("Failed to create business. Please try again.");
  //   }
  // }; 

 
  const handleSubmit = async () => {
    const payload = {
      ...signupData,
      userDomain: signupData.userDomains, 
    };

    console.log("Final payload before sending:", payload);

    try {
      const response = await axios.post("http://localhost:8787/api/v1/auth/signup", payload, {
        withCredentials:true
      });

      console.log("Response:", response.data);
    } 
    catch (error:any) {
      console.error("Error:", error.response?.data || error.message);
    }
  }
  


  return (
    <div className="w-100vw h-100vh flex flex-col items-center p-5">
      {/* Step 1: Select Category */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl rounded-md">
            <h2 className="text-lg font-semibold mb-3">Select Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Categories.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out ${
                    selectedUserDomain?.includes(category.value)
                      ? "bg-black text-white"
                      : "bg-white text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={selectedUserDomain === category.value}
                    onChange={() => handleCategoryChange(category.value)}
                    className="w-4 h-4 text-black accent-black"
                  />
                  <span className="text-gray-400">{category.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="border-2 border-gray-400 hover:bg-black hover:text-white transition-all duration-300 ease-in-out p-2 px-7 rounded-full"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
