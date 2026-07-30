/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProperty } from "@/lib/types";
import { getMyProperties } from "../_actions/getMyProperties";
import { MyPropertyCard } from "./MyPropertyCard";

export async function MyPropertiesList() {
  const result = await getMyProperties();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You haven&apos;t added any properties yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((property: IProperty | any) => (
        <MyPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}