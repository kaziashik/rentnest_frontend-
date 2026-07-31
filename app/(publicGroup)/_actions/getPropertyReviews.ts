import { cookies } from "next/headers";

export const getPropertyReviews = async (propertyId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/review/${propertyId}`, {
        headers: accessToken ? {
            Cookie: `accessToken=${accessToken}`
        } : undefined,
        cache: "force-cache",
        next: {
            revalidate: 60 * 60,
            tags: [`property-reviews-${propertyId}`]
        }
    });

    const result = await res.json();

    return result;
}