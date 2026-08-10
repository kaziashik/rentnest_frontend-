"use client";

import { Badge } from "@/components/ui/badge";
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
import { BanIcon, CheckCircleIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteUser, updateUserStatus } from "../_actions/userActions";
import { IUserData } from "@/lib/types";

type UserRowProps = {
  user: IUserData;
  layout?: "table" | "card";
};

function roleBadgeClass(role: IUserData["role"]) {
  if (role === "ADMIN") return "border-violet-200 bg-violet-50 text-violet-700";
  if (role === "LANDLORD") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function formatJoined(date: string) {
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function activityLabel(user: IUserData) {
  if (user.role === "LANDLORD") {
    const n = user._count?.properties ?? 0;
    return `${n} propert${n === 1 ? "y" : "ies"}`;
  }
  if (user.role === "TENANT") {
    const n = user._count?.rentalRequest ?? 0;
    return `${n} request${n === 1 ? "" : "s"}`;
  }
  return "Platform admin";
}

export function UserRow({ user, layout = "card" }: UserRowProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isBanned = user.activeStatus === "BANNED";
  const isAdmin = user.role === "ADMIN";

  const handleToggleStatus = () => {
    if (isAdmin) {
      toast.error("Admin accounts cannot be banned.");
      return;
    }

    startTransition(async () => {
      const result = await updateUserStatus(user.id, isBanned ? "ACTIVE" : "BANNED");

      if (result.success) {
        toast.success(result.message || "User status updated successfully.");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  const handleDelete = () => {
    if (isAdmin) {
      toast.error("Admin accounts cannot be deleted here.");
      return;
    }

    startTransition(async () => {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast.success(result.message || "User deleted successfully.");
        setDeleteOpen(false);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  const actions = (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending || isAdmin}
        onClick={handleToggleStatus}
        title={isAdmin ? "Admin accounts cannot be banned" : undefined}
        className={
          isBanned
            ? "border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
            : "border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
        }
      >
        {isBanned ? (
          <>
            <CheckCircleIcon data-icon="inline-start" />
            Unban
          </>
        ) : (
          <>
            <BanIcon data-icon="inline-start" />
            Ban
          </>
        )}
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isAdmin}
            title={isAdmin ? "Admin accounts cannot be deleted" : undefined}
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {user.name}&apos;s account will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Sure, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  if (layout === "table") {
    return (
      <tr className="border-b last:border-0 hover:bg-muted/20">
        <td className="px-3 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {user.phone && (
              <p className="truncate text-xs text-muted-foreground">{user.phone}</p>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          <Badge variant="outline" className={roleBadgeClass(user.role)}>
            {user.role}
          </Badge>
        </td>
        <td className="px-3 py-3">
          <Badge
            variant="outline"
            className={
              isBanned
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-green-500 bg-green-50 text-green-700"
            }
          >
            {user.activeStatus}
          </Badge>
        </td>
        <td className="px-3 py-3 text-muted-foreground">{activityLabel(user)}</td>
        <td className="px-3 py-3 text-muted-foreground">
          {formatJoined(user.createdAt)}
        </td>
        <td className="px-3 py-3 text-right">{actions}</td>
      </tr>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{user.name}</p>
            <Badge variant="outline" className={roleBadgeClass(user.role)}>
              {user.role}
            </Badge>
            <Badge
              variant="outline"
              className={
                isBanned
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-green-500 bg-green-50 text-green-700"
              }
            >
              {user.activeStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="text-sm text-muted-foreground">{user.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {activityLabel(user)} · Joined {formatJoined(user.createdAt)}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
}
