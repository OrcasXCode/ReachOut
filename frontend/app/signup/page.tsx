"use client"
import Link from 'next/link'
import { ChangeEventHandler, useEffect, useState } from "react";
import BusinessOnBoarding from '../components/BusinessOnBoarding'
import UserOnBoarding from '../components/UserOnBoarding'
import {useSignup} from '../context/SignUpContext'

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface ProfilePhoto {
  type: string;
  url: string;
}

function LabelledInput({ label, placeholder, type = "text", onChange }: LabelledInputType) {
  return (
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [showUserOnBoarding, setShowUserOnBoarding] = useState(false);
  const [showBusinessOnBoarding, setShowBusinessOnBoarding] = useState(false);
  const { updateSignupData, submitSignup } = useSignup();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    const profilePhotoData: ProfilePhoto = {
      type: "image",
      url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
    };

    const updatedData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      profilePhoto: profilePhotoData,
    };

    localStorage.setItem('signupData', JSON.stringify(updatedData)); // Save data

    updateSignupData(updatedData);

    if (role === "BUSINESS") {
      localStorage.setItem('onboardingStatus', 'BUSINESS'); // Save role as onboarding status
      setShowBusinessOnBoarding(true);
    }
    if (role === "USER") {
      localStorage.setItem('onboardingStatus', 'USER'); // Save role as onboarding status
      setShowUserOnBoarding(true);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('signupData');
    const onboardingStatus = localStorage.getItem('onboardingStatus');

    if (savedData && onboardingStatus) {
      // Parse saved data
      const parsedData = JSON.parse(savedData);

      // Set form data (to avoid losing it)
      setFirstName(parsedData.firstName);
      setLastName(parsedData.lastName);
      setEmail(parsedData.email);
      setPhoneNumber(parsedData.phoneNumber);
      setPassword(parsedData.password);
      setRole(parsedData.role);

      // Show the appropriate onboarding page based on the status
      if (onboardingStatus === 'USER') {
        setShowUserOnBoarding(true);
      }
      if (onboardingStatus === 'BUSINESS') {
        setShowBusinessOnBoarding(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showUserOnBoarding || showBusinessOnBoarding) {
      // Clear the data after completing onboarding
      localStorage.removeItem('signupData');
      localStorage.removeItem('onboardingStatus');
    }
  }, [showUserOnBoarding, showBusinessOnBoarding]);

  if (showBusinessOnBoarding) return <BusinessOnBoarding></BusinessOnBoarding>
  if (showUserOnBoarding) return <UserOnBoarding></UserOnBoarding>

  return (
    <>
      <div className="flex min-h-full flex-1 flex-row justify-center px-6 py-[160px] lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="flex flex-row gap-2.5">
              <LabelledInput label="First Name" placeholder="John" type="text" onChange={(e) => setFirstName(e.target.value)}></LabelledInput>

              <LabelledInput label="Last Name" placeholder="Doe" type="text" onChange={(e) => setLastName(e.target.value)}></LabelledInput>
            </div>

            <LabelledInput label="Phone Number" placeholder="+91 " type="text" onChange={(e) => setPhoneNumber(e.target.value)}></LabelledInput>

            <LabelledInput label="Email Address" placeholder="xyz@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)}></LabelledInput>

            <LabelledInput label="New Password" placeholder="••••••••" type="password" onChange={(e) => setPassword(e.target.value)}></LabelledInput>

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