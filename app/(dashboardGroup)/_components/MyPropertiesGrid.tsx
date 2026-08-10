"use client";

import { useMemo, useState } from "react";
import { ICategory, IProperty } from "@/lib/types";
import { MyPropertyCard } from "./MyPropertyCard";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const PAGE_SIZE = 5;

type MyPropertiesGridProps = {
  properties: IProperty[];
  categories: ICategory[];
};

export function MyPropertiesGrid({ properties, categories }: MyPropertiesGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return properties.slice(start, start + PAGE_SIZE);
  }, [properties, currentPage]);

  const goTo = (next: number) => {
    setPage(Math.min(totalPages, Math.max(1, next)));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pageItems.map((property) => (
          <MyPropertyCard
            key={property.id}
            property={property}
            categories={categories}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-3 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, properties.length)} of {properties.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={currentPage <= 1}
              onClick={() => goTo(currentPage - 1)}
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
                onClick={() => goTo(n)}
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
              onClick={() => goTo(currentPage + 1)}
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
