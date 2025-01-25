import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import {signupinput} from "@omsureja/reachout";
import {signininput} from "@omsureja/reachout";
import {forgetpasswordinput} from "@omsureja/reachout"
import {verifyotpinput} from "@omsureja/reachout"
import {resetpasswordinput} from "@omsureja/reachout"
import {editprofileinput} from "../../../common/src/index"
import jwt from 'jsonwebtoken';


export const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>();


//Defining the PrismClient Globallly so that we dont need to define it in every route
userRoutes.use('*', async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  
    c.set('prisma', prisma);
    await next();
});

//signup route
userRoutes.post('/signup', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();

    const parsed = signupinput.safeParse(body);

    if (!parsed.success) {
        return c.json({
            error: 'Invalid Input',
            details: parsed.error.errors
        }, 400);
    }

    const { firstName, lastName, email, phoneNumber, password, role } = parsed.data;

    try {
        const validEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (validEmail) {
            return c.json({ error: 'Email Already Exists' }, 400);
        }

        //!Before storing it in DB, hash the password if necessary
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                role
            },
        });

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ token: jwt },200);
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});

//global middelware
userRoutes.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization') || " ";
    if (!jwt) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
    }

    const token = jwt.split(' ')[1];
    if (!token) {
        c.status(401);
        return c.json({ error: 'Token Missing' });
    }

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload || !payload.id) {
        c.status(401);
        return c.json({ error: 'Unauthorized' });
        }

        c.set('userId', payload.id as string);
        await next();
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});

//signin route
userRoutes.post('/signin', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();

    const parsed = signininput.safeParse(body);
    if(!parsed.success){
        return c.json({
            error: 'Invalid input',
            details:parsed.error.errors
        },400)
    }

    const {email,password}=parsed.data

    try {
        const user = await prisma.user.findFirst({
        where: {
            email,
            password
        },
        });

        if (!user) {
        c.status(403);
        return c.json({ error: 'Incorrect Credentials' });
        }

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ message: 'SignIn Successful', token: jwt },200);
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});

//forget password route
userRoutes.post('/forgetpassword',async (c)=>{
    const prisma = c.get('prisma');
    const body = await c.req.json();

    const parsed = forgetpasswordinput.safeParse(body);
    if(!parsed.success){
        return c.json({
            error: 'Invalid input',
            details:parsed.error.errors
        },400)
    }

    const {email}=parsed.data;
    try{
        const validEmail= await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!validEmail){
            return c.json({
                error:'Email does not exist'
            })
        }

        function generateOTP(length: number): string {
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            
            return Array.from(array, (num) => (num % 10).toString()).join('');
        }
        console.log(generateOTP(6));
        
        const otp= generateOTP(6);
        const expiresAt=new Date(Date.now()+10*60*1000);

        await prisma.oTP.create({
            data:{
                email,otp,expiresAt
            }
        })
        //!Implement the function of sending the email seperately
        return c.json({message:'OTP sent to your email',otp},200)
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({
            error:'Internal Server Error'
        })
    }
})

//verify otp route
userRoutes.post('/verifyotp',async (c)=>{
    const body = await c.req.json();
    const prisma = c.get('prisma');

    const parsed=verifyotpinput.safeParse(body);
    if(!parsed.success){
        return c.json({
            error:'Invalid input',
            details:parsed.error.errors
        },400)
    }

    const {email,otp} = parsed.data;
    try{

        const getUser=await prisma.oTP.findFirst({
            where:{ email }
        })
        if(!getUser){
            return c.json({
                error:'You have not SignedUp Yet',
                details:'Please create a account first and then try again later'
            },404)
        }
        if(getUser?.otp!==otp){
            return c.json({
                error:'OTP did not match',
            },404)
        }
        if(getUser.expiresAt<new Date()){
            return c.json({
                error:'OTP expired',
                details:'Try to Resend it and try again later!'
            })
        }

        const resetToken = jwt.sign({ email }, c.env.JWT_SECRET, { expiresIn: '15m' });

        await prisma.oTP.delete({ where: { email } });

        return c.json({ message: 'OTP verified', resetToken }, 200);
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({
            error:'Internal Server Error'
        })
    }
})

//reset password route
userRoutes.post('/resetpassword',async (c)=>{
    const body =await c.req.json();
    const prisma= c.get('prisma');

    const parsed = resetpasswordinput.safeParse(body);
    if(!parsed.success){
        return c.json({
            error: 'Invalid Inputs',
            details : parsed.error.errors
        })
    }

    const { resetToken, newPassword, confirmnewPassword } = parsed.data;
    try{
        const decoded = jwt.verify(resetToken, c.env.JWT_SECRET) as { email: string };
        const { email } = decoded;

        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return c.json({
                error:'User does not exits',
            })
        }
        if(newPassword!==confirmnewPassword){
            return c.json({
                error:'Both the password does not match . Please try again later'
            })
        }
        await prisma.user.update({
            where:{email},
            data:{
                password:newPassword
            }
        })
        return c.json({
            message:'Password reset successfully',
            details:email
        },200)
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({error : 'Internal Server Error'})
    }
})

//getting user profile route
userRoutes.get('/:id',async (c)=>{
    const id = c.req.param('id');
    const prisma = c.get('prisma');

    try{
        if(!id) return c.json({
            error: 'Id is required',
        },401)
        const userDetails=await prisma.user.findFirst({
            where:{
                id:parseInt(id)
            }
        })
        if(!userDetails){
            return c.json({
                error:'User does not exists'
            },401)
        }
        return c.json(userDetails);
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({error:'Internal Server Error'});
    }
})


//edit user detail route
userRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = editprofileinput.safeParse(body);
    const prisma = c.get('prisma');

    if (!parsed.success) {
        return c.json({
            error: 'Invalid input',
            details: parsed.error.errors
        }, 400);
    }

    try {
        if (!id) return c.json({ error: 'Id is required' }, 400);

        const userDetails = await prisma.user.findFirst({
            where: { id: parseInt(id) }
        });

        if (!userDetails) {
            return c.json({ error: 'User does not exist' }, 404);
        }

        const { firstName, lastName, email, phoneNumber, password } = parsed.data;

        let updateData: any = {};

        if (firstName && firstName !== userDetails.firstName) updateData.firstName = firstName;
        if (lastName && lastName !== userDetails.lastName) updateData.lastName = lastName;
        if (password) updateData.password = password;

        // if (email && email !== userDetails.email) {
        //     await sendOtpVerification(email);
        //     return c.json({
        //         message: 'OTP sent to new email. Verify before updating.'
        //     }, 200);
        // }
        
        // if (phoneNumber && phoneNumber !== userDetails.phoneNumber) {
        //     await sendOtpVerification(phoneNumber);
        //     return c.json({
        //         message: 'OTP sent to new phone number. Verify before updating.'
        //     }, 200);
        // }

        if ('role' in body) {
            return c.json({ error: 'Role modification is not allowed' }, 403);
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: updateData
            });
        }

        return c.json({
            message: 'User details updated successfully',
            userDetails: { ...userDetails, ...updateData }
        }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
