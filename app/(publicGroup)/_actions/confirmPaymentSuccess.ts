"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

export const confirmPaymentSuccess = async (sessionId?: string | null) => {
  let confirmed = false;
  let message = "Caches refreshed";

  if (!sessionId) {
    message =
      "Missing Stripe session id — open payments and try Pay now again if status is stuck.";
  } else {
    try {
      const accessToken = await getAccessToken().catch(() => null);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      // Auth is optional; Stripe session id is enough to fulfill
      if (accessToken) {
        headers.Cookie = `accessToken=${accessToken}`;
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(
        `${process.env.BACKEND_API_URL}/api/pay/confirm-checkout-session`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ sessionId }),
          cache: "no-store",
        },
      );
      const result = await res.json().catch(() => null);
      confirmed = Boolean(result?.success);
      message =
        result?.message ||
        (confirmed
          ? "Payment confirmed successfully"
          : `Confirm failed (${res.status})`);
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
  revalidatePath("/landlord-dashboard/properties/requests");
  revalidatePath("/landlord-dashboard");
  revalidatePath("/properties");
  revalidatePath("/landlord-dashboard/properties");

  return { success: true, confirmed, message };
};
