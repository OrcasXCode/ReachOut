"use client"

import React, { useState } from "react";
import { FaCheckCircle, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCopy, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {Typography} from "@material-tailwind/react";
import Carousel from "../../components/ui/Carousal";
import { ReviewModel } from "@/app/components/ui/reviewmodal";


const UserProfile = () => {
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
    const [open, setOpen] = React.useState(false);
    
    const handleWriteReview = () => setOpen(!open);

    const slideData = [
    {
        src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    ];

    const profileData = {
    companyName: "TechCorp Solutions",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    email: "contact@techcorp.com",
    phone: "+91 9429084446",
    website: "www.techcorp.com",
    address: "123 Innovation Street, Tech Valley, CA 94025",
    category: "Technology",
    subCategory: "Software Development",
    rating: 4.8,
    mediaGallery: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    ],
    businessHours: [
        { day: "Monday", hours: "9:00 AM - 6:00 PM", isOpen: true },
        { day: "Tuesday", hours: "9:00 AM - 6:00 PM", isOpen: true },
        { day: "Wednesday", hours: "9:00 AM - 6:00 PM", isOpen: true },
        { day: "Thursday", hours: "9:00 AM - 6:00 PM", isOpen: true },
        { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
        { day: "Saturday", hours: "Closed", isOpen: false },
        { day: "Sunday", hours: "Closed", isOpen: false },
    ],
    about: "TechCorp Solutions is a leading software development company specializing in innovative solutions for enterprise clients. With over a decade of experience, we deliver cutting-edge technology solutions that drive business growth and digital transformation. Our team of expert developers and consultants work closely with clients to create customized solutions that meet their unique needs.",
    };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
  };

  const RatingStars = ({ rating } : {rating : any}) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`w-5 h-5 ${
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-[88px]">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 justify-between grid grid-cols-1  md:grid-cols-2">
          <div className="flex items-center space-x-4">
            <img
              src={profileData.profileImage}
              alt="Company Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.companyName}
                </h1>
                {profileData.isVerified && (
                  <FaCheckCircle className="ml-2 text-blue-500 w-6 h-6" />
                )}
              </div>
              <div className="mt-2">
                <RatingStars rating={profileData.rating} />
              </div>
            </div>
          </div>
          <div className="flex gap-5 pt-4 justify-center md:items-center md:justify-end ">
            <button onClick={()=>alert("Liked")} className="flex flex-row gap-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                </svg>
                (560)
            </button>
            <button onClick={()=>alert("DiLiked")} className="flex flex-row gap-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                </svg>
                (56)
            </button>
            <button onClick={()=>alert("DiLiked")} className="flex flex-row gap-2 items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clipRule="evenodd" />
                </svg>
                (15)
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-[50px]">Contact Information</h2>
            <div className="space-y-10">
              <div className="flex items-center">
                <FaEnvelope className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profileData.email}</span>
                <button
                  onClick={handleCopyEmail}
                  className="ml-2 text-blue-500 hover:text-blue-600 relative"
                >
                  <FaCopy className="w-4 h-4" />
                  {showCopiedTooltip && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-5 h-5 text-gray-500 mr-3" />
                <a
                  href={`tel:${profileData.phone}`}
                  className="text-gray-700 hover:text-blue-500"
                >
                  {profileData.phone}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="ml-2 text-blue-500 hover:text-blue-600 relative"
                >
                  <FaCopy className="w-4 h-4" />
                  {showCopiedTooltip && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center">
                <FaGlobe className="w-5 h-5 text-gray-500 mr-3" />
                <a
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-500"
                >
                  {profileData.website}
                </a>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profileData.address}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2">
              {profileData.businessHours.map((schedule, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded ${
                    schedule.isOpen ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <span className="font-medium">{schedule.day}</span>
                  <span
                    className={`${
                      schedule.isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">About Us</h2>
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="text-blue-500 hover:text-blue-600"
            >
              {isAboutExpanded ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          <p
            className={`text-gray-700 ${
              isAboutExpanded ? "" : "line-clamp-3"
            }`}
          >
            {profileData.about}
          </p>
        </div>

        {/* Media Gallery */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Media Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.mediaGallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        </div> */}
        <Typography variant="h5" color="blue-gray">Media Gallery</Typography>
        <div className="relative overflow-hidden w-full h-full py-20">
            <Carousel slides={slideData} />
        </div>    

        {/* Customer Review */}
        <section className="py-24 relative">
          <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
              <div className="">
                  <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-8 text-center">
                      Customer reviews &
                      rating</h2>
                  <div className="grid grid-cols-12 mb-11">

                      <div className="col-span-12 xl:col-span-4 flex items-center">
                          <div className="box flex flex-col gap-y-4 w-full max-xl:max-w-3xl mx-auto">
                              <div className="flex items-center w-full">
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">5</p>
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <g clipPath="url(#clip0_12042_8589)">
                                          <path
                                              d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                              fill="#FBBF24" />
                                      </g>
                                      <defs>
                                          <clipPath id="clip0_12042_8589">
                                              <rect width="20" height="20" fill="white" />
                                          </clipPath>
                                      </defs>
                                  </svg>
                                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                                      <span className="h-full w-[30%] rounded-[30px] bg-indigo-500 flex"></span>
                                  </p>
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">30</p>
                              </div>
                              <div className="flex items-center w-full">
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">4</p>
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <g clipPath="url(#clip0_12042_8589)">
                                          <path
                                              d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                              fill="#FBBF24" />
                                      </g>
                                      <defs>
                                          <clipPath id="clip0_12042_8589">
                                              <rect width="20" height="20" fill="white" />
                                          </clipPath>
                                      </defs>
                                  </svg>
                                  <p className="h-2 w-full xl:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                                      <span className="h-full w-[40%] rounded-[30px] bg-indigo-500 flex"></span>
                                  </p>
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">40</p>
                              </div>
                              <div className="flex items-center">
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">3</p>
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <g clipPath="url(#clip0_12042_8589)">
                                          <path
                                              d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                              fill="#FBBF24" />
                                      </g>
                                      <defs>
                                          <clipPath id="clip0_12042_8589">
                                              <rect width="20" height="20" fill="white" />
                                          </clipPath>
                                      </defs>
                                  </svg>
                                  <p className="h-2 w-full xl:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                                      <span className="h-full w-[20%] rounded-[30px] bg-indigo-500 flex"></span>
                                  </p>
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">20</p>
                              </div>
                              <div className="flex items-center">
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">2</p>
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <g clipPath="url(#clip0_12042_8589)">
                                          <path
                                              d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                              fill="#FBBF24" />
                                      </g>
                                      <defs>
                                          <clipPath id="clip0_12042_8589">
                                              <rect width="20" height="20" fill="white" />
                                          </clipPath>
                                      </defs>
                                  </svg>
                                  <p className="h-2 w-full xl:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                                      <span className="h-full w-[16%] rounded-[30px] bg-indigo-500 flex"></span>
                                  </p>
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">16</p>
                              </div>
                              <div className="flex items-center">
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">1</p>
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <g clipPath="url(#clip0_12042_8589)">
                                          <path
                                              d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                              fill="#FBBF24" />
                                      </g>
                                      <defs>
                                          <clipPath id="clip0_12042_8589">
                                              <rect width="20" height="20" fill="white" />
                                          </clipPath>
                                      </defs>
                                  </svg>
                                  <p className="h-2 w-full xl:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                                      <span className="h-full w-[8%] rounded-[30px] bg-indigo-500 flex"></span>
                                  </p>
                                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">8</p>
                              </div>
                          </div>
                      </div>
                      <div className="col-span-12 max-xl:mt-8 xl:col-span-8 xl:pl-8 w-full min-h-[230px]">
                          <div
                              className="grid grid-cols-12 h-full px-8 max-lg:py-8 rounded-3xl bg-gray-100 w-full max-xl:max-w-3xl max-xl:mx-auto">
                              <div className="col-span-12 md:col-span-8 flex items-center">
                                  <div className="flex flex-col sm:flex-row items-center max-lg:justify-center w-full h-full">
                                      <div
                                          className="sm:pr-3 sm:border-r border-gray-200 flex items-center justify-center flex-col">
                                          <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">4.3</h2>
                                          <div className="flex items-center gap-3 mb-4">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                          </div>
                                          <p className="font-normal text-lg leading-8 text-gray-400">46 Ratings</p>
                                      </div>

                                      <div
                                          className="sm:pl-3 sm:border-l border-gray-200 flex items-center justify-center flex-col">
                                          <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">4.8</h2>
                                          <div className="flex items-center gap-3 mb-4">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                  viewBox="0 0 36 36" fill="none">
                                                  <g clipPath="url(#clip0_13624_3137)">
                                                      <path
                                                          d="M17.1033 2.71738C17.4701 1.97413 18.5299 1.97413 18.8967 2.71738L23.0574 11.1478C23.2031 11.4429 23.4846 11.6475 23.8103 11.6948L33.1139 13.0467C33.9341 13.1659 34.2616 14.1739 33.6681 14.7524L26.936 21.3146C26.7003 21.5443 26.5927 21.8753 26.6484 22.1997L28.2376 31.4656C28.3777 32.2825 27.5203 32.9055 26.7867 32.5198L18.4653 28.145C18.174 27.9919 17.826 27.9919 17.5347 28.145L9.21334 32.5198C8.47971 32.9055 7.62228 32.2825 7.76239 31.4656L9.35162 22.1997C9.40726 21.8753 9.29971 21.5443 9.06402 21.3146L2.33193 14.7524C1.73841 14.1739 2.06593 13.1659 2.88615 13.0467L12.1897 11.6948C12.5154 11.6475 12.7969 11.4429 12.9426 11.1478L17.1033 2.71738Z"
                                                          fill="#FBBF24" />
                                                  </g>
                                                  <defs>
                                                      <clipPath id="clip0_13624_3137">
                                                          <rect width="36" height="36" fill="white" />
                                                      </clipPath>
                                                  </defs>
                                              </svg>
                                          </div>
                                          <p className="font-normal text-lg leading-8 text-gray-400">Last Month</p>
                                      </div>
                                  </div>
                              </div>
                              <div className="col-span-12 md:col-span-4 max-lg:mt-8 md:pl-8">
                                  <div className="flex items-center flex-col justify-center w-full h-full ">
                                        <ReviewModel></ReviewModel>
                                        <button
                                          className="rounded-full px-6 py-4 bg-white font-semibold text-lg text-indigo-600 whitespace-nowrap w-full text-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100 hover:shadow-indigo-200">See
                                          All Reviews
                                        </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="pb-8 border-b border-gray-200 max-xl:max-w-3xl max-xl:mx-auto">
                      <h4 className="font-manrope font-semibold text-3xl leading-10 text-black mb-6">Review Summary</h4>
                      <p className="font-normal text-lg leading-8 text-gray-500 ">
                          I recently had the opportunity to explore Pagedone's UI design system, and it left a lasting
                          impression on my workflow. The system seamlessly blends user-friendly features with a robust set
                          of design components, making it a go-to for creating visually stunning and consistent
                          interfaces.
                      </p>
                  </div>
              </div>
          </div>
        </section>            
      </div>
    </div>
  );
};

export default UserProfile;