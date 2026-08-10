"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../_actions/categoryActions";

type DeleteCategoryDialogProps = {
  categoryId: string;
  categoryName?: string;
  propertyCount?: number;
};

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  propertyCount = 0,
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (result.success) {
        toast.success(result.message || "Category deleted successfully.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2Icon data-icon="inline-start" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete{categoryName ? ` “${categoryName}”` : " this category"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {propertyCount > 0
              ? `This category has ${propertyCount} propert${propertyCount === 1 ? "y" : "ies"} linked. Deleting it may fail or affect those listings.`
              : "This action cannot be undone. No properties are currently using this category."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
