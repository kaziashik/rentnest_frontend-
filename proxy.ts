import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  //   console.log(request, "request");
  //   return NextResponse.redirect(new URL("/", request.url));

  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToen = accessToken
    ? (jwt.decode(accessToken) as JwtPayload)
    : null;

  let userRole = null;

  if (decodedToen) {
    userRole = decodedToen.role;
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
  if (!accessToken && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }



  //Authorization: Role based access controll
  if (pathname.startsWith("/dashboard") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if ( pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD") {
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
