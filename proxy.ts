import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { jwtutils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_EXACT = new Set([
  "/",
  "/about",
  "/services",
  "/contact",
  "/properties",
  "/blog",
  "/privacy",
  "/terms",
  "/success",
  "/cancel",
  "/login",
  "/register",
]);

const PUBLIC_PREFIXES = [
  "/propertiesDetails",
  "/blog/",
  "/api/",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  const decodedAccessToken = accessToken
    ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  let userRole: string | null = null;
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  if (accessToken && decodedAccessToken?.success && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "TENANT") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/landlord-dashboard", request.url));
    }
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!decodedAccessToken?.success && !isPublicPath(pathname) && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/tenant-dashboard") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
