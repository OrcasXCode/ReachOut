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


export const verifyotpinput = z.object({
    emailHash: z.string().length(64).regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
});
export type VerifyOtpInput = z.infer<typeof verifyotpinput>;


export const resetpasswordinput=z.object({
    resetToken:z.string(),
    newPassword:z.string().min(6),
    confirmnewPassword:z.string().min(6),
})
export type ResetPasswordInput=z.infer<typeof resetpasswordinput>


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