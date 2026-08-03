import { getAccessToken } from "@/service/refreshToken";
import { cookies } from "next/headers";

export const getAdminDashboard = async () => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/dashboard`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 60 * 5, // 5 minutes, admin stats should feel reasonably fresh
        tags: ["admin-dashboard"],
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch admin dashboard data",
      };
    }

    return result;
  } catch (error) {
    console.error("Get admin dashboard error:", error);

    return {
      success: false,
      message: "Something went wrong while fetching admin dashboard",
    };
  }
};