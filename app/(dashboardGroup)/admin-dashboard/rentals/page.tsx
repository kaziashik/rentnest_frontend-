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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Rental Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Requests grouped by property — see the listing photo, landlord, tenant,
          status, and how many times each home has been rented.
        </p>
      </div>

      <Suspense fallback={<RentalsSkeleton />}>
        <AdminRentalRequestsList />
      </Suspense>
    </div>
  );
}
