"use client"

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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteProperty } from "../_actions/propertyDelete";
import { cn } from "@/lib/utils";

type DeletePropertyDialogProps = {
  propertyId: string;
  propertyTitle?: string;
  compact?: boolean;
};

export function DeletePropertyDialog({
  propertyId,
  propertyTitle,
  compact = false,
}: DeletePropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProperty(propertyId);

      if (result.success) {
        toast.success(result.message || "Property deleted successfully.");
        setOpen(false);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={compact ? "secondary" : "outline"}
          size={compact ? "icon-sm" : "sm"}
          className={cn(
            compact &&
              "size-8 rounded-full border-0 bg-background/95 text-destructive shadow-sm hover:bg-background hover:text-destructive",
          )}
          aria-label="Delete property"
        >
          <Trash2Icon className={compact ? "size-3.5" : undefined} />
          {!compact && "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this property?</AlertDialogTitle>
          <AlertDialogDescription>
            {propertyTitle ? (
              <>
                <span className="font-medium text-foreground">{propertyTitle}</span> will be
                permanently removed from your listings. This cannot be undone.
              </>
            ) : (
              "This property will be permanently removed from your listings. This cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete property"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
