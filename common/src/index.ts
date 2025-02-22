import {z} from "zod"


export const signupinput=z.object({
    firstName:z.string(),
    lastName:z.string(),
    email:z.string().email(),
    phoneNumber:z.string().max(10),
    password:z.string().min(6),
    role: z.enum(['USER', 'BUSINESS']), 
    userDomain: z.string(),
    profilePhoto: z
    .object({
      type: z.string(), 
      url: z.string().url(),
    })
    .optional(),
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


export const otpVerifyInput = z.object({
    email: z.string().email("Invalid email address"),  // Validate email format
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"), // OTP validation
  });
export type VerifyOtpInput = z.infer<typeof otpVerifyInput>;
  
  export const resetPasswordInput = z.object({
    email: z.string().email("Invalid email address"),  // Ensure valid email address
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),  // OTP validation
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmnewPassword: z.string().min(6, "Password must be at least 6 characters long"),
  }).refine((data) => data.newPassword === data.confirmnewPassword, {
    message: "Passwords do not match",
    path: ["confirmnewPassword"],
  });
  
export type ResetPasswordInput = z.infer<typeof resetPasswordInput>;

export const editprofileinput = z.object({
    firstName:z.string(),
    lastName:z.string(),
    email:z.string().email(),
    phoneNumber:z.string().max(10),
    password:z.string().min(6)
})
export type EditProfileInput=z.infer<typeof editprofileinput>



const DayOfWeekEnum = z.enum([
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
]);

export const addBusinessInput = z.object({
    name: z.string(),
    verified: z.boolean(),
    address: z.string(),
    businessEmail: z.string().email(),
    phoneNumber: z.string().length(10),
    categoryId: z.string().min(1),
    subCategoryIds: z.array(z.string()).min(1),
    totalRating: z.number().default(0),
    website: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalcode: z.string().optional(),
    landmark: z.string().optional(),
    businessType: z.enum(['ESTABLISHED_BUSINESS', 'STREET_VENDOR', 'HOME_BUSINESS', 'SERVICES']),
    about: z.string(),
    mediaFiles: z.array(
        z.object({
            file: z.instanceof(File), // Checks if it's a File object
            type: z.string(),
        })
    ).optional(),
    businessHours: z.array(
        z.object({
            dayofWeek : DayOfWeekEnum,
            openingTime: z.string(),
            closingTime: z.string(),
            specialNote: z.string().optional()
        })
    ).optional()

});
export type AddBusinessInput=z.infer<typeof addBusinessInput>


export const editBusinessTimings = z.object({
    businessHours: z.array(
        z.object({
            dayOfWeek: DayOfWeekEnum,
            openingTime: z.string(),
            closingTime: z.string(),
            specialNote: z.string().optional()
        })
    )
})

export type EditBusinessTimings=z.infer<typeof editBusinessTimings>



export const editBusinessDetails = z.object({
    name: z.string().optional(),
    about: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    businessHours: z.array(
        z.object({
            dayOfWeek: DayOfWeekEnum,
            openingTime: z.string(),
            closingTime: z.string(),
            specialNote: z.string().optional()
        })
    ).optional()
})
export type EditBusinessDetails=z.infer<typeof editBusinessDetails>