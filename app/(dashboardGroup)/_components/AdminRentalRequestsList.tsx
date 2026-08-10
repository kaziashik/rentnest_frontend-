/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import {
  Building2Icon,
  CalendarIcon,
  ClipboardListIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  RepeatIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeClass } from "@/lib/statusBadge";
import { IRentalRequest, IRentalStatus } from "@/lib/types";
import { getAllRentalRequests } from "../_actions/getAllRentalRequests";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getPropertyById";

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

type PropertyGroup = {
  propertyId: string;
  title: string;
  location?: string;
  rentPrice: string;
  availability?: string;
  cover: string | null;
  landlord?: { name: string; email: string; phone?: string | null };
  requests: IRentalRequest[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    completed: number;
    rejected: number;
    timesRented: number;
  };
};

function countByStatus(requests: IRentalRequest[], status: IRentalStatus) {
  return requests.filter((r) => r.status === status).length;
}

function buildGroups(requests: IRentalRequest[]): PropertyGroup[] {
  const map = new Map<string, PropertyGroup>();

  for (const request of requests) {
    const propertyId = request.property?.id || request.propertyId;
    const existing = map.get(propertyId);
    const images = normalizeImages(request.property.property_image);
    const cover = images.find(isValidImageUrl) ?? null;

    if (!existing) {
      map.set(propertyId, {
        propertyId,
        title: request.property.title,
        location: request.property.location,
        rentPrice: request.property.rentPrice,
        availability: request.property.availability,
        cover,
        landlord: request.property.propertyOwner,
        requests: [request],
        stats: {
          total: 1,
          pending: request.status === "PENDING" ? 1 : 0,
          approved: request.status === "APPROVED" ? 1 : 0,
          active: request.status === "ACTIVE" ? 1 : 0,
          completed: request.status === "COMPLETED" ? 1 : 0,
          rejected: request.status === "REJECTED" ? 1 : 0,
          timesRented: request.status === "COMPLETED" ? 1 : 0,
        },
      });
      continue;
    }

    existing.requests.push(request);
    if (!existing.cover && cover) existing.cover = cover;
    if (!existing.location && request.property.location) {
      existing.location = request.property.location;
    }
    if (!existing.landlord && request.property.propertyOwner) {
      existing.landlord = request.property.propertyOwner;
    }
    if (!existing.availability && request.property.availability) {
      existing.availability = request.property.availability;
    }
  }

  return [...map.values()]
    .map((group) => {
      const requests = [...group.requests].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return {
        ...group,
        requests,
        stats: {
          total: requests.length,
          pending: countByStatus(requests, "PENDING"),
          approved: countByStatus(requests, "APPROVED"),
          active: countByStatus(requests, "ACTIVE"),
          completed: countByStatus(requests, "COMPLETED"),
          rejected: countByStatus(requests, "REJECTED"),
          timesRented: countByStatus(requests, "COMPLETED"),
        },
      };
    })
    .sort((a, b) => {
      const aLatest = new Date(a.requests[0]?.createdAt || 0).getTime();
      const bLatest = new Date(b.requests[0]?.createdAt || 0).getTime();
      return bLatest - aLatest;
    });
}

async function enrichGroups(groups: PropertyGroup[]) {
  const details = await Promise.all(
    groups.map(async (group) => {
      if (group.cover && group.landlord && group.location && group.availability) {
        return group;
      }
      try {
        const result = await getPropertyById(group.propertyId);
        if (!result?.success || !result.data) return group;
        const images = normalizeImages(result.data.property_image);
        return {
          ...group,
          cover: group.cover ?? images.find(isValidImageUrl) ?? null,
          location: group.location || result.data.location,
          availability: group.availability || result.data.availability,
          landlord: group.landlord || result.data.propertyOwner,
        };
      } catch {
        return group;
      }
    }),
  );
  return details;
}

function StatusChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  if (!value) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      <span className="tabular-nums">{value}</span>
      {label}
    </span>
  );
}

function AdminPropertyRentalGroup({ group }: { group: PropertyGroup }) {
  const detailsHref = `/propertiesDetails/${group.propertyId}`;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <Link
          href={detailsHref}
          className="relative block h-48 w-full shrink-0 overflow-hidden bg-muted lg:h-auto lg:min-h-[14rem] lg:w-64"
        >
          {group.cover ? (
            <Image
              src={group.cover}
              alt={group.title}
              fill
              sizes="(max-width: 1024px) 100vw, 256px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 border bg-background/95"
          >
            {group.availability === "UNAVAILABLE" ? "Unavailable" : "Available"}
          </Badge>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link
                href={detailsHref}
                className="font-display text-xl font-semibold tracking-tight hover:text-primary"
              >
                {group.title}
              </Link>
              {group.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPinIcon className="size-3.5 shrink-0" />
                  <span className="line-clamp-1">{group.location}</span>
                </p>
              )}
              <p className="text-sm font-semibold">
                RM {Number(group.rentPrice).toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground">/mo</span>
              </p>
            </div>

            <div className="rounded-xl border bg-muted/40 px-3 py-2 text-sm">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Building2Icon className="size-3.5" />
                Landlord
              </p>
              <p className="mt-1 font-medium">
                {group.landlord?.name || "Unknown landlord"}
              </p>
              {group.landlord?.email && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MailIcon className="size-3" />
                  {group.landlord.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <ClipboardListIcon className="size-3.5" />
              {group.stats.total} request{group.stats.total === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <RepeatIcon className="size-3.5" />
              Rented {group.stats.timesRented} time
              {group.stats.timesRented === 1 ? "" : "s"}
            </span>
            <StatusChip
              label="Pending"
              value={group.stats.pending}
              tone="border-yellow-200 bg-yellow-50 text-yellow-800"
            />
            <StatusChip
              label="Approved"
              value={group.stats.approved}
              tone="border-blue-200 bg-blue-50 text-blue-800"
            />
            <StatusChip
              label="Active"
              value={group.stats.active}
              tone="border-green-200 bg-green-50 text-green-800"
            />
            <StatusChip
              label="Completed"
              value={group.stats.completed}
              tone="border-gray-200 bg-gray-50 text-gray-700"
            />
            <StatusChip
              label="Rejected"
              value={group.stats.rejected}
              tone="border-red-200 bg-red-50 text-red-700"
            />
          </div>

          <div className="space-y-3 border-t pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Requests for this property
            </p>
            <div className="space-y-2.5">
              {group.requests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-xl border bg-background/80 px-3 py-3 sm:px-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(request.status)}
                        >
                          {request.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Requested{" "}
                          {new Date(request.createdAt).toLocaleDateString("en-US")}
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <UserIcon className="size-3.5 text-muted-foreground" />
                        {request.tenant.name}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MailIcon className="size-3" />
                        {request.tenant.email}
                      </p>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3.5" />
                      Move-in{" "}
                      {new Date(request.moveInDate).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  {request.message && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      “{request.message}”
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function AdminRentalRequestsList() {
  const result = await getAllRentalRequests();

  if (!result.success || !result.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HomeIcon className="size-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">No rental requests found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When tenants request properties across the platform, they will appear here
          grouped by listing.
        </p>
      </div>
    );
  }

  const groups = await enrichGroups(buildGroups(result.data as IRentalRequest[]));
  const totalRequests = groups.reduce((sum, g) => sum + g.stats.total, 0);
  const totalCompleted = groups.reduce((sum, g) => sum + g.stats.timesRented, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full border bg-muted/40 px-3 py-1.5">
          <span className="font-semibold tabular-nums">{groups.length}</span>{" "}
          <span className="text-muted-foreground">properties</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-3 py-1.5">
          <span className="font-semibold tabular-nums">{totalRequests}</span>{" "}
          <span className="text-muted-foreground">total requests</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-3 py-1.5">
          <span className="font-semibold tabular-nums">{totalCompleted}</span>{" "}
          <span className="text-muted-foreground">completed rentals</span>
        </span>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <AdminPropertyRentalGroup key={group.propertyId} group={group} />
        ))}
      </div>
    </div>
  );
}
