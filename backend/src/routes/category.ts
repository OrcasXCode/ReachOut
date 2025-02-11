import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const categoryRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
    AES_SECRET_KEY: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>();


//Defining the PrismClient Globallly so that we dont need to define it in every route
categoryRoutes.use('*', async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  
    c.set('prisma', prisma);
    await next();
});



categoryRoutes.get("/getAll",async (c)=>{
    const prisma = c.get('prisma');

    try{
        const allCategories = await prisma.category.findMany({
            include:{
                subCategories: true
            }
        });
        return c.json({
            allCategories
        },200)
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({error:"Internal Server Error"})
    }
})