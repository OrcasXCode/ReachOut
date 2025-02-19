import { z } from "zod";
export declare const signupinput: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["USER", "BUSINESS"]>;
    userDomain: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "USER" | "BUSINESS";
    userDomain: string;
}, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "USER" | "BUSINESS";
    userDomain: string;
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
    emailHash: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    emailHash: string;
    otp: string;
}, {
    emailHash: string;
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
export declare const editprofileinput: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}, {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}>;
export type EditProfileInput = z.infer<typeof editprofileinput>;
export declare const addBusinessInput: z.ZodObject<{
    name: z.ZodString;
    verified: z.ZodBoolean;
    address: z.ZodString;
    businessEmail: z.ZodString;
    phoneNumber: z.ZodString;
    categoryId: z.ZodString;
    subCategoryIds: z.ZodArray<z.ZodString, "many">;
    totalRating: z.ZodDefault<z.ZodNumber>;
    website: z.ZodOptional<z.ZodString>;
    businessType: z.ZodEnum<["ESTABLISHED_BUSINESS", "STREET_VENDOR", "HOME_BUSINESS", "SERVICES"]>;
    about: z.ZodString;
    mediaFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        file: z.ZodType<File, z.ZodTypeDef, File>;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        file: File;
    }, {
        type: string;
        file: File;
    }>, "many">>;
    businessHours: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayofWeek: z.ZodEnum<["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]>;
        openingTime: z.ZodString;
        closingTime: z.ZodString;
        specialNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dayofWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        openingTime: string;
        closingTime: string;
        specialNote?: string | undefined;
    }, {
        dayofWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        openingTime: string;
        closingTime: string;
        specialNote?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    phoneNumber: string;
    name: string;
    verified: boolean;
    address: string;
    businessEmail: string;
    categoryId: string;
    subCategoryIds: string[];
    totalRating: number;
    businessType: "ESTABLISHED_BUSINESS" | "STREET_VENDOR" | "HOME_BUSINESS" | "SERVICES";
    about: string;
    website?: string | undefined;
    mediaFiles?: {
        type: string;
        file: File;
    }[] | undefined;
    businessHours?: {
        dayofWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        openingTime: string;
        closingTime: string;
        specialNote?: string | undefined;
    }[] | undefined;
}, {
    phoneNumber: string;
    name: string;
    verified: boolean;
    address: string;
    businessEmail: string;
    categoryId: string;
    subCategoryIds: string[];
    businessType: "ESTABLISHED_BUSINESS" | "STREET_VENDOR" | "HOME_BUSINESS" | "SERVICES";
    about: string;
    totalRating?: number | undefined;
    website?: string | undefined;
    mediaFiles?: {
        type: string;
        file: File;
    }[] | undefined;
    businessHours?: {
        dayofWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        openingTime: string;
        closingTime: string;
        specialNote?: string | undefined;
    }[] | undefined;
}>;
export type AddBusinessInput = z.infer<typeof addBusinessInput>;
export declare const editBusinessTimings: z.ZodObject<{
    businessHours: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodEnum<["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]>;
        openingTime: z.ZodString;
        closingTime: z.ZodString;
        specialNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }, {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    businessHours: {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }[];
}, {
    businessHours: {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }[];
}>;
export type EditBusinessTimings = z.infer<typeof editBusinessTimings>;
export declare const editBusinessDetails: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    about: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    businessHours: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodEnum<["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]>;
        openingTime: z.ZodString;
        closingTime: z.ZodString;
        specialNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }, {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    phoneNumber?: string | undefined;
    name?: string | undefined;
    address?: string | undefined;
    about?: string | undefined;
    businessHours?: {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }[] | undefined;
}, {
    phoneNumber?: string | undefined;
    name?: string | undefined;
    address?: string | undefined;
    about?: string | undefined;
    businessHours?: {
        openingTime: string;
        closingTime: string;
        dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
        specialNote?: string | undefined;
    }[] | undefined;
}>;
export type EditBusinessDetails = z.infer<typeof editBusinessDetails>;
