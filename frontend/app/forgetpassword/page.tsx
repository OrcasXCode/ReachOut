"use client"

import {ChangeEventHandler,useState} from "react"
import axios from "axios";
import toast from "react-hot-toast";

interface LabelledInputType{
  label: string,
  placeholder: string,
  type?: string,
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function LabelledInput({label,placeholder,type="text",onChange}:LabelledInputType){
  return(
    <div>
      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          required
          placeholder={placeholder}
          autoComplete="email"
          onChange={onChange}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
    </div>
  )
}

export default function ForgetPassword() {

  const [email,setEmail] = useState("");
  const [error,setError] = useState<string | null>(null);

  const handleForgetPassword = async (event: React.FormEvent)=>{
    event.preventDefault();

    try{
      console.log("Sending Email",email);
      const response = await axios.post(
        "http://localhost:8787/api/v1/user/forgetpassword",
        {email},
        {withCredentials: true}
      )

      // Cookies.set("accessToken",response.data.accessToken,{
      //   expires: 7,
      //   secure: true,
      //   sameSite: "Strict"
      // })
      toast.success("OTP Sent");
      localStorage.setItem('email',email);
      setTimeout(() => {
        window.location.href = "/verifyotp";
      }, 1000);
    }
    catch(err:any){
      setError(err.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <>
      <div className="flex min-h-full h-screen w-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Forgot Your Password?
          </h2>
          <p className="italic font-light mt-5 text-center">Just enter your registered email address, and we'll send reset instructions to your inbox.</p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleForgetPassword} className="space-y-6">
            <LabelledInput type="email" placeholder="xyz@gmail.com" label="email" onChange={(e)=>setEmail(e.target.value)} ></LabelledInput>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
