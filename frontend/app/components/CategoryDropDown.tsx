"use client"

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'

const solutions = [
  { name: 'Beauty', href: '#', icon: ChartPieIcon },
  { name: 'Food', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Sports', href: '#', icon: FingerPrintIcon },
  { name: 'Fitness', href: '#', icon: SquaresPlusIcon },
  { name: 'Events', href: '#', icon: ArrowPathIcon },
  { name: 'Art', href: '#', icon: ArrowPathIcon },
  { name: 'Real Estate', href: '#', icon: ArrowPathIcon },
  { name: 'Retail', href: '#', icon: ArrowPathIcon },
  { name: 'Health', href: '#', icon: ArrowPathIcon },
  { name: 'Finance', href: '#', icon: ArrowPathIcon },
  // { name: 'Home Services', href: '#', icon: ArrowPathIcon },
  // { name: 'Wellness', href: '#', icon: ArrowPathIcon },
  // { name: 'Media', href: '#', icon: ArrowPathIcon },
  // { name: 'Entertainment', href: '#', icon: ArrowPathIcon },
  // { name: 'Travel', href: '#', icon: ArrowPathIcon },
  // { name: 'Automobile', href: '#', icon: ArrowPathIcon },
  // { name: 'Fashion', href: '#', icon: ArrowPathIcon },
  // { name: 'Education', href: '#', icon: ArrowPathIcon },
  // { name: 'Pets', href: '#', icon: ArrowPathIcon },
  // { name: 'Hospitality', href: '#', icon: ArrowPathIcon },
  // { name: 'Technology', href: '#', icon: ArrowPathIcon },
  // { name: 'Other', href: '#', icon: ArrowPathIcon },
];

export default function Example() {
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
        <span>Categories</span>
        <ChevronDownIcon aria-hidden="true" className="size-5" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-1/2 bg-amber-800 grid-cols-3 grid z-10 mt-5 w-screen max-w-max -translate-x-1/2  transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      >
          <div className=" overflow-hidden bg-white rounded-xl text-sm/6 ring-1 shadow-lg ring-gray-900/5">
            <div className="">
            {solutions.map((item) => (
              <div key={item.name} className="group relative flex gap-x-6 items-center rounded-lg p-1 hover:bg-gray-50">
                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                </div>
                <div>
                  <a href={item.href} className="font-semibold text-gray-900">
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}