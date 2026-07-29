
import { IProperty } from "@/lib/types";
import { getHouseRentalProperties } from "../../_actions/getHouseRentalNews";
import { PropertyCard } from "./propertyCard";





export async function PropertyList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const result = await getHouseRentalProperties({ query });
  // console.log("get House", result.data.data?.length);
  // console.log(!result.success || !result.data.data?.length);

  if (!result.success || !result.data.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No rental properties found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.data.map((property: IProperty) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}