"use server";

import { getAccessToken } from "@/service/refreshToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createCheckoutSession = async (requestId: string) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/pay/create-checkout-session`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestId })
    });

    const result = await res.json();

    if (result.success && result.data?.url) {
        redirect(result.data.url);
    }

    return result;
}