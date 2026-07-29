// _components/properties/propertyCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDoubleIcon, BathIcon, MapPinIcon } from "lucide-react";
import { IProperty } from "@/lib/types";

function isValidImageUrl(url?: string): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function PropertyCard({ property }: { property: IProperty }) {
  const rawImage = property.property_image?.[0];
  const image = isValidImageUrl(rawImage) ? rawImage : null;

  return (
    <Link href={`/propertiesDetails/${property.id}`}>
      <Card className="gap-4 overflow-hidden py-0 pb-4 transition-shadow hover:shadow-md">
        {image ? (
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
            <Badge
              variant={property.availability === "AVAILABLE" ? "default" : "secondary"}
              className="absolute top-2 right-2"
            >
              {property.availability === "AVAILABLE" ? "Available" : "Unavailable"}
            </Badge>
          </div>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}

        <CardHeader className="px-4">
          <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {property.category?.name && <Badge variant="secondary">{property.category.name}</Badge>}
            {property.fetures?.slice(0, 3).map((f) => (
              <Badge key={f} variant="outline">{f}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><BedDoubleIcon className="size-3.5" />{property.bedRooms}</span>
              <span className="flex items-center gap-1"><BathIcon className="size-3.5" />{property.bathRooms}</span>
            </span>
            <span className="text-base font-semibold text-foreground">
              RM {Number(property.rentPrice).toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}