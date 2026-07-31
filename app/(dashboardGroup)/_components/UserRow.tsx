"use client"

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
}

export function UserRow({ user }: UserRowProps) {
    const [isPending, startTransition] = useTransition();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const isBanned = user.activeStatus === "BANNED";

    const handleToggleStatus = () => {
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

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name}</p>
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
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={handleToggleStatus}
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
                                This action cannot be undone. {user.name}&apos;s account will be permanently removed.
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
        </div>
    )
}