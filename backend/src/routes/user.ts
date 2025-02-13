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

        c.res.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/;  SameSite=Strict`);
        c.res.headers.append('Set-Cookie', `refreshToken=${accessToken}; HttpOnly; Path=/;  SameSite=Strict`);

        return c.json({ accessToken }, 200);
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});

//signout route
userRoutes.post('/signout', async (c) => {
    const prisma = c.get('prisma');
    try {
        c.header('Set-Cookie', 'accessToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict');

        c.header('Set-Cookie', 'refreshToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict', { append: true });

        // Return a success response
        return c.json({ message: 'Logged out successfully' },200);
    } catch (error) {
        console.error('Error during sign-out:', error);

        return c.json({ error: 'Internal Server Error' },500);
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

        c.res.headers.append(
            'Set-Cookie',
            `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict`
        );

        c.res.headers.append(
            'Set-Cookie',
            `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict`
        );
        
        return c.json({ accessToken }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
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

        const secretKey = c.env.AES_SECRET_KEY;
        if(!secretKey){
            return c.json({
                error: 'AES Secret Key is not set',
            },403)
        }

        const emailHash =  crypto.createHash("sha256").update(email).digest("hex");

        const user= await prisma.user.findFirst({
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

        await prisma.oTP.upsert({
            where:{
                emailHash:emailHash
            },
            update: { 
                otp, 
                expiresAt 
            },
            create: { 
                email: encryptedEmail.encrypted, 
                emailIV: encryptedEmail.iv, 
                emailHash, 
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

        // const accessToken = await sign({ id: user.id }, c.env.JWT_SECRET || "");
         
        // c.res.headers.append('Set-Cookie', `refreshToken=${accessToken}; HttpOnly; Path=/;  SameSite=Strict`);

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

// Verify OTP Route (Same as before)
userRoutes.post('/verifyotp', async (c) => {
    const body = await c.req.json();
    const prisma = c.get('prisma');

    try {
        const otpUser = await prisma.oTP.findFirst({
            where: { emailHash: body.emailHash },
            select: { otp: true, expiresAt: true }
        });

        if (!otpUser) {
            return c.json({ error: 'OTP not found' }, 404);
        }

        if (otpUser.otp !== body.otp) {
            return c.json({ error: 'OTP did not match' }, 400);
        }

        if (otpUser.expiresAt.getTime() < Date.now()) {  
            return c.json({
                error: 'OTP expired',
                details: 'Try to resend it and try again later!'
            }, 400);
        }

        const resetToken = jwt.sign({ emailHash: body.emailHash }, c.env.JWT_SECRET, { expiresIn: '15m' });

        c.res.headers.append(
            "Set-Cookie",
            `resetToken=${resetToken}; HttpOnly; Secure; Path=/; SameSite=Strict`
        );

        // Delete OTP after successful verification
        await prisma.oTP.delete({ where: { emailHash: body.emailHash } });

        return c.json({ message: 'OTP verified' }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

// Reset Password Route with Cookie-Based Token Retrieval
userRoutes.post('/resetpassword', async (c) => {
    const body = await c.req.json();
    const prisma = c.get('prisma');

    const parsed = resetpasswordinput.safeParse(body);
    if (!parsed.success) {
        return c.json({
            error: 'Invalid Inputs',
            details: parsed.error.errors
        }, 400);
    }

    const { newPassword, confirmnewPassword } = parsed.data;

    try {
        // Get resetToken from HTTP-only cookies
        const resetToken = c.req.header('Cookie')?.split('; ').find(row => row.startsWith('resetToken='))?.split('=')[1];

        if (!resetToken) {
            return c.json({ error: 'Reset token is missing' }, 401);
        }

        const decoded = jwt.verify(resetToken, c.env.JWT_SECRET) as { emailHash: string };
        const { emailHash } = decoded;

        const user = await prisma.user.findUnique({ where: { emailHash } });

        if (!user) {
            return c.json({ error: 'User does not exist' }, 404);
        }

        if (newPassword !== confirmnewPassword) {
            return c.json({ error: 'Passwords do not match' }, 400);
        }

        await prisma.user.update({
            where: { emailHash },
            data: { password: newPassword }
        });

        // Clear the resetToken cookie after successful password reset
        c.res.headers.append(
            "Set-Cookie",
            `resetToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0`
        );

        return c.json({ message: 'Password reset successfully' }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Invalid or expired token' }, 400);
    }
});



//global middelware
userRoutes.use('/*', async (c, next) => {
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
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: 'Internal Server Error' });
    }
});


//getting userId
userRoutes.get('/me', async (c) => {
    const userId = c.get('userId');  
    if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ userId });
});



//getting user profile route
userRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    try {
        if (!id) {
            return c.json({ error: 'Id is required' }, 400);
        }

        if (!userId) {
            return c.json({ error: 'User is not authenticated' }, 403);
        }

        const secretKey = c.env.AES_SECRET_KEY;
        if (!secretKey) {
            return c.json({ error: 'Server misconfiguration: Missing AES secret key' }, 500);
        }

        const businessDetails = await prisma.business.findFirst({ where: { ownerId: id } });

        if (!businessDetails) return c.json({ error: 'User does not exist' }, 404);

        const userDetails = await prisma.user.findFirst({
            where: { id: id },
            include: { businesses: true },
        });

        if (!userDetails) {
            return c.json({ error: 'User does not exist' }, 404);
        }

        let decryptedEmail = "";
        let decryptedPhoneNumber = "";
        let decryptedBusinessEmail = "";
        let decryptedBusinessPhoneNumber = "";

        try {
            decryptedEmail = await AES.decrypt(userDetails.email, userDetails.emailIV, secretKey) || "";
            decryptedPhoneNumber = await AES.decrypt(userDetails.phoneNumber, userDetails.phoneNumberIV, secretKey) || "";
            decryptedBusinessEmail = await AES.decrypt(businessDetails.businessEmail, businessDetails.businessEmailIV, secretKey) || "";
            decryptedBusinessPhoneNumber = await AES.decrypt(businessDetails.phoneNumber, businessDetails.phoneNumberIV, secretKey) || "";
        } catch (decryptError) {
            console.error("Decryption failed:", decryptError);
            return c.json({ error: 'Failed to decrypt user data' }, 500);
        }

        return c.json({
            ...userDetails,
            email: decryptedEmail,
            phoneNumber: decryptedPhoneNumber,
            businessEmail: decryptedBusinessEmail,
            businessPhoneNumber: decryptedBusinessPhoneNumber,
        });

    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
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

//user to review a business
userRoutes.post('/review/:id', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId = c.req.param('id');
    const body = await c.req.json();

    try {
        if (!userId) {
            return c.json({ error: 'Provide a user ID' }, 401);
        }

        if (!businessId) {
            return c.json({ error: 'Provide a business ID for review' }, 403);
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const business = await prisma.business.findUnique({ where: { id: businessId } });
        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        const { rating, description, mediaUrls }: { 
            rating: number; 
            description: string; 
            mediaUrls?: { type: string; url: string }[]; 
        } = body; // Explicit typing for `mediaUrls`

        if (!rating || rating < 1 || rating > 5) {
            return c.json({ error: 'Rating must be between 1 and 5' }, 400);
        }

        if (!description || description.trim() === '') {
            return c.json({ error: 'Description is required' }, 400);
        }

        if (
            mediaUrls &&
            (!Array.isArray(mediaUrls) || !mediaUrls.every(media => media.type && media.url))
        ) {
            return c.json({ error: 'Invalid media format: Each media item must have type and url' }, 400);
        }

        const newReview = await prisma.review.create({
            data: {
                businessId,
                rating,
                description,
                customerMedia: {
                    create: mediaUrls?.map(({ type, url }) => ({
                        type,
                        url
                    })) || []
                }
            },
            include: {
                customerMedia: true
            }
        });

        return c.json({ message: 'Review submitted successfully', review: newReview }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
