"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

type PropertyState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: Record<string, any>;
} | null;

export const createProperty = async (prevState: PropertyState, formData: FormData) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const payload = {
        title: formData.get("title"),
        location: formData.get("location"),
        categoryId: formData.get("categoryId"),
        rentPrice: Number(formData.get("rentPrice")),
        bedRooms: Number(formData.get("bedRooms")),
        bathRooms: Number(formData.get("bathRooms")),
        fetures: (formData.get("fetures") as string)
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
        availability: formData.get("availability"),
        property_image: (formData.get("property_image") as string)
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean),
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/landlord`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        revalidateTag("my-properties", {
            expire: 0
        });
    }

    return result;
}