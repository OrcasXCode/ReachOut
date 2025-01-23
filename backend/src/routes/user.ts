import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {sign , decode , verify } from 'hono/jwt'

export const userRoutes=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}>()

userRoutes.post('/api/v1/user/signup', async (c) => {
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    try{
        const validEmail=await prisma.user.findUnique({
            where:{
                email:body.email
            }
        })
        if(!validEmail){
            return c.text('Email Already Exists')
        }

        const user=await prisma.user.create({
            data:{
            firstName:body.firstName,
            lastName:body.lastName,
            email:body.email,
            phoneNumber:body.phoneNumber,
            password:body.password,
            }
        })
     
        const jwt = await sign({
            id:user.id
        },c.env.JWT_SECRET)
        return c.text(jwt);
    }
    catch(error){
      console.log(error);
      c.status(411);
      return c.text('Invalid');
    }
  })
  
  
userRoutes.post('/api/v1/user/signin',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body=await c.req.json();
  
    try{
        const user=await prisma.user.findFirst({
            where:{
            email:body.email,
            password:body.password,
            }
        })
        if(!user){
            c.status(403); //unauthorized
            return c.json({
            message:"Incorrect Credentials"
            })
        }
        const jwt = await sign({
            id:user.id
         },c.env.JWT_SECRET);
        return c.json({jwt});
    }
    catch(error){
        console.log(error);
        c.status(411);
        return c.text('Invalid');
    }
  })
  