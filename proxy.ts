import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtutils } from "./utils/jwt";
import { cookies } from "next/headers";
import { getNewrefreshToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];


export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookiesStore = await cookies();
    

  let accessToken = request.cookies.get("accessToken")?.value;
 

  // const refreshToken = request.cookies.get("refreshToken")?.value;


  let decodedAccessToken = accessToken ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string): null;
  // const decodedRefreshToken = refreshToken ? jwtutils.verifyToken( refreshToken, process.env.JWT_REFRESH_SECRET as string): null;
    




  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //   //access token has expire but refresh token is valid, get new accces token from backand
  //   const result = await getNewrefreshToken();
  //   //  console.log("Chick_ashik",result);

  //   if (result.success) {
  //     const newAccessToken = result.data.accessToken;

  //     cookiesStore.set("accessToken", newAccessToken,{
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24,
  //       sameSite: "lax",
  //     });
      
  //     accessToken=newAccessToken
  //     decodedAccessToken = jwtutils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
  //   }
  // }

  

  // if (!decodedAccessToken?.success) {
  //   //token has expired or is invalid, clear the cookies
  //   cookiesStore.delete("accessToken");
  //   // return NextResponse.redirect(new URL("/login", request.url));
  // }




  let userRole = null;
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }
  //user is logged in and trying to access login or register page , redirect to dashboard or root home page
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "TENANT") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/landlord-dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }



  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  //Authenticated pages Protection: Authorization is not handled yet
  if (!decodedAccessToken?.success && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  //Authorization: Role based access controll
  if (pathname.startsWith("/dashboard") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/landlord-dashboard") &&
    userRole !== "LANDLORD"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}



export const config = {
  matcher: [
    // '/dashboard/:path*',

    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};
