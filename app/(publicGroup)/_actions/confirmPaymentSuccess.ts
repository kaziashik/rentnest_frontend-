"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

export const confirmPaymentSuccess = async (sessionId?: string | null) => {
  const accessToken = await getAccessToken();

  let confirmed = false;
  let message = "Caches refreshed";

  if (sessionId && accessToken) {
    try {
      const res = await fetch(
        `${process.env.BACKEND_API_URL}/api/pay/confirm-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}`,
          },
          body: JSON.stringify({ sessionId }),
          cache: "no-store",
        },
      );
      const result = await res.json();
      confirmed = Boolean(result?.success);
      message = result?.message || message;
    } catch {
      message = "Could not confirm payment with backend yet";
    }
  }

  revalidateTag("payment-history", "max");
  revalidateTag("my-rental-requests", "max");
  revalidateTag("rental-requests", "max");
  revalidateTag("properties", "max");
  revalidateTag("my-properties", "max");

  revalidatePath("/tenant-dashboard/payments");
  revalidatePath("/tenant-dashboard/requests");
  revalidatePath("/properties");
  revalidatePath("/landlord-dashboard/properties");
  revalidatePath("/landlord-dashboard/properties/requests");

  return { success: true, confirmed, message };
};
