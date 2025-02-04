"use client";

import React from "react";
import {
  Typography,
  Rating
} from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image"
import Carousel from "../components/ui/Carousal";

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

export default function UserProfile() {
  return (
    <section className="px-8 py-20 container mx-auto mt-5">
      <div className="flex flex-col mt-8">
        <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-5">
              Anva Tech Labs
            </h2>
            <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6 mb-5">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Rating value={4} readonly />
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
              </svg>
                560
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                </svg>
                56
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clipRule="evenodd" />
                </svg>
                5k+
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clipRule="evenodd" />
                </svg>
                15
              </div>
            </div>
        </div>

        {/* User Details */}
        <hr className="mt-5 mb-5"></hr>
        <Typography variant="h5" color="blue-gray">User Details</Typography>
        <Typography  variant="small" className="text-gray-400 font-normal mt-1 mb-5">View your profile information below.</Typography>
        <div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row mt-5">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              First Name
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">Roberts</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Last Name
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">Roberts</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Email
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">roberts@gmail.com</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Recovery Email
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">contactroberts@gmail.com</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Location
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">
              41-A 10003
              Near New Seatle Road
              USA - 90001
            </p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Phone Number
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">+91 9429084446</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Language
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">ENG</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Account Type
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">Business</p>
          </div>
        </div>

        </div>

        {/* Business Details */}
        <hr className="mt-5 mb-5"></hr>
        <Typography variant="h5" color="blue-gray">Business Details</Typography>
        <Typography  variant="small" className="text-gray-400 font-normal mt-1 mb-5">View your business information below.</Typography>
        <div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row mt-5">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Business Name
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">Anva Tech Labs</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Verified
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">-</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Business Email
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">anvatechlabs@gmail.com</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Recovery Email
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">contactroberts@gmail.com</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Business Location
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">
            Pentagon Building , California
            </p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Business Phone Number
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">+91 6284339948</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row">
          <div className="flex-1 max-w-[50%]">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              About
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 ">Anva Tech Labs is a leading software development company specializing in innovative solutions for enterprise clients. With over a decade of experience, we deliver cutting-edge technology solutions that drive business growth and digital transformation. Our team of expert developers and consultants work closely with clients to create customized solutions that meet their unique needs.</p>
          </div>
          <div className="w-[50%]">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Rating
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">4.3</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Likes
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">560</p>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Dislikes
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">56</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Website
            </Typography>
            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline ease-in-out">Visit Site</a>
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-sm text-gray-400 mb-2 font-semibold"
            >
              Reports
            </Typography>
            <p className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200">15</p>
          </div>
        </div>
        </div>


        {/*Reviews */}
        <hr className="mt-5 mb-5"></hr>
        <section className="py-15 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
                <div className="">
                    <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-8 text-center">
                        Customer Insights</h2>
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
                                        <Link href="/reviews"><button
                                            className="rounded-full px-6 py-4 bg-white font-semibold text-lg text-indigo-600 whitespace-nowrap w-full text-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100 hover:shadow-indigo-200">
                                            See All Reviews
                                          </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>              


        {/* Reports */}
        <hr className="mt-5 mb-5"></hr>
        <section className="py-15 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
                <div className="">
                    <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-8 text-center">Reports & Flags</h2>
                    <div className="grid grid-cols-12 mb-11 ">
                        <div className="col-span-12 xl:col-span-4 flex items-center">
                          <div className="box flex flex-col gap-y-4 w-full max-xl:max-w-3xl mx-auto">
                              <Image 
                                src='./report.svg' 
                                alt="Report Flag" 
                                width={300} 
                                height={300}
                              ></Image>
                          </div>
                       </div>
                        <div className="col-span-12 max-xl:mt-8 xl:col-span-8 xl:pl-8 w-full min-h-[230px]">
                            <div
                                className="grid grid-cols-12 h-full px-8 max-lg:py-8 rounded-3xl bg-gray-100 w-full max-xl:max-w-3xl max-xl:mx-auto">
                                <div className="col-span-12 md:col-span-8 flex items-center ">
                                    <div className="flex flex-col sm:flex-row items-center max-lg:justify-center w-full h-full justify-around">
                                        <div
                                            className="sm:pr-3 border-gray-200 flex items-center justify-center flex-col">
                                            <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">10</h2>
                                            {/* Can Add SVG */}
                                            <p className="font-normal text-lg leading-8 text-gray-400">Service Report</p>
                                        </div>
                                        <div
                                            className="sm:pl-3  border-gray-200 flex items-center justify-center flex-col">
                                            <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">0</h2>
                                            {/* Can Add SVG */}
                                            <p className="font-normal text-lg leading-8 text-gray-400">Behavioural Report</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-4 max-lg:mt-8 md:pl-8">
                                    <div className="flex items-center flex-col justify-center w-full h-full ">
                                        <Link href="/reviews"><button
                                            className="rounded-full px-6 py-4 bg-white font-semibold text-lg text-indigo-600 whitespace-nowrap w-full text-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100 hover:shadow-indigo-200">
                                            View All Reports
                                          </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>    

          {/* Media Gallery */}
          <hr className="mt-5 mb-5"></hr>
          <Typography variant="h5" color="blue-gray">Business Media</Typography>
          <Typography  variant="small" className="text-gray-400 font-normal mt-1 mb-5">View your business media which you uploaded.</Typography>
          <div className="relative overflow-hidden w-full h-full py-20">
              <Carousel slides={slideData} />
          </div>                             
      </div>
    </section>
  );
}

