import {Hono} from "hono";
import {getUserDetails,deleteProfile,reviewProfile,getUserId,editProfile} from "./user.service"
import { userAuthMiddleware } from '../user/user.middleware';


export const userRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

userRoutes.use('/*', userAuthMiddleware);

userRoutes.get('/:id', getUserDetails);
userRoutes.get('/:id', deleteProfile);
userRoutes.get('/review/:id', reviewProfile);
userRoutes.get('/me', getUserId);
userRoutes.get('/:id', editProfile);

