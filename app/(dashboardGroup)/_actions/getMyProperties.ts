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

    // Always fetch fresh — landlord listings change often; force-cache hid new properties.
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/my-properties`, {
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
    });

    const result = await res.json();

    return result;
}