
import { getCategories } from "@/app/(dashboardGroup)/_actions/getCategories";
import { CreatePropertyForm } from "@/app/(dashboardGroup)/_components/CreatePropertyForm";

import { ICategory } from "@/lib/types";

export default async function CreatePropertyPage() {
  const categoriesResult = await getCategories();
  const categories: ICategory[] = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Property</h1>
      <CreatePropertyForm categories={categories} />
    </div>
  );
}