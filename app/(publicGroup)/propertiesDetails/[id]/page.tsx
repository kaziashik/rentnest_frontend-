import { Suspense } from "react";
import { PropertyDetailsSkeleton } from "../../_components/properties/propertyDetailsSkeleton";
import { PropertyDetails } from "../../_components/properties/propertyDetails";



const PropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<PropertyDetailsSkeleton />}>
        <PropertyDetails propertyId={id} />
      </Suspense>
    </div>
  );
};

export default PropertyDetailsPage;