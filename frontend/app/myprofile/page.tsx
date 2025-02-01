"use client";

import * as React from "react";
import { Carousel, IconButton  } from "@material-tailwind/react";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import {ImageSlider} from "../components/ui/Carousal"

export default function Example() {
  return (
    <div className="flex justify-center flex-col mb-[100px]  mt-[150px] max-w-7xl mx-auto">
      {/* Top Section with Carousel */}
      <div className="flex flex-row w-full items-center justify-between  p-6 rounded-lg">
        {/* Left Section */}
        <div className="flex items-center justify-start  max-w-3xl p-6 rounded-lg">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Back End Developer
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <BriefcaseIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-400" />
                Full-time
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPinIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-400" />
                Remote
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CurrencyDollarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-400" />
                $120k &ndash; $140k
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-gray-400" />
                Closing on January 9, 2020
              </div>
            </div>
          </div>
          <div className="mt-2 flex lg:mt-0 lg:ml-4">
            <span className="hidden sm:block">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
              >
                <PencilIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5 text-gray-400" />
                Edit
              </button>
            </span>
            {/* Dropdown */}
            <Menu as="div" className="relative ml-3 sm:hidden">
              <MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:ring-gray-400">
                More
                <ChevronDownIcon aria-hidden="true" className="-mr-1 ml-1.5 size-5 text-gray-400" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Edit
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    View
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="max-w-[400px] max-h-[400px] ml-6 overflow-hidden relative ">
           <ImageSlider></ImageSlider>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="lg:flex lg:items-center lg:justify-between mt-[100px]">
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Margot Foster</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Application for</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Backend Developer</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Salary expectation</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">$120,000</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">About</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
                qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
                pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Attachments</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">resume_back_end_developer.pdf</span>
                        <span className="shrink-0 text-gray-400">2.4mb</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">coverletter_back_end_developer.pdf</span>
                        <span className="shrink-0 text-gray-400">4.5mb</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}