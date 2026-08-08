import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BedDoubleIcon, BathIcon, MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";
import { getPropertyById } from "../../_actions/getPropertyById";
import { notFound } from "next/navigation";
import { RequestRentalDialog } from "../RequestRentalDialog";
import { PropertyReviews } from "./PropertyReviews";
import { PropertyImageGallery } from "./PropertyImageGallery";
import { getHouseRentalProperties } from "../../_actions/getHouseRentalNews";
import { PropertyCard } from "./propertyCard";
import { IProperty } from "@/lib/types";

export async function PropertyDetails({ propertyId }: { propertyId: string }) {
  const result = await getPropertyById(propertyId);

  if (!result.success || !result.data) {
    notFound();
  }

  const property = result.data as IProperty;

  const relatedResult = await getHouseRentalProperties({
    query: {
      category: property.category?.name,
      page: "1",
      limit: "4",
    },
  });

  const related: IProperty[] = (relatedResult?.data?.data ?? []).filter(
    (p: IProperty) => p.id !== property.id,
  ).slice(0, 3);

  return (
    <div className="space-y-10">
      <PropertyImageGallery images={property.property_image ?? []} title={property.title} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight">
                  {property.title}
                </h1>
                <p className="mt-2 flex items-center gap-1 text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  {property.location}
                </p>
              </div>
              <p className="text-2xl font-semibold text-primary">
                RM {Number(property.rentPrice).toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {property.category?.name && (
                <Badge variant="secondary">{property.category.name}</Badge>
              )}
              <Badge variant={property.availability === "AVAILABLE" ? "default" : "outline"}>
                {property.availability === "AVAILABLE" ? "Available" : "Unavailable"}
              </Badge>
              {property.fetures?.map((f: string) => (
                <Badge key={f} variant="outline">
                  {f}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {property.title} is a {property.bedRooms}-bedroom, {property.bathRooms}-bathroom
              rental located in {property.location}.
              {property.category?.name
                ? ` Listed under the ${property.category.name} category.`
                : ""}{" "}
              {property.fetures?.length
                ? `Key features include ${property.fetures.join(", ")}.`
                : "Contact the landlord for more details about amenities and viewing times."}
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Specifications</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/50 p-4">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Bedrooms</dt>
                <dd className="mt-1 flex items-center gap-2 font-medium">
                  <BedDoubleIcon className="size-4 text-primary" />
                  {property.bedRooms}
                </dd>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Bathrooms</dt>
                <dd className="mt-1 flex items-center gap-2 font-medium">
                  <BathIcon className="size-4 text-primary" />
                  {property.bathRooms}
                </dd>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Location</dt>
                <dd className="mt-1 font-medium">{property.location}</dd>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Monthly rent</dt>
                <dd className="mt-1 font-medium">
                  RM {Number(property.rentPrice).toLocaleString()}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Reviews & ratings</h2>
            <PropertyReviews propertyId={property.id} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Ready to move?</p>
            <p className="mt-1 text-xl font-semibold">
              RM {Number(property.rentPrice).toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground"> / month</span>
            </p>
            <div className="mt-4">
              <RequestRentalDialog
                propertyId={property.id}
                availability={property.availability}
              />
            </div>
          </div>

          {property.propertyOwner && (
            <div className="rounded-2xl border bg-card p-6">
              <p className="text-sm font-medium">Listed by</p>
              <div className="mt-3 flex items-center gap-3">
                {property.propertyOwner.name && (
                  <div className="relative size-12 overflow-hidden rounded-full bg-primary/10">
                    <Image
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(property.propertyOwner.name)}`}
                      alt={property.propertyOwner.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium">{property.propertyOwner.name}</p>
                  <p className="text-xs text-muted-foreground">Property owner</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MailIcon className="size-4 text-primary" />
                  {property.propertyOwner.email}
                </p>
                {property.propertyOwner.phone && (
                  <p className="flex items-center gap-2">
                    <PhoneIcon className="size-4 text-primary" />
                    {property.propertyOwner.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="space-y-6 border-t pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Related properties</h2>
              <p className="text-sm text-muted-foreground">
                More listings similar to this one
              </p>
            </div>
            <Link href="/properties" className="text-sm font-medium text-primary hover:underline">
              Browse all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
