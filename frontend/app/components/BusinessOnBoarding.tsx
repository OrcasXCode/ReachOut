"use client";

import React , { useState ,useEffect } from "react";
import {  Radio } from "@heroui/react";
import {Typography} from "@material-tailwind/react";
import axios from 'axios';
import { useSignup } from "../context/SignUpContext";
import { subCategories } from "../business/page";

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface MediaUrl {
  type: string;
  url: string;
}

interface BusinessHour {
  dayofWeek: string;
  openingTime: string;
  closingTime: string;
  specialNote?: string;
}

export const CustomRadio = (props: any) => {

  const [date, setDate] = React.useState();

  const { children, ...otherProps } = props;
  return (
    <Radio
      {...otherProps}
      className="inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[300px] cursor-pointer border-gray-400 gap-4 p-2 pr-5 pl-5 rounded-full hover:border
          data-[selected=true]:border-primary transition-all duration-300 ease-in-out"
    >
      {children}
    </Radio>
  );
};

interface File{
  type:string;
  url:string;
}

export default function OnBoarding() {

  const { updateSignupData, submitSignup } = useSignup();
  const [step, setStep] = useState<number>(1);
  const [name,setName] = useState<string | null>(null);
  const [email,setEmail] = useState<string | null>(null);
  const [address,setAddress] = useState<string | null>(null);
  const [verified,setVerified] = useState<boolean | null>(false);
  const [phoneNumber,setPhoneNumber] = useState<string | null>(null);
  const [website,setWebsite] = useState<string | null>(null);
  const [about,setAbout] = useState<string | null>(null);
  const [totalrating,settotalRating] = useState<string | null>("0.0");
  const [categoryId, setcategoryId] = useState<string | null>(null);
  const [subCategoryIds, setsubCategoryIds] = useState<string[]>([]);
  // const [mediaUrls, setmediaUrls] = useState<File[]>([]);

  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    email: "",
    address: "",
    verified: "False",
    phoneNumber: "",
    website: "",
    about: "",
    totalrating: "0.0",
    categoryId: null as string | null,
    subCategoryIds: [] as string[],
    mediaUrls: [] as File[],
    businessHours: [
      { dayofWeek: "Monday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Tuesday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Wednesday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Thursday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Friday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Saturday", openingTime: "21:00", closingTime: "12:00" },
      { dayofWeek: "Sunday", openingTime: "21:00", closingTime: "12:00" },
    ],
  });

  const handleInputChange = (field: keyof typeof businessDetails, value: string) => {
    setBusinessDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessHourChange = (day: string, field: "openingTime" | "closingTime", value: string) => {
    setBusinessDetails((prev) => ({
      ...prev,
      businessHours: prev.businessHours.map((hour) =>
        hour.dayofWeek === day ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  const handleSubmit = () => {
    updateSignupData({ 
        businesses: {
            name: name ?? "", 
            businessEmail: email ?? "", // Ensures it's always a string
            address: address ?? "", 
            verified: verified ?? false,
            phoneNumber: phoneNumber ?? "",
            website: website ?? "",
            about: about ?? "",
            totalRating: totalrating ?? "0.0",
            categoryId: categoryId ?? undefined,
            subCategoryIds,
            mediaUrls: [],
            businessHours: []
        } 
    });
    submitSignup(); 
};


  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/category/getAll');
        const categories: Category[] = response.data.allCategories;
        setFetchedCategories(categories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
      }
    };    
    fetchCategories();
  }, []);
  useEffect(() => {
    console.log("Updated categories:", fetchedCategories);
  }, [fetchedCategories]);


  const handleCategoryChange = (value: string) => {
    setcategoryId(value);
    setsubCategoryIds([]);
    setBusinessDetails(prev => ({
      ...prev,
      categoryId: value,
      subCategoryIds: []
    }));
  };
  
  const handleSubCategoryClick = (value: string) => {
    setsubCategoryIds(prev =>
      prev.includes(value) ? prev.filter(sub => sub !== value) : [...prev, value]
    );
    setBusinessDetails(prev => ({
      ...prev,
      subCategoryIds: prev.subCategoryIds.includes(value)
        ? prev.subCategoryIds.filter(sub => sub !== value)
        : [...prev.subCategoryIds, value]
    }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = Array.from(e.target.files || []);
  //   setmediaUrls(selectedFiles);
  // };

  // const handleRemoveFile = (fileToRemove: File) => {
  //   setmediaUrls((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  // };

  // const shortenFileName = (fileName: string) => {
  //   const words = fileName.split(" ");
  //   if (words.length > 1) {
  //     return words.slice(0, 1).join(" ") + "...";
  //   }
  //   return fileName;
  // };

  const handleNext = () => {
    if (step === 1 && ! categoryId) {
      alert("Please select a category.");
      return;
    }
    if (step === 2 && subCategoryIds.length === 0) {
      alert("Please select at least one subcategory.");
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
              {fetchedCategories?.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out ${
                    categoryId === category.id
                      ? "bg-black text-white"
                      : "bg-white text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    value={category.id}
                    checked={categoryId === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 text-black accent-black"
                  />
                  <span className="text-gray-400">{category.name}</span>
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

      {/* Step 2: Select Subcategory */}
      {step === 2 && (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl rounded-md">
            <h2 className="text-lg font-semibold mb-3">Select Sub Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fetchedCategories.find((cat) => cat.id === categoryId)?.subCategories.map(
                (subCategory) => (
                  <label
                    key={subCategory.id}
                    className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out ${
                      subCategoryIds.includes(subCategory.id)
                        ? "bg-black text-white"
                        : "bg-white text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox" // Use checkbox for multiple selections
                      value={subCategory.id}
                      checked={subCategoryIds.includes(subCategory.id)}
                      onChange={() => handleSubCategoryClick(subCategory.id)}
                      className="w-4 h-4 text-black accent-black"
                    />
                    <span className="text-gray-400">{subCategory.name}</span>
                  </label>
                )
              )}
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

      {/* Step 3: Business Profile */}
      {step === 3 && (
        <section className="px-8 py-20 container mx-auto">
        <Typography variant="h5" color="blue-gray">
          Business Information
        </Typography>
        <Typography
          variant="small"
          className="text-gray-600 font-normal mt-1"
        >
          Fill up your business details to get discovered
        </Typography>
        <div className="flex flex-col mt-8">
            
          {/* Name & Address */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
              <input
                // onChange={onChange}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                placeholder=""
                required
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
            </div>
          </div>
          
          {/* Email & Phone Number */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                // onChange={onChange}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                placeholder=""
                required
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
            </div>
          </div>

          {/* Description & Website */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <input
                // onChange={onChange}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                placeholder=""
                required
                onChange={(e) => handleInputChange("about", e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                  <div className="flex">
                    <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-l-md dark:bg-gray-300">https://</span>
                    <input
                        // onChange={onChange}
                        type="text"
                        className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                        placeholder=""
                        required
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />                    
                  </div>
            </div>
          </div>
          
          {/* Current League & Rating */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Current League</label>
              <input
                // onChange={onChange}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                placeholder="Bronze"
                required
                disabled={true}
                onChange={(e) => handleInputChange("verified", e.target.value)}
              />
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 mb-2">Rating</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder="0.0"
                  required
                  disabled={true}
                  onChange={(e) => handleInputChange("totalrating", e.target.value)}
                />
            </div>
          </div>

          {/* Business Timings & Media Upload */}
          <div className="mb-6 flex flex-col items-start gap-4 md:flex-row">
              {/* <div className="w-full">
                <form className="mx-auto grid grid-cols-1 gap-4 p-2 rounded-lg">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex flex-row gap-2 bg-white rounded-lg ">
                      <p className="font-medium text-gray-900 flex items-end w-[50%]">{day}</p>
                      <div className="flex w-[50%] justify-between items-center">
                        <div>
                          <label htmlFor={`${day.toLowerCase()}-start`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                            Open time:
                          </label>
                          <div className="relative">
                            <input type="time" id={`${day.toLowerCase()}-start`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required 
                            value={businessDetails.businessHours.find((hour) => hour.dayofWeek === day)?.[field] || ""}
                            onChange={(e) => handleBusinessHourChange(day, field, e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`${day.toLowerCase()}-end`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                            Close time:
                          </label>
                          <div className="relative">
                            <input type="time" id={`${day.toLowerCase()}-end`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required
                            value={businessDetails.businessHours.find((hour) => hour.dayofWeek === day)?.[field] || ""}
                            onChange={(e) => handleBusinessHourChange(day, field, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </form>
              </div> */}
              <div className="w-full">
                <form className="mx-auto grid grid-cols-1 gap-4 p-2 rounded-lg">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex flex-row gap-2 bg-white rounded-lg">
                      <p className="font-medium text-gray-900 flex items-end w-[50%]">{day}</p>
                      <div className="flex w-[50%] justify-between items-center">
                        {/* Start Time */}
                        <div>
                          <label htmlFor={`${day.toLowerCase()}-start`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                            Open time:
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              id={`${day.toLowerCase()}-start`}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              min="09:00"
                              max="18:00"
                              required
                              value={
                                businessDetails.businessHours.find((hour) => hour.dayofWeek === day)?.openingTime || "09:00"
                              }
                              onChange={(e) => handleBusinessHourChange(day, "openingTime", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* End Time */}
                        <div>
                          <label htmlFor={`${day.toLowerCase()}-end`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                            Close time:
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              id={`${day.toLowerCase()}-end`}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              min="09:00"
                              max="18:00"
                              required
                              value={
                                businessDetails.businessHours.find((hour) => hour.dayofWeek === day)?.closingTime || "21:00"
                              }
                              onChange={(e) => handleBusinessHourChange(day, "closingTime", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </form>
              </div>

              {/* file upload */}
              {/* <div className="w-full">
                <div className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                  <div className="grid gap-1">
                    <svg
                      className="mx-auto"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="File">
                        <path
                          id="icon"
                          d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                          fill="#4F46E5"
                        />
                      </g>
                    </svg>
                    <h2 className="text-center text-gray-400 text-xs leading-4">
                      PNG, JPG, GIF, MP4, MOV, etc. (Photos and Videos only)
                    </h2>
                  </div>
                  <div className="grid gap-2">
                    <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                      Drag and Drop your file here or
                    </h4>
                    <div className="flex items-center justify-center">
                      <label>
                        <input
                          type="file"
                          hidden
                          accept="image/*, video/*" 
                          multiple 
                          onChange={handleFileChange}
                        />
                        <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                          Choose File
                        </div>
                      </label>
                    </div>
                  </div>
                  {mediaUrls.length > 0 && (
                    <div className="mt-4 p-3">
                      <h3 className="text-gray-400 text-md font-semibold mb-2">
                        Uploaded Files:
                      </h3>
                      <ul className="space-y-2">
                        {mediaUrls.map((file, index) => (
                          <li
                            key={index}
                            className="p-2 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-400">{shortenFileName(file)}</span>
                            <div>
                              <span className="text-xs text-gray-400">
                                {(mediaUrls.size / 1024).toFixed(1)} KB
                              </span>
                              <button
                                className="text-red-500 text-sm ml-2"
                                onClick={() => handleRemoveFile(file)}
                              >
                                &#10005;
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div> */}
          </div>
        </div>   
      </section>
      )}
    </div>
  );
}