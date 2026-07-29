import { Suspense } from "react";

import { PropertySearchBar } from "./_components/properties/PropertySearchBar";
import { PropertyListSkeleton } from "./_components/properties/propertyListSkeleton";
import { PropertyList } from "./_components/properties/propertyList";


export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h1 className="text-2xl font-semibold">Find Your Next Rental</h1>
        <p className="text-sm text-muted-foreground">
          Browse available properties near you.
        </p>
      </div>
      {/* <PropertySearchBar></PropertySearchBar> */}
      </div>

      <Suspense fallback={<PropertyListSkeleton />}>
        <PropertyList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}