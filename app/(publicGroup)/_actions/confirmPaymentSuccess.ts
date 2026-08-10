"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const confirmPaymentSuccess = async () => {
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

  return { success: true };
};
