"use client"

import { Rating } from "@material-tailwind/react";
import SubCategoryChip from "./SubCategoryChip";
import Image from "next/image"
 
export function DefaultRating() {
  return ;
}


export default function CustomerReview(){
    return(
    <section>
        <div className="container">
            <div className="flex flex-col items-center w-full p-6 space-y-8  lg:h-full lg:p-8 dark:bg-gray-50 dark:text-gray-800 rounded-md">
                   <div className="justify-between flex flex-row gap-2 w-full">
                       <div className="flex flex-row gap-3.5">
                            <Image
                                src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
                                alt="Profile Picture"
                                width={40} // Set a reasonable default width
                                height={40} // Set a reasonable default height
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="text-center dark:text-gray-600 flex flex-col space-y-0.5">
                                <p className="text-sm">Leroy Jenkins</p>
                                <SubCategoryChip tag="Nail Art"></SubCategoryChip>
                            </div>
                       </div>
                       <Rating value={4}/>
                   </div>
                <blockquote className="max-w-lg text-sm italic font-light text-center">"Et, dignissimos obcaecati. Recusandae praesentium doloribus vitae? Rem unde atque mollitia!"</blockquote>
                <div className="flex space-x-2">
                    <button type="button" aria-label="Page 1" className="w-2 h-2 rounded-full dark:bg-gray-900"></button>
                    <button type="button" aria-label="Page 2" className="w-2 h-2 rounded-full dark:bg-gray-400"></button>
                    <button type="button" aria-label="Page 3" className="w-2 h-2 rounded-full dark:bg-gray-400"></button>
                    <button type="button" aria-label="Page 4" className="w-2 h-2 rounded-full dark:bg-gray-400"></button>
                </div>
            </div>
        </div>
    </section>
    )
}