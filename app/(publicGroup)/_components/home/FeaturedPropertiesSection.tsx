import Link from "next/link";
import { Suspense } from "react";
import { PropertyListSkeleton } from "../properties/propertyListSkeleton";
import { getHouseRentalProperties } from "../../_actions/getHouseRentalNews";
import { PropertyCard } from "../properties/propertyCard";
import { IProperty } from "@/lib/types";
import { Button } from "@/components/ui/button";

async function FeaturedGrid() {
  const result = await getHouseRentalProperties({
    query: { page: "1", limit: "6" },
  });

  if (!result.success || !result.data?.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No featured properties available right now. Check back soon or browse all listings.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.data.map((property: IProperty) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

export function FeaturedPropertiesSection() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
              Featured homes
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Hand-picked rentals for you
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Explore available properties with photos, pricing, and clear availability status.
            </p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="rounded-full">
              View all properties
            </Button>
          </Link>
        </div>

        <Suspense fallback={<PropertyListSkeleton />}>
          <FeaturedGrid />
        </Suspense>
      </div>
    </section>
  );
}
