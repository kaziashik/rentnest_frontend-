import { Suspense } from "react";
import { UsersList } from "../../_components/UsersList";
import { UsersSkeleton } from "../../_components/UsersSkeleton";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage tenants and landlords on the platform.
        </p>
      </div>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  );
}