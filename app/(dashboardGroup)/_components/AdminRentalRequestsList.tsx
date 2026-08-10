import { HomeIcon } from "lucide-react";
import { IRentalRequest, IRentalStatus } from "@/lib/types";
import { getAllRentalRequests } from "../_actions/getAllRentalRequests";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getPropertyById";
import {
  AdminPropertyGroup,
  AdminRentalsExplorer,
} from "./AdminRentalsExplorer";

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

function countByStatus(requests: IRentalRequest[], status: IRentalStatus) {
  return requests.filter((r) => r.status === status).length;
}

function buildGroups(requests: IRentalRequest[]): AdminPropertyGroup[] {
  const map = new Map<string, AdminPropertyGroup>();

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
      const sorted = [...group.requests].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return {
        ...group,
        requests: sorted,
        stats: {
          total: sorted.length,
          pending: countByStatus(sorted, "PENDING"),
          approved: countByStatus(sorted, "APPROVED"),
          active: countByStatus(sorted, "ACTIVE"),
          completed: countByStatus(sorted, "COMPLETED"),
          rejected: countByStatus(sorted, "REJECTED"),
          timesRented: countByStatus(sorted, "COMPLETED"),
        },
      };
    })
    .sort((a, b) => {
      const aLatest = new Date(a.requests[0]?.createdAt || 0).getTime();
      const bLatest = new Date(b.requests[0]?.createdAt || 0).getTime();
      return bLatest - aLatest;
    });
}

async function enrichGroups(groups: AdminPropertyGroup[]) {
  return Promise.all(
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
  return <AdminRentalsExplorer groups={groups} />;
}
