import { redirect } from "next/navigation";

type LegacyCancelProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy Stripe redirect — preserve query params */
export default async function LegacyPaymentCancelPage({
  searchParams,
}: LegacyCancelProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) qs.append(key, item);
    }
  }

  const query = qs.toString();
  redirect(query ? `/payment/cancel?${query}` : "/payment/cancel");
}
