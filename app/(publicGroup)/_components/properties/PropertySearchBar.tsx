"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPinIcon, SearchIcon, XIcon } from "lucide-react";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
] as const;

const categoryOptions = [
  { label: "All types", value: "all" },
  { label: "Apartment", value: "Apartment" },
  { label: "House", value: "House" },
  { label: "Studio", value: "Studio" },
  { label: "Room", value: "Room" },
  { label: "Swimming Pool House", value: "Swimming Pool House" },
  { label: "Gym House", value: "Gym House" },
  { label: "Honeymoon Nature View", value: "Honeymoon Nature View" },
  { label: "Hiking View House", value: "Hiking View House" },
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
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
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
    setSort("newest");
    router.push(pathname);
  };

  const hasActiveFilters =
    title ||
    location ||
    minPrice ||
    maxPrice ||
    (category && category !== "all") ||
    (sort && sort !== "newest");

  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-1.5 sm:p-2">
      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-1.5">
        <div className="relative min-w-0 flex-[1.3]">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="title"
            aria-label="Search by title"
            placeholder="Search title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedUpdate(syncPayload({ title: e.target.value }));
            }}
            className="h-8 border-0 bg-background shadow-none pl-8 text-sm focus-visible:ring-1"
          />
        </div>

        <div className="relative min-w-0 flex-1">
          <MapPinIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            aria-label="Location"
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              debouncedUpdate(syncPayload({ location: e.target.value }));
            }}
            className="h-8 border-0 bg-background shadow-none pl-8 text-sm focus-visible:ring-1"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            updateURL(syncPayload({ category: value }));
          }}
        >
          <SelectTrigger
            aria-label="Category"
            className="h-8 w-full border-0 bg-background shadow-none text-sm focus-visible:ring-1 lg:w-[150px]"
          >
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1.5 lg:w-[170px]">
          <Input
            id="minPrice"
            aria-label="Min price"
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              debouncedUpdate(syncPayload({ minPrice: e.target.value }));
            }}
            className="h-8 border-0 bg-background shadow-none text-sm focus-visible:ring-1"
          />
          <Input
            id="maxPrice"
            aria-label="Max price"
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              debouncedUpdate(syncPayload({ maxPrice: e.target.value }));
            }}
            className="h-8 border-0 bg-background shadow-none text-sm focus-visible:ring-1"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            updateURL(syncPayload({ sort: value }));
          }}
        >
          <SelectTrigger
            aria-label="Sort"
            className="h-8 w-full border-0 bg-background shadow-none text-sm focus-visible:ring-1 lg:w-[110px]"
          >
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 shrink-0 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
