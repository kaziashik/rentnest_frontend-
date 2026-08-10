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
  "/payment/success",
  "/payment/cancel",
  "/login",
  "/register",
]);

const PUBLIC_PREFIXES = [
  "/propertiesDetails",
  "/blog/",
  "/api/",
  "/payment/",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

function withAccessTokenOnRequest(request: NextRequest, accessToken: string) {
  const cookieParts = request.cookies
    .getAll()
    .filter((c) => c.name !== "accessToken")
    .map((c) => `${c.name}=${c.value}`);
  cookieParts.push(`accessToken=${accessToken}`);

  const headers = new Headers(request.headers);
  headers.set("cookie", cookieParts.join("; "));
  return headers;
}

async function tryRefreshAccessToken(refreshToken: string) {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });
    const result = await res.json();
    if (result?.success && result?.data?.accessToken) {
      return result.data.accessToken as string;
    }
  } catch {
    // Fall through — treat as unauthenticated.
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  let refreshedAccessToken: string | null = null;

  if (!decodedAccessToken?.success && refreshToken) {
    const decodedRefreshToken = jwtutils.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    );

    if (decodedRefreshToken?.success) {
      refreshedAccessToken = await tryRefreshAccessToken(refreshToken);
      if (refreshedAccessToken) {
        accessToken = refreshedAccessToken;
        decodedAccessToken = jwtutils.verifyToken(
          refreshedAccessToken,
          process.env.JWT_ACCESS_SECRET as string,
        );
      }
    }
  }

  let userRole: string | null = null;
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  const finish = (response: NextResponse) => {
    if (refreshedAccessToken) {
      response.cookies.set("accessToken", refreshedAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        path: "/",
      });
    }
    return response;
  };

  const nextWithToken = () => {
    if (!refreshedAccessToken) {
      return finish(NextResponse.next());
    }
    return finish(
      NextResponse.next({
        request: {
          headers: withAccessTokenOnRequest(request, refreshedAccessToken),
        },
      }),
    );
  };

  if (accessToken && decodedAccessToken?.success && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "TENANT") {
      return finish(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
    if (userRole === "LANDLORD") {
      return finish(
        NextResponse.redirect(new URL("/landlord-dashboard", request.url)),
      );
    }
    if (userRole === "ADMIN") {
      return finish(
        NextResponse.redirect(new URL("/admin-dashboard", request.url)),
      );
    }
    return finish(NextResponse.redirect(new URL("/", request.url)));
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!decodedAccessToken?.success && !isPublicPath(pathname) && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return finish(NextResponse.redirect(loginUrl));
  }

  if (pathname.startsWith("/dashboard") && userRole !== "TENANT") {
    return finish(NextResponse.redirect(new URL("/", request.url)));
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return finish(NextResponse.redirect(new URL("/", request.url)));
  }
  if (pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD") {
    return finish(NextResponse.redirect(new URL("/", request.url)));
  }
  if (pathname.startsWith("/tenant-dashboard") && userRole !== "TENANT") {
    return finish(NextResponse.redirect(new URL("/", request.url)));
  }

  return nextWithToken();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
