/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ClipboardListIcon, HomeIcon } from "lucide-react";
import { IRentalRequest } from "@/lib/types";
import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { getTenantReviews } from "../_actions/getTenantReviews";
import { getPaymentHistory } from "../_actions/getPaymentHistory";
import { getPropertyById } from "@/app/(publicGroup)/_actions/getPropertyById";
import { MyRentalRequestCard } from "./MyRentalRequestCard";

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

export async function MyRentalRequestsList() {
  const [result, reviewsResult, paymentsResult] = await Promise.all([
    getMyRentalRequests(),
    getTenantReviews(),
    getPaymentHistory(),
  ]);

  const reviews = reviewsResult.success ? reviewsResult.data : [];
  const payments = paymentsResult.success ? paymentsResult.data : [];
  const reviewedRequestIds = new Set(reviews.map((r: any) => r.requestId));
  const paidRequestIds = new Set(
    payments
      .filter((p: any) => p.paymentStatus === "PAID")
      .map((p: any) => p.requestId),
  );

  if (!result.success || !result.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardListIcon className="size-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">No requests yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Browse homes and send a rental request — it will show up here with status updates.
        </p>
        <Link
          href="/properties"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <HomeIcon className="size-4" />
          Browse homes
        </Link>
      </div>
    );
  }

  const requests = await withPropertyMedia(result.data as IRentalRequest[]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {requests.length} request{requests.length === 1 ? "" : "s"}
      </p>
      <div className="flex flex-col gap-4">
        {requests.map((request, index) => (
          <MyRentalRequestCard
            key={request.id}
            request={request}
            hasReviewed={reviewedRequestIds.has(request.id)}
            hasPaid={paidRequestIds.has(request.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
