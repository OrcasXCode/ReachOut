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
    if(cachedCategories && typeof cachedCategories==="string"){
        return c.json(JSON.parse(cachedCategories));
    }

    try{
        const allCategories = await prisma.category.findMany({
            include:{
                subCategories: true
            }
        });
        await redis.set(cacheKey,JSON.stringify(allCategories),{ex:3600});
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


//get all user domains routes
export async function getUserDomains(c:Context){
    const userId = c.get('userId');
    const redis = createRedisClient(c.env);
    const cacheKey = `userDomains${userId}`;
    const cachedUserDomains = await redis.get(cacheKey);
    if(cachedUserDomains && typeof cachedUserDomains==="string"){
        return c.json(JSON.parse(cachedUserDomains));
    }

    const userDomains=[
        "IT & Digital Services", "Beauty & Personal Care", "Home-Based Businesses & Small Manufacturers", "Food & Beverage", "Health & Wellness", "Education & Coaching", "Home Services & Repairs", "Local Vendors & Market Sellers", "Transport & Logistics", "Photography & Event Planning", "Miscellaneous & Special Services"
    ]

    await redis.set(cacheKey,JSON.stringify(userDomains),{ex:3600});
    return c.json({userDomains},200);
}