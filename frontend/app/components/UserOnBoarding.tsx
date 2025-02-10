"use client";

import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";

const Categories = [
  { value: "beauty", label: "Beauty" },
  { value: "food", label: "Food" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "automobile", label: "Automobile" },
  { value: "home_services", label: "Home Services" },
  { value: "fitness", label: "Fitness" },
  { value: "technology", label: "Technology" },
  { value: "fashion", label: "Fashion" },
  { value: "travel", label: "Travel" },
  { value: "events", label: "Events" },
  { value: "art", label: "Art" },
  { value: "pets", label: "Pets" },
  { value: "finance", label: "Finance" },
  { value: "real_estate", label: "Real Estate" },
  { value: "hospitality", label: "Hospitality" },
];

export default function OnBoarding() {
  const [step, setStep] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className="w-100vw h-100vh flex flex-col items-center p-5">
      {/* Step 1: Select Category */}
      {step === 1 && (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl rounded-md">
            <h2 className="text-lg font-semibold mb-3">Select Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Categories.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out ${
                    selectedCategories.includes(category.value)
                      ? "bg-black text-white"
                      : "bg-white text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={selectedCategories.includes(category.value)}
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
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
