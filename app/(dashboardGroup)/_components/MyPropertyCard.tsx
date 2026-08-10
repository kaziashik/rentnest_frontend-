import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ICategory, IProperty } from "@/lib/types";
import { BathIcon, BedDoubleIcon, ImagesIcon, MapPinIcon } from "lucide-react";
import { PropertyFormDialog } from "./PropertyFormDialog";
import { DeletePropertyDialog } from "./DeletePropertyDialog";

type MyPropertyCardProps = {
  property: IProperty;
  categories: ICategory[];
};

function isValidImageUrl(url?: string): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function MyPropertyCard({ property, categories }: MyPropertyCardProps) {
  const images = Array.isArray(property.property_image)
    ? property.property_image.filter(isValidImageUrl)
    : [];
  const cover = images[0] ?? null;
  const featurePreview = (property.fetures ?? []).slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No photo
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/20" />

        <Badge
          variant={property.availability === "AVAILABLE" ? "default" : "secondary"}
          className="absolute top-3 left-3 shadow-sm"
        >
          {property.availability === "AVAILABLE" ? "Available" : "Unavailable"}
        </Badge>

        {images.length > 1 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
            <ImagesIcon className="size-3" />
            {images.length} photos
          </span>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <PropertyFormDialog
            mode="edit"
            property={property}
            categories={categories}
            compact
          />
          <DeletePropertyDialog
            propertyId={property.id}
            propertyTitle={property.title}
            compact
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          {property.category?.name && (
            <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
              {property.category.name}
            </p>
          )}
          <h3 className="font-display line-clamp-1 text-lg font-semibold tracking-tight">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>
        </div>

        {featurePreview.length > 0 && (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {featurePreview.join(" · ")}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BedDoubleIcon className="size-3.5" />
              {property.bedRooms}
            </span>
            <span className="inline-flex items-center gap-1">
              <BathIcon className="size-3.5" />
              {property.bathRooms}
            </span>
          </div>
          <p className="text-right">
            <span className="text-base font-semibold text-foreground">
              RM {Number(property.rentPrice).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/propertiesDetails/${property.id}`}
            className="inline-flex h-9 items-center justify-center rounded-full border bg-background text-sm font-medium transition hover:bg-muted"
          >
            View
          </Link>
          <PropertyFormDialog
            mode="edit"
            property={property}
            categories={categories}
            triggerLabel="Edit"
            triggerClassName="w-full rounded-full"
          />
        </div>
      </div>
    </article>
  );
}
