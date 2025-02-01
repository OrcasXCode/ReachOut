'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuthStore }  from "../lib/useAuthStore";
import  AvatarWithUserDropdown  from "../profile/page"
import  ListingsSearchBar  from "../components/ListingsSearchBar"
import  CategoryDropDown  from "../components/CategoryDropDown"
import  SubCategoryDropDown  from "../components/SubCategoryDropDown"
import  Recommendation  from "../components/Recommendation"
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Business', href: '/business' },
  { name: 'About', href: '/about' },
  { name: 'Help', href: '/help' },
]

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isSignedIn = useAuthStore((state) => state.isSignedIn);
    const pathname = usePathname()

  return (
           <div>
            {/* Navbar for business */}
            {pathname=="/business"  ?  <header className="inset-x-0 top-0 z-10 fixed bg-[#ffffff] border -b border-gray-200 ">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <Image
                            src="/dashboard.png"
                            alt="Dashboard Logo"
                            width={32} 
                            height={32}
                            priority 
                        />
                </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <CategoryDropDown></CategoryDropDown>
                    <SubCategoryDropDown></SubCategoryDropDown> 
                    <Recommendation></Recommendation> 
                </div>
              

                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-5  items-center justify-center">
                    <div className="max-w-[400px] min-w-[100px]">
                        <ListingsSearchBar></ListingsSearchBar>
                    </div>
                        {isSignedIn ? (
                                    <div>
                                    <   AvatarWithUserDropdown></AvatarWithUserDropdown>
                                    </div>
                                ) : (
                                    <Link href="/signin">Sign in</Link>
                        )} 
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
              
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-8 w-auto"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <CategoryDropDown></CategoryDropDown>
                                <SubCategoryDropDown></SubCategoryDropDown> 
                                <Recommendation></Recommendation> 
                            </div>
                            <div className="py-6">
                            {isSignedIn ? (
                                <AvatarWithUserDropdown />
                            ) : (
                                <Link href="/signin">Sign in</Link>
                            )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
                </Dialog>
            </header>  :

            //NavBar for All Routes
               <header className="inset-x-0 top-0 z-10 fixed bg-[#ffffff] border -b border-gray-200 ">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-8 w-auto"
                    />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                        {item.name}
                    </a>
                    ))}
                </div>
              

                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-5 items-center justify-center">
                    <div className="w-full max-w-[300px] min-w-[100px]">
                        <div className="relative">
                            <input
                                className="w-full bg-slate-800 placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-full pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                placeholder="" 
                            />
                            <button
                                className="absolute top-1 right-1 flex items-center rounded-full bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                                Search
                            </button> 
                        </div>
                    </div>
                        {isSignedIn ? (
                                    <div>
                                    <   AvatarWithUserDropdown></AvatarWithUserDropdown>
                                    </div>
                                ) : (
                                    <Link href="/signin">Sign in</Link>
                        )}   
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                        alt=""
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-8 w-auto"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                    </div>
                    <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                            <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                            {item.name}
                            </a>
                        ))}
                        </div>
                        <div className="py-6">
                        {isSignedIn ? (
                            <AvatarWithUserDropdown />
                        ) : (
                            <Link href="/signin">Sign in</Link>
                        )}
                        </div>
                    </div>
                    </div>
                </DialogPanel>
                </Dialog>
             </header>
            }
           
           </div>
     )
}

