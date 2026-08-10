import { Suspense } from "react";
import { getHouseRentalProperties } from "../../../(publicGroup)/_actions/getHouseRentalNews";
import {
  AdminPropertiesExplorer,
  AdminPropertyRow,
} from "../../_components/AdminPropertiesExplorer";

async function AllPropertiesList() {
  const result = await getHouseRentalProperties({
    query: { limit: "100", page: "1" },
  });

  if (!result.success || !result.data.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {result.message || "No properties found."}
      </p>
    );
  }

  const properties = result.data.data as AdminPropertyRow[];
  const categories = [
    ...new Set(
      properties
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <AdminPropertiesExplorer properties={properties} categories={categories} />
  );
}

function PropertiesSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          All Properties
        </h1>
      </div>

      <Suspense fallback={<PropertiesSkeleton />}>
        <AllPropertiesList />
      </Suspense>
    </div>
  );
}
