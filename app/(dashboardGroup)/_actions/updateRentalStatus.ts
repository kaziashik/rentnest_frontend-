"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

export const updateRentalStatus = async (requestId: string, status: string) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals/${requestId}/status`, {
        method: "PUT",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("rental-requests", "max");
        revalidateTag("my-rental-requests", "max");
        revalidateTag("properties", "max");
        revalidateTag("my-properties", "max");
        revalidatePath("/properties");
        revalidatePath("/landlord-dashboard/properties");
        revalidatePath("/landlord-dashboard/properties/requests");
        revalidatePath("/landlord-dashboard");
    }

    return result;
}