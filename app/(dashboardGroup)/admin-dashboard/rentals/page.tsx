import { Suspense } from "react";
import { AdminRentalRequestsList } from "../../_components/AdminRentalRequestsList";

function RentalsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
        </div>
    );
}

export default function AdminRentalsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Rental Requests</h1>
                <p className="text-sm text-muted-foreground">
                    Platform-wide view of all rental requests for moderation.
                </p>
            </div>

            <Suspense fallback={<RentalsSkeleton />}>
                <AdminRentalRequestsList />
            </Suspense>
        </div>
    );
}