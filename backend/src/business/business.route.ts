import {Hono} from "hono";
import {getBusinessMe,createNewBusiness,updateBusinessProfile,deleteBusinessProfile,getBusinessProfile,getBusinessBulk, likingABusiness, dislikingABusiness,getAllReviews,getAllBusinessReports,reportABusiness,updateBusinessHours,addBusinessMedia} from "./business.service"
import { businessMiddleware } from './business.middleware';


export const businessRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

businessRoutes.use('/*', businessMiddleware);

businessRoutes.get('/bulk', getBusinessBulk);
businessRoutes.get('/me', getBusinessMe);
businessRoutes.post('/create', createNewBusiness);
businessRoutes.put('/updatebusiness/:id', updateBusinessProfile);
businessRoutes.delete('/delete', deleteBusinessProfile);
businessRoutes.get('/:id', getBusinessProfile);
businessRoutes.put('/like/:id', likingABusiness);
businessRoutes.put('/dislike/:id', dislikingABusiness);
businessRoutes.get('/getallreviews/:id', getAllReviews);
businessRoutes.post('/reportbusiness/:id', getAllBusinessReports);
businessRoutes.get('/fetchallreports/:id', reportABusiness);
businessRoutes.put('/updatebusinesstimings/:id', updateBusinessHours);
businessRoutes.put('/uploadbusinessmedia/:id', addBusinessMedia);
