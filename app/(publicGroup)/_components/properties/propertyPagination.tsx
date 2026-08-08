"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PropertyPaginationProps = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export function PropertyPagination({ meta }: PropertyPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(meta.total / meta.limit);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  // build a small window of page numbers around the current page
  const pages: number[] = [];
  const windowSize = 2;
  const start = Math.max(1, meta.page - windowSize);
  const end = Math.min(totalPages, meta.page + windowSize);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="icon"
        disabled={meta.page <= 1}
        onClick={() => goToPage(meta.page - 1)}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      {start > 1 && (
        <>
          <Button variant="outline" size="icon" onClick={() => goToPage(1)}>
            1
          </Button>
          {start > 2 && <span className="px-1 text-muted-foreground">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === meta.page ? "default" : "outline"}
          size="icon"
          onClick={() => goToPage(p)}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
          <Button variant="outline" size="icon" onClick={() => goToPage(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={meta.page >= totalPages}
        onClick={() => goToPage(meta.page + 1)}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}