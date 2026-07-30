import { Suspense } from "react";
import { CategoriesList } from "../../_components/CategoriesList";
import { CategoryFormDialog } from "../../_components/CategoryFormDialog";

function CategoriesSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
            ))}
        </div>
    );
}

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <CategoryFormDialog mode="create" />
            </div>

            <Suspense fallback={<CategoriesSkeleton />}>
                <CategoriesList />
            </Suspense>
        </div>
    );
}