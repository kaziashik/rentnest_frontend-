import { RentalRequestsList } from "@/app/(dashboardGroup)/_components/RentalRequestsList";
import { RentalRequestsSkeleton } from "@/app/(dashboardGroup)/_components/RentalRequestsSkeleton";
import { Suspense } from "react";


export default function RentalRequestsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Rental Requests</h1>

      <Suspense fallback={<RentalRequestsSkeleton />}>
        <RentalRequestsList />
      </Suspense>
    </div>
  );
}