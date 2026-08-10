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
      <p className="py-12 text-center text-muted-foreground">
        No rental properties found.
      </p>
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
