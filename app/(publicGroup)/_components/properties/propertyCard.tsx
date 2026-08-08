import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDoubleIcon, BathIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
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
  const description =
    property.fetures?.slice(0, 2).join(" · ") ||
    `${property.bedRooms} bed · ${property.bathRooms} bath rental in ${property.location}`;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl py-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full shrink-0">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No image available
          </div>
        )}
        <Badge
          variant={property.availability === "AVAILABLE" ? "default" : "secondary"}
          className="absolute top-3 right-3"
        >
          {property.availability === "AVAILABLE" ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <CardHeader className="space-y-2 px-4 pt-4 pb-2">
        <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>

      <CardContent className="mt-auto space-y-3 px-4 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {property.category?.name && (
            <Badge variant="secondary">{property.category.name}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BedDoubleIcon className="size-3.5" />
              {property.bedRooms}
            </span>
            <span className="flex items-center gap-1">
              <BathIcon className="size-3.5" />
              {property.bathRooms}
            </span>
          </span>
          <span className="text-base font-semibold text-foreground">
            RM {Number(property.rentPrice).toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground">/mo</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <Button asChild className="w-full rounded-full">
          <Link href={`/propertiesDetails/${property.id}`}>
            View Details
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
