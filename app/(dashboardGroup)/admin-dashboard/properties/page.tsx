import { Suspense } from "react";
import { IProperty } from "@/lib/types";
import { getHouseRentalProperties } from "../../../(publicGroup)/_actions/getHouseRentalNews";
import { PropertyCard } from "../../../(publicGroup)/_components/properties/propertyCard";

async function AllPropertiesList() {
    const result = await getHouseRentalProperties({ query: {} });

    if (!result.success || !result.data.data?.length) {
        return (
            <p className="py-12 text-center text-muted-foreground">
                No properties found.
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

function PropertiesSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
        </div>
    );
}

export default function AdminPropertiesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">All Properties</h1>
                <p className="text-sm text-muted-foreground">
                    Platform-wide view of all property listings.
                </p>
            </div>

            <Suspense fallback={<PropertiesSkeleton />}>
                <AllPropertiesList />
            </Suspense>
        </div>
    );
}