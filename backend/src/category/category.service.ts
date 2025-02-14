import { Context } from "hono";
import { createRedisClient } from "../services/redis";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export const getPrisma = (env: { DATABASE_URL: string }) => {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
};


//get all categories routes
export async function getCategory(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const redis = createRedisClient(c.env);
    const cacheKey = `categorey${userId}`;
    const cachedCategories = await redis.get(cacheKey);
    if(cachedCategories) return c.json(cachedCategories);

    try{
        const allCategories = await prisma.category.findMany({
            include:{
                subCategories: true
            }
        });
        await redis.set(cacheKey,allCategories,{ex:3600});
        return c.json({
            allCategories
        },200)
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({error:"Internal Server Error"})
    }
}