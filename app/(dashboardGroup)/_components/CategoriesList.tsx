import { ICategory } from "@/lib/types";
import { getAllCategories } from "../_actions/getAllCategories";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { Card, CardContent } from "@/components/ui/card";

export async function CategoriesList() {
  const result = await getAllCategories();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No categories found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {result.data.map((category: ICategory) => (
        <Card key={category.id}>
          <CardContent className="flex items-center justify-between py-4">
            <span className="font-medium">{category.name}</span>
            <div className="flex gap-2">
              <CategoryFormDialog mode="edit" category={category} />
              <DeleteCategoryDialog categoryId={category.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}