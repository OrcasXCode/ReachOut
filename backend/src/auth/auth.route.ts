import {Hono} from "hono";
import {signin, signup,signout,sendPasswordResetOTP,verifyOTP,resetPassword} from "./auth.service"
import {authMiddleware} from "./auth.middleware"


export const authRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string,
      JWT_SECRET:string
    }
}>()

authRoutes.post('/signin',signin);
authRoutes.post('/signup',signup);
authRoutes.post('/signout',signout);
authRoutes.post('/forgetpassword',sendPasswordResetOTP);
authRoutes.post('/verifyotp',verifyOTP);
authRoutes.post('/resetpassword',resetPassword);

authRoutes.use("/*",authMiddleware);
// authRoutes.post('/signout',signout);
// authRouter.post('/forgetpassword',forgetpassword);
// authRouter.post('/verifyotp',verifyotp);
// authRouter.post('/resetpassword',resetpassword);

