import { verify } from "hono/jwt";
import { createRedisClient } from "../services/redis";
import { Context, Next } from "hono";

export async function businessMiddleware(c: Context, next: Next) {
  // try {
    const redis = createRedisClient(c.env);
    // const cookies = c.req.header("Cookie") || "";
    // const accessToken = cookies
    //   .split("; ")
    //   .find((row) => row.startsWith("accessToken="))
    //   ?.split("=")[1];

    // if (!accessToken) {
    //   c.status(401);
    //   return c.json({ error: "Unauthorized" });
    // }

    // const payload = await verify(accessToken, c.env?.JWT_SECRET);
    // if (!payload || !payload.id) {
    //   c.status(401);
    //   return c.json({ error: "Invalid token" });
    // }

    // const redisToken = await redis.get(`session:${payload.id}`);
    // if (!redisToken || redisToken !== accessToken) {
    //   c.status(401);
    //   return c.json({ error: "Session expired" });
    // }

    // c.set("userId", payload.id as string);
    // console.log("passed")
    // await next();
    const cookies = c.req.header("Cookie") || "";
    const accessToken = cookies.split("; ").find(row=>row.startsWith("accessToken="))?.split("=")[1];

    if (!accessToken) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }


    try {
        const payload = await verify(accessToken, c.env.JWT_SECRET);
        if (!payload || !payload.id) {
            c.status(401);
            return c.json({ error: 'Unauthorized' });
        }

        c.set('userId', payload.id as string);
        await next();
    } 
  catch (error) {
    console.log(error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
}

