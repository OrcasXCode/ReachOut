import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';
import {sign,verify} from 'hono/jwt'
import {addBusinessInput} from "@omsureja/reachout"
import {editBusinessTimings} from "@omsureja/reachout"
import {editBusinessDetails} from "@omsureja/reachout"
import {AES} from '../services/aesService'
import crypto from 'crypto'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";



export const businessRoutes = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
        AES_SECRET_KEY: string
    },
    Variables:{
        userId: string;
        prisma: PrismaClient;
    }
}>()

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: "AKIATX3PIHYN2QXFDS6W",
      secretAccessKey: "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",
    },
});
  

businessRoutes.use('*', async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  
    c.set('prisma', prisma);
    await next();
});


//global middelware
businessRoutes.use('/*', async (c, next) => {
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


//create new business
businessRoutes.post('/create', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const body = await c.req.json();

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

        const parsed = addBusinessInput.safeParse(body);
        if (!parsed.success) {
            return c.json({
                error: 'Invalid Inputs',
                details: parsed.error.errors
            }, 400);
        }

        const { name, verified, address, mediaUrls, businessHours ,businessEmail, categoryId, subCategoryIds, phoneNumber, totalRating, website, about } = parsed.data;


        if (!Array.isArray(mediaUrls) || !mediaUrls.every(media => typeof media.type === 'string' && typeof media.url === 'string')) {
            return c.json({ error: 'Invalid media format: Each media item must have type and url' }, 400);
        }

        if (!Array.isArray(businessHours) || !businessHours.every(hour => 
            typeof hour.dayofWeek === 'string' && 
            typeof hour.openingTime === 'string' && 
            typeof hour.closingTime === 'string'
        )) {
            return c.json({ error: 'Invalid business hours format' }, 400);
        }

        const secretKey = c.env.AES_SECRET_KEY;
        if(!secretKey){
            return c.json({
                error: 'AES Secret Key is missing'
            },403)
        }

        const businessEmailHash = crypto.createHash("sha256").update(businessEmail).digest("hex");
        const phoneNumberHash = crypto.createHash("sha256").update(phoneNumber).digest("hex");
        const encryptedBusienssEmail = await AES.encrypt(businessEmail,secretKey);
        const encryptedPhoneNumber = await AES.encrypt(phoneNumber,secretKey);
        // const encryptedOwnerId = await AES.encrypt(userId,secretKey);

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

        if(!categoryId || !userId || !subCategoryIds){
            return c.json({
                error: 'Category ID is missing'
            },403)
        }

        const newBusiness = await prisma.business.create({
            data: {
                name,
                ownerId:userId,
                businessEmail: encryptedBusienssEmail.encrypted,
                businessEmailIV: encryptedBusienssEmail.iv,
                businessEmailHash,  
                phoneNumber: encryptedPhoneNumber.encrypted,
                phoneNumberIV: encryptedPhoneNumber.iv,
                phoneNumberHash,   
                verified: false,
                address,
                categoryId,
                subCategories: {
                    create: subCategoryIds.map(subCategoryId => ({
                        subCategory: { connect: { id: subCategoryId } }
                    }))
                },
                totalRating: 0,
                website,
                about,
                businessMedia: {
                    create: mediaUrls.map(media => ({
                        type: media.type,
                        url: media.url
                    }))
                },
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
          
        return c.json({
            message: 'Business created successfully',
            business: newBusiness
        }, 200);
        
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//update business details
businessRoutes.put('/updatebusiness/:id', async (c) => {
    const prisma = c.get('prisma');
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
});


//delete the business profile
businessRoutes.delete('/delete', async (c) => {
    const prisma = c.get('prisma');
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
});


//get a single business profile
businessRoutes.get('/viewprofile/:id', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId = c.req.param('id')

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

        if(user.ownerId !== userId){
            return c.json({error: 'You are not authorized to update this business'}, 403);
        }

        
        const userBusiness = await prisma.business.findUnique({
            where: {
                id: businessId
            },
        });
        return c.json({userBusiness},200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//get all business with filters and search
businessRoutes.get('/bulk', async (c) => {
    const prisma = c.get('prisma');
    const query = c.req.query();

    const categoryId = query.categoryId || undefined;
    
    try {
        const categories = await prisma.category.findMany({
            where: categoryId ? { id: categoryId } : {},  
            include: {
                Business: {
                    include: {
                        subCategories: {
                            include: { subCategory: { select: { id: true, name: true } } } // Fetch subCategory ID + name
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
                    id: sub.subCategory.id,  // Fetch subCategory ID
                    name: sub.subCategory.name // Fetch subCategory Name
                }))
            }))
        }));

        return c.json({ bulkBusinesses }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});



//liking a business
businessRoutes.put('/like/:id',async (c)=>{
    const prisma = c.get('prisma');
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
})


//disliking a busienss
businessRoutes.put('/dislike/:id',async(c)=>{
    const prisma = c.get('prisma');
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
})


//get all reviews 
businessRoutes.get('/getallreviews/:id', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId  = c.req.param('id'); 

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

        return c.json(business.reviews, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//report a business
businessRoutes.post('/reportbusiness/:id',async (c)=>{
    const prisma = c.get('prisma');
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
})


//fetch all the report of a business for businessOwners
businessRoutes.get('/fetchallreports/:id',async(c)=>{
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId = c.req.param('id');

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
})


//update business hours
businessRoutes.put('/updatebusinesstimings/:id', async (c) => {
    const prisma = c.get('prisma');
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
});



//add business medias
businessRoutes.put('/uploadbusinessmedia/:id', async (c) => {
    const prisma = c.get('prisma');
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
});



businessRoutes.get('/me', async (c) => {
    const userId = c.get('userId');  
    const prisma =c.get('prisma');
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
    return c.json({ businessId });
});