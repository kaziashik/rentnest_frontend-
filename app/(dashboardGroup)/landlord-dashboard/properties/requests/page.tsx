import { Suspense } from "react";
import { RentalRequestsList } from "@/app/(dashboardGroup)/_components/RentalRequestsList";
import { RentalRequestsSkeleton } from "@/app/(dashboardGroup)/_components/RentalRequestsSkeleton";

export default function RentalRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Rental Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Review tenant applications and accept or reject them.
        </p>
      </div>

      <Suspense fallback={<RentalRequestsSkeleton />}>
        <RentalRequestsList />
      </Suspense>
    </div>
  );
}
