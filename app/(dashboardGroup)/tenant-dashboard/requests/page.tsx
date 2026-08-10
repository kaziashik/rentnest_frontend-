import Link from "next/link";
import { Suspense } from "react";
import { HomeIcon } from "lucide-react";
import { MyRentalRequestsSkeleton } from "../../_components/MyRentalRequestsSkeleton";
import { MyRentalRequestsList } from "../../_components/MyRentalRequestsList";

export default function MyRentalRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            My Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Track rental requests you have sent to landlords.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border bg-background px-4 text-sm font-medium transition hover:bg-muted"
        >
          <HomeIcon className="size-4" />
          Browse homes
        </Link>
      </div>

      <Suspense fallback={<MyRentalRequestsSkeleton />}>
        <MyRentalRequestsList />
      </Suspense>
    </div>
  );
}
