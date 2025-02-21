"use client"

import {  UserCircleIcon } from '@heroicons/react/24/solid';
import { useState, useRef ,useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';


export default function EditProfile() {
    const [files, setFiles] = useState<{ [key: string]: File }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedOver, setDraggedOver] = useState(false);
    const [userRole, setUserRole] = useState<string | null>("USER");
    const [userId, setUserId] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [userBusinessDetails, setUserBusinessDetails] = useState<any>(null);
    const [firstName,setFirstName] = useState<string | null>(null);
    const [lastName,setLastName] = useState<string | null>(null);
    const [email,setEmail] = useState<string | null>(null);
    const [phoneNumber,setPhoneNumber] = useState<string | null>(null);
    const [name,setName] = useState<string | null>(null);
    const [businessEmail,setBusinessEmail] = useState<string | null>(null);
    const [businessPhoneNumber,setBusinessPhoneNumber] = useState<string | null>(null);
    const [address,setAddress] = useState<string | null>(null);
    const [verified,setVerified] = useState<boolean | null>(false);
    const [totalRating,setTotalRating] = useState<number | null>(0);
    const [website,setWebsite] = useState<string | null>(null);
    const [about,setAbout] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [businessId,setBusinessId] = useState<string | null>(null);

    // Handle file addition
    const addFile = (file: File) => {
        const objectURL = URL.createObjectURL(file);
        setFiles((prevFiles) => ({ ...prevFiles, [objectURL]: file }));
    };

    // // Handle file input change
    // const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         for (const file of e.target.files) {
    //             addFile(file);
    //         }
    //     }
    // };

    // Handle file drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            for (const file of e.dataTransfer.files) {
                addFile(file);
            }
        }
        setDraggedOver(false);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes("Files")) {
            setDraggedOver(true);
        }
    };

    // Handle drag leave
    const handleDragLeave = () => {
        setDraggedOver(false);
    };

    // Handle file deletion
    // const handleDelete = (objectURL: string) => {
    //     const newFiles = { ...files };
    //     delete newFiles[objectURL];
    //     setFiles(newFiles);
    // };

    // Handle form submission
    useEffect(()=>{
        const fetchBusinessData = async()=>{
            const meResponse = await axios.get("http://localhost:8787/api/v1/business/me", {
                withCredentials: true,
            });
            const businessId = meResponse.data.businessId.id;
            setBusinessId(businessId);
        }
        fetchBusinessData();
    },[])

    const handleSubmit = async () => {
        if (Object.keys(files).length === 0) {
            alert("No files selected");
            return;
        }
    
        const formData = new FormData();
        Object.values(files).forEach((file) => {
            formData.append("files", file);
        });
    
        try {
            console.log("Entered File API");
            const response = await axios.put(
                `http://localhost:8787/api/v1/business/uploadbusinessmedia/${businessId}`,
                formData, // Pass formData directly
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            console.log("Exited",response);
            alert("Files uploaded successfully");
            setFiles({}); // Clear selected files after upload
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };
    
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
    
        const newFiles = Array.from(event.target.files);
        setFiles((prevFiles) => ({
            ...prevFiles,
            ...Object.fromEntries(newFiles.map((file) => [URL.createObjectURL(file), file])),
        }));
    };
    const handleDelete = (objectURL: string) => {
        setFiles((prevFiles) => {
            const updatedFiles = { ...prevFiles };
            delete updatedFiles[objectURL];
            return updatedFiles;
        });
    };   
    
    const handleCancel = () => {
        setFiles({});
    };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
            const meResponse = await axios.get("http://localhost:8787/api/v1/user/me", {
                withCredentials: true,
            });
            console.log("Me Response",meResponse);
            const userId = meResponse.data.userId;
            console.log(userId);
            setUserId(userId);
    
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            const userResponse = await axios.get(`http://localhost:8787/api/v1/user/${userId}`, {
                withCredentials: true,
            });
    
            const userData = userResponse.data;
            setUserDetails(userData);

            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setEmail(userData.email || "");
            setPhoneNumber(userData.phoneNumber || "");
            setUserRole(userData.role || "");
            setBusinessEmail(userData.businessEmail || "");
            setBusinessPhoneNumber(userData.businessPhoneNumber || "");

            if (userData?.role === "BUSINESS") {
                const business = userData?.businesses[0]; 
                setUserBusinessDetails(business);  
                setName(business?.name || "");  
                setAddress(business?.address || "");  
                setAbout(business?.about || "");  
                setWebsite(business?.website || "");  
                setVerified(business?.verified || false);
                setTotalRating(business?.totalRating || 0);
            }

        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      fetchUserData();
    }, []);

    //update user details
    const updateDetailsHandler = async () => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        try {
            const updatedDetails = {
                firstName,
                lastName,
                email,
                phoneNumber,
                password:"1234567890"
            };

            await axios.put(
                `http://localhost:8787/api/v1/user/${userId}`,
                updatedDetails,
                { withCredentials: true }
            );

            // Update local state after successful update
            setUserDetails((prev: any) => ({
                ...prev,
                ...updatedDetails,
            }));

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    //delete user account
    const deleteAccountHandler = async () => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8787/api/v1/user/${userId}`,
                { withCredentials: true }
            );

            setTimeout(()=>{
                window.location.href="/signin"
            },1000)

            toast.success("Account Deleted");

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const [profileurl,setProfileUrl] = useState(null);

    const fetchUserProfile = async()=>{
      const response = await axios.get('http://localhost:8787/api/v1/business/getprofilepic',{withCredentials:true});
      console.log(response.data.profilePhoto.url);
      setProfileUrl(response.data.profilePhoto.url);
    }
  
    useEffect(()=>{
      fetchUserProfile();
    },[profileurl])
  
    return (
        <form className="w-full h-full flex items-center justify-center mb-[150px] mt-[150px]">
            <div className="space-y-12 max-w-7xl p-3">

                {/* Profile Picture */}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                    </p>

                    <div className="col-span-full mt-5">
                        <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                            Profile Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">  
                            <div aria-hidden="true" className="size-12 text-gray-300 border rounded-full">
                                {profileurl ? (
                                    <img src={profileurl} alt="Profile" className="size-12 rounded-full" />
                                ) : (
                                    <UserCircleIcon aria-hidden="true" className="size-12 text-gray-300" />
                                )}
                            </div>
                            <button
                                type="button"
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal User Details */}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Use your correct personal information to avoid spoiling marketplace.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            autoComplete="given-name"
                            value={firstName || ""}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e)=>setFirstName(e.target.value)}
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2">
                            <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
                            value={lastName || ""}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e)=>setLastName(e.target.value)}
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email || ""}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="phone-number" className="block text-sm/6 font-medium text-gray-900">
                            Phone Number
                        </label>
                        <div className="mt-2">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={phoneNumber || ""}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e)=>setPhoneNumber(e.target.value)}
                            />
                        </div>
                        </div>

                        {/* <div className="col-span-full">
                            <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <textarea
                                id="street-address"
                                name="street-address"
                                rows={3}
                                autoComplete="street-address"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div> */}

                        {/* <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                            City
                        </label>
                        <div className="mt-2">
                            <input
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="address-level2"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-2">
                        <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                            State / Province
                        </label>
                        <div className="mt-2">
                            <input
                            id="region"
                            name="region"
                            type="text"
                            autoComplete="address-level1"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                            ZIP / Postal code
                        </label>
                        <div className="mt-2">
                            <input
                            id="postal-code"
                            name="postal-code"
                            type="text"
                            autoComplete="postal-code"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        </div> */}
                    </div>
                </div>

                {/* Business Details */}
                {userRole === "BUSINESS" && (
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Business Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Use your correct business information to avoid any further inconvenience.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        value={name || ""}
                                        onChange={(e)=>setName(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                
                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                    Current League
                                </label>
                                <div className="mt-2">
                                <input
                                    id="last-name"
                                    name="last-name"
                                    type="text"
                                    autoComplete="family-name"
                                    disabled={true}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={String(verified) || ""}
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email Address
                                </label>
                                <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={businessEmail || ""}
                                    onChange={(e)=>setBusinessEmail(e.target.value)}
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-3">
                                <label htmlFor="phone-number" className="block text-sm/6 font-medium text-gray-900">
                                Phone Number
                                </label>
                                <div className="mt-2">
                                <input
                                    id="businessPhoneNumber"
                                    name="businessPhoneNumber"
                                    type="text"
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={businessPhoneNumber || ""}
                                    onChange={(e)=>setBusinessPhoneNumber(e.target.value)}
                                />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Website
                                </label>
                                <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={website || ""}
                                    onChange={(e)=>setWebsite(e.target.value)}
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-3">
                                <label htmlFor="phone-number" className="block text-sm/6 font-medium text-gray-900">
                                    Rating
                                </label>
                                <div className="mt-2">
                                <input
                                    id="totalRating"
                                    name="totalRating"
                                    type="text"
                                    disabled={true}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={String(totalRating) || ""}
                                />
                                </div>
                            </div>
                
                            <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                                    About
                                </label>
                                <div className="mt-2">
                                <textarea
                                    id="street-address"
                                    name="street-address"
                                    rows={3}
                                    autoComplete="street-address"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={about || ""}
                                    onChange={(e)=>setAbout(e.target.value)}
                                />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                                Street address
                                </label>
                                <div className="mt-2">
                                <textarea
                                    id="street-address"
                                    name="street-address"
                                    rows={3}
                                    autoComplete="street-address"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={address || ""}
                                    onChange={(e)=>setAddress(e.target.value)}
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                                City
                                </label>
                                <div className="mt-2">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                                State / Province
                                </label>
                                <div className="mt-2">
                                <input
                                    id="region"
                                    name="region"
                                    type="text"
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                </div>
                            </div>
                
                            <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                                ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                <input
                                    id="postal-code"
                                    name="postal-code"
                                    type="text"
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div className="sm:col-span-full">
                                <article
                                    aria-label="File Upload Modal"
                                    className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >

                                    {/* Scroll Area */}
                                    <section className="h-full overflow-auto p-8 w-full flex flex-col">
                                        <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                            <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                                <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
                                            </p>
                                            <input
                                                id="hidden-input"
                                                type="file"
                                                multiple
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileInputChange}
                                            />
                                            <button
                                                id="button"
                                                type="button" // Prevent form submission
                                                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Upload a file
                                            </button>
                                        </header>

                                        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">To Upload</h1>

                                        <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                                            {Object.keys(files).length === 0 ? (
                                                <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center">
                                                    <img
                                                        className="mx-auto w-32"
                                                        src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                                                        alt="no data"
                                                    />
                                                    <span className="text-small text-gray-500">No files selected</span>
                                                </li>
                                            ) : (
                                                Object.entries(files).map(([objectURL, file]) => (
                                                    <li key={objectURL} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                                                        <article
                                                            tabIndex={0}
                                                            className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm"
                                                        >
                                                            {file.type.match("image.*") && (
                                                                <img
                                                                    alt="upload preview"
                                                                    className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
                                                                    src={objectURL}
                                                                />
                                                            )}
                                                            <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                                                                <h1 className="flex-1 group-hover:text-blue-800">{file.name}</h1>
                                                                <div className="flex">
                                                                    <span className="p-1 text-blue-800">
                                                                        <i>
                                                                            <svg
                                                                                className="fill-current w-4 h-4 ml-auto pt-1"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                                                            </svg>
                                                                        </i>
                                                                    </span>
                                                                    <p className="p-1 size text-xs text-gray-700">
                                                                        {file.size > 1024
                                                                            ? file.size > 1048576
                                                                                ? Math.round(file.size / 1048576) + "mb"
                                                                                : Math.round(file.size / 1024) + "kb"
                                                                            : file.size + "b"}
                                                                    </p>
                                                                    <button
                                                                        className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                                                                        onClick={() => handleDelete(objectURL)}
                                                                    >
                                                                        <svg
                                                                            className="pointer-events-none fill-current w-4 h-4 ml-auto"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                className="pointer-events-none"
                                                                                d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </section>
                                                        </article>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </section>

                                    {/* Sticky Footer */}
                                    <footer className="flex justify-end px-8 pb-8 pt-4">
                                        <button
                                            id="submit"
                                            type="button" // Prevent form submission
                                            className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                                            onClick={handleSubmit}
                                        >
                                            Upload now
                                        </button>
                                        <button
                                            id="cancel"
                                            type="button" // Prevent form submission
                                            className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </footer>
                                </article>
                            </div>

                            <div className="sm:col-span-full space-x-4 p-2">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <div key={day} className="flex flex-row gap-2 bg-white rounded-lg mb-5">
                                    <p className="font-medium text-gray-900 flex items-end w-[50%]">{day}</p>

                                    <div className="flex w-[50%] justify-between items-center">
                                    {/* Start Time */}
                                    <div>
                                        <label htmlFor={`${day.toLowerCase()}-start`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                                        Open time:
                                        </label>
                                        <div className="relative">
                                        <input type="time" id={`${day.toLowerCase()}-start`} className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required />
                                        </div>
                                    </div>

                                    {/* End Time */}
                                    <div>
                                        <label htmlFor={`${day.toLowerCase()}-end`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                                        Close time:
                                        </label>
                                        <div className="relative">
                                        <input type="time" id={`${day.toLowerCase()}-end`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" required />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}
    

                {/* Notifications Section */}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Notifications</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                        We'll always let you know about important changes, but you pick what else you want to hear about.
                    </p>

                    <div className="mt-10 space-y-10">
                        <fieldset>
                        <legend className="text-sm/6 font-semibold text-gray-900">By email</legend>
                        <div className="mt-6 space-y-6">
                            <div className="flex gap-3">
                            <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                <input
                                    defaultChecked
                                    id="comments"
                                    name="comments"
                                    type="checkbox"
                                    aria-describedby="comments-description"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                    <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="comments" className="font-medium text-gray-900">
                                Comments
                                </label>
                                <p id="comments-description" className="text-gray-500">
                                Get notified when someones posts a comment on a posting.
                                </p>
                            </div>
                            </div>
                            <div className="flex gap-3">
                            <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                <input
                                    id="candidates"
                                    name="candidates"
                                    type="checkbox"
                                    aria-describedby="candidates-description"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                    <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="candidates" className="font-medium text-gray-900">
                                Candidates
                                </label>
                                <p id="candidates-description" className="text-gray-500">
                                Get notified when a candidate applies for a job.
                                </p>
                            </div>
                            </div>
                            <div className="flex gap-3">
                            <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                <input
                                    id="offers"
                                    name="offers"
                                    type="checkbox"
                                    aria-describedby="offers-description"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                    <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="offers" className="font-medium text-gray-900">
                                Offers
                                </label>
                                <p id="offers-description" className="text-gray-500">
                                Get notified when a candidate accepts or rejects an offer.
                                </p>
                            </div>
                            </div>
                        </div>
                        </fieldset>

                        <fieldset>
                        <legend className="text-sm/6 font-semibold text-gray-900">Push notifications</legend>
                        <p className="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-x-3">
                            <input
                                defaultChecked
                                id="push-everything"
                                name="push-notifications"
                                type="radio"
                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                            />
                            <label htmlFor="push-everything" className="block text-sm/6 font-medium text-gray-900">
                                Everything
                            </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                            <input
                                id="push-email"
                                name="push-notifications"
                                type="radio"
                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                            />
                            <label htmlFor="push-email" className="block text-sm/6 font-medium text-gray-900">
                                Same as email
                            </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                            <input
                                id="push-nothing"
                                name="push-notifications"
                                type="radio"
                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                            />
                            <label htmlFor="push-nothing" className="block text-sm/6 font-medium text-gray-900">
                                No push notifications
                            </label>
                            </div>
                        </div>
                        </fieldset>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={updateDetailsHandler}
                    >
                        Save
                    </button>
                </div>

                {/* Delete Account */}
                <button onClick={() => setIsOpen(true)} className="py-2 px-4 bg-red-500 text-white rounded-md">
                    Delete Account
                </button>

                {isOpen && (
                     <div
                     className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"
                   >
                     <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 relative">
                       {/* Close Icon */}
                        <button onClick={() => setIsOpen(false)} className="float-right">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                                viewBox="0 0 320.591 320.591"                          
                            >
                                <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"
                                />
                                <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"
                            />
                        </svg>
                        </button>
               
                       {/* Modal Content */}
                       <div className="my-8 text-center">
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-14 fill-red-500 inline"
                           viewBox="0 0 286.054 286.054"
                         >
                           <path
                             fill="#e2574c"
                             d="M143.027 0C64.04 0 0 64.04 0 143.027c0 78.996 64.04 143.027 143.027 143.027 78.996 0 143.027-64.022 143.027-143.027C286.054 64.04 222.022 0 143.027 0zm0 259.236c-64.183 0-116.209-52.026-116.209-116.209S78.844 26.818 143.027 26.818s116.209 52.026 116.209 116.209-52.026 116.209-116.209 116.209zm.009-196.51c-10.244 0-17.995 5.346-17.995 13.981v79.201c0 8.644 7.75 13.972 17.995 13.972 9.994 0 17.995-5.551 17.995-13.972V76.707c-.001-8.43-8.001-13.981-17.995-13.981zm0 124.997c-9.842 0-17.852 8.01-17.852 17.86 0 9.833 8.01 17.843 17.852 17.843s17.843-8.01 17.843-17.843c-.001-9.851-8.001-17.86-17.843-17.86z"
                             data-original="#e2574c"
                           />
                         </svg>
               
                         <h4 className="text-lg text-gray-800 font-semibold mt-6">
                           Your account will be deleted permanently!
                         </h4>
                         <p className="text-sm text-gray-500 mt-2">Are you sure to proceed?</p>
                       </div>
               
                       {/* Buttons */}
                       <div className="flex max-sm:flex-col gap-4">
                         <button
                           type="button"
                           className="px-5 py-2.5 rounded-lg w-full tracking-wide text-gray-800 text-sm border-none outline-none bg-gray-200 hover:bg-gray-300"
                           onClick={() => setIsOpen(false)}
                         >
                           I am not sure
                         </button>
                         <button
                           type="button"
                           className="px-5 py-2.5 rounded-lg w-full tracking-wide text-white text-sm border-none outline-none bg-red-500 hover:bg-red-600"
                           onClick={deleteAccountHandler}
                         >
                           Remove my account
                         </button>
                       </div>
                     </div>
                   </div>
                )}

                <div id="hs-scale-animation-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabIndex={-1} aria-labelledby="hs-scale-animation-modal-label">
                <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                    <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3 id="hs-scale-animation-modal-label" className="font-bold text-gray-800">
                        Modal title
                        </h3>
                        <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#hs-scale-animation-modal">
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <p className="mt-1 text-gray-800">
                        This is a wider card with supporting text below as a natural lead-in to additional content.
                        </p>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-scale-animation-modal">
                        Close
                        </button>
                        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Save changes
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </form>
    );
}