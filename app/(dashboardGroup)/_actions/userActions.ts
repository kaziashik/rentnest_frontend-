"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const updateUserStatus = async (userId: string, activeStatus: "ACTIVE" | "BANNED") => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/user/${userId}/status`, {
        method: "PATCH",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ activeStatus })
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("all-users", "max");
    }

    return result;
}

export const deleteUser = async (userId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("all-users", "max");
    }

    return result;
}