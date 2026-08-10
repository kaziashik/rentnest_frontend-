import { IProperty } from "@/lib/types";
import { getHouseRentalProperties } from "../../_actions/getHouseRentalNews";
import { PropertyCard } from "./propertyCard";
import { PropertyPagination } from "./propertyPagination";

export async function PropertyList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const result = await getHouseRentalProperties({ query });

  if (!result.success) {
    return (
      <div className="space-y-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <p className="font-medium text-destructive">Unable to load properties</p>
        <p className="text-sm text-muted-foreground">
          {result.message || "Check BACKEND_API_URL and restart the Next.js server."}
        </p>
      </div>
    );
  }

  if (!result.data?.data?.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
        <p className="font-display text-lg font-semibold tracking-tight">
          No rentals match your filters
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Try a different location, category, or price range — or clear filters
          to browse all listings.
        </p>
        <a
          href="/properties"
          className="mt-5 inline-flex rounded-full border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Clear filters
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.data.map((property: IProperty, index: number) => (
          <PropertyCard key={property.id} property={property} index={index} />
        ))}
      </div>
      <PropertyPagination meta={result.data.meta} />
    </div>
  );
}
