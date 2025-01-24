import {z} from "zod"


export const signupinput=z.object({
    firstName:z.string(),
    lastName:z.string(),
    email:z.string().email(),
    phoneNumber:z.string().max(10),
    password:z.string().min(6),
    role: z.enum(['USER', 'BUSINESS']), 
})
export type SignupInput= z.infer<typeof signupinput>


export const signininput=z.object({
    email:z.string().email(),
    password:z.string()
})
export type SigninInput=z.infer<typeof signininput>


export const forgetpasswordinput=z.object({
    email:z.string().email(),
})
export type ForgetPasswordInput=z.infer<typeof forgetpasswordinput>


export const verifyotpinput=z.object({
    email:z.string().email(),
    otp:z.string().min(6)
})
export type VerifyOtpInput=z.infer<typeof verifyotpinput>

export const resetpasswordinput=z.object({
    resetToken:z.string(),
    newPassword:z.string().min(6),
    confirmnewPassword:z.string().min(6),
})
export type ResetPasswordInput=z.infer<typeof resetpasswordinput>