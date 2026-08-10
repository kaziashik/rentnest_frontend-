import { redirect } from "next/navigation";

/** Legacy Stripe redirect — keep for older checkout sessions */
export default function LegacyPaymentSuccessPage() {
  redirect("/payment/success");
}
