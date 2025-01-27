import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';
import {sign,verify} from 'hono/jwt'
import {addBusinessInput} from "../../../common/src/index"
import {editBusinessTimings} from "../../../common/src/index"
import {editBusinessDetails} from "../../../common/src/index"


export const businessRoutes = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        userId: string;
        prisma: PrismaClient;
    }
}>()

businessRoutes.use('*', async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  
    c.set('prisma', prisma);
    await next();
});



//global middelware
businessRoutes.use('/*', async (c, next) => {
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


//create new business
businessRoutes.post('/create', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const body = await c.req.json();

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

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

        const existingBusiness = await prisma.business.findFirst({
            where: {
                OR: [
                    { name, address },
                    { businessEmail },
                    { phoneNumber }
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

        const newBusiness = await prisma.business.create({
            data: {
              name,
              businessEmail,
              phoneNumber,
              verified: false,
              address,
              category: {
                connect: { id: categoryId }
              },
              subCategories: {
                create: subCategoryIds.map(subCategoryId => ({
                  subCategory: { connect: { id: subCategoryId } }
                }))
              },
              totalRating: 0,
              website,
              about,
              owner: {
                connect: { id: parseInt(userId) }
              },
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
businessRoutes.put('/updatebusiness', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();
    const {id:businessId} = c.req.query();

    try {
        const parsed= editBusinessDetails.safeParse(body);

        if (!parsed.success) {
            return c.json({
                error: 'Invalid data format',
                details: parsed.error.errors
            }, 400);
        }

        const { name, about, address,  phoneNumber, businessHours } = parsed.data;

        const existingBusiness = await prisma.business.findUnique({
            where: {
                id: parseInt(businessId)
            }
        });

        if (!existingBusiness) {
            return c.json({
                error: 'Business not found'
            }, 404);
        }

        const updatedBusiness = await prisma.business.update({
            where: {
                id: parseInt(businessId)
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
                    businessId:  parseInt(businessId)
                }
            });

            const createBusinessTimings = await prisma.businessTimings.createMany({
                data: businessHours.map(hour => ({
                    businessId:  parseInt(businessId),
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
    const { businessId } = await c.req.json(); 

    try {
        const business = await prisma.business.findUnique({
            where: { id: parseInt(businessId) },
            include: { owner: true },  
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        if (business.ownerId !== parseInt(userId)) {
            return c.json({ error: 'You are not the owner of this business' }, 401);
        }

        await prisma.businessSubCategory.deleteMany({
            where: { businessId: parseInt(businessId) },
        });

        await prisma.business.delete({
            where: { id: parseInt(businessId) },
        });

        return c.json({ message: 'Business deleted successfully' }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//get a single business profile
businessRoutes.get('/', async (c) => {
    const prisma = c.get('prisma');
    // const id = c.req.query('id');  
    const userId = c.get('userId')

    try {
        // if (!id) return c.json({ error: 'id is required' }, 400);
        
        // const business = await prisma.business.findUnique({
        //     where: {
        //         id: parseInt(id)
        //     },
        //     include: {
        //         category:true,
        //         subCategories: true,
        //         owner: {
        //             select: { id: true, firstName: true, 
        //                 lastName:true , email: true , phoneNumber:true }  // Select specific fields from owner
        //         }
        //     }
        // });

        // if (!business) return c.json({ error: 'Business not found' }, 404);

        // return c.json({ business }, 200);

        if(!userId) {
            return c.json({ error: 'You are not logged in' }, 401);
        }
        
        const userBusiness = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                businesses: {  // Assuming `businesses` is the correct relation name
                    include: {
                        category: true,
                        subCategories: true
                    }
                }
            }
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
    const userId = c.get('userId');

    const categoryId = query.categoryId ? parseInt(query.categoryId) : undefined;
    const subCategoryId = query.subCategoryId ? parseInt(query.subCategoryId) : undefined;

    try {
        const userBusiness = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                businesses: {
                    where: {
                        ...(categoryId && { categoryId }),  
                        ...(subCategoryId && {
                            subCategories: {
                                some: {
                                    subCategoryId: subCategoryId 
                                }
                            }
                        })
                    },
                    include: {
                        category: true,
                        subCategories: true
                    }
                }
            }
        });

        return c.json({ userBusiness }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//liking a business
businessRoutes.post('/like',async (c)=>{
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId = c.req.query('id');


    try{
        if(!businessId) return c.json({
            error:'Provide a business Id'
        },401)

        if(!userId) return c.json({
            error: 'Provide a user Id'
        },401)
        const user = await prisma.user.findUnique({
            where:{
                id:parseInt(userId)
            }
        })
        if(!user){
            return c.json({
                error: 'Unauthorized'
            },401)
        }

        await prisma.business.update({
            where:{
                id:parseInt(businessId)
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
businessRoutes.post('/dislike',async(c)=>{
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const businessId = c.req.query('id');

    try{

        if(!businessId) return c.json({
            error:'Provide a business Id'
        },401)

        if(!userId) return c.json({
            error: 'Provide a user Id'
        },401)
        const user = await prisma.user.findUnique({
            where:{
                id:parseInt(userId)
            }
        })
        if(!user){
            return c.json({
                error: 'User not found'
            },401)
        }

        await prisma.business.update({
            where:{
                id:parseInt(businessId)
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
businessRoutes.get('/getallreviews/', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const { id: businessId } = c.req.query(); 
    try {
        if (!businessId) {
            return c.json({ error: 'Provide a business ID' }, 400);
        }
        if (!userId) {
            return c.json({ error: 'Provide a user ID' }, 400);
        }

        const businessIdNumber = parseInt(businessId);
        const userIdNumber = parseInt(userId);

        if (isNaN(businessIdNumber) || isNaN(userIdNumber)) {
            return c.json({ error: 'Invalid ID format' }, 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: userIdNumber }
        });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const business = await prisma.business.findUnique({
            where: { id: businessIdNumber },
            include: { reviews: true }
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        return c.json(business.reviews, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});


//report a business
businessRoutes.post('/report/',async (c)=>{
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const {id : businessId} = c.req.query();
    const { reason }=await c.req.json();


    try{
        if(!userId) {
            return c.json({
                error: 'Provide a user ID'
            },401)
        }
        const user= await prisma.user.findUnique({
            where:{
                id:parseInt(businessId)
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

        await prisma.report.create({
            data: {
                businessId: parseInt(businessId),
                userId: parseInt(userId),
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
businessRoutes.get('/fetchallreports/',async(c)=>{
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const {id:businessId} = c.req.query();

    try{
        if(!userId) return c.json({
            error: 'Provide a user ID'
        },401)

        if(!businessId) return c.json({
            error: 'Provide a business ID'
        },401)

        const user= await prisma.user.findUnique({
            where:{
                id:parseInt(businessId)
            }
        })
        if(!user) return c.json({
            error: 'User not found'
        },401)

        const allReports = await prisma.business.findMany({
            where:{
                id:parseInt(businessId)
            },
            include:{
                reports:true
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


//add business hours
businessRoutes.put('/updatebusinesstimings/', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const { businessId } = c.req.query();
  
    const body = await c.req.json();
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
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
  
      const businessHours = parsed.data;
  
      const business = await prisma.business.findUnique({
        where: { id: parseInt(businessId) },
        include: {
          owner: true
        }
      });
  
      if (!business) {
        return c.json({ error: 'Business not found' }, 404);
      }
  
      if (business.owner.id !== parseInt(userId)) {
        return c.json({ error: 'You are not the owner of this business' }, 401);
      }
  
      const updatedBusinessTimings = await prisma.businessTimings.deleteMany({
        where: { businessId: parseInt(businessId) }
      });
  
      const createBusinessTimings = await prisma.businessTimings.createMany({
        data: businessHours.map(hour => ({
          businessId: parseInt(businessId),
          dayOfWeek: hour.dayofWeek, 
          openingTime: hour.openingTime,
          closingTime: hour.closingTime,
          specialNote: hour.specialNote || null
        }))
      });
  
      return c.json({
        message: 'Business timings updated successfully',
        businessTimings: createBusinessTimings
      }, 200);
  
    } catch (error) {
      console.error(error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
});
  


//add business medias
businessRoutes.put('/uploadbusinessmedia/', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const body = await c.req.json();

    try {
        if (!userId) {
            return c.json({ error: 'Provide a user ID' }, 401);
        }

        const { businessId, mediaUrls } = body;

        if (!businessId || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
            return c.json({ error: 'Invalid input: businessId and mediaUrls are required' }, 400);
        }

        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: { owner: true },
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        if (business.ownerId !== parseInt(userId)) {
            return c.json({ error: 'Unauthorized: You do not own this business' }, 403);
        }

        if (!mediaUrls.every(media => media.type && media.url)) {
            return c.json({ error: 'Invalid media format: Each media item must have type and url' }, 400);
        }

        const createdMedia = await prisma.media.createMany({
            data: mediaUrls.map(media => ({
                type: media.type,
                url: media.url,
                businessMediaId: businessId
            }))
        });

        return c.json({
            message: 'Business media uploaded successfully',
            uploadedMediaCount: createdMedia.count
        }, 200);

    } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
