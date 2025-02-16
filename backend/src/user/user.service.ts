import { Context } from "hono";
import { createRedisClient } from "../services/redis";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { AES } from "../services/aesService";
import {editprofileinput} from "@omsureja/reachout"


export const getPrisma = (env: { DATABASE_URL: string }) => {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
};


//fetching userID route
export async function getUserId(c:Context){
    const userId = c.get('userId');
    console.log("UserId in backend",userId);  
    if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ userId });
}

//getting user profile route
export async function getUserDetails(c: Context) {
    const prisma = getPrisma(c.env);
    const userId = c.get("userId"); 
    const redis = createRedisClient(c.env);
    const id = c.req.param('id');
  
  
    const cacheKey = `user:${userId}`;
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) return c.json(cachedUser);
  
    const secretKey = c.env.AES_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Server misconfiguration: Missing AES secret key" }, 500);
  
    try {
        if (!id) {
            return c.json({ error: 'Id is required' }, 400);
        }
        if (!userId) return c.json({ error: "User is not authenticated" }, 403);
        const userDetails = await prisma.user.findFirst({
            where: { id: userId },
            include: {
              businesses: {
                include: {
                  businessMedia: {
                    select: {
                      id: true,
                      url: true, // Ensure that businessMedia fields exist
                    },
                  },
                },
              },
            },
        });  
        if (!userDetails) return c.json({ error: "User does not exist" }, 404);

        const businessDetails = await prisma.business.findFirst({ where: { ownerId: id },});
        if (!businessDetails) return c.json({ error: 'User does not exist' }, 404);

        let decryptedEmail = "";
        let decryptedPhoneNumber = "";
        let decryptedBusinessEmail = "";
        let decryptedBusinessPhoneNumber = "";
  
        try {
            decryptedEmail = await AES.decrypt(userDetails.email, userDetails.emailIV, secretKey) || "";
            decryptedPhoneNumber = await AES.decrypt(userDetails.phoneNumber, userDetails.phoneNumberIV, secretKey) || "";
    
            if (businessDetails) {
                decryptedBusinessEmail = await AES.decrypt(
                businessDetails.businessEmail,
                businessDetails.businessEmailIV || "", // Ensure IV field exists
                secretKey
                ) || "";
            
                decryptedBusinessPhoneNumber = await AES.decrypt(
                businessDetails.phoneNumber, 
                businessDetails.phoneNumberIV || "", // Ensure IV field exists
                secretKey
                ) || "";
            }
            
        } catch (decryptError) {
            console.error("Decryption failed:", decryptError);
            return c.json({ error: "Failed to decrypt user data" }, 500);
        }
  
        const responseData = {
            ...userDetails,
            email: decryptedEmail,
            phoneNumber: decryptedPhoneNumber,
            businessEmail: decryptedBusinessEmail,
            businessPhoneNumber: decryptedBusinessPhoneNumber,
        };
    
        await redis.set(cacheKey, responseData, { ex: 3600 });
    
        return c.json(responseData);
    } 
    catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
}

//delete user profile route
export async function deleteProfile(c:Context){
    const prisma = getPrisma(c.env);
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
}

//review user profile route
export async function reviewProfile(c:Context){
    const prisma = getPrisma(c.env);
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
}

//edit user profile route
export async function editProfile(c:Context){
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = editprofileinput.safeParse(body);
    const prisma = getPrisma(c.env);

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
}
  
  

