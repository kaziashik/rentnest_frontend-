"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IRentalRequest } from "@/lib/types";
import { CalendarIcon, CheckCircle2Icon, MapPinIcon } from "lucide-react";
import { PayNowButton } from "./PayNowButton";

type AwaitingPaymentCardProps = {
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

export function AwaitingPaymentCard({
  request,
  index = 0,
}: AwaitingPaymentCardProps) {
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
          className="relative block h-40 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:min-h-[10.5rem] sm:w-48 lg:w-56"
        >
          {cover ? (
            <Image
              src={cover}
              alt={request.property.title}
              fill
              sizes="(max-width: 640px) 100vw, 224px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/10" />
          <Badge className="absolute top-3 left-3 shadow-sm">Due now</Badge>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="space-y-1">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              Move-in {new Date(request.moveInDate).toLocaleDateString("en-US")}
            </span>
            <span className="text-base font-semibold text-foreground">
              RM {Number(request.property.rentPrice).toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p>
              <span className="font-semibold">Success — request approved.</span>{" "}
              Complete payment to activate the rental.
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-3">
            <PayNowButton requestId={request.id} />
            <Link
              href={detailsHref}
              className="inline-flex h-9 items-center rounded-full border bg-background px-3.5 text-sm font-medium transition hover:bg-muted"
            >
              View property
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
