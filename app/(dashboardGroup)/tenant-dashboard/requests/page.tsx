import { Suspense } from "react";
import { MyRentalRequestsSkeleton } from "../../_components/MyRentalRequestsSkeleton";
import { MyRentalRequestsList } from "../../_components/MyRentalRequestsList";


export default function MyRentalRequestsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Requests</h1>

      <Suspense fallback={<MyRentalRequestsSkeleton />}>
        <MyRentalRequestsList />
      </Suspense>
    </div>
  );
}