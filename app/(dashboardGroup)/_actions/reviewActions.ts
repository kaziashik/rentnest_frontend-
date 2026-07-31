"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

type ReviewState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: Record<string, any>;
} | null;

export const createReview = async (
    propertyId: string,
    requestId: string,
    prevState: ReviewState,
    formData: FormData
) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const payload = {
        propertyId,
        requestId,
        rating: Number(formData.get("rating")),
        comment: formData.get("comment"),
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/review`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("tenant-reviews", "max");
        revalidateTag(`property-reviews-${propertyId}`, "max");
    }

    return result;
}