"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPayment } from "@/lib/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  ReceiptIcon,
  SearchIcon,
} from "lucide-react";

type PaymentHistoryTableProps = {
  payments: IPayment[];
};

const PAGE_SIZE = 5;

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

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.rentalRequest.property.title.toLowerCase().includes(q) ||
        p.rentalRequest.property.location?.toLowerCase().includes(q) ||
        p.paymentStatus.toLowerCase().includes(q) ||
        p.transactionId?.toLowerCase().includes(q),
    );
  }, [payments, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/25 px-6 py-12 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ReceiptIcon className="size-5" />
        </div>
        <p className="font-medium">No payment history yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Completed Stripe checkouts will show up here with amount and transaction details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-full pl-9"
        />
      </div>

      {paginated.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No payments match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {paginated.map((payment, index) => {
            const cover =
              normalizeImages(payment.rentalRequest.property.property_image).find(
                isValidImageUrl,
              ) ?? null;
            const href = `/propertiesDetails/${payment.rentalRequest.property.id}`;

            return (
              <article
                key={payment.id}
                className="animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-sm"
                style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row">
                  <Link
                    href={href}
                    className="relative block h-32 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:min-h-[7.5rem] sm:w-40"
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={payment.rentalRequest.property.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-32 items-center justify-center text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={href}
                          className="font-display line-clamp-1 text-base font-semibold hover:text-primary"
                        >
                          {payment.rentalRequest.property.title}
                        </Link>
                        {payment.rentalRequest.property.location && (
                          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPinIcon className="size-3.5 shrink-0" />
                            <span className="line-clamp-1">
                              {payment.rentalRequest.property.location}
                            </span>
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          payment.paymentStatus === "PAID" ? "default" : "outline"
                        }
                        className="shrink-0 rounded-full"
                      >
                        {payment.paymentStatus}
                      </Badge>
                    </div>

                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
                      <div className="flex justify-between sm:block">
                        <span>Amount</span>
                        <p className="font-semibold text-foreground">
                          RM {Number(payment.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span>Paid on</span>
                        <p className="text-foreground">
                          {new Date(payment.paidAt).toLocaleDateString("en-US")}
                        </p>
                      </div>
                      <div className="flex justify-between gap-2 sm:block">
                        <span>Transaction</span>
                        <p className="truncate font-mono text-xs text-foreground">
                          {payment.transactionId || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
