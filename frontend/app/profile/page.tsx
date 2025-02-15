"use client";

import React from "react";
import Link from "next/link"
import Cookies from 'js-cookie'
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";

import {
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuthStore } from "../lib/useAuthStore";
import axios from 'axios';
import {toast} from 'react-hot-toast';

 
const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon , route:'/myprofile' },
  { label: "Edit Profile", icon: Cog6ToothIcon , route:'/myprofile/edit' },
  { label: "Inbox", icon: InboxArrowDownIcon , route:'/viewinbox'},
  { label: "Help", icon: LifebuoyIcon , route:'/contact'},
  { label: "Sign Out", icon: PowerIcon, route:'/signout' },
];

export default function AvatarWithUserDropdown() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { setIsSignedIn } = useAuthStore();

  const handleSignOut = async () => {
    // Show loading toast
    const loadingToast = toast.loading('Signing out...', { duration: Infinity });
  
    try {
      const response = await axios.post('http://localhost:8787/api/v1/auth/signout', {}, {
        withCredentials: true, 
      });
  
      if (response.status === 200) {
        setIsSignedIn(false);
        // Update the loading toast to success
        toast.success('Logout Successful', {
          id: loadingToast,
          duration: 3000,
        });
  
        localStorage.removeItem('auth-store'); // Clear Zustand's persisted state
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1000);
      } else {
        // Update the loading toast to error
        toast.error('Signout failed. Please try again.', {
          id: loadingToast,
          duration: 3000,
        });
      }
    } catch (err: any) {
      console.error('Error during sign-out:', err);
      // Update the loading toast to error
      toast.error('An error occurred during sign-out. Please try again.', {
        id: loadingToast,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center">
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button variant="text" color="blue-gray" className="p-0">
            <Avatar
              variant="circular"
              size="md"
              alt="User"
              withBorder={true}
              color="blue-gray"
              className="w-10 h-10 p-0.5 rounded-full"
              src="https://docs.material-tailwind.com/img/face-2.jpg"
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-3 w-48 space-y-5  z-20 bg-[#ffffff] border-gray-50 rounded-sm">
        {profileMenuItems.map(({ label, icon, route }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return isLastItem ? (
              <MenuItem
                key={label}
                onClick={handleSignOut}
                className="group flex items-center p-2 rounded gap-2 text-gray-600 hover:bg-red-500/10 focus:bg-red-500/10"
              >
                {React.createElement(icon, {
                  className: "h-4 w-4 text-red-500",
                  strokeWidth: 1,
                })}
                <Typography as="span" variant="small" className="font-medium text-red-500">
                  {label}
                </Typography>
              </MenuItem>
            ) : (
              <Link href={route} key={label}>
                <MenuItem
                  onClick={closeMenu}
                  className="group flex items-center p-2 rounded gap-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                >
                  {React.createElement(icon, {
                    className: "h-4 w-4 text-gray-600",
                    strokeWidth: 1,
                  })}
                  <Typography as="span" variant="small" className="font-medium text-black">
                    {label}
                  </Typography>
                </MenuItem>
              </Link>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}
