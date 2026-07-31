import { getAccessToken } from "@/service/refreshToken";
import { cookies } from "next/headers";

export const getTenantReviews = async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/review/tenant-reviews`, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },
        cache: "force-cache",
        next: {
            revalidate: 60 * 60,
            tags: ["tenant-reviews"]
        }
    });

    const result = await res.json();

    return result;
}