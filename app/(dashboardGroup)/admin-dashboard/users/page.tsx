import { Suspense } from "react";
import { UsersList } from "../../_components/UsersList";
import { UsersSkeleton } from "../../_components/UsersSkeleton";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          Users
        </h1>
      </div>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  );
}
