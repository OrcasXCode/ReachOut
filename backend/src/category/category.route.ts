import {Hono} from "hono";
import {getCategory,getUserDomains} from "./category.service"
// import { categoryMiddleware } from './category.middleware';


export const categoryRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

// categoryRoutes.use('/*', categoryMiddleware);

categoryRoutes.get('/getAll', getCategory);
categoryRoutes.get('/getUserDomains', getUserDomains);
