import { ICategory } from "@/lib/types";
import { getAllCategories } from "../_actions/getAllCategories";
import { AdminCategoriesExplorer } from "./AdminCategoriesExplorer";
import { CategoryFormDialog } from "./CategoryFormDialog";

export async function CategoriesList() {
  const result = await getAllCategories();

  if (!result.success) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {result.message || "Failed to load categories."}
      </p>
    );
  }

  const categories = (result.data ?? []) as ICategory[];

  if (!categories.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
        <p className="font-medium">No categories yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first category so landlords can classify listings.
        </p>
        <div className="mt-4 flex justify-center">
          <CategoryFormDialog mode="create" />
        </div>
      </div>
    );
  }

  return <AdminCategoriesExplorer categories={categories} />;
}
