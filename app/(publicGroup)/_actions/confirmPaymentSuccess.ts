"use server";

import { revalidateTag } from "next/cache";

export const confirmPaymentSuccess = async () => {
    revalidateTag("payment-history", "max");
    revalidateTag("my-rental-requests", "max");

    return { success: true };
}