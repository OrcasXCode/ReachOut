import { Context } from "hono";
import { createRedisClient } from "../services/redis";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { AES } from "../services/aesService";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {addBusinessInput} from "@omsureja/reachout"
import {editBusinessTimings} from "@omsureja/reachout"
import {editBusinessDetails} from "@omsureja/reachout"
import crypto from 'crypto'


export const getPrisma = (env: { DATABASE_URL: string }) => {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
};


const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: "AKIATX3PIHYN2QXFDS6W",
      secretAccessKey: "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",
    },
});


//creating new business route
export async function createNewBusiness(c: Context) {
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const body = await c.req.formData();

    const name = body.get("name")?.toString();
    const verified = body.get("verified") === "true";
    const address = body.get("address")?.toString();
    const businessEmail = body.get("businessEmail")?.toString();
    const phoneNumber = body.get("phoneNumber")?.toString();
    const categoryId = body.get("categoryId")?.toString();
    const about = body.get("about")?.toString();
    const city = body.get("city")?.toString();
    const state = body.get("state")?.toString();
    const postalcode = body.get("postalcode")?.toString();
    const landmark = body.get("landmark")?.toString();
    const website = body.get("website")?.toString();
    const businessType = body.get("businessType")?.toString();
    const totalRating = body.get("totalRating") ? Number(body.get("totalRating")) : undefined;


    const subCategoryIds = JSON.parse(body.get("subCategoryIds")?.toString() || "[]");
    const businessHours = JSON.parse(body.get("businessHours")?.toString() || "[]");

    const mediaFiles: { file: File; type: string }[] = [];
    const files = body.getAll("mediaFiles") as File[];

    for (const file of files) {
        mediaFiles.push({ file, type: file.type });
    }

    const parsedData = {
        name,
        verified,
        address,
        businessEmail,
        phoneNumber,
        categoryId,
        subCategoryIds,
        totalRating,
        about,
        city,
        state,
        postalcode,
        landmark,
        website,
        businessHours,
        mediaFiles,
        businessType
    };


    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        if (!user || user.role !== 'BUSINESS') {
            return c.json({ error: 'User is not a business user, not allowed to create a business' }, 401);
        }

        const parsed = addBusinessInput.safeParse(parsedData);
        if (!parsed.success) {
            return c.json({
                error: 'Invalid Inputs',
                details: parsed.error.errors
            }, 400);
        }

        const { name, verified, address,city,state,landmark,postalcode, businessHours, businessEmail, categoryId, subCategoryIds, phoneNumber, totalRating, website, about, businessType } = parsed.data;


        if (!Array.isArray(businessHours) || !businessHours.every(hour =>
            typeof hour.dayofWeek === 'string' &&
            typeof hour.openingTime === 'string' &&
            typeof hour.closingTime === 'string'
        )) {
            return c.json({ error: 'Invalid business hours format' }, 400);
        }

        const secretKey = c.env.AES_SECRET_KEY;
        if (!secretKey) {
            return c.json({
                error: 'AES Secret Key is missing'
            }, 403);
        }

        const businessEmailHash = crypto.createHash("sha256").update(businessEmail).digest("hex");
        const phoneNumberHash = crypto.createHash("sha256").update(phoneNumber).digest("hex");
        const encryptedBusinessEmail = await AES.encrypt(businessEmail, secretKey);
        const encryptedPhoneNumber = await AES.encrypt(phoneNumber, secretKey);

        const existingBusiness = await prisma.business.findFirst({
            where: {
                OR: [
                    { name, address },
                    { businessEmailHash },
                    { phoneNumberHash }
                ]
            }
        });

        if (existingBusiness) {
            return c.json({ error: 'Business already exists' }, 401);
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return c.json({ error: `Category with ID ${categoryId} does not exist` }, 401);
        }

        if (!categoryId || !userId || !subCategoryIds) {
            return c.json({
                error: 'Category ID is missing'
            }, 403);
        }

        // Create the new business
        const newBusiness = await prisma.business.create({
            data: {
                name,
                ownerId: userId,
                businessEmail: encryptedBusinessEmail.encrypted,
                businessEmailIV: encryptedBusinessEmail.iv,
                businessEmailHash,
                phoneNumber: encryptedPhoneNumber.encrypted,
                phoneNumberIV: encryptedPhoneNumber.iv,
                phoneNumberHash,
                verified: false,
                address,
                city: city ?? "",       // Ensure it's a string
                state: state ?? "",
                postalcode: postalcode ?? "",
                landmark: landmark ?? "",
                categoryId,
                businessType,
                subCategories: {
                    create: subCategoryIds.map(subCategoryId => ({
                        subCategory: { connect: { id: subCategoryId } }
                    }))
                },
                totalRating: 0,
                website,
                about,
                businessHours: {
                    create: businessHours.map(hour => ({
                        dayOfWeek: hour.dayofWeek,
                        openingTime: hour.openingTime,
                        closingTime: hour.closingTime,
                        specialNote: hour.specialNote || null
                    }))
                }
            }
        });

        if (body.has("mediaFiles")) {
            const mediaFiles = body.getAll("mediaFiles") as File[];
        
            if (!mediaFiles || mediaFiles.length === 0) {
                return c.json({ error: 'No media files provided' }, 400);
            }
        
            const uploadedMedia = await Promise.all(mediaFiles.map(async (file) => {
                const fileBuffer = await file.arrayBuffer();
                const fileKey = `business-media/${newBusiness.id}/${Date.now()}-${file.name}`;
        
                const command = new PutObjectCommand({
                    Bucket: "myprojectuploads",
                    Key: fileKey,
                    Body: Buffer.from(fileBuffer),
                    ContentType: file.type,
                });
        
                await s3.send(command);
                return {
                    type: file.type,
                    url: `https://myprojectuploads.s3.amazonaws.com/${fileKey}`,
                    businessMediaId: newBusiness.id,
                };
            }));
        
            await prisma.media.createMany({ data: uploadedMedia });
        }
        

        return c.json({
            message: 'Business created successfully',
            business: newBusiness
        }, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
}

//updating business profile route
export async function updateBusinessProfile(c:Context){
    const prisma = getPrisma(c.env);
    const body = await c.req.json();
    const userId = c.get('userId');
    const businessId = c.req.param('id');

    try {
        const parsed= editBusinessDetails.safeParse(body);

        const user = await prisma.business.findUnique({
            where: {
                id: businessId
            },
            select:{
                ownerId : true
            }
        })

        if(user?.ownerId !== userId){
            return c.json({error: 'You are not authorized to update this business'}, 403);
        }

        if (!parsed.success) {
            return c.json({
                error: 'Invalid data format',
                details: parsed.error.errors
            }, 400);
        }

        const { name, about, address,  phoneNumber, businessHours } = parsed.data;

        const existingBusiness = await prisma.business.findUnique({
            where: {
                id: businessId
            }
        });

        if (!existingBusiness) {
            return c.json({
                error: 'Business not found'
            }, 404);
        }

        const updatedBusiness = await prisma.business.update({
            where: {
                id: businessId
            },
            data: {
                name: name || existingBusiness.name,
                about : about || existingBusiness.about,
                address: address || existingBusiness.address,
                phoneNumber:  phoneNumber || existingBusiness. phoneNumber
            }
        });

        if (businessHours) {
            await prisma.businessTimings.deleteMany({
                where: {
                    businessId:  businessId
                }
            });

            const createBusinessTimings = await prisma.businessTimings.createMany({
                data: businessHours.map(hour => ({
                    businessId:  businessId,
                    dayOfWeek: hour.dayOfWeek, 
                    openingTime: hour.openingTime,
                    closingTime: hour.closingTime,
                    specialNote: hour.specialNote || null
                }))
            });
        }

        return c.json({
            message: 'Business updated successfully',
            business: updatedBusiness
        }, 200);
    } catch (error) {
        console.log(error);
        return c.json({
            error: 'Internal Server Error'
        }, 500);
    }
};

//delete business profile route
export async function deleteBusinessProfile(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id')

    try {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: { owner: true },  
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        if (business.ownerId !== userId) {
            return c.json({ error: 'You are not the owner of this business' }, 401);
        }

        await prisma.businessTimings.deleteMany({
            where: { businessId }
        });

        await prisma.businessSubCategory.deleteMany({
            where: { businessId: businessId },
        });

        await prisma.business.delete({
            where: { id: businessId },
        });

        return c.json({ message: 'Business deleted successfully' }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

//get a single business profile route
export async function getBusinessProfile(c:Context){
    const startTime = performance.now();
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');
    const redis = createRedisClient(c.env);


    const cacheKey = `business:${businessId}`;
    const cachedBusiness = await redis.get(cacheKey);
    if (cachedBusiness && typeof cachedBusiness === "string") {
        return c.json(JSON.parse(cachedBusiness));
    }

    const secretKey = c.env.AES_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Server misconfiguration: Missing AES secret key" }, 500);

    try {
        if(!userId) {
            return c.json({ error: 'You are not logged in' }, 401);
        }

        const user = await prisma.business.findUnique({
            where: {
                id: businessId
            },
            select:{
                ownerId : true,
            }
        })

        if(!user){
            return c.json({
                error: 'Business not found',
            },403)
        }

        const userBusiness = await prisma.business.findUnique({
            where: {
                id: businessId
            },
            include:{
                businessMedia:true
            }
        });

        
        let decryptedEmail = "";
        let decryptedPhoneNumber = "";
        let decryptedBusinessEmail = "";
        let decryptedBusinessPhoneNumber = "";
  
        try {
            if (userBusiness) {
                decryptedBusinessEmail = await AES.decrypt(
                    userBusiness.businessEmail,
                    userBusiness.businessEmailIV || "", // Ensure IV field exists
                secretKey
                ) || "";
            
                decryptedBusinessPhoneNumber = await AES.decrypt(
                userBusiness.phoneNumber, 
                userBusiness.phoneNumberIV || "", // Ensure IV field exists
                secretKey
                ) || "";
            }
            
        } catch (decryptError) {
            console.error("Decryption failed:", decryptError);
            return c.json({ error: "Failed to decrypt user data" }, 500);
        }
        await redis.set(
            cacheKey,
            JSON.stringify({
              ...userBusiness,
              businessEmail: decryptedBusinessEmail,
              businessPhoneNumber: decryptedBusinessPhoneNumber
            }),
            { ex: 3600 }
          );
          
        const endTime = performance.now(); 
        console.log(`Execution Time: ${(endTime - startTime).toFixed(2)}ms`);
        return c.json({...userBusiness,businessEmail: decryptedBusinessEmail,businessPhoneNumber: decryptedBusinessPhoneNumber,},200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

//add business media route
export async function addBusinessMedia(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');

    if (!userId) return c.json({ error: 'Provide a user ID' }, 401);
    if (!businessId) return c.json({ error: 'Business ID is required' }, 400);

    try {
        const business = await prisma.business.findFirst({
            where: { id: businessId },
            select: { ownerId: true },
        });

        console.log(business);
        if (!business) return c.json({ error: 'Business not found' }, 404);
        if (userId !== business.ownerId) {
            return c.json({ error: 'You are not the owner of this business' }, 401);
        }

        // Parse formData instead of JSON
        const body = await c.req.formData();
        const files = body.getAll("files") as File[];

        if (!files || files.length === 0) {
            return c.json({ error: 'No files provided' }, 400);
        }

        // Upload each file to S3 and store URLs
        const uploadedMedia = await Promise.all(files.map(async (file) => {
            const fileBuffer = await file.arrayBuffer();
            const fileKey = `business-media/${businessId}/${Date.now()}-${file.name}`;

            const command = new PutObjectCommand({
                Bucket: "myprojectuploads",
                Key: fileKey,
                Body: Buffer.from(fileBuffer),
                ContentType: file.type,
            });

            await s3.send(command);
            return {
                type: file.type,
                url: `https://myprojectuploads.s3.amazonaws.com/${fileKey}`,
                businessMediaId: businessId,
            };
        }));

        // Save uploaded media details in DB
        await prisma.media.createMany({ data: uploadedMedia });

        return c.json({
            message: 'Business media uploaded successfully',
            uploadedMediaCount: uploadedMedia.length,
        }, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};


//add profile photo route
export async function updateProfilePhoto(c: Context) {
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');

    if (!userId) return c.json({ error: 'Provide a user ID' }, 401);

    try {
        // Parse formData to handle file uploads
        const body = await c.req.formData();
        const files = body.getAll("files") as File[];

        if (!files || files.length === 0) {
            return c.json({ error: 'No files provided' }, 400);
        }

        // Upload each file to S3 and store URLs
        const uploadedMedia = await Promise.all(files.map(async (file) => {
            const fileBuffer = await file.arrayBuffer();
            const fileKey = `profilePhoto/${userId}/${Date.now()}-${file.name}`;

            const command = new PutObjectCommand({
                Bucket: "myprojectuploads",
                Key: fileKey,
                Body: Buffer.from(fileBuffer),
                ContentType: file.type,
            });

            await s3.send(command);
            return {
                type: file.type,
                url: `https://myprojectuploads.s3.amazonaws.com/${fileKey}`,
            };
        }));

        // Update or create ProfilePhoto in the Prisma model
        const profilePhoto = await prisma.profilePhoto.upsert({
            where: { userId },
            update: {
                url: uploadedMedia[0].url,
                type: uploadedMedia[0].type,
            },
            create: {
                userId,
                url: uploadedMedia[0].url,
                type: uploadedMedia[0].type,
            },
        });

        // Respond with success message
        return c.json({
            message: 'Profile photo uploaded successfully',
            profilePhoto,
        }, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

//get profile picture route
export async function getProfilePhoto(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    try{
        const response = await prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                profilePhoto:true
            }
        })
        if(!response){
            console.log("Error in repsonse");
            return c.json({error:'Something went wrong'},401);
        }
        return c.json(response);
    }
    catch(error){
        console.log({error:"Something went wrong"});
    }
}


//update business hours route
export async function updateBusinessHours(c:Context) {
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');

    const body = await c.req.json();

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== 'BUSINESS') {
            return c.json({ error: 'User is not a business user, not allowed to update business timings' }, 401);
        }

        const parsed = editBusinessTimings.safeParse(body);
        if (!parsed.success) {
            return c.json({
                error: 'Invalid business hours format',
                details: parsed.error.errors
            }, 400);
        }

        const businessOwner = await prisma.business.findUnique({
            where: {
                id: businessId,
            },
            select: {
                ownerId: true,
            }
        });

        if (!businessOwner) {
            return c.json({ error: 'Business not found' }, 404);
        }

        if (userId !== businessOwner.ownerId) {
            return c.json({
                error: 'You are not the owner of this business',
            }, 401);
        }

        const { businessHours } = parsed.data;

        if (!businessId) {
            return c.json({
                error: 'Business ID is required',
            }, 403);
        }

        await prisma.businessTimings.deleteMany({
            where: {
                businessId,
                dayOfWeek: { in: businessHours.map(hour => hour.dayOfWeek) }
            }
        });
        
        await prisma.businessTimings.createMany({
            data: businessHours.map(hour => ({
                businessId,
                dayOfWeek: hour.dayOfWeek,  // Fixed typo
                openingTime: hour.openingTime,
                closingTime: hour.closingTime,
                specialNote: hour.specialNote || null
            }))
        });

        return c.json({
            message: 'Business timings updated successfully'
        }, 200);
    }
    catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

//report a business route
export async function reportABusiness(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');
    const { reason }=await c.req.json();

    try{
        if(!userId) {
            return c.json({
                error: 'Provide a user ID'
            },401)
        }

        const user= await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user) return c.json({
            error: 'User not found'
        },401)

        if(!reason){
            return c.json({
                error: 'Provide a reason'
            },401)
        }

        if(!businessId){
            return c.json({
                error: 'Provide a business ID'
            },403)
        }
        const business = await prisma.business.findUnique({
            where:{
                id:businessId
            }
        })
        if(!business){
            return c.json({
                error: 'Business not found'
            },403)
        }

        await prisma.report.create({
            data: {
                businessId: businessId,
                userId: userId,
                reason,
            }
        })

        return c.json({
            message:'Business Reported Successfully',
        },200)
    }
    catch(error){
        console.log(error);
        return c.json({
            error: 'Internal Server Error',
        },500)
    }
};


//fetch all the report of a business for businessOwners route
export async function getAllBusinessReports(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');

    const redis = createRedisClient(c.env);
    const cacheKey = `businessReport${businessId}`;
    const cachedBusinessReports = await redis.get(cacheKey);
    if(cachedBusinessReports && typeof cachedBusinessReports === "string"){
        return c.json(JSON.parse(cachedBusinessReports));
    }

    try{
        if(!userId) return c.json({
            error: 'Provide a user ID'
        },401)

        if(!businessId) return c.json({
            error: 'Provide a business ID'
        },401)

        const business= await prisma.business.findUnique({
            where:{
                id:businessId, 
            },
            select:{
                ownerId : true,
            }
        })

        if(!business){
            return c.json({
                error: 'Business Not Found',
            },403)
        }

        if(userId !== business.ownerId){
            return c.json({
                error: 'You are not the owner of this business',
            },401)
        }

        const user= await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user) return c.json({
            error: 'User not found'
        },401)

        const allReports = await prisma.report.findMany({
            where:{
                businessId :businessId
            }
        })

        await redis.set(cacheKey,JSON.stringify(allReports),{ex:3600});
        return c.json({
            allReports
        },200)
    }
    catch(error){
        console.log(error);
        return c.json({
            error: 'Internal Server Error',
        },500)
    }
};


//get all business reviews route
export async function getAllReviews(c:Context) {
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId  = c.req.param('id'); 

    const redis = createRedisClient(c.env);
    const cacheKey = `businessReviews${businessId}`;
    const cachedBusinessReviews = await redis.get(cacheKey);
    if(cachedBusinessReviews && typeof cachedBusinessReviews === "string"){
        return c.json(JSON.parse(cachedBusinessReviews)); 
    }

    try {
        if (!businessId) {
            return c.json({ error: 'Provide a business ID' }, 400);
        }
        if (!userId) {
            return c.json({ error: 'Provide a user ID' }, 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: { reviews: true},
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        await redis.set(cacheKey,JSON.stringify(business.reviews),{ex:3600});
        return c.json(business.reviews, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};

//disliking a busienss route
export async function dislikingABusiness(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');

    try{
        if(!businessId) return c.json({
            error:'Provide a business Id'
        },401)

        if(!userId) return c.json({
            error: 'Provide a user Id'
        },401)
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user){
            return c.json({
                error: 'User not found'
            },401)
        }

        await prisma.business.update({
            where:{
                id:businessId
            },
            data:{
                dislikes : {
                    increment : 1
                }
            }
        })

        return c.json({
            message: 'Business disliked successfully'
        },200)
    }
    catch(error){
        console.log(error);
        return c.json({
            error: 'Internal Server Error',
        },500)
    }
};


//liking a business route
export async function likingABusiness(c:Context){
    const prisma = getPrisma(c.env);
    const userId = c.get('userId');
    const businessId = c.req.param('id');


    try{
        if(!businessId) return c.json({
            error:'Provide a business Id'
        },401)

        if(!userId) return c.json({
            error: 'Provide a user Id'
        },401)

        const user = await prisma.user.findUnique({
            where:{
                id : userId
            }
        })
        if(!user){
            return c.json({
                error: 'Unauthorized'
            },401)
        }

        await prisma.business.update({
            where:{
                id: businessId
            },
            data:{
                likes : {
                    increment : 1
                }
            }
        })

        return c.json({
            message: 'Business liked successfully'
        },200)
    }
    catch(error){
        console.log(error);
        return c.json({
            error: 'Internal Server Error',
        },500)
    }
};


//get all business with filters and search route
export async function getBusinessBulk(c:Context){
    const prisma = getPrisma(c.env);

    const queryString = c.req.query();
    const frequentlyChosen = queryString.frequents ?? undefined;
    const category = queryString.category ?? undefined;
    const rating = queryString.rating ? Number(queryString.rating) : undefined;
    const businesstype = queryString.businessType ?? undefined;

    const timings = queryString.timings ??  undefined;
    let openTime, closeTime;
    if (timings && timings.includes("+")) {
        [openTime, closeTime] = timings.split("+");
    }

    const redis = createRedisClient(c.env);
    const cacheKey = `businessBulk:${Object.entries(queryString)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")}`;
    const cachedBulkBusinesses = await redis.get(cacheKey);
    if (cachedBulkBusinesses && typeof cachedBulkBusinesses === "string") {
        return c.json(JSON.parse(cachedBulkBusinesses));
    }
    
    try {
        const categories = await prisma.category.findMany({
            where: {
                ...(category && { name: category }),
                ...(frequentlyChosen && { id: frequentlyChosen }),
            },  
            include: {
                Business: {
                    where:{
                        // ...(businesstype!==undefined && {businessType:{gte:businesstype}}),
                        ...(rating !== undefined && { totalRating: { gte: rating } }),
                        ...(timings !== undefined && {
                            businessHours:{
                                some:{
                                    openingTime:{lte:openTime},
                                    closingTime:{gte:closeTime}
                                }
                            }
                        })
                    },
                    include: {
                        subCategories: {
                            include: { subCategory: { select: { id: true, name: true } } } 
                        }
                    }
                }
            }
        });

        const bulkBusinesses = categories.map(category => ({
            categoryId: category.id,
            categoryName: category.name,
            businesses: category.Business.map(business => ({
                id: business.id,
                name: business.name,
                about: business.about,
                subCategories: business.subCategories.map(sub => ({
                    id: sub.subCategory.id, 
                    name: sub.subCategory.name 
                }))
            }))
        }));

        await redis.set(cacheKey, JSON.stringify(bulkBusinesses),{ex:3600});
        return c.json({ bulkBusinesses }, 200);
    } catch (error:any) {
        console.log(error);
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
};

//get my business id route
export async function getBusinessMe(c:Context){
    const userId = c.get('userId');  
    const prisma = getPrisma(c.env);

    const redis = createRedisClient(c.env);
    const cacheKey = `mybusinessId${userId}`;
    const cachedMyBusinessId = await redis.get(cacheKey);
    if (cachedMyBusinessId && typeof cachedMyBusinessId==="string"){
        return c.json(JSON.parse(cachedMyBusinessId));
    }
    const businessId = await prisma.business.findFirst({
        where:{
            ownerId : userId
        },
        select:{
            id:true
        }
    })
    
    if (!businessId) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    await redis.set(cacheKey,JSON.stringify(businessId),{ex:3600});
    return c.json({ businessId });
}