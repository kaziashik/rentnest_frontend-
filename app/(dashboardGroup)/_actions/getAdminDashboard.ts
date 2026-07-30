import { cookies } from "next/headers";

export const getAdminDashboard = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/dashboard`, {
        headers: {
            Cookie: `accessToken=${accessToken}`
        },
        cache: "force-cache",
        next: {
            revalidate: 60 * 5, // 5 minutes, admin stats should feel reasonably fresh
            tags: ["admin-dashboard"]
        }
    });

    const result = await res.json();

    return result;
}