import { Suspense } from "react";
import { MyPropertiesList } from "../../_components/MyPropertiesList";
import { MyPropertiesSkeleton } from "../../_components/MyPropertiesSkeleton";

export default function LandlordPropertiesPage() {
  return (
    <Suspense fallback={<MyPropertiesSkeleton />}>
      <MyPropertiesList />
    </Suspense>
  );
}
