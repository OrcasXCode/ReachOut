'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import Listings from '../components/Listings'
import PaginationTab from '../components/Pagination'
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Top Rated', href: '#', current: false },
  { name: 'Newest Listings', href: '#', current: false },
  { name: 'Best Service', href: '#', current: false },
  { name: 'Nearest to You', href: '#', current: false },
  { name: 'For you', href: '#', current: false },
];

const subCategories = [
  { name: 'Food', href: '#' , id: '8711621d-59df-4dff-82bc-d1f7943e43dc'},
  { name: 'Health', href: '#' ,id: '8ecee37a-464a-4324-92e5-9ffe768c7145'},
  { name: 'Education', href: '#',id: 'd02285c6-3ca5-43e3-b9a4-8e60e4d5f669' },
  { name: 'Entertainment', href: '#',id: 'b3132d1c-d3dc-4e49-9af5-6f55fd6deb6e' },
  { name: 'Technology', href: '#',id: 'f0ec96a2-8628-415f-aac0-80f2836e9d05' },
  { name: 'Fashion', href: '#',id: 'c996fc4c-285a-4f64-8a49-b802895a3e05' },
  { name: 'Travel', href: '#',id: 'bad5a399-c3ee-42b5-918a-cadc3ca382e6' },
  { name: 'Art', href: '#',id: '334c6fa1-37b5-4e81-b0f1-7ec0d4feb34b' },
  { name: 'Beauty', href: '#',id: 'e80c709c-cc6d-41ae-b551-0ce92594b1e1' },
  { name: 'Sports', href: '#',id: '389cdea5-03d0-43a8-8e3d-ae1aeac00309' },
];


const filters = [
  {
    id: 'category',
    name: 'Explore Categories',
    options: [
      { value: 'BEAUTY', label: 'Beauty', checked: false },
      { value: 'FOOD', label: 'Food', checked: false },
      { value: 'HEALTH', label: 'Health', checked: false },
      { value: 'EDUCATION', label: 'Education', checked: false },
      { value: 'ENTERTAINMENT', label: 'Entertainment', checked: false },
      { value: 'AUTOMOBILE', label: 'Automobile', checked: false },
      { value: 'HOME_SERVICES', label: 'Home Services', checked: false },
      { value: 'FITNESS', label: 'Fitness', checked: false },
      { value: 'TECHNOLOGY', label: 'Technology', checked: false },
      { value: 'FASHION', label: 'Fashion', checked: false },
      { value: 'TRAVEL', label: 'Travel', checked: false },
      { value: 'EVENTS', label: 'Events', checked: false },
      { value: 'ART', label: 'Art', checked: false },
      { value: 'PETS', label: 'Pets', checked: false },
      { value: 'FINANCE', label: 'Finance', checked: false },
      { value: 'REAL_ESTATE', label: 'Real Estate', checked: false },
      { value: 'HOSPITALITY', label: 'Hospitality', checked: false },
      { value: 'RETAIL', label: 'Retail', checked: false },
      { value: 'WELLNESS', label: 'Wellness', checked: false },
      { value: 'SPORTS', label: 'Sports', checked: false },
      { value: 'MEDIA', label: 'Media', checked: false },
      { value: 'OTHER', label: 'Other', checked: false },
    ],
  },  
  {
    id: 'location',
    name: 'Location',
    options: [
      { value: 'nearby', label: 'Nearby (~5km)', checked: true },
      { value: 'city', label: 'Within City', checked: false },
      { value: 'state', label: 'Within State', checked: false },
      { value: 'country', label: 'Nationwide', checked: false },
    ],
  },
  {
    id: 'price',
    name: 'Time Range',
    options: [
      { value: 'morning', label: 'Morning [ 6:00 AM to 12:00 PM ]', checked: false },
      { value: 'afternoon', label: 'Afternoon [ 12:00 PM to 5:00 PM ]', checked: false },
      { value: 'evening', label: 'Evening [ 5:00 PM to 8:00 PM ]', checked: false },
      { value: 'night', label: 'Night [ 8:00 PM to 6:00 AM ]', checked: false },
      { value: 'weekends-and-holidays', label: 'Weekends & Holidays', checked: false },
    ],
  },
  {
    id: 'business-type',
    name: 'Business Type',
    options: [
      { value: 'small-business', label: 'Small Business', checked: true },
      { value: 'street-vendors', label: 'Street Vendors', checked: false },
      { value: 'home-businesses', label: 'Home Businesses', checked: false },
      { value: 'services', label: 'Local Services', checked: false },
    ],
  },
  {
    id: 'ratings',
    name: 'Customer Ratings',
    options: [
      { value: '4+', label: '4 Stars & Up', checked: false },
      { value: '3+', label: '3 Stars & Up', checked: false },
      { value: '2+', label: '2 Stars & Up', checked: false },
      { value: 'all', label: 'All Ratings', checked: true },
    ],
  },
];

export { sortOptions, subCategories, filters };


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  // const handleCategoryClick = (categoryName: string) => {
  //   setSelectedCategoryId(categoryName);
  // };
  const router = useRouter();
  const searchParams = useSearchParams(); // For reading query params

  const handleCategoryChange = (categoryId: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      currentParams.set("categoryId", categoryId);
    } else {
      currentParams.delete("categoryId");
    }
    router.push(`?${currentParams.toString()}`);
  };

  

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href} className="block px-2 py-3">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-30 pb-6">
            <h4 className="text-2xl font-bold tracking-tight text-gray-900">Market Place</h4>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
{/* 
              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button> */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="text-sm  mb-3 font-medium text-gray-400">Frequently Chosen</h3>
                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={`?categoryId=${category.id}`}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  defaultChecked={option.checked}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3 text-black">
                <Listings></Listings>
                <PaginationTab></PaginationTab>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
