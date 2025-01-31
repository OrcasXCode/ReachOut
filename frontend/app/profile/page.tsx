"use client";
import React from "react";
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
 
const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Edit Profile", icon: Cog6ToothIcon },
  { label: "Inbox", icon: InboxArrowDownIcon },
  { label: "Help", icon: LifebuoyIcon },
  { label: "Sign Out", icon: PowerIcon },
];

export default function AvatarWithUserDropdown() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

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
          {profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={closeMenu}
                className={`group flex items-center p-2 rounded gap-2 text-gray-600  ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10"
                    : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 group-hover:text-blac ${
                    isLastItem ? "text-red-500" : "text-gray-600"
                  }`,
                  strokeWidth: 1,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-medium group-hover:text-black"
                >
                  {label}
                </Typography>
            </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}
