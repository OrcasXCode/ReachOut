"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpasswordinput = exports.verifyotpinput = exports.forgetpasswordinput = exports.signininput = exports.signupinput = void 0;
const zod_1 = require("zod");
exports.signupinput = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().max(10),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['USER', 'BUSINESS']),
});
exports.signininput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.forgetpasswordinput = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.verifyotpinput = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().min(6)
});
exports.resetpasswordinput = zod_1.z.object({
    resetToken: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6),
    confirmnewPassword: zod_1.z.string().min(6),
});
