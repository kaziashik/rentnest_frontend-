"use server";

import { jwtutils } from "@/utils/jwt";
import { cookies } from "next/headers";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24,
  sameSite: "lax" as const,
  path: "/",
};

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    },
  );

  const result = await res.json();
  return result;
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtutils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;
  const decodedRefreshToken = refreshToken
    ? jwtutils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();
    if (result.success) {
      const newAccessToken = result.data.accessToken as string;
      // Cookie writes are only allowed in Server Actions / Route Handlers.
      // getMe() calls this during Server Component render — skip set there.
      try {
        cookieStore.set("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);
      } catch {
        // Use refreshed token for this request only; proxy persists it on next nav.
      }
      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
