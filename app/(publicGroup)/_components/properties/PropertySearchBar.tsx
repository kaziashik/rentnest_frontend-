"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDownIcon, XIcon } from "lucide-react";

const sortOptions = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

const categoryOptions = [
  { label: "All categories", value: "all" },
  { label: "Apartment", value: "Apartment" },
  { label: "House", value: "House" },
  { label: "Studio", value: "Studio" },
  { label: "Room", value: "Room" },
];

export function PropertySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    });

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const debouncedUpdate = useDebouncedCallback((updates: Record<string, string>) => {
    updateURL(updates);
  }, 500);

  const syncPayload = (overrides: Partial<Record<string, string>> = {}) => ({
    title,
    location,
    minPrice,
    maxPrice,
    category,
    sort,
    ...overrides,
  });

  const clearFilters = () => {
    setTitle("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("all");
    setSort("");
    router.push(pathname);
  };

  const activeSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? "Sort";
  const hasActiveFilters = title || location || minPrice || maxPrice || (category && category !== "all") || sort;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="space-y-1.5 xl:col-span-2">
          <Label htmlFor="title">Search</Label>
          <Input
            id="title"
            placeholder="Property title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedUpdate(syncPayload({ title: e.target.value }));
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Penang"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              debouncedUpdate(syncPayload({ location: e.target.value }));
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              updateURL(syncPayload({ category: value }));
            }}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            min={0}
            placeholder="RM 0"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              debouncedUpdate(syncPayload({ minPrice: e.target.value }));
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            placeholder="No limit"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              debouncedUpdate(syncPayload({ maxPrice: e.target.value }));
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1.5">
          <Label>Sort</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between md:w-48">
                <span className="flex items-center gap-2">
                  <ArrowUpDownIcon className="size-3.5" />
                  {activeSortLabel}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    setSort(option.value);
                    updateURL(syncPayload({ sort: option.value }));
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasActiveFilters && (
          <div className="pt-6">
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <XIcon className="size-4" />
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
