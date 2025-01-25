import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';
import {sign,verify} from 'hono/jwt'
import {addBusinessInput} from "../../../common/src/index"


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
    const prisma=c.get('prisma');
    const userId=c.get('userId');
    const body=await c.req.json();

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
        }, 401);
    }

    const { name, verified, address, businessEmail, categoryId, subCategoryIds, phoneNumber, totalRating, website, about } = parsed.data;

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

    // check if category exists
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        return c.json({ error: `Category with ID ${categoryId} does not exist` }, 401);
    }

    const ownerId=c.get('userId');
    try {
        const newBusiness = await prisma.business.create({
            data: {
              name,
              businessEmail,
              phoneNumber,
              verified: false,
              address,
              category: {
                connect: { id: categoryId } // Ensure categoryId exists in Category table
              },
              subCategories: {
                create: subCategoryIds.map((subCategoryId) => ({
                  subCategory: { connect: { id: subCategoryId } } // Ensure subCategoryId exists in SubCategory table
                }))
              },
              totalRating: 0,
              website,
              about,
              owner: {
                connect: { id: parseInt(ownerId) } // Ensure ownerId exists in User table
              }
            },
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
businessRoutes.put('/updatebusiness',async(c)=>{
    const prisma = c.get('prisma');
    const body = c.req.json();
    
    try{

    }
    catch(error){
        console.log(error);
        return c.json({
            error:'Internal Server Error'
        },500)
    }
})

//delete the business profile
businessRoutes.delete('/delete', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const { businessId } = await c.req.json(); 

    try {
        const business = await prisma.business.findUnique({
            where: { id: parseInt(businessId) },
            include: { owner: true },  // Include the owner to verify ownership
        });

        if (!business) {
            return c.json({ error: 'Business not found' }, 404);
        }

        // Check if the logged-in user is the owner
        if (business.ownerId !== parseInt(userId)) {
            return c.json({ error: 'You are not the owner of this business' }, 401);
        }

        // Delete related records in BusinessSubCategory (if any)
        await prisma.businessSubCategory.deleteMany({
            where: { businessId: parseInt(businessId) },
        });

        // delete the whole business
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
