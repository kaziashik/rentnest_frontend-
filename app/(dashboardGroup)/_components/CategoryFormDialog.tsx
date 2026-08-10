"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICategory } from "@/lib/types";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createCategory, updateCategory } from "../_actions/categoryActions";

type CategoryFormDialogProps = {
  mode: "create" | "edit";
  category?: ICategory;
};

export function CategoryFormDialog({ mode, category }: CategoryFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const action =
    mode === "edit" && category
      ? updateCategory.bind(null, category.id)
      : createCategory;

  const [state, formAction, pending] = useActionState(action, null) as any;

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(
        state.message ||
          (mode === "edit"
            ? "Category updated successfully"
            : "Category created successfully"),
      );
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.message || "Something went wrong");
    }
  }, [state, mode, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            variant="outline"
            size="sm"
            className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        ) : (
          <Button className="rounded-full">
            <PlusIcon data-icon="inline-start" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`category-name-${category?.id ?? "new"}`}>
              Name
            </Label>
            <Input
              id={`category-name-${category?.id ?? "new"}`}
              name="name"
              defaultValue={category?.name}
              placeholder="e.g. Swimming Pool House"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`category-desc-${category?.id ?? "new"}`}>
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id={`category-desc-${category?.id ?? "new"}`}
              name="description"
              defaultValue={category?.description ?? ""}
              placeholder="Short note for admins about this category"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
