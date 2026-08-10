/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { IProperty } from "@/lib/types";
import { getMyProperties } from "../_actions/getMyProperties";
import { getCategories } from "../_actions/getCategories";
import { MyPropertiesGrid } from "./MyPropertiesGrid";
import { HomeIcon, PlusIcon } from "lucide-react";

export async function MyPropertiesList() {
  const [result, categoriesResult] = await Promise.all([
    getMyProperties(),
    getCategories(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const properties: IProperty[] = result.success ? result.data ?? [] : [];
  const count = properties.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {count === 0
              ? "You have no properties"
              : `You have ${count} propert${count === 1 ? "y" : "ies"}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Preview, edit, or remove your listings. The first photo is what tenants see on cards.
          </p>
        </div>
        <Link
          href="/landlord-dashboard/properties/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <PlusIcon className="size-4" />
          Add property
        </Link>
      </div>

      {count === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HomeIcon className="size-6" />
          </div>
          <h2 className="font-display text-xl font-semibold">No properties yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add your first listing with photos, pricing, and amenities so tenants can find it.
          </p>
          <Link
            href="/landlord-dashboard/properties/create"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <PlusIcon className="size-4" />
            Add property
          </Link>
        </div>
      ) : (
        <MyPropertiesGrid properties={properties} categories={categories} />
      )}
    </div>
  );
}
