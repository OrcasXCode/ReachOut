import {Hono} from "hono";
import {getUserDetails,deleteProfile,reviewProfile,getUserId,editProfile} from "./user.service"
import { userMiddleware } from '../user/user.middleware';


export const userRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

userRoutes.use('/*', userMiddleware);

userRoutes.get('/me', getUserId);
userRoutes.get('/:id', getUserDetails);
userRoutes.delete('/:id', deleteProfile);
userRoutes.post('/review/:id', reviewProfile);
userRoutes.put('/:id', editProfile);

