import { sign } from "hono/jwt";
import { Context } from "hono";
import bcrypt from "bcryptjs";
import { createRedisClient } from "../services/redis";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {forgetpasswordinput, signininput, signupinput,otpVerifyInput,resetPasswordInput} from "@omsureja/reachout";
import { AES } from "../services/aesService";
import crypto from "crypto";
import jwt from 'jsonwebtoken';


export const getPrisma = (env: { DATABASE_URL: string }) => {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL, 
  }).$extends(withAccelerate());
};


export async function signin(c: Context) {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const parsed = signininput.safeParse(body);
  const redis = createRedisClient(c.env);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.errors }, 400);
  }

  const { email, password } = parsed.data;

  try {
    const secretKey = c.env.AES_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Encryption key not found" }, 500);

    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    // Rate Limiting: Check if user is temporarily blocked
    const failedAttemptsKey = `failed_attempts:${emailHash}`;
    const failedAttempts = await redis.get(failedAttemptsKey);

    if (failedAttempts && parseInt(failedAttempts.toString() || "0") >= 5) {
      c.status(429);
      return c.json({ error: "Too many failed attempts. Try again later." });
    }

    const userCacheKey = `user:${emailHash}`;
    let userData: string | null = await redis.get(userCacheKey);
    let user: { id: string; email: string; emailIV: string; password: string } | null = null;

    if (userData) {
      try {
        user = typeof userData === "string" ? JSON.parse(userData) : userData;
      } catch (error) {
        console.error("Failed to parse user data from Redis:", error);
        userData = null; // Reset userData to fetch from DB
      }
    }

    if (!userData) {
      user = await prisma.user.findUnique({
        where: { emailHash },
        select: { id: true, email: true, emailIV: true, password: true },
      });

      if (!user) {
        await redis.incr(failedAttemptsKey);
        await redis.expire(failedAttemptsKey, 900);
        return c.json({ error: "Incorrect Credentials" }, 403);
      }

      await redis.set(userCacheKey, JSON.stringify(user), { ex: 3600 });
    }

    if (!user || !user.id) {
      return c.json({ error: "Invalid user data" }, 500);
    }

    const decryptedEmail = await AES.decrypt(user.email, user.emailIV, secretKey);
    if (!decryptedEmail || decryptedEmail !== email) {
      console.error("Decryption failed:", decryptedEmail);
      await redis.incr(failedAttemptsKey);
      await redis.expire(failedAttemptsKey, 900);
      return c.json({ error: "Incorrect Credentials" }, 403);
    }

    if (user.password !== password) {
      await redis.incr(failedAttemptsKey);
      await redis.expire(failedAttemptsKey, 900);
      return c.json({ error: "Password does not match" }, 403);
    }

    await redis.del(failedAttemptsKey);

    const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
    const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");

    await redis.set(`access_token:${user.id}`, accessToken, { ex: 3600 });
    await redis.set(`refresh_token:${user.id}`, refreshToken, { ex: 7 * 86400 });

    c.res.headers.append("Set-Cookie", `accessToken=${accessToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`);
    c.res.headers.append("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${7 * 86400}`);

    return c.json({ message: "Login successful",accessToken,refreshToken }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function signup(c: Context) {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const parsed = signupinput.safeParse(body);
  const redis = createRedisClient(c.env);

  if (!parsed.success) {
    return c.json({ error: "Invalid Input", details: parsed.error.errors }, 400);
  }

  const { firstName, lastName, email, phoneNumber, password, role, userDomain, profilePhoto } = parsed.data;

  try {
    const secretKey = c.env.AES_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Encryption key not found" }, 500);

    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    const existingUser = await prisma.user.findUnique({ where: { emailHash } });
    if (existingUser) {
      return c.json({ error: "Email Already Exists" }, 400);
    }

    const encryptedEmail = await AES.encrypt(email, secretKey);
    const encryptedPhoneNumber = await AES.encrypt(phoneNumber, secretKey);

    // Create the user synchronously
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: encryptedEmail.encrypted,
        emailIV: encryptedEmail.iv,
        emailHash,
        phoneNumber: encryptedPhoneNumber.encrypted,
        phoneNumberIV: encryptedPhoneNumber.iv,
        password: password, // or use hashed password
        userDomain,
        role,
        profilePhoto: {
          create: {
            type: profilePhoto?.type || "",
            url: profilePhoto?.url || "",
          },
        },
      },
    });

    // Generate tokens and set cookies
    const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
    const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");

    await redis.set(`refresh_token:${user.id}`, refreshToken, { ex: 7 * 86400 });

    c.res.headers.append("Set-Cookie", `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict`);
    c.res.headers.append("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict`);

    return c.json({ message: "Signup successful", accessToken }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function sendPasswordResetOTP(c: Context) {
  const prisma = getPrisma(c.env);
  const redis = createRedisClient(c.env);
  const body = await c.req.json();
  const parsed = forgetpasswordinput.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid Input", details: parsed.error.errors }, 400);
  }

  const { email } = parsed.data;

  try {
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    const user = await prisma.user.findUnique({
      where: { emailHash },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate OTP (6 digits)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in Redis with an expiration time (5 minutes)
    const otpKey = `reset_otp:${emailHash}`;
    await redis.set(otpKey, otp, { ex: 5 * 60 }); // Expire in 5 minutes

    // Send OTP to the user's email
    // await sendOTPEmail(email, otp);
    const response = await fetch('https://cfw-react-emails.omp164703.workers.dev/send/email/otp-email', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp })
    });

    return c.json({ message: "OTP sent to email" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function verifyOTP(c: Context) {
  const redis = createRedisClient(c.env);
  const body = await c.req.json();
  const parsed = otpVerifyInput.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid Input", details: parsed.error.errors }, 400);
  }

  const { email, otp } = parsed.data;

  try {
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    // Get OTP from Redis
    const otpKey = `reset_otp:${emailHash}`;
    const storedOTP = await redis.get(otpKey);

    if (!storedOTP) {
      return c.json({ error: "OTP expired or not found" }, 400);
    }

    // Validate OTP
    if (storedOTP !== otp) {
      return c.json({ error: "Invalid OTP" }, 400);
    }

    // OTP is valid, proceed to password reset
    return c.json({ message: "OTP verified successfully" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function resetPassword(c: Context) {
  const prisma = getPrisma(c.env);
  const redis = createRedisClient(c.env);
  const body = await c.req.json();
  const parsed = resetPasswordInput.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid Input", details: parsed.error.errors }, 400);
  }

  const { email, otp, newPassword } = parsed.data;

  try {
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    // Verify OTP
    const otpKey = `reset_otp:${emailHash}`;
    const storedOTP = await redis.get(otpKey);

    if (!storedOTP) {
      return c.json({ error: "OTP expired or not found" }, 400);
    }

    if (storedOTP !== otp) {
      return c.json({ error: "Invalid OTP" }, 400);
    }

    // Hash the new password
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    // Update the password in the database
    const user = await prisma.user.update({
      where: { emailHash },
      data: { password: hashedPassword },
    });

    // Optionally, remove the OTP from Redis to prevent reuse
    await redis.del(otpKey);

    return c.json({ message: "Password reset successfully" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}


export async function signout(c:Context){
  const prisma = getPrisma(c.env)
  try {
    c.res.headers.append('Set-Cookie', 'accessToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict');
    c.res.headers.append('Set-Cookie', 'refreshToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict');
    // Return a success response
    return c.json({ message: 'Logged out successfully' },200);
  } 
  catch (error) {
    console.error('Error during sign-out:', error);
    return c.json({ error: 'Internal Server Error' },500);
  }
};