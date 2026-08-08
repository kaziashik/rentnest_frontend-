"use client"

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUserData } from "@/lib/types";
import { UserRow } from "./UserRow";
import { SearchIcon } from "lucide-react";

type UsersTableProps = {
    users: IUserData[];
}

const PAGE_SIZE = 8;

export function UsersTable({ users }: UsersTableProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return users;

        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.role.toLowerCase().includes(query)
        );
    }, [users, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const paginated = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="pl-9"
                />
            </div>

            {paginated.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                    No users match your search.
                </p>
            ) : (
                <div className="space-y-3">
                    {paginated.map((user) => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages} ({filtered.length} users)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}