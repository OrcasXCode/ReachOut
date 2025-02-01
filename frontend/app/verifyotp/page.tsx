"use client"

import {InputOtp} from "@heroui/react";
import {Button} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center flex-wrap md:flex-nowrap gap-4 h-screen w-screen">
      <InputOtp
        classNames={{
          segmentWrapper: "gap-x-0",
          segment: [
            "relative",
            "h-10",
            "w-10",
            "border-y",
            "border-r",
            "first:rounded-l-md",
            "first:border-l",
            "last:rounded-r-md",
            "border-default-200",
            "data-[active=true]:border",
            "data-[active=true]:z-20",
            "data-[active=true]:ring-2",
            "data-[active=true]:ring-offset-2",
            "data-[active=true]:ring-offset-background",
            "data-[active=true]:ring-foreground",
          ],
          description: "text-sm font-light italic text-gray-700 text-center mt-2",
        }}
        description="Enter the 6 digit code sent to your email"
        length={6}
        radius="none"
      />
       <Button className="mt-[20px] text-gray-400 rounded-lg border hover:border-0 hover:bg-gray-200 hover:text-black" type="submit" variant="flat">
        Verify OTP
      </Button>
    </div>
  );
}


