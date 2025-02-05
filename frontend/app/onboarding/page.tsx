"use client";

import React , { useState ,useEffect } from "react";
import { RadioGroup, Radio } from "@heroui/react";
import {Typography} from "@material-tailwind/react";
import {Input} from "@heroui/react";


const Categories = [
  {
    value: "beauty",
    label: "Beauty",
    subcategories: [
      { value: "hair_care", label: "Hair Care" },
      { value: "skin_care", label: "Skin Care" },
      { value: "makeup", label: "Makeup" },
      { value: "nails", label: "Nails" },
      { value: "spa", label: "Spa" },
      { value: "mehndi", label: "Mehndi" },
      { value: "wedding_services", label: "Wedding Services" },
      { value: "salon", label: "Salon" },
    ],
  },
  {
    value: "food",
    label: "Food",
    subcategories: [
      { value: "restaurant", label: "Restaurant" },
      { value: "cafe", label: "Cafe" },
      { value: "bakery", label: "Bakery" },
      { value: "food_truck", label: "Food Truck" },
      { value: "catering", label: "Catering" },
      { value: "ice_cream", label: "Ice Cream" },
      { value: "fast_food", label: "Fast Food" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "non_vegetarian", label: "Non Vegetarian" },
      { value: "vegan", label: "Vegan" },
      { value: "juice_bar", label: "Juice Bar" },
    ],
  },
  {
    value: "health",
    label: "Health",
    subcategories: [
      { value: "pharmacy", label: "Pharmacy" },
      { value: "doctor", label: "Doctor" },
      { value: "dentist", label: "Dentist" },
      { value: "ayurveda", label: "Ayurveda" },
      { value: "homeopathy", label: "Homeopathy" },
      { value: "nutritionist", label: "Nutritionist" },
      { value: "wellness_center", label: "Wellness Center" },
      { value: "alternative_medicine", label: "Alternative Medicine" },
      { value: "clinic", label: "Clinic" },
    ],
  },
  {
    value: "education",
    label: "Education",
    subcategories: [
      { value: "school", label: "School" },
      { value: "tuition", label: "Tuition" },
      { value: "coaching", label: "Coaching" },
      { value: "language_classes", label: "Language Classes" },
      { value: "music_classes", label: "Music Classes" },
      { value: "dance_classes", label: "Dance Classes" },
      { value: "sports_training", label: "Sports Training" },
      { value: "computer_training", label: "Computer Training" },
      { value: "online_courses", label: "Online Courses" },
    ],
  },
  {
    value: "entertainment",
    label: "Entertainment",
    subcategories: [
      { value: "cinema", label: "Cinema" },
      { value: "theater", label: "Theater" },
      { value: "music_concert", label: "Music Concert" },
      { value: "comedy_show", label: "Comedy Show" },
      { value: "night_club", label: "Night Club" },
      { value: "art_gallery", label: "Art Gallery" },
      { value: "stadium", label: "Stadium" },
      { value: "park", label: "Park" },
      { value: "karaoke", label: "Karaoke" },
    ],
  },
  {
    value: "automobile",
    label: "Automobile",
    subcategories: [
      { value: "car_rental", label: "Car Rental" },
      { value: "bike_rental", label: "Bike Rental" },
      { value: "car_service", label: "Car Service" },
      { value: "car_wash", label: "Car Wash" },
      { value: "car_accessories", label: "Car Accessories" },
      { value: "car_sales", label: "Car Sales" },
    ],
  },
  {
    value: "home_services",
    label: "Home Services",
    subcategories: [
      { value: "plumbing", label: "Plumbing" },
      { value: "electrical", label: "Electrical" },
      { value: "cleaning", label: "Cleaning" },
      { value: "painting", label: "Painting" },
      { value: "carpentry", label: "Carpentry" },
      { value: "moving", label: "Moving" },
      { value: "interior_design", label: "Interior Design" },
      { value: "landscaping", label: "Landscaping" },
    ],
  },
  {
    value: "fitness",
    label: "Fitness",
    subcategories: [
      { value: "gym", label: "Gym" },
      { value: "yoga", label: "Yoga" },
      { value: "pilates", label: "Pilates" },
      { value: "dance_fitness", label: "Dance Fitness" },
      { value: "zumba", label: "Zumba" },
      { value: "personal_trainer", label: "Personal Trainer" },
    ],
  },
  {
    value: "technology",
    label: "Technology",
    subcategories: [
      { value: "software_development", label: "Software Development" },
      { value: "web_development", label: "Web Development" },
      { value: "mobile_app_development", label: "Mobile App Development" },
      { value: "it_support", label: "IT Support" },
      { value: "digital_marketing", label: "Digital Marketing" },
      { value: "cyber_security", label: "Cyber Security" },
      { value: "data_analytics", label: "Data Analytics" },
    ],
  },
  {
    value: "fashion",
    label: "Fashion",
    subcategories: [
      { value: "clothing", label: "Clothing" },
      { value: "footwear", label: "Footwear" },
      { value: "accessories", label: "Accessories" },
      { value: "jewelry", label: "Jewelry" },
      { value: "hair_accessories", label: "Hair Accessories" },
    ],
  },
  {
    value: "travel",
    label: "Travel",
    subcategories: [
      { value: "flight_booking", label: "Flight Booking" },
      { value: "hotel_booking", label: "Hotel Booking" },
      { value: "tour_guide", label: "Tour Guide" },
      { value: "travel_agency", label: "Travel Agency" },
      { value: "car_rental", label: "Car Rental" },
    ],
  },
  {
    value: "events",
    label: "Events",
    subcategories: [
      { value: "wedding", label: "Wedding" },
      { value: "birthday_party", label: "Birthday Party" },
      { value: "corporate_events", label: "Corporate Events" },
      { value: "concerts", label: "Concerts" },
      { value: "exhibitions", label: "Exhibitions" },
      { value: "conferences", label: "Conferences" },
      { value: "seminars", label: "Seminars" },
    ],
  },
  {
    value: "art",
    label: "Art",
    subcategories: [
      { value: "painting", label: "Painting" },
      { value: "sculpture", label: "Sculpture" },
      { value: "photography", label: "Photography" },
      { value: "digital_art", label: "Digital Art" },
      { value: "art_gallery", label: "Art Gallery" },
    ],
  },
  {
    value: "pets",
    label: "Pets",
    subcategories: [
      { value: "pet_shop", label: "Pet Shop" },
      { value: "veterinary_clinic", label: "Veterinary Clinic" },
      { value: "pet_sitting", label: "Pet Sitting" },
      { value: "pet_training", label: "Pet Training" },
      { value: "pet_accessories", label: "Pet Accessories" },
      { value: "pet_boarding", label: "Pet Boarding" },
    ],
  },
  {
    value: "finance",
    label: "Finance",
    subcategories: [
      { value: "accounting", label: "Accounting" },
      { value: "tax_services", label: "Tax Services" },
      { value: "insurance", label: "Insurance" },
      { value: "loans", label: "Loans" },
      { value: "investment_advisory", label: "Investment Advisory" },
      { value: "wealth_management", label: "Wealth Management" },
      { value: "financial_planning", label: "Financial Planning" },
    ],
  },
  {
    value: "real_estate",
    label: "Real Estate",
    subcategories: [
      { value: "property_sale", label: "Property Sale" },
      { value: "property_rental", label: "Property Rental" },
      { value: "property_management", label: "Property Management" },
      { value: "interior_design", label: "Interior Design" },
      { value: "construction", label: "Construction" },
      { value: "architecture", label: "Architecture" },
    ],
  },
  {
    value: "hospitality",
    label: "Hospitality",
    subcategories: [
      { value: "hotel", label: "Hotel" },
      { value: "resort", label: "Resort" },
      { value: "bed_and_breakfast", label: "Bed and Breakfast" },
      { value: "guesthouse", label: "Guesthouse" },
      { value: "homestay", label: "Homestay" },
    ],
  },
  {
    value: "retail",
    label: "Retail",
    subcategories: [
      { value: "electronics", label: "Electronics" },
      { value: "clothing", label: "Clothing" },
      { value: "furniture", label: "Furniture" },
      { value: "home_decor", label: "Home Decor" },
      { value: "books", label: "Books" },
      { value: "toys", label: "Toys" },
      { value: "grocery", label: "Grocery" },
      { value: "stationery", label: "Stationery" },
    ],
  },
  {
    value: "wellness",
    label: "Wellness",
    subcategories: [
      { value: "massage", label: "Massage" },
      { value: "spa", label: "Spa" },
      { value: "mediation", label: "Mediation" },
      { value: "acupuncture", label: "Acupuncture" },
      { value: "aromatherapy", label: "Aromatherapy" },
    ],
  },
  {
    value: "sports",
    label: "Sports",
    subcategories: [
      { value: "gym", label: "Gym" },
      { value: "sports_equipment", label: "Sports Equipment" },
      { value: "coaching", label: "Coaching" },
      { value: "swimming_pool", label: "Swimming Pool" },
      { value: "tennis_court", label: "Tennis Court" },
      { value: "cricket_pitch", label: "Cricket Pitch" },
    ],
  },
  {
    value: "media",
    label: "Media",
    subcategories: [
      { value: "radio", label: "Radio" },
      { value: "television", label: "Television" },
      { value: "print", label: "Print" },
      { value: "social_media", label: "Social Media" },
      { value: "video_production", label: "Video Production" },
    ],
  },
  {
    value: "other",
    label: "Other",
    subcategories: [
      { value: "custom_service", label: "Custom Service" },
      { value: "event_organization", label: "Event Organization" },
      { value: "others", label: "Others" },
    ],
  },
];

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

export default function OnBaording() {
  const [selectedRole, setSelectedRole] = useState<string>("User");
  const [selectedCategories, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string[]>([]);
  const [checkedSubCategories, setCheckedSubCategories] = useState<string[]>([]);

  const handleSubCategoryClick = (value: string) => {
    setCheckedSubCategories((prev) =>
      prev.includes(value) ? prev.filter((sub) => sub !== value) : [...prev, value]
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const filteredSubCategories =
      Categories.find((cat) => cat.value === value)?.subcategories.map((sub) => sub.value) || [];
    setSelectedSubCategory(filteredSubCategories);
    setCheckedSubCategories([]); 
  };

  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  return (
    <div className="w-100vw h-100vh flex flex-col items-center p-5">
      {/* User Role Selection */}
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="bg-white p-7 rounded-lg">
          <h2 className="font-bold text-gray-400 text-sm mb-2">Account Type</h2>
          <RadioGroup
            description=""
            label=""
            value={selectedRole}
            onChange={(val) => setSelectedRole(val as unknown as string)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-5 items-center justify-around">
              <CustomRadio value="User">User</CustomRadio>
              <div className="bg-gray-500 w-px h-5"></div>
              <CustomRadio value="Business">Business</CustomRadio>
            </div>
          </RadioGroup>
          <div className="flex justify-end mt-5">
            <button
              className="border-2 border-gray-400 hover:bg-black hover:text-white transition-all duration-300 ease-in-out p-2 px-7 rounded-full"
              onClick={() => alert(`Selected Role: ${selectedRole}`)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Select Category */}
      <div className="w-full h-screen flex flex-col  items-center justify-center">
          <div className="w-full h-screen flex flex-col items-center justify-center p-5">
          <div className="w-full max-w-5xl rounded-md">
            <h2 className="text-lg font-semibold mb-3">Select Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Categories.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out 
                    ${
                      selectedCategories === category.value
                        ? "bg-black text-white"
                        : "bg-white text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    value={category.value}
                    checked={selectedCategories === category.value}
                    onChange={() => handleCategoryChange(category.value)}
                    className="w-4 h-4 text-black accent-black"
                  />
                  <span className="text-gray-400">{category.label}</span>
                </label>
              ))}
            </div>

            {/* Display Selected Category */}
            {/* <div className="mt-5 p-3 bg-white space-y-3 rounded-md shadow-md">
              <h3 className="text-md font-medium">Selected Category:</h3>
              <p className="text-blue-600 font-semibold capitalize">
                {selectedCategories ? selectedCategories : "None"}
              </p>
            </div> */}
            <div className="flex justify-end mt-5">
              <button
                className="border-2 border-gray-400 hover:bg-black hover:text-white transition-all duration-300 ease-in-out p-2 px-7 rounded-full"
                onClick={() => alert(`Selected Role: ${selectedRole}`)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Select SubCategory */}
      <div className="w-full h-screen flex flex-col  items-center justify-center">
          <div className="w-full h-screen flex flex-col items-center justify-center p-5">
            <div className="w-full max-w-5xl rounded-md">
                  <h2 className="text-lg font-semibold mb-3">Select Sub Category</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedSubCategory.map((subCategory,index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-2 p-3 rounded-full shadow-sm cursor-pointer transition-all duration-300 ease-in-out bg-white ${
                          checkedSubCategories.includes(subCategory) ? "bg-black text-white" : "bg-white text-black"
                        }`}
                        onClick={() => handleSubCategoryClick(subCategory)}
                      >
                        <input
                          type="radio"
                          value={subCategory}
                          onClick={() => handleSubCategoryClick(subCategory)}
                          checked={checkedSubCategories.includes(subCategory)}
                          readOnly
                          className="w-4 h-4 text-black accent-black"
                        />
                        <span className="text-black">{subCategory}</span>
                      </label>
                    ))}
                  </div>
                  {/* <div className="mt-5 p-3 bg-white space-y-3 rounded-md shadow-md">
                    <h3 className="text-md font-medium">Selected Sub Category:</h3>
                    <p className="text-blue-600 font-semibold capitalize">
                      {selectedCategories ? selectedCategories : "None"}
                    </p>
                  </div> */}
                  <div className="flex justify-end mt-5">
                    <button
                      className="border-2 border-gray-400 hover:bg-black hover:text-white transition-all duration-300 ease-in-out p-2 px-7 rounded-full"
                      onClick={() => alert(`Selected Role: ${selectedRole}`)}
                    >
                      Next
                    </button>
                  </div>
            </div>
          </div>

           
      </div>

      {/*Create Business Profile  */}
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
                />
            </div>
          </div>

          {/* Business Timings & Media Upload */}
          <div className="mb-6 flex flex-col items-start gap-4 md:flex-row">
            <div className="w-full">
              <form className="mx-auto grid grid-cols-1 gap-4  p-2 rounded-lg">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex flex-row gap-2 bg-white rounded-lg ">
                    <p className="font-medium text-gray-900 flex items-end w-[50%]">{day}</p>

                    <div className="flex w-[50%] justify-between items-center">
                      {/* Start Time */}
                      <div>
                        <label htmlFor={`${day.toLowerCase()}-start`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                          Open time:
                        </label>
                        <div className="relative">
                          <input type="time" id={`${day.toLowerCase()}-start`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required />
                        </div>
                      </div>

                      {/* End Time */}
                      <div>
                        <label htmlFor={`${day.toLowerCase()}-end`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                          Close time:
                        </label>
                        <div className="relative">
                          <input type="time" id={`${day.toLowerCase()}-end`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </form>
            </div>
            <div className="w-full">
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
                        accept="image/*, video/*" // Allow photos and videos
                        multiple // Allow multiple files
                        onChange={handleFileChange}
                      />
                      <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                        Choose File
                      </div>
                    </label>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gray-800 text-md font-semibold mb-2">
                      Uploaded Files:
                    </h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="p-2 bg-white rounded shadow border border-gray-200 flex items-center justify-between"
                        >
                          <span>{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>   
      </section>
    </div>
  );
}


