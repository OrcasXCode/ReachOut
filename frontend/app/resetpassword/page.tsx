"use client";

import {ChangeEventHandler,useState} from "react";
import axios from  "axios"
import Cookies from "js-cookie"

interface LabelledInputType{
  label: string,
  placeholder:string,
  type?: string,
  onChange: ChangeEventHandler<HTMLInputElement>;
}


function LabelledInput({ label, placeholder, type = "text", onChange }: LabelledInputType) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete="email"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default function ResetPassword() {

  const [newPassword,setPassword] = useState("");
  const [confirmnewPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState<string | null>(null);

  const handleResetPassword = async (event:React.FormEvent)=>{
    event.preventDefault();

    try{
      const resetToken = Cookies.get("resetToken")
      const response = await axios.post(
        "http://localhost:8787/api/v1/user/resetpassword",
        {newPassword,confirmnewPassword,resetToken},
        {withCredentials: true}
      )

      Cookies.set("accessToken",response.data.accessToken,{
        expires: 7,
        secure: true,
        sameSite: "Strict"
      })
    }
    catch(err:any){
      setError(err.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-[170px] lg:px-8 h-screen w-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <LabelledInput type="text" placeholder="" label="New Password" onChange={(e)=>setPassword(e.target.value)}></LabelledInput>
            <LabelledInput type="text" placeholder="" label="New Password" onChange={(e)=>setConfirmPassword(e.target.value)}></LabelledInput>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
