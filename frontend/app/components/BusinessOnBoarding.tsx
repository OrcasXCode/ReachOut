"use client";

import React , { useState ,useEffect,useRef } from "react";
import {  Radio } from "@heroui/react";
import {Typography} from "@material-tailwind/react";
import axios from 'axios';
import { useSignup } from "../context/SignUpContext";
// import { subCategories } from "../business/page";


interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
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


export default function OnBoarding() {
  const {updateBusinessData, submitSignup, submitCreateBusiness , signupData, mediaUrls} = useSignup();
  const [step, setStep] = useState<number>(3);
  const [categoryId, setcategoryId] = useState<string | null>(null);
  const [subCategoryIds, setsubCategoryIds] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedOver, setDraggedOver] = useState(false);
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");

  interface MediaUrls {
    type: string;
    url: string;
  }


  const [businessDetails, setBusinessDetails] = useState({
    name: "Sandy Saloon",
    businessEmail: "sandy@gmail.com",
    address: "jhwfbds",
    verified: false,
    phoneNumber: "9429084446",
    website: "sandy.com",
    city: city,
    state: state,
    postalcode: zip,
    landmark: landmark,
    businessType:"ESTABLISHED_BUSINESS",
    about: "kjwdfkjsdf",
    totalRating: 0,
    categoryId: "",
    subCategoryIds: [] as string[],
    mediaUrls: [] as { type: string; url: string }[],
    businessHours: [
      { dayofWeek: "MONDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "TUESDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "WEDNESDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "THURSDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "FRIDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "SATURDAY", openingTime: "09:00", closingTime: "18:00" },
      { dayofWeek: "SUNDAY", openingTime: "09:00", closingTime: "18:00" },
    ],
  });

    // Handle file addition
  const addFile = (file: File) => {
    const objectURL = URL.createObjectURL(file);
    setFiles((prevFiles) => ({ ...prevFiles, [objectURL]: file }));
  };


  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
        for (const file of e.dataTransfer.files) {
            addFile(file);
        }
    }
    setDraggedOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
        setDraggedOver(true);
    }
  };

  const handleDragLeave = () => {
      setDraggedOver(false);
  };

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


  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

  const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => ({
        ...prevFiles,
        ...Object.fromEntries(newFiles.map((file) => [URL.createObjectURL(file), file])),
    }));
  };
  // const handleDelete = (objectURL: string) => {
  //   setFiles((prevFiles) => {
  //     const updatedFiles = { ...prevFiles };
  //     delete updatedFiles[objectURL];  // Delete the file based on its URL
  //     return updatedFiles;
  //   });
  // };

  // const handleCancel = () => {
  //   setFiles({});
  // };

  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      let uploadedMediaUrls: MediaUrls[] = [];  // Initialize the array to store media URLs

      if (files && files.length > 0) {
        // Loop over each file and create a media URL
        Array.from(files).forEach((file) => {
          // You can process the file here and create the media URL directly
          const fileUrl = URL.createObjectURL(file);  // Generates a temporary URL for the file
  
          // Add the file to the uploadedMediaUrls array
          uploadedMediaUrls.push({
            type: file.type.startsWith("image") ? "image" : "file",  // Adjust type based on file type
            url: fileUrl,
          });
        });
      }
  
      // Prepare business data
      const updatedBusinessData = {
        ...businessDetails,
        categoryId: businessDetails.categoryId ?? null,
        mediaUrls: uploadedMediaUrls,
      };
  
      // Update business data in context
       updateBusinessData({
        ...businessDetails,
        categoryId: businessDetails.categoryId ?? null,
        mediaUrls: uploadedMediaUrls,
      });
  
      // Sign up user first
      await submitSignup(signupData);
  
      // Then create business
      await submitCreateBusiness(updatedBusinessData);
  
      console.log("Business created successfully!");
      alert("Business created successfully!");
  
      
    } catch (error) {
      console.error("Error creating business:", error);
      alert("Failed to create business. Please try again.");
    }
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

  async function getLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const API_KEY = "3276956a71704e8fb07cb00684882166"; // Replace with your OpenCage API key
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const result = data.results[0];
          const components = result.components;

          setCity(components.city || components.town || components.village || "");
          setState(components.state || "");
          setZip(components.postcode || "");
          setLandmark(result.formatted || ""); // Full formatted address
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to retrieve location. Please enable location services.");
      }
    );
  }

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
            
          {/* Name & Description */}
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
                onChange={(e) => handleInputChange("businessEmail", e.target.value)}
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

          {/* get location & Website */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full">
                <button
                  className="block w-full rounded-md px-3 py-1.5 text-base  outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm  bg-blue-600 text-white"
                  onClick={getLocation} 
                >Use Current Location</button>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 mb-2">Website (Optional)</label>
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

          {/* city,state,postalcode,landmark,address */}
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full space-y-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  value={city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  value={state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  value={zip}
                  onChange={(e) => handleInputChange("postalcode", e.target.value)}
                />
            </div>
            <div className="w-full space-y-3">
                <label className="block text-sm font-medium text-gray-900 mb-2 ">Address</label>
                <textarea
                  // onChange={onChange}
                  rows={5}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-900 mb-2">Landmark</label>
                <input
                  // onChange={onChange}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder=""
                  required
                  value={landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                />
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
                  onChange={(e) => handleInputChange("totalRating", e.target.value)}
                />
            </div>
          </div>

          {/* Business Timings & Media Upload */}
          <div className="mb-6 flex flex-col items-start gap-4 md:flex-row">
              <div className="w-full">
                 {/* Business Time */}
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
                 {/* File Upload Section */}
                  <div className="sm:col-span-full">
                    <article
                        aria-label="File Upload Modal"
                        className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >

                        {/* Scroll Area */}
                        <section className="h-full overflow-auto p-8 w-full flex flex-col">
                            <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                    <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
                                </p>
                                <input
                                    id="hidden-input"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                />
                                <button
                                    id="button"
                                    type="button" // Prevent form submission
                                    className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Upload a file
                                </button>
                            </header>

                            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">To Upload</h1>

                            <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                                {Object.keys(files).length === 0 ? (
                                    <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center">
                                        <img
                                            className="mx-auto w-32"
                                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                                            alt="no data"
                                        />
                                        <span className="text-small text-gray-500">No files selected</span>
                                    </li>
                                ) : (
                                    Object.entries(files).map(([objectURL, file]) => (
                                        <li key={objectURL} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                                            <article
                                                tabIndex={0}
                                                className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm"
                                            >
                                                {file.type.match("image.*") && (
                                                    <img
                                                        alt="upload preview"
                                                        className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
                                                        src={objectURL}
                                                    />
                                                )}
                                                <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                                                    <h1 className="flex-1 group-hover:text-blue-800">{file.name}</h1>
                                                    <div className="flex">
                                                        <span className="p-1 text-blue-800">
                                                            <i>
                                                                <svg
                                                                    className="fill-current w-4 h-4 ml-auto pt-1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                                                </svg>
                                                            </i>
                                                        </span>
                                                        <p className="p-1 size text-xs text-gray-700">
                                                            {file.size > 1024
                                                                ? file.size > 1048576
                                                                    ? Math.round(file.size / 1048576) + "mb"
                                                                    : Math.round(file.size / 1024) + "kb"
                                                                : file.size + "b"}
                                                        </p>
                                                        <button
                                                            className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                                                            // onClick={() => handleDelete(objectURL)}
                                                        >
                                                            <svg
                                                                className="pointer-events-none fill-current w-4 h-4 ml-auto"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    className="pointer-events-none"
                                                                    d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </section>
                                            </article>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </section>

                        {/* Sticky Footer */}
                        {/* <footer className="flex justify-end px-8 pb-8 pt-4">
                            <button
                                id="submit"
                                type="button" // Prevent form submission
                                className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                                onClick={handleMediaSubmit}
                            >
                                Upload now
                            </button>
                            <button
                                id="cancel"
                                type="button" // Prevent form submission
                                className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </footer> */}
                    </article>
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
      </section>
      )}
    </div>
  );
}