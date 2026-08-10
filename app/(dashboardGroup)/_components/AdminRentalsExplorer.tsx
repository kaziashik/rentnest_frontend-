"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2Icon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  MailIcon,
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
import { IRentalRequest, IRentalStatus } from "@/lib/types";

export type AdminPropertyGroup = {
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

const PAGE_SIZE = 5;

const STATUS_OPTIONS: Array<{ value: "" | IRentalStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

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

function matchesQuery(group: AdminPropertyGroup, q: string, request: IRentalRequest) {
  if (!q) return true;
  const haystack = [
    group.title,
    group.location,
    group.rentPrice,
    group.availability,
    group.landlord?.name,
    group.landlord?.email,
    group.landlord?.phone,
    request.tenant.name,
    request.tenant.email,
    request.status,
    request.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function filterGroupRequests(
  group: AdminPropertyGroup,
  q: string,
  status: "" | IRentalStatus,
) {
  return group.requests.filter((request) => {
    if (status && request.status !== status) return false;
    return matchesQuery(group, q, request);
  });
}

function AdminPropertyRentalGroup({
  group,
  requests,
}: {
  group: AdminPropertyGroup;
  requests: IRentalRequest[];
}) {
  const detailsHref = `/propertiesDetails/${group.propertyId}`;
  const pending = requests.filter((r) => r.status === "PENDING").length;
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const active = requests.filter((r) => r.status === "ACTIVE").length;
  const completed = requests.filter((r) => r.status === "COMPLETED").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;

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
                <span className="text-xs font-normal text-muted-foreground">
                  /mo
                </span>
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
              {requests.length} shown
              {requests.length !== group.stats.total
                ? ` / ${group.stats.total}`
                : ""}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <RepeatIcon className="size-3.5" />
              Rented {group.stats.timesRented} time
              {group.stats.timesRented === 1 ? "" : "s"}
            </span>
            <StatusChip
              label="Pending"
              value={pending}
              tone="border-yellow-200 bg-yellow-50 text-yellow-800"
            />
            <StatusChip
              label="Approved"
              value={approved}
              tone="border-blue-200 bg-blue-50 text-blue-800"
            />
            <StatusChip
              label="Active"
              value={active}
              tone="border-green-200 bg-green-50 text-green-800"
            />
            <StatusChip
              label="Completed"
              value={completed}
              tone="border-gray-200 bg-gray-50 text-gray-700"
            />
            <StatusChip
              label="Rejected"
              value={rejected}
              tone="border-red-200 bg-red-50 text-red-700"
            />
          </div>

          <div className="space-y-3 border-t pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Requests for this property
            </p>
            <div className="space-y-2.5">
              {requests.map((request) => (
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

type AdminRentalsExplorerProps = {
  groups: AdminPropertyGroup[];
};

export function AdminRentalsExplorer({ groups }: AdminRentalsExplorerProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | IRentalStatus>("");
  const [availability, setAvailability] = useState<"" | "AVAILABLE" | "UNAVAILABLE">(
    "",
  );
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return groups
      .filter((group) => {
        if (availability && group.availability !== availability) return false;
        return filterGroupRequests(group, q, status).length > 0;
      })
      .map((group) => ({
        group,
        requests: filterGroupRequests(group, q, status),
      }));
  }, [groups, search, status, availability]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalRequestsShown = filtered.reduce(
    (sum, item) => sum + item.requests.length,
    0,
  );
  const totalCompleted = groups.reduce(
    (sum, group) => sum + group.stats.timesRented,
    0,
  );

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setAvailability("");
    setPage(1);
  };

  const hasFilters = Boolean(search || status || availability);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-card p-2.5 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-rentals-search"
              aria-label="Search rentals"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Property, landlord, tenant…"
              className="h-9 rounded-full pl-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
            <select
              id="admin-rentals-status"
              aria-label="Request status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as "" | IRentalStatus);
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-36 sm:text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              id="admin-rentals-availability"
              aria-label="Listing availability"
              value={availability}
              onChange={(e) => {
                setAvailability(
                  e.target.value as "" | "AVAILABLE" | "UNAVAILABLE",
                );
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-36 sm:text-sm"
            >
              <option value="">All listings</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
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
          <span className="text-muted-foreground">
            propert{filtered.length === 1 ? "y" : "ies"}
          </span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{totalRequestsShown}</span>{" "}
          <span className="text-muted-foreground">requests</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{totalCompleted}</span>{" "}
          <span className="text-muted-foreground">completed</span>
        </span>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <p className="font-medium">No properties match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a landlord email, tenant name, property title, or clear filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map(({ group, requests }) => (
            <AdminPropertyRentalGroup
              key={group.propertyId}
              group={group}
              requests={requests}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} properties
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
