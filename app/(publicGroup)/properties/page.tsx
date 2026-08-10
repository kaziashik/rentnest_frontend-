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
    <div className="container-page space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Find your next rental
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Filter by location, type, and budget
          </p>
        </div>

        <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-muted" />}>
          <PropertySearchBar />
        </Suspense>
      </div>

      <Suspense fallback={<PropertyListSkeleton />}>
        <PropertyList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
