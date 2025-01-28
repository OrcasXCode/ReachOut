import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import {signupinput} from "@omsureja/reachout";
import {signininput} from "@omsureja/reachout";
import {forgetpasswordinput} from "@omsureja/reachout"
import {verifyotpinput} from "@omsureja/reachout"
import {resetpasswordinput} from "@omsureja/reachout"
import {editprofileinput} from "@omsureja/reachout"
import jwt from 'jsonwebtoken';
import {AES} from '../services/aesService'
import crypto from 'crypto'


export const userRoutes = new Hono<{
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

        const secretKey = c.env.AES_SECRET_KEY;
        if(!secretKey) return c.json({error:'Enryption key not found'},500);

        const emailHash = crypto.createHash("sha256").update(email).digest("hex");

        const existingUser = await prisma.user.findUnique({
            where: { emailHash }
        });

        if (existingUser) {
            return c.json({ error: 'Email Already Exists' }, 400);
        }

        const encryptedEmail = await AES.encrypt(email,secretKey);
        const encryptedPhoneNumber = await AES.encrypt(phoneNumber,secretKey);
   

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email: encryptedEmail.encrypted,
                emailIV: encryptedEmail.iv,
                emailHash,
                phoneNumber: encryptedPhoneNumber.encrypted,
                phoneNumberIV: encryptedPhoneNumber.iv,
                password : password ,
                // password : hashedPassword ,
                role
            },
        });

        const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
        const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");        

        c.res.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Secure; SameSite=Strict`);

        return c.json({ accessToken }, 200);
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
    if (!parsed.success) {
        return c.json({
            error: 'Invalid input',
            details: parsed.error.errors
        }, 400);
    }

    const { email, password } = parsed.data;

    try {
        const secretKey = c.env.AES_SECRET_KEY;
        if (!secretKey) return c.json({ error: 'Encryption key not found' }, 500);

        const emailHash = crypto.createHash("sha256").update(email).digest("hex");

        const user = await prisma.user.findUnique({
            where: { emailHash },
            select: {
                id: true,
                password: true,
                email: true,
                emailIV: true
            }
        });

        if (!user) {
            return c.json({ error: 'Incorrect Credentials' }, 403);
        }

        const decryptedEmail = await AES.decrypt(user.email, user.emailIV, secretKey);
        if (decryptedEmail !== email) {
            return c.json({ error: 'Incorrect Credentials' }, 403);
        }


        if(user.password!==password){
            return c.json({ error: 'Password does not match' }, 403);
        }


        const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
        const refreshToken = await sign({ id: user.id }, c.env.REFRESH_SECRET || "");

        c.res.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Secure; SameSite=Strict`);

        return c.json({ accessToken }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


// //forget password route
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

        const secretKey = c.env.AES_SECRET_KEY;
        if(!secretKey){
            return c.json({
                error: 'AES Secret Key is not set',
            },403)
        }

        const emailHash =  crypto.createHash("sha256").update(email).digest("hex");

        const user= await prisma.user.findUnique({
            where:{
                emailHash
            },
            select:{
                email:true,
                emailIV:true
            }
        })

        if(!user){
            return c.json({
                error:'User does not exist'
            },401)
        }

        const decryptedEmail = await AES.decrypt(user.email,user.emailIV,secretKey);
        if(email !== decryptedEmail){
            return c.json({
                error: 'Email does not match'
            },403)
        }

        function generateOTP(length: number): string {
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            
            return Array.from(array, (num) => (num % 10).toString()).join('');
        }
        console.log(generateOTP(6));
        
        const otp= generateOTP(6);
        const expiresAt=new Date(Date.now()+10*60*1000);
        const encryptedEmail = await AES.encrypt(email,secretKey);

        await prisma.oTP.create({
            data: {
              emailHash,  
              email: encryptedEmail.encrypted, 
              emailIV: encryptedEmail.iv, 
              otp,
              expiresAt
            }
          });
          
        const response = await fetch('https://cfw-react-emails.omp164703.workers.dev/send/email/otp-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp })
        });
        
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

        const secretKey = c.env.AES_SECRET_KEY;
        if(!secretKey) {
            return c.json({
                error: 'AES Secret Key is not set',
            },403)
        }
        
        const emailHash = crypto.createHash("sh256").update(email).digest("hex");

        const getUser=await prisma.oTP.findFirst({
            where:{
                emailHash,
            }
        })

        if(!getUser){
            return c.json({
                error:'You have not SignedUp Yet',
                details:'Please create a account first and then try again later'
            },404)
        }

        const decryptedEmail = await AES.decrypt(getUser.email,getUser.emailIV,secretKey);
        if(decryptedEmail!==email){
            return c.json({
                error:'Email has been tampered with',
            },403)
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

        const resetToken = jwt.sign({ emailHash }, c.env.JWT_SECRET, { expiresIn: '15m' });

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
        const decoded = jwt.verify(resetToken, c.env.JWT_SECRET) as { emailHash: string };
        const { emailHash } = decoded;

        const user = await prisma.user.findUnique({
            where:{emailHash}
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
            where:{emailHash},
            data:{
                password:newPassword
            }
        })
        return c.json({
            message:'Password reset successfully',
            details:emailHash
        },200)
    }
    catch(error){
        console.log(error);
        c.status(500);
        return c.json({error : 'Internal Server Error'})
    }
})

//getting user profile route
userRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    try {
        if (!id) {
            return c.json({ error: 'Id is required' }, 401);
        }

        if(!userId){
            return c.json({
                error: 'User is not authenticated',
            },403)
        }

        const userDetails = await prisma.user.findFirst({
            where: { id : id }
        });

        if (!userDetails) {
            return c.json({ error: 'User does not exist' }, 401);
        }

        return c.json(userDetails);
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});


//edit user detail route
//!Pending
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
            where: { id: id }
        });

        if (!userDetails) {
            return c.json({ error: 'User does not exist' }, 404);
        }

        const { firstName, lastName, email, phoneNumber, password } = parsed.data;

        let updateData: any = {};

        if (firstName && firstName !== userDetails.firstName) updateData.firstName = firstName;
        if (lastName && lastName !== userDetails.lastName) updateData.lastName = lastName;
        if (password) updateData.password = password;

        //!Apply Send OTP Verification Trigger
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
                where: { id : id },
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

//delete user profile 
userRoutes.delete('/:id', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const id  = c.req.param('id');

    try {
        if (!userId) {
            return c.json({ error: 'Provide a user ID' }, 401);
        }

        if(!id){
            return c.json({
                error: 'Provide a user ID to delete',
            },403)
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        await prisma.user.delete({
            where: { id },
        });

        return c.json({ message: 'User deleted successfully' }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});