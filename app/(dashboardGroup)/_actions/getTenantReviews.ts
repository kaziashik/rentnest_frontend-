import { cookies } from "next/headers";

export const getTenantReviews = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

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