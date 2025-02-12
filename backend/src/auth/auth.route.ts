import {Hono} from "hono";
import {signin, signup} from "./auth.service"


export const authRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

authRoutes.post('/signin',signin);
authRoutes.post('/signup',signup);
// authRouter.post('/forgetpassword',forgetpassword);
// authRouter.post('/verifyotp',verifyotp);
// authRouter.post('/resetpassword',resetpassword);

