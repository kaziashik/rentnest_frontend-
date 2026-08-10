import { redirect } from "next/navigation";

type LegacySuccessProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy Stripe redirect — preserve session_id and other query params */
export default async function LegacyPaymentSuccessPage({
  searchParams,
}: LegacySuccessProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) qs.append(key, item);
    }
  }

  const query = qs.toString();
  redirect(query ? `/payment/success?${query}` : "/payment/success");
}
