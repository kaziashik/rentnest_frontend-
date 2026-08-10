/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { IRentalRequest } from "@/lib/types";
import { getRentalRequests } from "../_actions/getRentalRequests";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getPropertyById";
import { RentalRequestCard } from "./RentalRequestCard";

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

async function withPropertyMedia(requests: IRentalRequest[]) {
  const uniqueIds = [...new Set(requests.map((r) => r.property?.id).filter(Boolean))];

  const details = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const result = await getPropertyById(id);
        if (result?.success && result.data) {
          return [
            id,
            {
              property_image: normalizeImages(result.data.property_image),
              location: result.data.location as string | undefined,
            },
          ] as const;
        }
      } catch {
        // keep original request data
      }
      return [id, null] as const;
    }),
  );

  const byId = new Map(details);

  return requests.map((request) => {
    const extra = byId.get(request.property.id);
    if (!extra) return request;

    const existing = normalizeImages(request.property.property_image);
    return {
      ...request,
      property: {
        ...request.property,
        location: request.property.location || extra.location,
        property_image: existing.length ? existing : extra.property_image,
      },
    };
  });
}

export async function RentalRequestsList() {
  const result = await getRentalRequests();

  if (!result.success || !result.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardListIcon className="size-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">No rental requests yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When tenants request your listings, they will appear here for you to accept or reject.
        </p>
        <Link
          href="/landlord-dashboard/properties"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <PlusIcon className="size-4" />
          View my properties
        </Link>
      </div>
    );
  }

  const requests = await withPropertyMedia(result.data as IRentalRequest[]);
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {requests.length} request{requests.length === 1 ? "" : "s"}
        {pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
      </p>
      <div className="flex flex-col gap-4">
        {requests.map((request, index) => (
          <RentalRequestCard key={request.id} request={request} index={index} />
        ))}
      </div>
    </div>
  );
}
