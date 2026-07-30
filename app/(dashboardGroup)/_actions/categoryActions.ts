"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const createCategory = async (prevState: any, formData: FormData) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const payload = {
        name: formData.get("name"),
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("categories", "max");
    }

    return result;
}

export const updateCategory = async (categoryId: string, prevState: any, formData: FormData) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const payload = {
        name: formData.get("name"),
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("categories", "max");
    }

    return result;
}

export const deleteCategory = async (categoryId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return { success: false, message: "User not logged in!" }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("categories", "max");
    }

    return result;
}