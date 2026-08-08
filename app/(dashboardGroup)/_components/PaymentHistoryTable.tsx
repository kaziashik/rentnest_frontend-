"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IPayment } from "@/lib/types";
import { SearchIcon } from "lucide-react";

type PaymentHistoryTableProps = {
  payments: IPayment[];
};

const PAGE_SIZE = 5;

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.rentalRequest.property.title.toLowerCase().includes(q) ||
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
      <p className="py-8 text-center text-sm text-muted-foreground">No payments yet.</p>
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
          className="pl-9"
        />
      </div>

      {paginated.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No payments match your search.
        </p>
      ) : (
        <div className="space-y-3">
          {paginated.map((payment) => (
            <Card key={payment.id} className="rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    {payment.rentalRequest.property.title}
                  </CardTitle>
                  <Badge variant={payment.paymentStatus === "PAID" ? "default" : "outline"}>
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Amount</span>
                  <span className="font-semibold text-foreground">
                    RM {Number(payment.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Paid on</span>
                  <span>{new Date(payment.paidAt).toLocaleDateString("en-US")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transaction ID</span>
                  <span className="font-mono text-xs">{payment.transactionId}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
