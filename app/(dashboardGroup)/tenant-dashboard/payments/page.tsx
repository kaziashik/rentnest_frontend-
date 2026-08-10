import { Suspense } from "react";
import { connection } from "next/server";
import { TenantPaymentsList } from "../../_components/TenantPaymentsList";

function PaymentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border sm:flex-row"
        >
          <div className="h-40 w-full animate-pulse bg-muted sm:w-48" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="mt-auto h-9 w-28 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function TenantPaymentsPage() {
  await connection();
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Pay approved rentals with Stripe and review your payment history.
        </p>
      </div>

      <Suspense fallback={<PaymentsSkeleton />}>
        <TenantPaymentsList />
      </Suspense>
    </div>
  );
}
