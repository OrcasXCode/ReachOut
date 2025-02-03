"use client"

import CategoryChip from "../components/ui/CategoryChip";
import CustomerReview from "../components/ui/CustomerReview";
import SubCategoryChip from "../components/ui/SubCategoryChip";
import Carousel from "../components/ui/Carousal";
import {useState} from 'react'
import Link from "next/link";


const people = [
    {
      name: 'Elegant Studio',
      email: 'Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas. Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas.',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      role: 'Co-Founder / CTO',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      role: 'Business Relations',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: null,
    },
    {
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      role: 'Front-end Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Courtney Henry',
      email: 'courtney.henry@example.com',
      role: 'Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      role: 'Director of Product',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: null,
    },
  ]
  
  export default function Example() {

    const [isExpanded, setIsExpanded] = useState(false);


    return (
    <div className='max-w-5xl items-center justify-center flex'>
        <ul role="list" className="divide-y divide-gray-100 mt-[150px] space-y-3">
        {people.map((person) => (
          <li key={person.email} className="flex justify-between border p-5">
            <div className="flex flex-col min-w-0  gap-x-4">
              <div className="min-w-0 flex flex-row justify-between ">
                <div>
                  <h1 className="font-semibold text-gray-900">{person.name}</h1>
                  <CategoryChip tag="Beauty"></CategoryChip>
                  <div className="flex flex-row gap-2 mt-2">
                    <SubCategoryChip tag="Mehndi"></SubCategoryChip>
                    <SubCategoryChip tag="Bridal"></SubCategoryChip>
                    <SubCategoryChip tag="Nail Art"></SubCategoryChip>
                  </div>
                  <div>
                    <div
                      className="overflow-hidden"
                      style={{
                        width: '500px',
                        height: isExpanded ? 'auto' : '30px', 
                      }}
                    >
                      <p className="text-xs text-gray-500">
                        {person.email}
                      </p>
                    </div>
                    {!isExpanded && (
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => setIsExpanded(true)}
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </div>
                {/*Business Info */}
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs/5 text-gray-500">+91 94290****46</p>
                <p className="mt-1 text-xs/5 text-gray-500">xyz@gmail.com</p>
                <p className="mt-1 text-xs/5 text-gray-500">1.5km away</p>
                <p className="mt-1 text-xs/5 text-gray-500">Open Now</p>
                <Link href='viewbusinessprofile' className="flex flex-row items-center justify-center gap-1.5 group">
                  <p className="text-xs/5 underline transition-all duration-300 ease-in-out text-blue-500 group-hover:text-blue-300 group-hover:underline-offset-4">See More</p>
                  <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 25 25" 
                      width="20" 
                      height="15" 
                      fill="currentColor" 
                      className=" transition-all duration-300 ease-in-out text-blue-500 group-hover:text-blue-300 group-hover:translate-x-1"
                    >
                      <path 
                        d="M17.5 6l-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.5l-6.5-6.5z" 
                      />
                  </svg>
                </Link>
               </div>
              </div>
            
              <div className="flex flex-row p-0 items-center justify-center gap-1">
                {/* Review Section (60% width) */}
                <div className="w-[60%]">
                  <CustomerReview />
                </div>

                {/* Carousel Section (40% width) */}
                <div className="w-[40%] flex items-center justify-center">
                  <Carousel/>
                </div>
              </div>
            </div>
           
           
          </li>
        ))}
      </ul>
    </div>
    )
  }
  