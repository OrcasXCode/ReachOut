'use client'

import { useState,useEffect } from 'react'
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
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash'


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
      { value: 'BEAUTY', label: 'Beauty', checked: false ,id: 'e80c709c-cc6d-41ae-b551-0ce92594b1e1' },
      { value: 'FOOD', label: 'Food', checked: false, id: '8711621d-59df-4dff-82bc-d1f7943e43dc' },
      { value: 'HEALTH', label: 'Health', checked: false ,id: '8ecee37a-464a-4324-92e5-9ffe768c7145'},
      { value: 'EDUCATION', label: 'Education', checked: false,id: 'd02285c6-3ca5-43e3-b9a4-8e60e4d5f669' },
      { value: 'ENTERTAINMENT', label: 'Entertainment', checked: false,id: 'b3132d1c-d3dc-4e49-9af5-6f55fd6deb6e' },
      { value: 'AUTOMOBILE', label: 'Automobile', checked: false ,id: 'bdf49ffb-30c6-42e2-b481-bb0c106068f4' },
      { value: 'HOME_SERVICES', label: 'Home Services', checked: false,id: '9d6b07c6-f93a-4f8b-b9ea-efb16fb56e1a' },
      { value: 'FITNESS', label: 'Fitness', checked: false,id: '40a16feb-7444-4e1b-a9ea-66fa6adf644d' },
      { value: 'TECHNOLOGY', label: 'Technology', checked: false,id: 'f0ec96a2-8628-415f-aac0-80f2836e9d05'},
      { value: 'FASHION', label: 'Fashion', checked: false,id: 'c996fc4c-285a-4f64-8a49-b802895a3e05' },
      { value: 'TRAVEL', label: 'Travel', checked: false,id: 'bad5a399-c3ee-42b5-918a-cadc3ca382e6' },
      { value: 'EVENTS', label: 'Events', checked: false ,id:'5aea9a3c-65e5-4e84-8132-798f35d9f918'},
      { value: 'ART', label: 'Art', checked: false,id: '334c6fa1-37b5-4e81-b0f1-7ec0d4feb34b' },
      { value: 'PETS', label: 'Pets', checked: false,id:'e9230a89-a5b5-492c-88db-02b2648fa099' },
      { value: 'FINANCE', label: 'Finance', checked: false,id:'99c9b588-dcf7-47c1-9751-b017ce4ec709' },
      { value: 'REAL_ESTATE', label: 'Real Estate', checked: false,id:'639d5ade-5034-4065-8d95-6cc805441bc9' },
      { value: 'HOSPITALITY', label: 'Hospitality', checked: false ,id:'ef5e6ec2-a6a4-4dab-8bc5-25fc2e569cad'},
      { value: 'RETAIL', label: 'Retail', checked: false,id:'7d65e702-2078-44bb-9c98-cf1f20eb3e6d' },
      { value: 'WELLNESS', label: 'Wellness', checked: false,id:'a75ffcfa-5fb3-4fa8-9c73-37a8ee2b3af0' },
      { value: 'SPORTS', label: 'Sports', checked: false,id: '389cdea5-03d0-43a8-8e3d-ae1aeac00309' },
      { value: 'MEDIA', label: 'Media', checked: false,id:'aab69bf0-8119-49d0-96c8-d93a560a9a13' },
      { value: 'OTHER', label: 'Other', checked: false,id:'fa31a018-2a39-401d-b606-577436a78699' },
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
      { value: 'morning', label: 'Morning [ 6:00 AM to 12:00 PM ]', checked: false ,id:'timings:6:00+12:00'},
      { value: 'afternoon', label: 'Afternoon [ 12:00 PM to 15:00 PM ]', checked: false,id:'timings:12:00+15:00' },
      { value: 'evening', label: 'Evening [ 15:00 PM to 20:00 PM ]', checked: false,id:'timings:15:00+20:00'},
      { value: 'night', label: 'Night [ 20:00 PM to 6:00 AM ]', checked: false,id:'timings:20:00+6:00' },
      { value: 'weekends-and-holidays', label: 'Weekends & Holidays', checked: false },
    ],
  },
  {
    id: 'business-type',
    name: 'Business Type',
    options: [
      { value: 'Established Businesses', label: 'Established Businesse', checked: true,id:'businesses'},
      { value: 'Street-Vendors', label: 'Street-Vendors', checked: false,id:'street-vendors' },
      { value: 'Home-Businesses', label: 'Home-Businesses', checked: false,id:'home-businesses' },
      { value: 'Services', label: 'Services', checked: false,id:'services' },
    ],
  },
  {
    id: 'ratings',
    name: 'Customer Ratings',
    options: [
      { value: '4+', label: '4 Stars & Up', checked: false,id:'4' },
      { value: '3+', label: '3 Stars & Up', checked: false,id:'3' },
      { value: '2+', label: '2 Stars & Up', checked: false,id:'2' },
      { value: 'all', label: 'All Ratings', checked: true,id:'1' },
    ],
  },
];

export { sortOptions, subCategories, filters };


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

  // useEffect(() => {
  //   const filtersFromQuery = { ...selectedFilters };
  //   Object.keys(searchParams).forEach((key) => {
  //     const value = searchParams.get(key);
  //     filtersFromQuery[key] = typeof value === 'string' ? value.split(',') : (value || []);
  //   });
  //   setSelectedFilters(filtersFromQuery);
  // }, [searchParams]);

  useEffect(() => {
    const filtersFromQuery: { [key: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      filtersFromQuery[key] = value.split(',');
    });
    setSelectedFilters(filtersFromQuery);
  }, [searchParams]);

  const updateURL = debounce((filters: { [key: string]: string[] }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  }, 300);

  const handleFilterChange = (sectionId: string, value: string, checked: boolean) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (checked) {
        updatedFilters[sectionId] = [...(updatedFilters[sectionId] || []), value];
      } else {
        updatedFilters[sectionId] = updatedFilters[sectionId]?.filter((v) => v !== value) || [];
      }

      updateURL(updatedFilters);
      // updateFiltersInRedis(updatedFilters);
      return updatedFilters;
    });
  };

  // const updateFiltersInRedis = async (filtersData: { [key: string]: string[] }) => {
  //   try {
  //     const response = await fetch('/api/save-filters', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(filtersData),
  //     });
  //     if (response.ok) {
  //       console.log('Filters saved to Redis');
  //     } else {
  //       console.error('Error saving filters to Redis');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };


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
                        href="#"
                        onClick={() => handleFilterChange('frequents', category.id, true)}
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
                                  type="checkbox"
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  value={option.value}
                                  checked={selectedFilters[section.id]?.includes(option.value) || false}
                                  onChange={(e) => handleFilterChange(section.id, option.value, e.target.checked)}
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
                <Listings/>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
