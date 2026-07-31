import { getAccessToken } from "@/service/refreshToken";
import { cookies } from "next/headers";

export const getMyProfile = async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },
        cache: "force-cache",
        next: {
            revalidate: 60 * 60,
            tags: ["my-profile"]
        }
    });

    const result = await res.json();

    return result;
}