import { Suspense } from "react";
import { IReview, IRentalRequest } from "@/lib/types";

import { ReviewCard } from "../../_components/ReviewCard";
import { getTenantReviews } from "../../_actions/getTenantReviews";
import { getMyRentalRequests } from "../../_actions/getMyRentalRequests";
import { getPropertyById } from "../../../(publicGroup)/_actions/getPropertyById";

async function MyReviewsList() {
    const [reviewsResult, requestsResult] = await Promise.all([
        getTenantReviews(),
        getMyRentalRequests(),
    ]);

    if (!reviewsResult.success || !reviewsResult.data?.length) {
        return (
            <p className="py-12 text-center text-muted-foreground">
                You haven&apos;t left any reviews yet.
            </p>
        );
    }

    const requests: IRentalRequest[] = requestsResult.success ? requestsResult.data : [];
    const reviews: IReview[] = reviewsResult.data;

    // dedupe property IDs so we don't fetch the same property twice
    const uniquePropertyIds = [...new Set(reviews.map((r) => r.propertyId))];

    const propertyDetailsResults = await Promise.all(
        uniquePropertyIds.map((id) => getPropertyById(id))
    );

    const propertyDetailsMap = new Map(
        uniquePropertyIds.map((id, index) => [id, propertyDetailsResults[index]])
    );

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reviews.map((review) => {
                const relatedRequest = requests.find((r) => r.id === review.requestId);
                const propertyResult = propertyDetailsMap.get(review.propertyId);
                const property = propertyResult?.success ? propertyResult.data : null;

                return (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        propertyTitle={relatedRequest?.property.title}
                        location={property?.location}
                        ownerName={property?.propertyOwner?.name}
                    />
                );
            })}
        </div>
    );
}

function ReviewsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
        </div>
    );
}

export default function MyReviewsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">My Reviews</h1>
            <Suspense fallback={<ReviewsSkeleton />}>
                <MyReviewsList />
            </Suspense>
        </div>
    );
}