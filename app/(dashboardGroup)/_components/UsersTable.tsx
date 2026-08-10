"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IActiveStatus, IRole, IUserData } from "@/lib/types";
import { UserRow } from "./UserRow";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

type UsersTableProps = {
  users: IUserData[];
};

const PAGE_SIZE = 8;

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | IRole>("");
  const [status, setStatus] = useState<"" | IActiveStatus>("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.activeStatus !== status) return false;
      if (!query) return true;

      const haystack = [
        u.name,
        u.email,
        u.phone,
        u.role,
        u.activeStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const roleCounts = useMemo(() => {
    return {
      TENANT: users.filter((u) => u.role === "TENANT").length,
      LANDLORD: users.filter((u) => u.role === "LANDLORD").length,
      ADMIN: users.filter((u) => u.role === "ADMIN").length,
      BANNED: users.filter((u) => u.activeStatus === "BANNED").length,
    };
  }, [users]);

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  const hasFilters = Boolean(search || role || status);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-card p-2.5 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search users"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Name, email, or phone…"
              className="h-9 rounded-full pl-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <select
              aria-label="Filter by role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as "" | IRole);
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-36 sm:text-sm"
            >
              <option value="">All roles</option>
              <option value="TENANT">Tenant</option>
              <option value="LANDLORD">Landlord</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as "" | IActiveStatus);
                setPage(1);
              }}
              className="h-9 w-full rounded-full border bg-background px-2.5 text-xs sm:w-32 sm:text-sm"
            >
              <option value="">All status</option>
              <option value="ACTIVE">Active</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 rounded-full px-2.5"
              onClick={clearFilters}
            >
              <XIcon className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs sm:text-sm">
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{filtered.length}</span>{" "}
          <span className="text-muted-foreground">shown</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{roleCounts.TENANT}</span>{" "}
          <span className="text-muted-foreground">tenants</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{roleCounts.LANDLORD}</span>{" "}
          <span className="text-muted-foreground">landlords</span>
        </span>
        <span className="rounded-full border bg-muted/40 px-2.5 py-1">
          <span className="font-semibold tabular-nums">{roleCounts.ADMIN}</span>{" "}
          <span className="text-muted-foreground">admins</span>
        </span>
        {roleCounts.BANNED > 0 && (
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700">
            <span className="font-semibold tabular-nums">{roleCounts.BANNED}</span>{" "}
            banned
          </span>
        )}
      </div>

      {paginated.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="font-medium">No users match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another name, role, or clear filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-medium">User</th>
                  <th className="px-3 py-2.5 font-medium">Role</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Activity</th>
                  <th className="px-3 py-2.5 font-medium">Joined</th>
                  <th className="px-3 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <UserRow key={user.id} user={user} layout="table" />
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y md:hidden">
            {paginated.map((user) => (
              <UserRow key={user.id} user={user} layout="card" />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
          <span className="hidden sm:inline">
            {" "}
            · {filtered.length} user{filtered.length === 1 ? "" : "s"}
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon className="size-4" />
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
