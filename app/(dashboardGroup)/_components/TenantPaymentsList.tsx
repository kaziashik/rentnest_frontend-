/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { CreditCardIcon, HomeIcon } from "lucide-react";
import { IPayment, IRentalRequest } from "@/lib/types";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { getPaymentHistory } from "../_actions/getPaymentHistory";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getPropertyById";
import { AwaitingPaymentCard } from "./AwaitingPaymentCard";
import { PaymentHistoryTable } from "./PaymentHistoryTable";

function normalizeImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((u): u is string => typeof u === "string" && u.length > 0);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((u): u is string => typeof u === "string" && u.length > 0);
      }
    } catch {
      if (raw.startsWith("http")) return [raw];
    }
  }
  return [];
}

async function withPropertyMedia<T extends { property: { id: string; location?: string; property_image?: unknown } }>(
  items: T[],
) {
  const uniqueIds = [...new Set(items.map((item) => item.property?.id).filter(Boolean))];

  const details = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const result = await getPropertyById(id);
        if (result?.success && result.data) {
          return [
            id,
            {
              property_image: normalizeImages(result.data.property_image),
              location: result.data.location as string | undefined,
            },
          ] as const;
        }
      } catch {
        // keep original
      }
      return [id, null] as const;
    }),
  );

  const byId = new Map(details);

  return items.map((item) => {
    const extra = byId.get(item.property.id);
    if (!extra) return item;
    const existing = normalizeImages(item.property.property_image);
    return {
      ...item,
      property: {
        ...item.property,
        location: item.property.location || extra.location,
        property_image: existing.length ? existing : extra.property_image,
      },
    };
  });
}

export async function TenantPaymentsList() {
  const [requestsResult, paymentsResult] = await Promise.all([
    getMyRentalRequests(),
    getPaymentHistory(),
  ]);

  const requests: IRentalRequest[] = requestsResult.success ? requestsResult.data ?? [] : [];
  const payments: IPayment[] = paymentsResult.success ? paymentsResult.data ?? [] : [];

  const paidRequestIds = new Set(
    payments
      .filter((p) => p.paymentStatus === "PAID")
      .map((p) => p.requestId),
  );

  const awaitingRaw = requests.filter(
    (r) => r.status === "APPROVED" && !paidRequestIds.has(r.id),
  );
  const awaitingPayment = await withPropertyMedia(awaitingRaw);

  const paymentRequests = payments.map((payment) => ({
    id: payment.id,
    property: payment.rentalRequest.property,
  }));
  const enrichedPaymentProps = await withPropertyMedia(paymentRequests);
  const enrichedByPaymentId = new Map(
    enrichedPaymentProps.map((item) => [item.id, item.property]),
  );

  const paymentsForHistory = payments.map((payment) => ({
    ...payment,
    rentalRequest: {
      ...payment.rentalRequest,
      property: enrichedByPaymentId.get(payment.id) ?? payment.rentalRequest.property,
    },
  }));

  const hasAnything = awaitingPayment.length > 0 || paymentsForHistory.length > 0;

  if (!hasAnything) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CreditCardIcon className="size-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">No payments yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When a landlord approves your request, you can pay here with Stripe Checkout.
        </p>
        <Link
          href="/properties"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <HomeIcon className="size-4" />
          Browse homes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {awaitingPayment.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Awaiting payment
              </h2>
              <p className="text-sm text-muted-foreground">
                Approved rentals waiting for checkout
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {awaitingPayment.length} due
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {awaitingPayment.map((request, index) => (
              <AwaitingPaymentCard
                key={request.id}
                request={request}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Payment history
          </h2>
          <p className="text-sm text-muted-foreground">
            Past Stripe payments for your rentals
          </p>
        </div>
        <PaymentHistoryTable payments={paymentsForHistory} />
      </section>
    </div>
  );
}
