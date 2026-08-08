import { cookies } from "next/headers";

export const getMyProperties = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/my-properties`, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },

        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24, // 1 day
            tags: ["my-properties"]
        }
    });

    const result = await res.json();
   

    return result;
}