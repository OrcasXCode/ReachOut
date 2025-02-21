"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editBusinessDetails = exports.editBusinessTimings = exports.addBusinessInput = exports.editprofileinput = exports.resetpasswordinput = exports.verifyotpinput = exports.forgetpasswordinput = exports.signininput = exports.signupinput = void 0;
const zod_1 = require("zod");
exports.signupinput = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().max(10),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['USER', 'BUSINESS']),
    userDomain: zod_1.z.string().optional(),
    profilePhoto: zod_1.z
        .object({
        type: zod_1.z.string(),
        url: zod_1.z.string().url(),
    })
        .optional(),
});
exports.signininput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.forgetpasswordinput = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.verifyotpinput = zod_1.z.object({
    emailHash: zod_1.z.string().length(64).regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash"),
    otp: zod_1.z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
});
exports.resetpasswordinput = zod_1.z.object({
    resetToken: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6),
    confirmnewPassword: zod_1.z.string().min(6),
});
exports.editprofileinput = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().max(10),
    password: zod_1.z.string().min(6)
});
const DayOfWeekEnum = zod_1.z.enum([
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
]);
exports.addBusinessInput = zod_1.z.object({
    name: zod_1.z.string(),
    verified: zod_1.z.boolean(),
    address: zod_1.z.string(),
    businessEmail: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().length(10),
    categoryId: zod_1.z.string().min(1),
    subCategoryIds: zod_1.z.array(zod_1.z.string()).min(1),
    totalRating: zod_1.z.number().default(0),
    website: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    postalcode: zod_1.z.string().optional(),
    landmark: zod_1.z.string().optional(),
    businessType: zod_1.z.enum(['ESTABLISHED_BUSINESS', 'STREET_VENDOR', 'HOME_BUSINESS', 'SERVICES']),
    about: zod_1.z.string(),
    mediaFiles: zod_1.z.array(zod_1.z.object({
        file: zod_1.z.instanceof(File), // Checks if it's a File object
        type: zod_1.z.string(),
    })).optional(),
    businessHours: zod_1.z.array(zod_1.z.object({
        dayofWeek: DayOfWeekEnum,
        openingTime: zod_1.z.string(),
        closingTime: zod_1.z.string(),
        specialNote: zod_1.z.string().optional()
    })).optional()
});
exports.editBusinessTimings = zod_1.z.object({
    businessHours: zod_1.z.array(zod_1.z.object({
        dayOfWeek: DayOfWeekEnum,
        openingTime: zod_1.z.string(),
        closingTime: zod_1.z.string(),
        specialNote: zod_1.z.string().optional()
    }))
});
exports.editBusinessDetails = zod_1.z.object({
    name: zod_1.z.string().optional(),
    about: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    businessHours: zod_1.z.array(zod_1.z.object({
        dayOfWeek: DayOfWeekEnum,
        openingTime: zod_1.z.string(),
        closingTime: zod_1.z.string(),
        specialNote: zod_1.z.string().optional()
    })).optional()
});
