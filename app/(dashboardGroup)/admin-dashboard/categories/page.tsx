import { Suspense } from "react";
import { CategoriesList } from "../../_components/CategoriesList";
import { CategoryFormDialog } from "../../_components/CategoryFormDialog";

function CategoriesSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="h-10 animate-pulse rounded-full bg-muted" />
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          Categories
        </h1>
        <CategoryFormDialog mode="create" />
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
