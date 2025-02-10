"use client"
import Link from 'next/link'
import { ChangeEventHandler, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import BusinessOnBoarding from '../components/BusinessOnBoarding'
import UserOnBoarding from '../components/UserOnBoarding'

interface LabelledInputType{
  label: string;
  placeholder: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function LabelledInput({label,placeholder,type="text",onChange}:LabelledInputType){
  return(
    <div>
      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">{label}</label>
        <div className="mt-2">
          <input
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            autoComplete="email"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
    </div>
  )
}


export default function SignUp() {

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("USER");
  const [error,setError] = useState<string | null>(null);
  const [showUserOnBoarding,setShowUserOnBoarding] = useState(false);
  const [showBusinessOnBoarding,setShowBusinessOnBoarding] = useState(false);

  const handleSignUp = async(event:React.FormEvent)=>{
    event.preventDefault();
    if(role=="USER"){
      setShowUserOnBoarding(true);
    }
    if(role=="BUSINESS"){
      setShowBusinessOnBoarding(true);
    }
    try{
      const response = await axios.post(
        "http://localhost:8787/api/v1/user/signup",
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          role
        },
        {withCredentials : true}
      );

      localStorage.setItem('firstName',firstName);
      localStorage.setItem('firstName',lastName);
      localStorage.setItem('firstName',email);
      localStorage.setItem('firstName',phoneNumber);
      localStorage.setItem('firstName',password);
      localStorage.setItem('firstName',role);

      Cookies.set("accessToken",response.data.accessToken,{
        expires: 1,
        secure:true,
        sameSite:"Strict"
      })
    }
    catch(err:any){
      setError(err.response?.data?.error || "Something Went Wrong");
    }
  }

  if(showBusinessOnBoarding){
    return <BusinessOnBoarding></BusinessOnBoarding>
  }
  if(showUserOnBoarding){
    return <UserOnBoarding></UserOnBoarding>
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-row  justify-center px-6 py-[160px] lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm relative pt-[100px]">
            <div className="flex flex-col items-start justify-items-start place-content-start">
                <h2 className="mt-10 text-center text-4xl/9 font-bold tracking-tight text-gray-900">
                    Get
                </h2>
                <h2 className="mt-5 text-center text-6xl/9 font-bold tracking-tight text-gray-900">
                    Discovered
                </h2>
            </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="flex flex-row gap-2.5">
              <LabelledInput label="First Name" placeholder="John" type="text" onChange={(e)=>setFirstName(e.target.value)}></LabelledInput>

              <LabelledInput label="Last Name" placeholder="Doe" type="text" onChange={(e)=>setLastName(e.target.value)}></LabelledInput>
            </div>
                
      
              <LabelledInput label="Phone Number" placeholder="+91 " type="text" onChange={(e)=>setPhoneNumber(e.target.value)}></LabelledInput>

              <LabelledInput label="Email Address" placeholder="xyz@gmail.com" type="email" onChange={(e)=>setEmail(e.target.value)}></LabelledInput>


              <LabelledInput label="New Password" placeholder="••••••••" type="password" onChange={(e)=>setPassword(e.target.value)}></LabelledInput>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="USER">User</option>
                <option value="BUSINESS">Business</option>
              </select>


            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member ? {' '}
            <Link href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}