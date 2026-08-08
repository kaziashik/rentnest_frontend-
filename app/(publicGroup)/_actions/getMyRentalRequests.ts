"use server"

import { cookies } from "next/headers";

export const getMyRentalRequests = async () => {

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },
        cache: "no-cache",
        next: {
            revalidate: 0,
            tags: ["rentals"]
        }
    });

    const result = await res.json();

    return result;
}