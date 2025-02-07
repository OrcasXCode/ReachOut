"use client"

import {InputOtp,Button} from "@heroui/react";
import {ChangeEventHandler,useState} from "react";
import axios from  "axios"
import Cookies from "js-cookie"
import toast from "react-hot-toast";

interface LabelledInputType{
  type?: string,
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function LabelledInput({type="text",onChange}:LabelledInputType){
  return(
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
      type={type}
      onChange={onChange}
    />
  )
}

export default function App() {

  const [otp,setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const email = localStorage.getItem('email');


  const handleVerifyOtp = async (event:React.FormEvent)=>{
    event.preventDefault();
    try{
      const emailHash = crypto.createHash("sha256").update(email).digest("hex");
      const response = await axios.post("http://localhost:8787/api/v1/user/verifyotp", {
        emailHash, otp
    });

      // Cookies.set("accessToken", response.data.accessToken, {
      //   expires: 7, 
      //   secure: true, 
      //   sameSite: "Strict", 
      // });
      const resetToken = response.data.resetToken;
      localStorage.setItem('resetToken', resetToken);  // Store the token securely

      // Redirect to the reset password page
      toast.success("OTP verified successfully");
      window.location.href = '/resetpassword';
      // Cookies.set("resetToken", response.data.accessToken, {
      //   expires: 7, 
      //   secure: true, 
      //   sameSite: "Strict", 
      // });
    }
    catch(err:any){
      setError(err.response?.data?.error || "Something went wrong");
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-wrap md:flex-nowrap gap-4 h-screen w-screen">
      <form onSubmit={handleVerifyOtp}>
        <LabelledInput type="tel" onChange={(e) => setOtp(e.target.value)}></LabelledInput>
        <Button className="mt-[20px] text-gray-400 rounded-lg border hover:border-0 hover:bg-gray-200 hover:text-black" type="submit" variant="flat">
          Verify OTP
        </Button>
      </form>
    </div>
  );
}


