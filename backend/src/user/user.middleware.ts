import { verify } from 'hono/jwt';
import { MiddlewareHandler } from 'hono';

export const userMiddleware: MiddlewareHandler = async (c, next) => {
    const cookies = c.req.header("Cookie") || "";
    const accessToken = cookies.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1];

    if (!accessToken) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const payload = await verify(accessToken, c.env.JWT_SECRET);
        
        if (!payload || typeof payload !== 'object' || !payload.id) {
            console.error("Invalid token payload:", payload);
            return c.json({ error: 'Unauthorized' }, 401);
        }

        c.set('userId', payload.id as string);
        console.log("Sending UserId in Context",payload.id)
        await next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};
