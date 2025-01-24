import { z } from "zod";
export declare const signupinput: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["USER", "BUSINESS"]>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "USER" | "BUSINESS";
}, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "USER" | "BUSINESS";
}>;
export type SignupInput = z.infer<typeof signupinput>;
export declare const signininput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SigninInput = z.infer<typeof signininput>;
export declare const forgetpasswordinput: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ForgetPasswordInput = z.infer<typeof forgetpasswordinput>;
export declare const verifyotpinput: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
}, {
    email: string;
    otp: string;
}>;
export type VerifyOtpInput = z.infer<typeof verifyotpinput>;
export declare const resetpasswordinput: z.ZodObject<{
    resetToken: z.ZodString;
    newPassword: z.ZodString;
    confirmnewPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    resetToken: string;
    newPassword: string;
    confirmnewPassword: string;
}, {
    resetToken: string;
    newPassword: string;
    confirmnewPassword: string;
}>;
export type ResetPasswordInput = z.infer<typeof resetpasswordinput>;
