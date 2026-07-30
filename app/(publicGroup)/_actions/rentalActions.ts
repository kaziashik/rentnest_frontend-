"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

type RentalRequestState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: Record<string, any>;
} | null;

export const createRentalRequest = async (
    propertyId: string,
    prevState: RentalRequestState,
    formData: FormData
) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "Please log in to request this property."
        }
    }

    const payload = {
        propertyId,
        message: formData.get("message") ?? "",
        moveInDate: formData.get("moveInDate")
            ? new Date(formData.get("moveInDate") as string).toISOString()
            : null,
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("my-rental-requests", "max");
    }

    return result;
}