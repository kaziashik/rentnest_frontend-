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
          Search by property, landlord, or tenant — then browse 5 properties per page
          with request status and rental history.
        </p>
      </div>

      <Suspense fallback={<RentalsSkeleton />}>
        <AdminRentalRequestsList />
      </Suspense>
    </div>
  );
}
