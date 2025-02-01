"use client"

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Field, Label, Switch } from '@headlessui/react'

const ContactTextArea = ({ row, placeholder, name, defaultValue } :{row:any,placeholder:any,name:any,defaultValue:any}) => {
    return (
      <>
        <div className="mb-6">
          <textarea
            rows={row}
            placeholder={placeholder}
            name={name}
            className="w-full resize-none rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
            defaultValue={defaultValue}
          />
        </div>
      </>
    );
  };
  
  const ContactInputBox = ({ type, placeholder, name } : {type:any,placeholder:any,name:any}) => {
    return (
      <>
        <div className="mb-6">
          <input
            type={type}
            placeholder={placeholder}
            name={name}
            className="w-full rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
          />
        </div>
      </>
    );
  };
  

export default function App() {


  const [agreed, setAgreed] = useState(false)

    return(
    <div>   
      {/* Help Section */}
        <section className="dark:bg-gray-100 dark:text-gray-800 mt-[90px] pb-[100px]">
            <div className="container flex flex-col items-center p-4 mx-auto md:p-8">
                <h1 className="text-3xl font-bold leading-none text-center sm:text-4xl">Help Center</h1>
                <div className="relative mt-6 mb-12">
                    <span className="absolute inset-y-0 flex items-center pl-2 mx-auto">
                        <button type="submit" title="Search" className="p-1 focus:outline-none focus:ring">
                            <svg fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4 dark:text-gray-800">
                                <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                            </svg>
                        </button>
                    </span>
                    <input type="search" name="Search" placeholder="Search..." className="w-full py-3 pl-12 text-sm rounded-full sm:w-96 focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50" />
                </div>
                <div className="flex flex-col w-full divide-y sm:flex-row sm:divide-y-0 sm:divide-x sm:px-8 lg:px-12 xl:px-32 dark:divide-gray-300">
                    <div className="flex flex-col w-full divide-y dark:divide-gray-300">
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Billing</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Support</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Account</a>
                    </div>
                    <div className="flex flex-col w-full divide-y dark:divide-gray-300">
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Features</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Contact us</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">My orders</a>
                    </div>
                    <div className="hidden w-full divide-y sm:flex-col sm:flex dark:divide-gray-300">
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Enterprise</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Privacy</a>
                        <a rel="noopener noreferrer" href="#" className="flex items-center justify-center p-4 sm:py-8 lg:py-12">Developers</a>
                    </div>
                </div>
            </div>
        </section>
        {/* FAQ's */}
        <section className="bg-gray-800 text-gray-100 mb-[50px]">
            <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
                <p className="p-2 text-sm font-medium tracking-wider text-center uppercase">How it works</p>
                <h2 className="mb-12 text-4xl font-bold leading-none text-center sm:text-5xl">Frequently Asked Questions</h2>
                <div className="grid gap-10 md:gap-8 sm:p-3 md:grid-cols-2 lg:px-12 xl:px-32">
                    <div>
                        <h3 className="font-semibold">Lorem ipsum dolor sit amet.</h3>
                        <p className="mt-1 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione, fugit? Aspernatur, ullam enim, odit eaque quia rerum ipsum voluptatem consequatur ratione, doloremque debitis? Fuga labore omnis minima, quisquam delectus culpa!</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Lorem ipsum dolor sit amet.</h3>
                        <p className="mt-1 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione, fugit? Aspernatur, ullam enim, odit eaque quia rerum ipsum voluptatem consequatur ratione, doloremque debitis? Fuga labore omnis minima, quisquam delectus culpa!</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Lorem ipsum dolor sit amet.</h3>
                        <p className="mt-1 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione, fugit? Aspernatur, ullam enim, odit eaque quia rerum ipsum voluptatem consequatur ratione, doloremque debitis? Fuga labore omnis minima, quisquam delectus culpa!</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Lorem ipsum dolor sit amet.</h3>
                        <p className="mt-1 text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione, fugit? Aspernatur, ullam enim, odit eaque quia rerum ipsum voluptatem consequatur ratione, doloremque debitis? Fuga labore omnis minima, quisquam delectus culpa!</p>
                    </div>
                </div>
            </div>
        </section>
         {/* Contact Us Form */}
         <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
              />
            </div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Contact sales</h2>
              <p className="mt-2 text-lg/8 text-gray-600">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p>
            </div>
            <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
                    Company
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                      <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country"
                          aria-label="Country"
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                          <option>US</option>
                          <option>CA</option>
                          <option>EU</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                      <input
                        id="phone-number"
                        name="phone-number"
                        type="text"
                        placeholder="123-456-7890"
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      defaultValue={''}
                    />
                  </div>
                </div>
                <Field className="flex gap-x-4 sm:col-span-2">
                  <div className="flex h-6 items-center">
                    <Switch
                      checked={agreed}
                      onChange={setAgreed}
                      className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-checked:bg-indigo-600"
                    >
                      <span className="sr-only">Agree to policies</span>
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white ring-1 shadow-xs ring-gray-900/5 transition duration-200 ease-in-out group-data-checked:translate-x-3.5"
                      />
                    </Switch>
                  </div>
                  <Label className="text-sm/6 text-gray-600">
                    By selecting this, you agree to our{' '}
                    <a href="#" className="font-semibold text-indigo-600">
                      privacy&nbsp;policy
                    </a>
                    .
                  </Label>
                </Field>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Let's talk
                </button>
              </div>
            </form>
          </div>
    </div>
    )
}
