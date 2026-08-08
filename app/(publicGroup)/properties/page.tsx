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
    <div className="container-page space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Explore
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your next rental
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Search by title or location, filter by price and category, and sort results to match
          your budget.
        </p>
      </div>

      <Suspense fallback={<div className="h-28 animate-pulse rounded-xl bg-muted" />}>
        <PropertySearchBar />
      </Suspense>

      <Suspense fallback={<PropertyListSkeleton />}>
        <PropertyList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
