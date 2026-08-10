"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/types";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import {
  Building2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  TagsIcon,
  XIcon,
} from "lucide-react";

const PAGE_SIZE = 8;

type AdminCategoriesExplorerProps = {
  categories: ICategory[];
};

function formatJoined(date?: string) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function AdminCategoriesExplorer({
  categories,
}: AdminCategoriesExplorerProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories.filter((category) => {
      const haystack = [category.name, category.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [categories, search]);

  const totalProperties = useMemo(
    () => categories.reduce((sum, c) => sum + (c._count?.properties ?? 0), 0),
    [categories],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-card p-2.5 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search categories"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search category name or description…"
              className="h-9 rounded-full pl-8 text-sm"
            />
          </div>

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 rounded-full px-2.5"
              onClick={clearSearch}
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
          <span className="text-muted-foreground">shown</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{categories.length}</span>{" "}
          <span className="text-muted-foreground">categories</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{totalProperties}</span>{" "}
          <span className="text-muted-foreground">listed properties</span>
        </span>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <TagsIcon className="mx-auto size-8 text-muted-foreground/60" />
          <p className="mt-3 font-medium">No categories match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another name, or clear search and add a new category.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 font-medium">Properties</th>
                  <th className="px-3 py-2.5 font-medium">Created</th>
                  <th className="px-3 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((category) => {
                  const count = category._count?.properties ?? 0;
                  return (
                    <tr
                      key={category.id}
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
                            <Building2Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">{category.name}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {category.description?.trim() || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 tabular-nums text-muted-foreground">
                        {count} listing{count === 1 ? "" : "s"}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {formatJoined(category.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <CategoryFormDialog mode="edit" category={category} />
                          <DeleteCategoryDialog
                            categoryId={category.id}
                            categoryName={category.name}
                            propertyCount={count}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y md:hidden">
            {pageItems.map((category) => {
              const count = category._count?.properties ?? 0;
              return (
                <div key={category.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
                      <Building2Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {category.description?.trim() || "No description"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {count} listing{count === 1 ? "" : "s"} · Created{" "}
                        {formatJoined(category.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <CategoryFormDialog mode="edit" category={category} />
                    <DeleteCategoryDialog
                      categoryId={category.id}
                      categoryName={category.name}
                      propertyCount={count}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
          <span className="hidden sm:inline">
            {" "}
            · {filtered.length} categor
            {filtered.length === 1 ? "y" : "ies"}
          </span>
        </p>
        <div className="flex gap-2">
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
    </div>
  );
}
