import { cookies } from "next/headers";

export const getRentalRequests = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  const result = await res.json();

  return result;
};
