import { Suspense } from "react";
import { AdminRentalRequestsList } from "../../_components/AdminRentalRequestsList";

function RentalsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

export default function AdminRentalsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          Rental Requests
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Grouped by property · 5 per page
        </p>
      </div>

      <Suspense fallback={<RentalsSkeleton />}>
        <AdminRentalRequestsList />
      </Suspense>
    </div>
  );
}
