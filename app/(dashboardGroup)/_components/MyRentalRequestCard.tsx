"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IRentalRequest } from "@/lib/types";
import { getStatusBadgeClass } from "@/lib/statusBadge";
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { WriteReviewDialog } from "./WriteReviewDialog";
import { PayNowButton } from "./PayNowButton";

type MyRentalRequestCardProps = {
  request: IRentalRequest;
  hasReviewed: boolean;
  hasPaid: boolean;
  index?: number;
};

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

export function MyRentalRequestCard({
  request,
  hasReviewed,
  hasPaid,
  index = 0,
}: MyRentalRequestCardProps) {
  const [justReviewed, setJustReviewed] = useState(false);

  const showReviewButton =
    request.status === "COMPLETED" && !hasReviewed && !justReviewed;
  const showPayButton = request.status === "APPROVED" && !hasPaid;
  const isActiveRental = request.status === "ACTIVE" || hasPaid;

  const cover =
    normalizeImages(request.property.property_image).find(isValidImageUrl) ?? null;

  const detailsHref = `/propertiesDetails/${request.property.id}`;

  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        <Link
          href={detailsHref}
          className="relative block h-44 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-52 lg:w-60"
        >
          {cover ? (
            <Image
              src={cover}
              alt={request.property.title}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-44 items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10 sm:bg-linear-to-r sm:from-transparent sm:to-black/10" />
          <Badge
            variant="outline"
            className={`absolute top-3 left-3 border bg-background/95 shadow-sm ${getStatusBadgeClass(request.status)}`}
          >
            {request.status}
          </Badge>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link
                href={detailsHref}
                className="font-display line-clamp-1 text-lg font-semibold tracking-tight transition group-hover:text-primary"
              >
                {request.property.title}
              </Link>
              {request.property.location && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPinIcon className="size-3.5 shrink-0" />
                  <span className="line-clamp-1">{request.property.location}</span>
                </p>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(request.createdAt).toLocaleDateString("en-US")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              Move-in {new Date(request.moveInDate).toLocaleDateString("en-US")}
            </span>
            <span className="font-semibold text-foreground">
              RM {Number(request.property.rentPrice).toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          {request.message && (
            <p className="line-clamp-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              “{request.message}”
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-3">
            <Link
              href={detailsHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-background px-3.5 text-sm font-medium transition hover:bg-muted"
            >
              View property
              <ArrowRightIcon className="size-3.5" />
            </Link>

            {showPayButton && (
              <div onClick={(e) => e.stopPropagation()}>
                <PayNowButton requestId={request.id} />
              </div>
            )}

            {showReviewButton && (
              <div onClick={(e) => e.stopPropagation()}>
                <WriteReviewDialog
                  propertyId={request.property.id}
                  requestId={request.id}
                  onReviewed={() => setJustReviewed(true)}
                />
              </div>
            )}

            {isActiveRental && request.status !== "COMPLETED" && (
              <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600">
                Active rental
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
