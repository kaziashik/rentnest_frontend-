import { Suspense } from "react";
import { TenantPaymentsList } from "../../_components/TenantPaymentsList";

function PaymentsSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))}
        </div>
    );
}

export default function TenantPaymentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Payments</h1>

            <Suspense fallback={<PaymentsSkeleton />}>
                <TenantPaymentsList />
            </Suspense>
        </div>
    );
}