import { Suspense } from "react";
import { PropertySearchBar } from "../_components/properties/PropertySearchBar";
import { PropertyListSkeleton } from "../_components/properties/propertyListSkeleton";
import { PropertyList } from "../_components/properties/propertyList";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container-page space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-3">
        <PageHeader
          title="Find your next rental"
          description="Filter by location, type, and budget"
        />

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
