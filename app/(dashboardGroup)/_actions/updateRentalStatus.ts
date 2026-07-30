"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const updateRentalStatus = async (requestId: string, status: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

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
    }

    return result;
}