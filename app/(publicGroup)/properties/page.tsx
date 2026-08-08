import { Suspense } from "react";
import { PropertySearchBar } from "../_components/properties/PropertySearchBar";
import { PropertyListSkeleton } from "../_components/properties/propertyListSkeleton";
import { PropertyList } from "../_components/properties/propertyList";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container-page space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Explore
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Find your next rental
          </h1>
        </div>
        <p className="max-w-md text-sm text-muted-foreground sm:text-right">
          Filter by location, type, and budget.
        </p>
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-muted" />}>
        <PropertySearchBar />
      </Suspense>

      <Suspense fallback={<PropertyListSkeleton />}>
        <PropertyList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
