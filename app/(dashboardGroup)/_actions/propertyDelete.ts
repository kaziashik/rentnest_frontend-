"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

type DeleteState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: null;
} | null;

export const deleteProperty = async (propertyId: string) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/landlord/${propertyId}`, {
        method: "DELETE",
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("my-properties", "max");
    }

    return result;
}