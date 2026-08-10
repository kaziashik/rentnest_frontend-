"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IRentalRequest } from "@/lib/types";
import {
  ArrowRightIcon,
  CalendarIcon,
  MailIcon,
  CheckIcon,
  XIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateRentalStatus } from "../_actions/updateRentalStatus";
import { getStatusBadgeClass } from "@/lib/statusBadge";

type RentalRequestCardProps = {
  request: IRentalRequest;
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

export function RentalRequestCard({ request, index = 0 }: RentalRequestCardProps) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(request.status);

  useEffect(() => {
    setLocalStatus(request.status);
  }, [request.status]);

  const cover =
    normalizeImages(request.property.property_image).find(isValidImageUrl) ?? null;
  const detailsHref = `/propertiesDetails/${request.property.id}`;

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      const result = await updateRentalStatus(request.id, status);

      if (result.success) {
        toast.success(result.message || "Request status updated successfully");
        setLocalStatus(status as typeof request.status);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  const statusLabel =
    localStatus === "APPROVED"
      ? "Awaiting payment"
      : localStatus === "ACTIVE"
        ? "Active"
        : localStatus === "COMPLETED"
          ? "Completed"
          : localStatus === "REJECTED"
            ? "Rejected"
            : localStatus;

  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        <Link
          href={detailsHref}
          className="relative block h-44 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:min-h-[11.5rem] sm:w-52 lg:w-60"
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
            className={`absolute top-3 left-3 border bg-background/95 shadow-sm ${getStatusBadgeClass(localStatus)}`}
          >
            {localStatus}
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

          <div className="rounded-xl bg-muted/45 px-3 py-2.5 text-sm">
            <p className="flex items-center gap-1.5 font-medium">
              <UserIcon className="size-3.5 text-muted-foreground" />
              {request.tenant.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <MailIcon className="size-3.5" />
              {request.tenant.email}
            </p>
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
            <p className="line-clamp-2 text-sm text-muted-foreground">
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

            {localStatus === "PENDING" ? (
              <>
                <Button
                  size="sm"
                  className="h-9 rounded-full px-4"
                  disabled={isPending}
                  onClick={() => handleStatusChange("APPROVED")}
                >
                  <CheckIcon data-icon="inline-start" />
                  {isPending ? "Saving..." : "Accept"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-full border-red-500 px-4 text-red-500 hover:bg-red-50 hover:text-red-600"
                  disabled={isPending}
                  onClick={() => handleStatusChange("REJECTED")}
                >
                  <XIcon data-icon="inline-start" />
                  Reject
                </Button>
              </>
            ) : localStatus === "ACTIVE" ? (
              <>
                <Badge
                  variant="outline"
                  className={`rounded-full ${getStatusBadgeClass("ACTIVE")}`}
                >
                  Active
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  disabled={isPending}
                  onClick={() => handleStatusChange("COMPLETED")}
                >
                  <CheckIcon data-icon="inline-start" />
                  {isPending ? "Saving..." : "Mark complete"}
                </Button>
              </>
            ) : (
              <Badge
                variant="secondary"
                className={`rounded-full ${getStatusBadgeClass(localStatus)}`}
              >
                {statusLabel}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
