// components/page/properties/property-search-bar.tsx
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
import { ArrowUpDownIcon, XIcon } from "lucide-react";

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export function PropertySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced — waits 500ms after the last keystroke before updating the URL
  const debouncedUpdate = useDebouncedCallback((updates: Record<string, string>) => {
    updateURL(updates);
  }, 500);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    debouncedUpdate({ title: value, location, minPrice, maxPrice, sort });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    debouncedUpdate({ title, location: value, minPrice, maxPrice, sort });
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    debouncedUpdate({ title, location, minPrice: value, maxPrice, sort });
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    debouncedUpdate({ title, location, minPrice, maxPrice: value, sort });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    // Sort is a click, not typing — apply immediately, no debounce needed
    updateURL({ title, location, minPrice, maxPrice, sort: value });
  };

  const clearFilters = () => {
    setTitle("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    router.push(pathname);
  };

  const activeSortLabel =
    sortOptions.find((o) => o.value === sort)?.label ?? "Sort";

  const hasActiveFilters = title || location || minPrice || maxPrice || sort;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-end md:gap-4">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="title">Search</Label>
        <Input
          id="title"
          placeholder="Search by property title..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Ipoh, MY"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-28 space-y-1.5">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="RM 0"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />
        </div>
        <div className="w-28 space-y-1.5">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="No limit"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Sort</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between md:w-40">
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
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasActiveFilters && (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <XIcon className="size-4" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}