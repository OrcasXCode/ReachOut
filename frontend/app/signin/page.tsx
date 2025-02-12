"use client";

import Link from "next/link";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";
import Cookies from "js-cookie"; 
import { useAuthStore } from "../lib/useAuthStore";
import {toast} from 'react-hot-toast';

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}


function LabelledInput({ label, placeholder, type = "text", onChange }: LabelledInputType) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900">{label}</label>
        {label==='Password' ? 
        <div className="text-sm">
          <a href="/forgetpassword" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div> : null}
      </div>
      <div className="mt-2">
        <input
          onChange={onChange}
          type={type}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setIsSignedIn } = useAuthStore();


  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault(); 

    try {
      const response = await axios.post(
        "http://localhost:8787/api/v1/user/signin",
        { email, password },
        { withCredentials: true}
      );

      Cookies.set("accessToken", response.data.accessToken, {
        expires: 7, 
        secure: true, 
        sameSite: "Lax", 
        path:"/"
      });

      setIsSignedIn(true);
      toast.success("SignIn Successful");
    
      // Redirect after state update
      setTimeout(() => {
        window.location.href = "/business";
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen  flex-1 flex-col justify-center lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignIn} className="space-y-6">
          <LabelledInput label="Email" placeholder="xyz@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
          <LabelledInput label="Password" placeholder="••••••••" type="password" onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Did not register yet?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
