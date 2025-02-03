import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken"); 

    const protectedRoutes = ["/user","/business","/help","/forgetpassword","/verifyotp","/resetpassword"]; 
    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    );

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/signin", req.url)); 
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/business/:path*", "/help","/user/:path*","/forgetpassword","/verifyotp","/resetpassword"], 
};
