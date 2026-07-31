"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

type ProfileState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: Record<string, any>;
} | null;

export const updateProfile = async (currentRole: string, prevState: ProfileState, formData: FormData) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const payload = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        photo: formData.get("photo") || null,
        role: currentRole,
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("my-profile", "max");
    }

    return result;
}