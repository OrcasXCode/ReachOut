import { sign } from "hono/jwt";
import { Context } from "hono";
import bcrypt from "bcryptjs";
import { createRedisClient } from "../services/redis";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signininput, signupinput } from "@omsureja/reachout";
import { AES } from "../services/aesService";
import crypto from "crypto";

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

    if (failedAttempts && parseInt(failedAttempts?.toString() || "0") >= 5) {
      c.status(429);
      return c.json({ error: "Too many failed attempts. Try again later." });
    }

    const userCacheKey = `user:${emailHash}`;
    let userData: string | null = await redis.get(userCacheKey);
    let user: { id: string; email: string; emailIV: string; password: string } | null = null;

    if (userData) {
      try {
        user = JSON.parse(userData);
      } catch (error) {
        console.error("Failed to parse user data from Redis:", error);
        // If parsing fails, fetch the user from the database
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
    } else {
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

    // TypeScript now recognizes `user` properties
    if (!user || !user.id) {
      return c.json({ error: "Invalid user data" }, 500);
    }

    const decryptedEmail = await AES.decrypt(user.email, user.emailIV, secretKey);
    if (decryptedEmail !== email) {
      await redis.incr(failedAttemptsKey);
      await redis.expire(failedAttemptsKey, 900);
      return c.json({ error: "Incorrect Credentials" }, 403);
    }

    if (user.password !== password) {
      await redis.incr(failedAttemptsKey);
      await redis.expire(failedAttemptsKey, 900);
      return c.json({ error: "Password does not match" }, 403);
    }

    // Clear failed login attempts after successful login
    await redis.del(failedAttemptsKey);

    const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
    const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");

    // Store refresh token in Redis
    await redis.set(`refresh_token:${user.id}`, refreshToken, {
      ex: 7 * 86400, // Expire after 7 days
    });

    c.res.headers.append("Set-Cookie", `accessToken=${accessToken}; HttpOnly; SameSite=Strict; Path=/`);
    c.res.headers.append("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${7 * 86400}`);

    return c.json({ message: "Login successful" }, 200);
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

  const { firstName, lastName, email, phoneNumber, password, role } = parsed.data;

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

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: encryptedEmail.encrypted,
        emailIV: encryptedEmail.iv,
        emailHash,
        phoneNumber: encryptedPhoneNumber.encrypted,
        phoneNumberIV: encryptedPhoneNumber.iv,
        password: password,
        // password: hashedPassword,
        role,
      },
    });

    const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
    const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");

    //Store refresh token in Redis
    await redis.set(`refresh_token:${user.id}`, refreshToken, {
      ex: 7 * 86400, 
    });

    c.res.headers.append("Set-Cookie", `accessToken=${accessToken}; HttpOnly; Path=/;  SameSite=Strict`);
    c.res.headers.append("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Path=/;  SameSite=Strict`);

    return c.json({ message: "Signup successful", accessToken }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

// **Logout Function**
export async function logout(c: Context) {
  const redis = createRedisClient(c.env);
  try {
    const userId = c.get("userId");
    await redis.del(`refresh_token:${userId}`); 

    c.header("Set-Cookie", `accessToken=; HttpOnly; Path=/; Max-Age=0`);
    c.header("Set-Cookie", `refreshToken=; HttpOnly; Path=/; Max-Age=0`);

    return c.json({ message: "Logout successful" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
}
