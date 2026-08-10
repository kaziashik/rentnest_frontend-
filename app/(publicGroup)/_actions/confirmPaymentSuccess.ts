"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

function revalidatePaymentCaches() {
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
  revalidatePath("/admin-dashboard");
}

export const confirmPaymentSuccess = async (sessionId?: string | null) => {
  let confirmed = false;
  let message = "Caches refreshed";

  if (!sessionId) {
    message =
      "Missing Stripe session id — trying to sync paid checkouts for your account.";
  } else {
    try {
      const accessToken = await getAccessToken().catch(() => null);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
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

  // Fallback: sync any paid Stripe sessions for this tenant (covers lost session_id)
  if (!confirmed) {
    try {
      const accessToken = await getAccessToken().catch(() => null);
      if (accessToken) {
        const res = await fetch(
          `${process.env.BACKEND_API_URL}/api/pay/sync-paid-checkouts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `accessToken=${accessToken}`,
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          },
        );
        const result = await res.json().catch(() => null);
        const syncedCount = Array.isArray(result?.data?.synced)
          ? result.data.synced.length
          : 0;
        if (result?.success && syncedCount > 0) {
          confirmed = true;
          message = result.message || `Synced ${syncedCount} paid rental(s)`;
        } else if (!sessionId) {
          message =
            result?.message ||
            "Missing Stripe session id. Open Payments and use Pay now again if status is stuck.";
        }
      }
    } catch {
      // keep prior message
    }
  }

  revalidatePaymentCaches();
  return { success: true, confirmed, message };
};
