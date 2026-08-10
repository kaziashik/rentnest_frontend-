"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BedDoubleIcon,
  BathIcon,
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  RepeatIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusBadgeClass } from "@/lib/statusBadge";
import { IAvailability, IRentalStatus } from "@/lib/types";

export type AdminPropertyRow = {
  id: string;
  title: string;
  location: string;
  rentPrice: string | number;
  bedRooms: number;
  bathRooms: number;
  availability: IAvailability;
  property_image?: unknown;
  category?: { name: string };
  propertyOwner?: { id?: string; name: string; email: string; phone?: string | null };
  rentalSummary?: {
    totalRequests: number;
    timesRented: number;
    activeCount: number;
    approvedCount: number;
    pendingCount: number;
    currentStatus: IRentalStatus | null;
    currentTenant: { id: string; name: string; email: string } | null;
  };
};

const PAGE_SIZE = 8;

function normalizeImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((u): u is string => typeof u === "string" && u.length > 0);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((u): u is string => typeof u === "string" && u.length > 0);
      }
    } catch {
      if (raw.startsWith("http")) return [raw];
    }
  }
  return [];
}

function isValidImageUrl(url?: string): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function listingLabel(property: AdminPropertyRow) {
  if (property.rentalSummary?.currentStatus === "ACTIVE") return "Active rental";
  if (property.rentalSummary?.currentStatus === "APPROVED") return "Awaiting payment";
  if (property.rentalSummary?.currentStatus === "PENDING") return "Pending request";
  if (property.availability === "UNAVAILABLE") return "Unavailable";
  return "Available";
}

function listingTone(property: AdminPropertyRow) {
  const status = property.rentalSummary?.currentStatus;
  if (status === "ACTIVE") return getStatusBadgeClass("ACTIVE");
  if (status === "APPROVED") return getStatusBadgeClass("APPROVED");
  if (status === "PENDING") return getStatusBadgeClass("PENDING");
  if (property.availability === "UNAVAILABLE") {
    return "border-gray-300 bg-gray-50 text-gray-600";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

type AdminPropertiesExplorerProps = {
  properties: AdminPropertyRow[];
  categories: string[];
};

export function AdminPropertiesExplorer({
  properties,
  categories,
}: AdminPropertiesExplorerProps) {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<"" | IAvailability>("");
  const [category, setCategory] = useState("");
  const [rentalState, setRentalState] = useState<
    "" | "ACTIVE" | "APPROVED" | "PENDING" | "IDLE" | "COMPLETED"
  >("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return properties.filter((property) => {
      if (availability && property.availability !== availability) return false;
      if (category && property.category?.name !== category) return false;

      const summary = property.rentalSummary;
      if (rentalState === "ACTIVE" && summary?.currentStatus !== "ACTIVE") return false;
      if (rentalState === "APPROVED" && summary?.currentStatus !== "APPROVED") return false;
      if (rentalState === "PENDING" && summary?.currentStatus !== "PENDING") return false;
      if (rentalState === "COMPLETED" && !(summary?.timesRented)) return false;
      if (
        rentalState === "IDLE" &&
        (summary?.currentStatus === "ACTIVE" ||
          summary?.currentStatus === "APPROVED" ||
          summary?.currentStatus === "PENDING")
      ) {
        return false;
      }

      if (!q) return true;
      const haystack = [
        property.title,
        property.location,
        property.category?.name,
        property.propertyOwner?.name,
        property.propertyOwner?.email,
        property.rentalSummary?.currentTenant?.name,
        property.rentalSummary?.currentTenant?.email,
        property.availability,
        property.rentalSummary?.currentStatus,
        String(property.rentPrice),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [properties, search, availability, category, rentalState]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const clearFilters = () => {
    setSearch("");
    setAvailability("");
    setCategory("");
    setRentalState("");
    setPage(1);
  };

  const hasFilters = Boolean(search || availability || category || rentalState);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-card p-2.5 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search properties"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Property, owner, tenant, location…"
              className="h-9 rounded-full pl-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <select
              aria-label="Availability"
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value as "" | IAvailability);
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-32 sm:text-sm"
            >
              <option value="">Availability</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>

            <select
              aria-label="Rental state"
              value={rentalState}
              onChange={(e) => {
                setRentalState(e.target.value as typeof rentalState);
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-36 sm:text-sm"
            >
              <option value="">Rental state</option>
              <option value="ACTIVE">Active</option>
              <option value="APPROVED">Awaiting pay</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Ever rented</option>
              <option value="IDLE">No open request</option>
            </select>

            <select
              aria-label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="col-span-2 h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:col-span-1 sm:w-40 sm:text-sm"
            >
              <option value="">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 rounded-full px-2.5"
              onClick={clearFilters}
            >
              <XIcon className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs sm:text-sm">
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{filtered.length}</span>{" "}
          <span className="text-muted-foreground">shown</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{properties.length}</span>{" "}
          <span className="text-muted-foreground">total</span>
        </span>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="font-medium">No properties match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try owner email, tenant name, category, or clear filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Property</th>
                  <th className="px-3 py-2.5 font-medium">Owner</th>
                  <th className="px-3 py-2.5 font-medium">Tenant / status</th>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 font-medium">Rentals</th>
                  <th className="px-3 py-2.5 font-medium text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((property) => {
                  const cover =
                    normalizeImages(property.property_image).find(isValidImageUrl) ??
                    null;
                  return (
                    <tr
                      key={property.id}
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-3 py-3">
                        <Link
                          href={`/propertiesDetails/${property.id}`}
                          className="flex min-w-0 items-center gap-3"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {cover ? (
                              <Image
                                src={cover}
                                alt={property.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium hover:text-primary">
                              {property.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <MapPinIcon className="size-3 shrink-0" />
                              {property.location}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <BedDoubleIcon className="size-3" />
                                {property.bedRooms}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <BathIcon className="size-3" />
                                {property.bathRooms}
                              </span>
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium">
                          {property.propertyOwner?.name || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.propertyOwner?.email}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className={`mb-1 ${listingTone(property)}`}
                        >
                          {listingLabel(property)}
                        </Badge>
                        {property.rentalSummary?.currentTenant ? (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <UserIcon className="size-3" />
                            {property.rentalSummary.currentTenant.name}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">No current tenant</p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {property.category?.name || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <p className="inline-flex items-center gap-1 font-medium">
                          <RepeatIcon className="size-3.5 text-muted-foreground" />
                          {property.rentalSummary?.timesRented ?? 0}×
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.rentalSummary?.totalRequests ?? 0} requests
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        RM {Number(property.rentPrice).toLocaleString()}
                        <span className="block text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y md:hidden">
            {pageItems.map((property) => {
              const cover =
                normalizeImages(property.property_image).find(isValidImageUrl) ?? null;
              return (
                <article key={property.id} className="space-y-2.5 p-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/propertiesDetails/${property.id}`}
                      className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={property.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <Link
                          href={`/propertiesDetails/${property.id}`}
                          className="truncate font-medium hover:text-primary"
                        >
                          {property.title}
                        </Link>
                        <Badge
                          variant="outline"
                          className={listingTone(property)}
                        >
                          {listingLabel(property)}
                        </Badge>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPinIcon className="size-3" />
                        <span className="truncate">{property.location}</span>
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        RM {Number(property.rentPrice).toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-muted/40 px-2.5 py-2">
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Building2Icon className="size-3" />
                        Owner
                      </p>
                      <p className="mt-0.5 font-medium">
                        {property.propertyOwner?.name || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2.5 py-2">
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <UserIcon className="size-3" />
                        Tenant
                      </p>
                      <p className="mt-0.5 font-medium">
                        {property.rentalSummary?.currentTenant?.name || "None"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2.5 py-2">
                      <p className="text-muted-foreground">Category</p>
                      <p className="mt-0.5 font-medium">
                        {property.category?.name || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 px-2.5 py-2">
                      <p className="text-muted-foreground">Times rented</p>
                      <p className="mt-0.5 font-medium">
                        {property.rentalSummary?.timesRented ?? 0}× ·{" "}
                        {property.rentalSummary?.totalRequests ?? 0} req
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2 border-t pt-4">
          <p className="text-xs text-muted-foreground sm:text-sm">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon className="size-4" />
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant={n === currentPage ? "default" : "outline"}
                  size="sm"
                  className="size-9 rounded-full p-0"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
