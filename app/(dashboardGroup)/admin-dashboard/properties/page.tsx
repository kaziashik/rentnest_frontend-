import { Suspense } from "react";
import { MyPropertiesList } from "../../_components/MyPropertiesList";
import { MyPropertiesSkeleton } from "../../_components/MyPropertiesSkeleton";

export default function LandlordPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Properties</h1>
      </div>

      <Suspense fallback={<MyPropertiesSkeleton />}>
        <MyPropertiesList />
      </Suspense>
    </div>
  );
}