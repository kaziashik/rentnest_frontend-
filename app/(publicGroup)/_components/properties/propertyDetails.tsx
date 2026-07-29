import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BedDoubleIcon, BathIcon, MapPinIcon } from "lucide-react";
import { getPropertyById } from "../../_actions/getPropertyById";
import { notFound } from "next/navigation";

function isValidImageUrl(url?: string): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function PropertyDetails({ propertyId }: { propertyId: string }) {
  const result = await getPropertyById(propertyId);

  if (!result.success || !result.data) {
    notFound();
  }

  const property = result.data;
  const rawImage = property.property_image?.[0];
  const image = isValidImageUrl(rawImage) ? rawImage : null;

  return (
    <div className="space-y-6">
      <div className="relative h-96 w-full overflow-hidden rounded-xl">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{property.title}</h1>
          <p className="flex items-center gap-1 text-muted-foreground">
            <MapPinIcon className="size-4" />
            {property.location}
          </p>
        </div>
        <p className="text-xl font-semibold">
          RM {Number(property.rentPrice).toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {property.category?.name && <Badge variant="secondary">{property.category.name}</Badge>}
        {property.fetures?.map((f: string) => (
          <Badge key={f} variant="outline">{f}</Badge>
        ))}
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <BedDoubleIcon className="size-4" /> {property.bedRooms} Bedrooms
        </span>
        <span className="flex items-center gap-1">
          <BathIcon className="size-4" /> {property.bathRooms} Bathrooms
        </span>
      </div>

      {property.propertyOwner && (
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Listed by</p>
          <p className="text-sm text-muted-foreground">{property.propertyOwner.name}</p>
          <p className="text-sm text-muted-foreground">{property.propertyOwner.email}</p>
        </div>
      )}
    </div>
  );
}